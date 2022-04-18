<script lang="ts">
	import CellComponent from '../components/Cell.svelte';
	import type { Cell } from '../components/Cell';
	import { emptyCell, CellState } from '../components/Cell';
	import interpreteSource from './interpreter'

	type Row = number;
	type Column = string;

	type Position = {
		row: Row;
		column: Column;
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
		if (c.function[0] == '=') c.value = interpreteSource(c.function.slice(1));
		else c.value = c.function;
		return c;
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

<style type="text/css" media="screen">
	td {
		padding: 0;
	}
</style>
