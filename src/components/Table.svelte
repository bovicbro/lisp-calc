<script type="ts">

	const newPosition = (row: Row, column: Column): Position => {
		return { row: row, column: column };
	};

	type State = {
		rows: number[];
		columns: string[];
		cells: Map<Position, Cell>;
		selectedCell?: Cell;
		editedCell?: Cell;
	};

	//initiate state
	let state: State = {
		rows: [
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
		],
		columns: [
			'A',
			'B',
			'C',
			'D',
			'E',
			'F',
			'G',
			'H',
			'I',
			'J',
			'K',
			'L',
			'M',
			'N',
			'O',
			'P',
			'Q',
			'R',
			'S',
			'T'
		],
		cells: new Map()
	};

	const stringToPosition = (s: string): Position => {
		const row = parseInt(/\d+/.exec(s)[0]) as Row;
		const column = /([A-Z])+/.exec(s)[0] as Column;
		return newPosition(row, column);
	};

	// Initiates cells
	state.rows.forEach((row) =>
		state.columns.forEach((column) =>
			state.cells.set({ row, column }, { ...emptyCell, position: { row, column } })
		)
	);

	const handleKeydown = (e) => {
		const key = e.key;
		console.log(key);
		switch (key) {
			case 'ArrowUp':
				break;
			case 'ArrowLeft':
				break;
			case 'ArrowRight':
				break;
			case 'ArrowDown':
				break;
			case 'F2':
				if (state.selectedCell) state.selectedCell.state = CellState.Edit;
				break;
			case 'Delete':
				if (state.selectedCell) {
					state.selectedCell.function = '';
				}
				break;
			case 'Enter':
				console.log(state);
		}
	};
</script>


<svelte:window on:keydown={handleKeydown} />
<Modal />
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
							data={getCellFromPosition({ row, column }, state.cells)}
							callback={(newState) => {
								handleUpdate(newState);
							}}
							{selectCell}
							{deselectCell}
							editCell={editCell(state)}
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
		background-color: #cde0e5;
	}
	th {
		background-color: #274472;
		color: white;
		min-width: 40px;
	}

	table,
	th,
	td {
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
		border: 1px solid lightslategray;
		border-collapse: collapse;
		margin: 0;
	}
</style>
