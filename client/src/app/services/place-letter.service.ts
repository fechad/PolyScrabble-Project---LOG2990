import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import * as constants from '@app/constants';
import { GameContextService } from './game-context.service';
import { GridService } from './grid.service';
import { MouseService } from './mouse.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceLetterService {
    constructor(private gridService: GridService, private gameContextService: GameContextService, private mouseDetectService: MouseService) {}

    removeWord() {
        for (const letter of this.gridService.letters) {
            this.gridService.rack.push(letter);
            this.gameContextService.addTempRack(letter);
        }
        for (const position of this.gridService.letterPosition) {
            this.gameContextService.state.value.board[position[0]][position[1]] = null;
        }
        this.clear();
    }

    sendPlacedLetters() {
        for (const position of this.gridService.letterPosition) this.gameContextService.state.value.board[position[0]][position[1]] = null;
        this.gameContextService.place(
            this.gridService.letterForServer,
            this.gridService.firstLetter[1],
            this.gridService.firstLetter[0],
            this.mouseDetectService.isHorizontal,
        );
        this.gridService.tempUpdateBoard(
            this.gridService.letterForServer,
            this.gridService.firstLetter[1],
            this.gridService.firstLetter[0],
            this.mouseDetectService.isHorizontal,
        );
        this.clear();
    }

    clear() {
        this.gridService.letterPosition = [];
        this.gridService.letterWritten = 0;
        this.gridService.letters = [];
        this.gridService.letterForServer = '';
        this.gridService.drawGrid();
    }

    removeLetterOnCanvas() {
        const letter = this.gridService.letters.pop();
        const letterRemoved = this.gridService.letterPosition[this.gridService.letterPosition.length - 1];
        this.gridService.letterPosition.pop();
        this.gridService.letterForServer = this.gridService.letterForServer.slice(0, constants.LAST_INDEX);
        if (!letter) throw new Error('tried to remove a letter when word is empty');
        this.gridService.rack.push(letter);
        this.gameContextService.addTempRack(letter);
        this.gameContextService.state.value.board[letterRemoved[0]][letterRemoved[1]] = null;
        this.gridService.drawGrid();
        this.drawShiftedArrow(letterRemoved, 1);
        this.gridService.letterWritten -= 1;
    }

    placeWordOnCanvas(word: string) {
        const asterisk: Letter = { name: '*', score: 0 };
        this.gameContextService.attemptTempRackUpdate(word);
        this.gridService.letterWritten += 1;
        const item = this.gridService.rack.find((i) => i.name === word.toUpperCase() && word.toLowerCase() === word);
        this.gridService.letters.push(item || asterisk);
        this.gridService.letterForServer += word;
        if (this.gridService.letters.length === 1)
            this.gridService.firstLetter = [
                Math.ceil(this.mouseDetectService.mousePosition.x / constants.CANVAS_SQUARE_SIZE) - constants.ADJUSTMENT,
                Math.ceil(this.mouseDetectService.mousePosition.y / constants.CANVAS_SQUARE_SIZE) - constants.ADJUSTMENT,
            ];
        this.gridService.tempUpdateBoard(
            word,
            Math.ceil(this.mouseDetectService.mousePosition.y / constants.CANVAS_SQUARE_SIZE) - constants.ADJUSTMENT,
            Math.ceil(this.mouseDetectService.mousePosition.x / constants.CANVAS_SQUARE_SIZE) - constants.ADJUSTMENT,
            this.mouseDetectService.isHorizontal,
        );
        const lastLetter = this.gridService.letterPosition[this.gridService.letterPosition.length - 1];
        if (this.nextPosExist()) this.drawShiftedArrow(lastLetter, this.getShift(lastLetter));
        this.gameContextService.tempUpdateRack();
    }

    nextPosExist() {
        const lastLetter = this.gridService.letterPosition[this.gridService.letterPosition.length - 1];
        return (
            (this.getShift(lastLetter) + lastLetter[1] < constants.POS_AND_SHIFT && this.mouseDetectService.isHorizontal) ||
            (this.getShift(lastLetter) + lastLetter[0] < constants.POS_AND_SHIFT && !this.mouseDetectService.isHorizontal)
        );
    }

    drawShiftedArrow(pos: number[], shift: number) {
        if (this.mouseDetectService.isHorizontal)
            this.gridService.drawArrow((pos[1] + shift) * constants.CANVAS_SQUARE_SIZE, this.mouseDetectService.mousePosition.y, true);
        else this.gridService.drawArrow(this.mouseDetectService.mousePosition.x, (pos[0] + shift) * constants.CANVAS_SQUARE_SIZE, false);
    }

    getShift(pos: number[]): number {
        const board = this.gameContextService.state.value.board;
        let shift = 2;
        const horizontal = this.mouseDetectService.isHorizontal;
        let y = horizontal ? pos[0] : pos[0] + 1;
        let x = horizontal ? pos[1] + 1 : pos[1];
        while (y !== constants.BOARD_SIZE && board[y][x]) {
            if (horizontal) x++;
            else y++;
            shift++;
        }
        return shift;
    }
}
