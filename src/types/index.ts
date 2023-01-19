export enum GameStatus {
    PLAYING = 'playing',
    GAME_OVER = 'game-over'
}

export enum KeyboardKeys {
    TOP = 'w',
    TOP_RIGHT = 'e',
    TOP_LEFT = 'q',
    BOTTOM = 's',
    BOTTOM_RIGHT = 'd',
    BOTTOM_LEFT = 'a'
}

export interface RNGType {
    x: number
    y: number
    z: number
    value: number
}

export type MatrixType = Record<string, RNGType[]>
export enum SlideKeys {
    X = 'x',
    Y = 'y',
    Z = 'z'
}
export enum DirectionType {
    ASC= "ASC",
    DESC = "DESC"
}



