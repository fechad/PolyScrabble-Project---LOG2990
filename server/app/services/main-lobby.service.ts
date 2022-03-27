import { Game } from '@app/classes/game';
import { Parameters } from '@app/classes/parameters';
import { PlayerId, Room, RoomId, State } from '@app/classes/room';
import { imgList, NUMBER_ICONS } from '@app/constants';
import { EventEmitter } from 'events';
import { Container, Service } from 'typedi';
import { DictionnaryService } from './dictionnary.service';
import { RoomsService } from './rooms.service';

@Service()
export class MainLobbyService {
    private nextRoomId = 0;
    private dictionnaryService = Container.get<DictionnaryService>(DictionnaryService);

    constructor(private roomsService: RoomsService) {}

    connect(socket: EventEmitter, id: PlayerId) {
        const alreadyJoinedRoom = this.roomsService.rooms
            .filter((r) => r.getState() === State.Started)
            .find((r) => r.mainPlayer.id === id || r.getOtherPlayer()?.id === id);
        if (alreadyJoinedRoom) {
            socket.emit('join', alreadyJoinedRoom.id);
        }

        socket.on('join-room', (roomId: RoomId, playerName: string, avatar: string) => {
            const room = this.roomsService.rooms.find((r) => r.id === roomId);
            if (!room) {
                socket.emit('error', 'Room is no longer available');
                return;
            }
            const error = room.addPlayer(id, playerName, false, avatar);
            if (error) {
                socket.emit('error', error.message);
                return;
            }
            socket.emit('join', roomId);
        });

        socket.on('create-room', (playerName: string, parameters: Parameters, virtualPlayer?: string) => {
            const roomId = this.getNewRoomId();
            const room = new Room(roomId, id, playerName, parameters);
            socket.emit('join', roomId);
            console.log(`Created room ${roomId} for player ${playerName}`);
            this.roomsService.rooms.push(room);
            if (virtualPlayer) {
                room.addPlayer('VP', virtualPlayer, true, imgList[Math.floor(Math.random() * NUMBER_ICONS)]);
                room.start();
                const game = new Game(room, this.dictionnaryService);
                this.roomsService.games.push(game);
                /* const vP = new VirtualPlayer(parameters.difficulty, game, this.dictionnaryService, this.trie);
                vP.waitForTurn();*/
            }
        });
    }

    getNewRoomId(): RoomId {
        const roomId = this.nextRoomId;
        this.nextRoomId += 1;
        return roomId;
    }
}
