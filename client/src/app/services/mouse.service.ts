import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { take } from 'rxjs/operators';
import { GameContextService } from './game-context.service';
import { GridService } from './grid.service';
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!

const DEFAULT_SIZE = 500;
const offset = 1;
const TILE = 32;
const NUMBER_OF_TILES = 15;
const GRID_ORIGIN = 20;
const CANVAS_ADJUSTMENT = 16;

@Injectable({
    providedIn: 'root',
})
export class MouseService {
    mousePosition: Vec2 = { x: 0, y: 0 };
    isHorizontal = true;
    constructor(private gridService: GridService, public gameContextService: GameContextService) {}

    async mouseHitDetect(event: MouseEvent) {
        const board = this.gameContextService.state.value.board;
        const myTurn = await this.gameContextService.isMyTurn().pipe(take(1)).toPromise();
        if (!myTurn) return;
        if (this.gridService.letterWritten !== 0) return;
        if (this.gridService.letterWritten < 0) this.gridService.letterWritten = 0;
        if (event.button !== MouseButton.Left || !this.isInBound(event)) return;

        const prevPos = this.mousePosition;
        this.mousePosition = {
            x: this.calculateX(event.offsetX),
            y: this.calculateY(event.offsetY),
        };
        const y = Math.ceil(this.mousePosition.y / 33) - 2;
        const x = Math.ceil(this.mousePosition.x / 33) - 2;
        if (board[y][x] !== null) return;
        if (prevPos.x === this.mousePosition.x && prevPos.y === this.mousePosition.y) {
            this.isHorizontal = !this.isHorizontal;
        } else {
            this.isHorizontal = true;
        }
        this.gridService.drawGrid();
        this.gridService.drawArrow(this.mousePosition.x, this.mousePosition.y, this.isHorizontal);
    }

    isInBound(event: MouseEvent): boolean {
        const size = document.getElementById('canvas')?.clientWidth;
        const GRID_BORDERS = [GRID_ORIGIN, size];
        return (
            event.offsetX >= GRID_BORDERS[0]?.valueOf()! &&
            event.offsetX <= GRID_BORDERS[1]?.valueOf()! &&
            event.offsetY >= GRID_BORDERS[0]?.valueOf()! &&
            event.offsetY <= GRID_BORDERS[1]?.valueOf()!
        );
    }
    calculateX(xPosition: number): number {
        const size = document.getElementById('canvas')?.clientWidth;
        const sqrSize = DEFAULT_SIZE / NUMBER_OF_TILES;
        const converted = (xPosition * DEFAULT_SIZE) / size?.valueOf()!;
        let x = Math.floor((converted - GRID_ORIGIN) / TILE);
        if (x < 0) x = 0;
        return (sqrSize + offset) * x + GRID_ORIGIN + CANVAS_ADJUSTMENT;
    }
    calculateY(yPosition: number): number {
        const size = document.getElementById('canvas')?.clientWidth;
        const sqrSize = DEFAULT_SIZE / NUMBER_OF_TILES - offset;
        const converted = (yPosition * DEFAULT_SIZE) / size?.valueOf()!;
        let y = Math.floor((converted - GRID_ORIGIN) / TILE);
        if (y < 0) y = 0;
        return (sqrSize + offset) * y + GRID_ORIGIN + CANVAS_ADJUSTMENT;
    }
}
