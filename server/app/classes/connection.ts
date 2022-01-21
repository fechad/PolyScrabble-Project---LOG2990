import * as io from 'socket.io';
import { Parameters } from './parameters';

const ROOMS_LIST_UPDATE_TIMEOUT = 500; // ms

export type Room = {name: string, parameters: Parameters};

export class Connection {
    private io: io.Socket;
    private room: Room;
    private roomsBroadcastTimer: NodeJS.Timeout | undefined;

    constructor(io: io.Socket) { this.io = io; }

    init(): void {
        // message initial
        this.io.on('joinRoom', (room : Room) => this.joinRoom(room));
        this.roomsBroadcastTimer = setInterval(() => this.broadcastRooms(), ROOMS_LIST_UPDATE_TIMEOUT);
        this.io.on('changeParameters', (change) => this.changeParameters(change));

        this.io.on('startGame', () => this.startGame());
        this.io.on('message', (message: string) => {
            console.log(message);
        });
        this.io.on('validate', (word: string) => {
            const isValid = word.length > 5;
            this.io.emit('wordValidated', isValid);
        });

        this.io.on('disconnect', (reason) => {
            this.stopBroadcastsRooms();
            console.log(`Deconnexion par l'utilisateur avec id : ${this.io.id}`);
            console.log(`Raison de deconnexion : ${reason}`);
        });
    }

    joinRoom(room: Room): void {
        console.log(`Client ${this.io.id} joined room ${room.name}`);
        this.room = room;
        this.stopBroadcastsRooms();
    }

    broadcastRooms(): void {
        this.io.emit('rooms', ['1', '2', '3']);
    }

    stopBroadcastsRooms(): void {
        if (this.roomsBroadcastTimer != undefined) {
            clearInterval(this.roomsBroadcastTimer);
            this.roomsBroadcastTimer = undefined;
        }
    }

    startGame(): void {
        console.log(`Room ${this.room} started game`);
    }

    changeParameters(newParameters: Parameters): void {
        const validation = newParameters.validateParameters()
        if(validation === undefined){
            this.room.parameters = newParameters;
        } else {
            this.io.emit('validationError', `Error of Parameter: ${validation}`)
        }
    }
}