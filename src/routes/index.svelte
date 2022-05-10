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
		rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
		columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
		cells: new Map()
	};

	function updateCell(position: Position, newState: Cell): void {
		newState.state = CellState.Idle;
		newState = evaluate(newState);
		state.cells.set(position, newState);
		state = state;
	}

	function evaluate(c: Cell): Cell {
		if( typeof c.function == 'undefined' ) return emptyCell
		if (c.function[0] == '=') c.value = evaluateSource(c.function.slice(1), getCellValue);
		else c.value = c.function;
		return c;
	}

	const getCellValue = (p: Position): number => {
		return getCellFromPosition(state.cells, p).value
	};

	const stringToPosition = (s: string): Position => {
		const row = parseInt(/\d+/.exec(s)[0]) as Row;
		const column = /([A-Z])+/.exec(s)[0] as Column;
		return newPosition(row, column);
	};

 const getCellFromPosition = (map: Map<Position,Cell>, position: Position): Cell => {
	 let returnValue: Cell;
	 map.forEach( (value, key) => {
		 if (key.row == position.row && key.column == position.column) {
			 returnValue = value
		 }
	 })
	 return returnValue
 }

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
<button
	on:click={() => {
		console.log(getCellValue(stringToPosition('A1')));
	}}>BFB</button
>

<style type="text/css" media="screen">
	td {
		padding: 0;
	}
</style>
