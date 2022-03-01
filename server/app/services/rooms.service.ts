import { Game } from '@app/classes/game';
import { Room, RoomId } from '@app/classes/room';
import { Service } from 'typedi';

export const DELETION_DELAY = 5000; // ms
const NOT_FOUND = -1;

@Service()
export class RoomsService {
    readonly rooms: Room[] = [];
    readonly games: Game[] = [];

    remove(roomId: RoomId) {
        const roomIdx = this.rooms.findIndex((room) => room.id === roomId);
        if (roomIdx !== NOT_FOUND) {
            this.rooms.splice(roomIdx, 1);
        }
        const gameIdx = this.games.findIndex((game) => game.gameId === roomId);
        if (gameIdx !== NOT_FOUND) {
            this.games.splice(gameIdx, 1);
        }
    }
}
