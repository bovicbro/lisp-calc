export type Cell = {
    value?:    number;
    function?: string;
    state:     CellState;
    position?:  Position;
}

export enum CellState {
    Idle     = 'idle',
    Edit     = 'edit',
    Selected = 'selected'
}

export const emptyCell = {
    state: CellState.Idle
}


export type Position = {
    row: Row;
    column: Column;
};

export type Row = number;
export type Column = string;
