<script lang="ts">
 import CellComponent from '../components/Cell.svelte';
 import Modal from '../components/Modal.svelte'
 import type { Cell, Position, Row, Column} from '../components/Cell';
 import { emptyCell, CellState } from '../components/Cell';
 import { evaluateSource } from '$lib/interpreter/';

	const newPosition = (row: Row, column: Column): Position => {
		return { row: row, column: column };
	};

	type State = {
		rows: number[];
		columns: string[];
		cells: Map<Position, Cell>;
		selectedCell?: Cell;
	};

	//initiate state
	let state: State = {
		rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
		columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O','P','Q','R','S','T'],
		cells: new Map()
	};

	const stringToPosition = (s: string): Position => {
		const row = parseInt(/\d+/.exec(s)[0]) as Row;
		const column = /([A-Z])+/.exec(s)[0] as Column;
		return newPosition(row, column);
	};

 // Initiates cells
 state.rows.forEach((row) => state.columns.forEach( (column) => state.cells.set({row,column},{...emptyCell, position: {row,column}})))

	const updateCells = () => {
		state.cells.forEach((cell, position) => {
            if (cell && position)
                updateCell(position, cell);
		});
		state = state;
	};

	const updateCell = (position: Position, newState: Cell): void => {
		newState.state = CellState.Idle;
		newState = evaluate(newState);
		// state.cells.set(newState.position, {...newState});
		state = state;
	};

	const evaluate = (c: Cell): Cell => {
		if (typeof c.function == 'undefined') return emptyCell;
		if (c.function[0] == '=') c.value = evaluateSource(c.function.slice(1), getCellCallback(state));
		else c.value = c.function;
		return c;
	};

	const getCellValue = (position: string, state: State): number => {
		let returnValue: Cell;
		const p: Position = stringToPosition(position);
		state.cells.forEach((value, key) => {
			if (key.row == p.row && key.column == p.column) {
				returnValue = value;
			}
		});
		return returnValue.value;
	};

 const getCellFromPosition = (position: Position, cells: Map<Position,Cell>) => {
	 let cell: Cell;
	 cells.forEach( (value, key) => {
			if (key.row == position.row && key.column == position.column) {
				cell = value;
			}

	 } )
	 return cell
 }

	const getCellCallback = (s: State): ((arg0: string) => number) => {
		return (arg0: string): number => {
			return getCellValue(arg0, s);
		};
	};

 const selectCell = (c: Cell): void => {
	 if (state.selectedCell) {
		 state.selectedCell.state = CellState.Idle
	 }
	 state.selectedCell = c
 }

 const deselectCell = (): void => {
	 if (state.selectedCell)
	 	state.selectedCell = null
 }

 const handleUpdate = (newState) => {
     updateCell(newState.position, newState)
     updateCells()
 }
</script>

<Modal/>
<table>
	<tr>
		<th />
		{#each state.columns as heading}
			<th>{heading}</th>
		{/each}
	</tr>
	{#each state.rows as row}
		<tr>
			<th>{row}</th>
			{#each state.columns as column}
				<td>
					{#if state}
					<CellComponent
						data = {getCellFromPosition({row,column},state.cells)}
						callback={(newState) => {handleUpdate(newState)}}
						selectCell={selectCell}
						deselectCell = {deselectCell}
					/>
					{/if}
				</td>
			{/each}
		</tr>
	{/each}
</table>

<style type="text/css" media="screen">
	td {
		padding: 0;
	}

 tr:nth-child(even) {
  background-color: #CDE0E5;
 }
 th {
	 background-color: #274472;
	 color: white;
	 min-width: 40px;
 }

 table, th, td {
	 font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
	 border: 1px solid lightslategray;
	 border-collapse: collapse;
	 margin: 0;
 }
</style>
