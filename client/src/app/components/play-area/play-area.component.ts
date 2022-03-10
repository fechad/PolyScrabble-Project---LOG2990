import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { GameContextService } from '@app/services/game-context.service';
import { GridService } from '@app/services/grid.service';
import { MouseService } from '@app/services/mouse.service';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 525;
export const DEFAULT_HEIGHT = 525;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    buttonPressed = '';
    // eslint-disable-next-line no-invalid-this
    mousePosition = this.mouseDetectService.mousePosition;
    rack: string[] = [];
    firstLetter = [0, 0];
    shift: number[] = [];
    private isLoaded = false;
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private gameContextService: GameContextService,
        public mouseDetectService: MouseService,
        public communicationservice: CommunicationService,
    ) {
        this.gameContextService.state.subscribe(() => {
            if (this.isLoaded) this.gridService.drawGrid();
        });
        this.gameContextService.rack.subscribe((rack) => {
            for (const i of rack) {
                if (this.rack.length <= 7) this.rack.push(i.name);
            }
        });
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
        if (this.buttonPressed === 'Enter') {
            for (const elem of this.gridService.letterPosition) this.gameContextService.state.value.board[elem[0]][elem[1]] = null;
            this.communicationservice.place(
                this.gridService.letterForServer,
                this.firstLetter[1],
                this.firstLetter[0],
                this.mouseDetectService.isHorizontal,
            );
            this.gridService.letterPosition = [[0, 0]];
            this.gridService.letterWritten = 0;
            this.gridService.letters = [];
            this.gridService.letterForServer = '';
            this.gridService.drawGrid();
        } else if (this.buttonPressed === 'Backspace' && this.gridService.letters.length > 0) {
            const letter = this.gridService.letters.pop();
            const letterRemoved = this.gridService.letterPosition[this.gridService.letterPosition.length - 1];
            this.gridService.letterPosition.pop();
            this.gridService.letterForServer = this.gridService.letterForServer.slice(0, -1);
            if (letter !== undefined) {
                this.gridService.rack.push(letter);
                this.gameContextService.addTempRack(letter);
            }
            if (letterRemoved[0] !== undefined && letterRemoved[0] !== undefined)
                this.gameContextService.state.value.board[letterRemoved[0]][letterRemoved[1]] = null;
            this.gridService.drawGrid();
            this.drawShiftedArrow(letterRemoved, 1);
            this.gridService.letterWritten -= 1;
        } else if (this.mouseDetectService.writingAllowed && this.isInBound()) {
            try {
                this.gameContextService.attemptTempRackUpdate(this.buttonPressed);
                this.gridService.letterWritten += 1;
                for (const i of this.gridService.rack) {
                    if (i.name === this.buttonPressed.toUpperCase()) {
                        this.gridService.letters.push(i);
                        this.gridService.letterForServer += this.buttonPressed;
                        break;
                    }
                }
                this.gridService.drawGrid();
                if (this.gridService.letters.length === 1)
                    this.firstLetter = [
                        Math.ceil(this.mouseDetectService.mousePosition.x / 33) - 2,
                        Math.ceil(this.mouseDetectService.mousePosition.y / 33) - 2,
                    ];
                this.gridService.tempUpdateBoard(
                    this.buttonPressed,
                    Math.ceil(this.mouseDetectService.mousePosition.y / 33) - 2,
                    Math.ceil(this.mouseDetectService.mousePosition.x / 33) - 2,
                    this.mouseDetectService.isHorizontal,
                );
                const lastLetter = this.gridService.letterPosition[this.gridService.letterPosition.length - 1];
                this.drawShiftedArrow(lastLetter, 2);
                this.gameContextService.tempUpdateRack();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                this.communicationservice.sendLocalMessage(e.message);
            }
        }
    }

    drawShiftedArrow(pos: number[], shift: number) {
        if (this.mouseDetectService.isHorizontal)
            this.gridService.drawArrow(((pos[1] + shift) * 100) / 3, this.mouseDetectService.mousePosition.y, true);
        else this.gridService.drawArrow(this.mouseDetectService.mousePosition.x, ((pos[0] + shift) * 100) / 3, false);
    }
    isInBound() {
        if (this.mouseDetectService.isHorizontal && this.mouseDetectService.mousePosition.x + (this.gridService.letters.length * 100) / 3 <= 520)
            return true;
        else if (
            !this.mouseDetectService.isHorizontal &&
            this.mouseDetectService.mousePosition.y + (this.gridService.letters.length * 100) / 3 <= 520
        )
            return true;
        return false;
    }

    getShift(pos: number[]): number {
        const board = this.gameContextService.state.value.board;
        let shift = 2;
        if (this.mouseDetectService.isHorizontal) {
            while (board[pos[0]][pos[1] + 1] !== null) {
                pos[1] += 1;
                console.log(pos[1]);
                shift += 1;
                console.log(shift);
            }
            return shift;
        } else {
            while (board[pos[0] + 1][pos[1]] !== null) {
                pos[0] += 1;
                shift += 1;
            }
            return shift;
        }
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.isLoaded = true;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
