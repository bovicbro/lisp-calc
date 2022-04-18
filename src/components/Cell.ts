export type Cell = {
    value: number | string;
    function: string;
    state: CellState;
}

export enum CellState {
    Idle = 'idle',
    Edit = 'edit'
}

export const emptyCell = {
    value: '',
    function: '',
    state: CellState.Idle
}
