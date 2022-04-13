<script type="text/javascript" lang="ts">
	import Cell from '../components/Cell.svelte';

	type Row = number;
	type Column = string;

	type Position = {
		row: Row;
		column: Column;
	};

	type State = {
		rows: Row[];
		columns: Column[];
		Cells: Map<Position, Cell>;
	};

  type Cell = {
    value: number;
    function: string;
    state: CellState;
  }

  enum CellState {'idle','edit'}

	//initiate state
	let state: State = {
		rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
		columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
		Cells: new Map()
	};

  function evaluate(position: Position): number  {
    console.log(position)
    return 1
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
					<Cell content="." state="idle" callback={() => evaluate({row, column})} />
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
