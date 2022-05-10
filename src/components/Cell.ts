export type Cell = {
    value?: number;
    function?: string;
    state: CellState;
}

export enum CellState {
    Idle = 'idle',
    Edit = 'edit'
}

export const emptyCell = {
    state: CellState.Idle
}
