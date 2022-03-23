import { GameTile } from '@app/classes/game-tile';
import { PlacementOption } from '@app/classes/placement-option';
import * as cst from '@app/constants';

export type Position = { row: number; col: number };

export class WordGetter {
    constructor(public board: GameTile[][]) {}

    static wordWithOffset(placement: PlacementOption, offset: number): Position {
        const row = placement.row + (placement.isHorizontal ? 0 : offset);
        const col = placement.col + (placement.isHorizontal ? offset : 0);
        return { row, col };
    }

    getStringPositionVirtualPlayer(placement: PlacementOption): string {
        let contactWord = '';
        if (!this.isInBound({ row: placement.row, col: placement.col})) return contactWord;
        const pos = this.findStart(placement);
        if (placement.isHorizontal) {
            while (pos.col < cst.BOARD_LENGTH && (!this.board[pos.row][pos.col].empty || pos.col === placement.col)) {
                if (pos.col === placement.col) contactWord += cst.CONTACT_CHAR;
                else contactWord += this.board[pos.row][pos.col].getChar();
                pos.col++;
            }
        } else {
            while (pos.row < cst.BOARD_LENGTH && (!this.board[pos.row][pos.col].empty || pos.row === placement.row)) {
                if (pos.row === placement.row) contactWord += cst.CONTACT_CHAR;
                else contactWord += this.board[pos.row][pos.col].getChar();
                pos.row++;
            }
        }
        return contactWord;
    }

    getWords(placement: PlacementOption, contacts: number[][]): PlacementOption[] {
        const words: PlacementOption[] = [];
        words.push(this.getLettersAttemptedWord(placement));
        words.push(
            ...contacts
                .filter((contact) => contact.length !== 0)
                .map((contact) => {
                    const contactPlacement = new PlacementOption(
                        contact[cst.ROW_CONTACT],
                        contact[cst.COL_CONTACT],
                        !placement.isHorizontal,
                        placement.word,
                    );
                    return this.getLettersAttemptedWord(contactPlacement, contact[cst.LETTER_PLACE_CONTACT]);
                }),
        );
        return words;
    }

    private findStart(placement: PlacementOption): Position {
        let row = placement.row;
        let col = placement.col;
        if (placement.isHorizontal) while (col > 0 && !this.board[row][col - 1].empty) col--;
        else while (row > 0 && !this.board[row - 1][col].empty) row--;
        return { row, col };
    }

    private getLettersAttemptedWord(placement: PlacementOption, contactIdx?: number): PlacementOption {
        let letterCount = 0;
        let letters = '';

        if (!this.isInBound({ row: placement.row, col: placement.col})) return placement;
        const pos = this.findStart(placement);

        const minRow = pos.row;
        const minCol = pos.col;

        while (this.isInBound(pos)) {
            if (!this.board[pos.row][pos.col].empty) {
                letters += this.board[pos.row][pos.col].getChar();
            } else if (contactIdx !== undefined && pos.row === placement.row && pos.col === placement.col) {
                letters += placement.word.charAt(contactIdx);
            } else if (contactIdx === undefined && letterCount < placement.word.length) {
                letters += placement.word.charAt(letterCount);
                letterCount++;
            } else {
                break;
            }
            if (placement.isHorizontal) pos.col++;
            else pos.row++;
        }
        return new PlacementOption(minRow, minCol, placement.isHorizontal, letters);
    }

    private isInBound(pos: Position): boolean {
        return pos.row >= 0 && pos.row < cst.BOARD_LENGTH && pos.col >= 0 && pos.col < cst.BOARD_LENGTH;
    }
}
