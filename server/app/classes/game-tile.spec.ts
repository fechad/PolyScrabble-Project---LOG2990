import { expect } from 'chai';
import { assert } from 'console';
import { GameTile } from './game-tile';

describe('Game Tile', () => {
    let gameTile: GameTile;
    let gameTileMult2: GameTile;
    let gameTileWordMult3: GameTile;

    beforeEach(() => {
        gameTile = new GameTile(1);
        gameTileMult2 = new GameTile(2);
        gameTileWordMult3 = new GameTile(1, 3);
    });

    it('should be initialised with the good multipliers', (done) => {
        assert(gameTile.multiplier === 1);
        assert(gameTile.wordMultiplier === 1);

        assert(gameTileMult2.multiplier === 2);
        assert(gameTileMult2.wordMultiplier === 1);

        assert(gameTileWordMult3.multiplier === 1);
        assert(gameTileWordMult3.wordMultiplier === 3);
        done();
    });

    it('should set a letter', (done) => {
        gameTile.setLetter('a');

        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'].name === 'A');
        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'].score === 1);
        assert(!gameTile.empty);
        done();
    });

    it('should get the char of the letter', (done) => {
        assert(gameTile.getChar() === '!');

        gameTile.setLetter('a');

        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'].name === 'A');
        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'].score === 1);
        assert(!gameTile.empty);
        const char = gameTile.getChar();
        assert(char === 'a');
        done();
    });

    it('should get the letter', (done) => {
        let expectedLetter = { id: 1, name: 'A', score: 1, quantity: 9 };
        let char = 'a';
        // eslint-disable-next-line dot-notation
        let result = gameTile['getLetter'](char);
        expect(result.id).to.equal(expectedLetter.id);
        expect(result.name).to.equal(expectedLetter.name);
        expect(result.score).to.equal(expectedLetter.score);
        expect(result.quantity).to.equal(expectedLetter.quantity);

        expectedLetter = { id: 21, name: 'U', score: 1, quantity: 6 };
        char = 'u';
        // eslint-disable-next-line dot-notation
        result = gameTile['getLetter'](char);
        expect(result.id).to.equal(expectedLetter.id);
        expect(result.name).to.equal(expectedLetter.name);
        expect(result.score).to.equal(expectedLetter.score);
        expect(result.quantity).to.equal(expectedLetter.quantity);

        expectedLetter = { id: 27, name: '*', score: 0, quantity: 2 };
        char = '8cjbs';
        // eslint-disable-next-line dot-notation
        result = gameTile['getLetter'](char);
        expect(result.id).to.equal(expectedLetter.id);
        expect(result.name).to.equal(expectedLetter.name);
        expect(result.score).to.equal(expectedLetter.score);
        expect(result.quantity).to.equal(expectedLetter.quantity);
        done();
    });

    it('should get points of the tile', (done) => {
        gameTile.setLetter('b');
        gameTileMult2.setLetter('i');
        gameTileWordMult3.setLetter('o');

        assert(gameTile.getChar() === 'b');
        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'].score === 3);
        assert(gameTile.getPoints() === 3);
        assert(!gameTile.empty);

        assert(gameTileMult2.getChar() === 'i');
        // eslint-disable-next-line dot-notation
        assert(gameTileMult2['letter'].score === 1);
        assert(gameTileMult2.getPoints() === 2);
        gameTileMult2.newlyPlaced = false;
        assert(gameTileMult2.getPoints() === 1);
        assert(!gameTileMult2.empty);

        assert(gameTileWordMult3.getChar() === 'o');
        // eslint-disable-next-line dot-notation
        assert(gameTileWordMult3['letter'].score === 1);
        assert(!gameTileWordMult3.empty);
        done();
    });

    it('should not get points if there is no letter', (done) => {
        const invalid = -1;
        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'] === undefined);
        assert(gameTile.getPoints() === invalid);
        done();
    });

    it('should set 0 points for a special letter', (done) => {
        gameTile.setLetter('A');
        assert(gameTile.getChar() === 'a');
        // eslint-disable-next-line dot-notation
        assert(gameTile['letter'].score === 0);
        assert(gameTile.getPoints() === 0);
        done();
    });
});
