export type PlayerGameInfo = { name: string; pointsScored: number };
export enum GameMode {
    Classic = 'Classique',
    Log2990 = 'LOG2990',
}
export interface GameHistory {
    startTime: Date;
    length: string;
    firstPlayer: PlayerGameInfo;
    secondPlayer: PlayerGameInfo;
    mode: GameMode;
}
