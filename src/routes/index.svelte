<script lang="ts">
	import CellComponent from '../components/Cell.svelte';
	import type { Cell } from '../components/Cell';
	import { emptyCell, CellState } from '../components/Cell';

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
		rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
		cells: new Map()
	};

	function updateCell(position: Position, newState: Cell): void {
		newState.state = CellState.Idle;
		newState = evaluate(newState);
		state.cells.set(position, newState);
		state = state;
	}

	function evaluate(c: Cell): Cell {
		if (c.function[0] == '=') c.value = eval(c.function.substring(1));
		else c.value = c.function;
		return c;
	}

	// Tokens - my building blocks.
	type Token = Number | Add | Subtract;
	type Number = { type: 'number'; val: number };
	const number = (v: number) => ({type: 'number', val: v} as Number) 
	type Add = { type: 'add';};
	const add = () => ({type: 'add'} as Add) 
	type Subtract = { type: 'subtract';};

	// Scanning / tokenizing
	// Split the string into datatypes
	const tokenize = (stream: string): Token[] => {
		let parsedTokens: Token[];
		return parsedTokens;
	};

	// const tokenMap = new Map<RegExp, () => Token >([
	// 	[new RegExp('+'), add],
	// 	[new RegExp('/d'), number]
	// ])

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
