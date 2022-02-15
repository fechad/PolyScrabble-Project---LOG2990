import { DictionnaryService } from '@app/services/dictionnary.service';
import { expect } from 'chai';
import { assert } from 'console';
import { Board } from './board';

/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */

const BOARD_LENGTH = 15;
const INVALID = -1;

describe('Board', () => {
    let board: Board;
    let word: string;
    let dictionnary: DictionnaryService;

    before(async () => {
        dictionnary = new DictionnaryService();
        await dictionnary.init();
    });

    beforeEach(() => {
        board = new Board(dictionnary);
        word = 'test';
    });

    it('should create 225 tiles', (done) => {
        const expectedCount = BOARD_LENGTH * BOARD_LENGTH;
        assert(board.board !== undefined);
        let count = 0;
        board.board.forEach((row) => {
            row.forEach((tile) => {
                if (tile !== undefined) count++;
            });
        });
        expect(count).equal(expectedCount);
        done();
    });

    it('should have all type of multipliers', (done) => {
        let testRef = [0, 0, 1, 3];
        assert(board.board[testRef[0]][testRef[1]].multiplier === testRef[2]);
        assert(board.board[testRef[0]][testRef[1]].wordMultiplier === testRef[3]);

        testRef = [1, 13, 1, 2];
        assert(board.board[testRef[0]][testRef[1]].multiplier === testRef[2]);
        assert(board.board[testRef[0]][testRef[1]].wordMultiplier === testRef[3]);

        testRef = [5, 1, 3, 1];
        assert(board.board[testRef[0]][testRef[1]].multiplier === testRef[2]);
        assert(board.board[testRef[0]][testRef[1]].wordMultiplier === testRef[3]);

        testRef = [0, 3, 2, 1];
        assert(board.board[testRef[0]][testRef[1]].multiplier === testRef[2]);
        assert(board.board[testRef[0]][testRef[1]].wordMultiplier === testRef[3]);

        testRef = [2, 4, 1, 1];
        assert(board.board[testRef[0]][testRef[1]].multiplier === testRef[2]);
        assert(board.board[testRef[0]][testRef[1]].wordMultiplier === testRef[3]);
        done();
    });

    it('should validate if word is inside the board', (done) => {
        let positionArray = ['c', '12', 'h'];
        let result = board['isWordInBound'](word.length, positionArray);
        assert(result);

        positionArray = ['l', '9', 'v'];
        result = board['isWordInBound'](word.length, positionArray);
        assert(result);
        done();
    });

    it('should not let the word get out of the board', (done) => {
        let positionArray = ['c', '13', 'h'];
        let result = board['isWordInBound'](word.length, positionArray);
        assert(!result);

        positionArray = ['n', '9', 'v'];
        result = board['isWordInBound'](word.length, positionArray);
        assert(!result);

        positionArray = ['d', '12', 'h'];
        result = board['isWordInBound'](word.length, positionArray);
        assert(result);
        board.board[3][12].setLetter('a');
        result = board['isWordInBound'](word.length, positionArray);
        assert(!result);

        positionArray = ['k', '10', 'v'];
        result = board['isWordInBound'](word.length, positionArray);
        assert(result);
        board.board[11][9].setLetter('a');
        board.board[13][9].setLetter('t');
        result = board['isWordInBound'](word.length, positionArray);
        assert(!result);
        done();
    });

    it('should let a placement on the star for first word', (done) => {
        let positionArray = ['h', '6', 'h'];
        let result = board['firstWordValidation'](word.length, positionArray);
        assert(result);

        positionArray = ['e', '8', 'v'];
        result = board['firstWordValidation'](word.length, positionArray);
        assert(result);

        positionArray = ['h', '8', 'h'];
        result = board['firstWordValidation'](word.length, positionArray);
        assert(result);
        done();
    });

    it('should let not first word not touch the star', (done) => {
        const positionArray = ['m', '5', 'h'];
        board.board[7][7].setLetter('a');
        const result = board['firstWordValidation'](word.length, positionArray);
        assert(result);
        done();
    });

    it('should not let a placement not on the star for first word', (done) => {
        let positionArray = ['i', '6', 'h'];
        let result = board['firstWordValidation'](word.length, positionArray);
        assert(!result);

        positionArray = ['d', '8', 'v'];
        result = board['firstWordValidation'](word.length, positionArray);
        assert(!result);

        positionArray = ['h', '9', 'h'];
        result = board['firstWordValidation'](word.length, positionArray);
        assert(!result);
        done();
    });

    it('should not let no contact except for first word', (done) => {
        let positionArray = ['f', '11', 'v'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));

        board.board[7][6].setLetter('a');
        board.board[7][7].setLetter('s');

        positionArray = ['b', '6', 'v'];
        assert(!board['isTouchingOtherWord'](word.length, positionArray));
        done();
    });

    it('should validate if word has contact point', (done) => {
        board.board[7][6].setLetter('a');
        board.board[7][7].setLetter('s');

        let positionArray = ['h', '9', 'h'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['h', '3', 'h'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['i', '7', 'h'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['g', '6', 'h'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['h', '6', 'h'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        // TODO: check if going through a word

        positionArray = ['f', '9', 'v'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['g', '6', 'v'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['d', '7', 'v'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['i', '8', 'v'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        positionArray = ['f', '8', 'v'];
        assert(board['isTouchingOtherWord'](word.length, positionArray));
        done();
    });

    it('should get all the points of contact of the word', (done) => {
        board.board[7][6].setLetter('a');
        board.board[7][7].setLetter('s');

        let positionArray = ['i', '6', 'h'];
        let contacts = board['getContacts'](word.length, positionArray);
        assert(contacts.length === 2);
        assert(contacts[0][0] === 8);
        assert(contacts[0][1] === 6);
        assert(contacts[0][2] === 1);

        assert(contacts[1][0] === 8);
        assert(contacts[1][1] === 7);
        assert(contacts[1][2] === 2);

        board.board[8][6].setLetter('i');

        positionArray = ['i', '6', 'h'];
        contacts = board['getContacts'](word.length, positionArray);
        assert(contacts.length === 2);
        assert(contacts[0][0] === 8);
        assert(contacts[0][1] === 6);
        assert(contacts[0][2] === INVALID);

        assert(contacts[1][0] === 8);
        assert(contacts[1][1] === 7);
        assert(contacts[1][2] === 1);

        positionArray = ['e', '7', 'v'];
        contacts = board['getContacts'](word.length, positionArray);
        assert(contacts.length === 2);
        assert(contacts[0][0] === 7);
        assert(contacts[0][1] === 6);
        assert(contacts[0][2] === INVALID);

        assert(contacts[1][0] === 8);
        assert(contacts[1][1] === 6);
        assert(contacts[1][2] === INVALID);

        positionArray = ['e', '6', 'v'];
        contacts = board['getContacts'](word.length, positionArray);
        assert(contacts.length === 1);
        assert(contacts[0][0] === 7);
        assert(contacts[0][1] === 5);
        assert(contacts[0][2] === 3);
        done();
    });
    it('should change newly placed word', (done) => {
        board.board[7][6].setLetter('a');
        board.board[7][7].setLetter('s');
        board.board[9][6].setLetter('v');
        board.board[10][6].setLetter('u');

        let wordAndPos = ['h', '7', '6', 'as'];
        board['changeNewlyPlaced'](wordAndPos);

        assert(!board.board[7][6].newlyPlaced);
        assert(!board.board[7][7].newlyPlaced);
        assert(board.board[9][6].newlyPlaced);
        assert(board.board[10][6].newlyPlaced);

        wordAndPos = ['v', '9', '6', 'vu'];
        board['changeNewlyPlaced'](wordAndPos);

        assert(!board.board[7][6].newlyPlaced);
        assert(!board.board[7][7].newlyPlaced);
        assert(!board.board[9][6].newlyPlaced);
        assert(!board.board[10][6].newlyPlaced);
        done();
    });

    it('should place the letters on the board and get the score', (done) => {
        let wordAndPos = ['h;7;6;as', 'v;9;6;vu'];
        let expectedScore = 7;
        let score = board['placeWithScore'](wordAndPos);

        assert(!board.board[7][6].newlyPlaced);
        assert(!board.board[7][7].newlyPlaced);
        expect(score).to.equal(expectedScore);

        wordAndPos = ['v;4;5;test', 'h;7;5;tas'];
        expectedScore = 9;
        score = board['placeWithScore'](wordAndPos);

        assert(!board.board[4][5].newlyPlaced);
        assert(!board.board[5][5].newlyPlaced);
        assert(!board.board[6][5].newlyPlaced);
        assert(!board.board[7][5].newlyPlaced);
        expect(score).to.equal(expectedScore);

        wordAndPos = ['h;5;4;metro', 'v;4;5;test'];
        expectedScore = 10;
        score = board['placeWithScore'](wordAndPos);

        assert(!board.board[5][4].newlyPlaced);
        assert(!board.board[5][5].newlyPlaced);
        assert(!board.board[5][6].newlyPlaced);
        assert(!board.board[5][7].newlyPlaced);
        assert(!board.board[5][8].newlyPlaced);
        expect(score).to.equal(expectedScore);

        wordAndPos = ['v;7;7;speciale', 'h;7;5;tas'];
        expectedScore = 42;
        score = board['placeWithScore'](wordAndPos);

        assert(!board.board[7][7].newlyPlaced);
        assert(!board.board[7][8].newlyPlaced);
        assert(!board.board[7][9].newlyPlaced);
        assert(!board.board[7][10].newlyPlaced);
        assert(!board.board[7][11].newlyPlaced);
        assert(!board.board[7][12].newlyPlaced);
        assert(!board.board[7][13].newlyPlaced);
        assert(!board.board[7][14].newlyPlaced);
        expect(score).to.equal(expectedScore);
        done();
    });

    it('should place a word on the board', async () => {
        let position = 'f8v';
        let attemptedWord = 'testeur';
        let expectedScore = 58;

        let result = await board.placeWord(attemptedWord, position);
        expect(result).to.equals(expectedScore);

        position = 'f6h';
        // arts avec la collision avec le premier t de testeur
        attemptedWord = 'ars';
        expectedScore = 13;

        result = await board.placeWord(attemptedWord, position);
        expect(result).to.equals(expectedScore);
    });
});
