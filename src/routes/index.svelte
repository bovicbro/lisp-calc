<script lang="ts">
	import CellComponent from '../components/Cell.svelte';
	import type { Cell } from '../components/Cell';
	import { emptyCell, CellState } from '../components/Cell';
	import { evaluateSource } from '$lib/interpreter/';

	type Row = number;
	type Column = string;

	type Position = {
		row: Row;
		column: Column;
	};

	const newPosition = (row: Row, column: Column): Position => {
		return { row: row, column: column };
	};

	type State = {
		rows: Row[];
		columns: Column[];
		cells: Map<Position, Cell>;
	};

	//initiate state
	let state: State = {
		rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
		columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O','P','Q','R','S','T'],
		cells: new Map()
	};

	const updateCells = () => {
		state.cells.forEach((cell, position) => {
			updateCell(position, cell);
			console.log(cell);
		});
		state = state;
		console.log('updating all cells');
	};

	const updateCell = (position: Position, newState: Cell): void => {
		newState.state = CellState.Idle;
		newState = evaluate(newState);
		state.cells.set(position, newState);
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

	const stringToPosition = (s: string): Position => {
		const row = parseInt(/\d+/.exec(s)[0]) as Row;
		const column = /([A-Z])+/.exec(s)[0] as Column;
		return newPosition(row, column);
	};

	const getCellCallback = (s: State): ((arg0: string) => number) => {
		return (arg0: string): number => {
			return getCellValue(arg0, s);
		};
	};
</script>

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
					<CellComponent
						data={{ ...emptyCell }}
						callback={(newState) => updateCell({ row, column }, newState)}
					/>
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
		border: 1px solid lightgray;
		border-collapse: collapse;
	 margin: 0;
 }
</style>
