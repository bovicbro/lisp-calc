<script lang="ts">
	import CellComponent from '../components/Cell.svelte';
	import Modal from '../components/Modal.svelte';
	import type { Cell, Position, Row, Column } from '../components/Cell';
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

	const updateCells = () => {
		state.cells.forEach((cell, position) => {
			if (cell && position) updateCell(cell);
		});
		state = state;
	};

	const updateCell = (newState: Cell): void => {
		newState = evaluate(newState);
		newState.state = CellState.Idle;
	};

	const evaluate = (c: Cell): Cell => {
		if (typeof c.function == 'undefined') return emptyCell;
		if (c.function[0] == '=') c.value = evaluateSource(c.function.slice(1), getCellCallback(state));
		else c.value = parseInt(c.function);
		return c;
	};

	const getCell = (position: string, state: State): Cell => {
		let returnValue: Cell;
		const p: Position = stringToPosition(position);
		state.cells.forEach((value, key) => {
			if (key.row == p.row && key.column == p.column) {
				returnValue = value;
			}
		});
		return returnValue;
	};

	const getCellFromPosition = (position: Position, cells: Map<Position, Cell>) => {
		let cell: Cell;
		cells.forEach((value, key) => {
			if (key.row == position.row && key.column == position.column) {
				cell = value;
			}
		});
		return cell;
	};

	const getCellCallback = (s: State): ((arg0: string) => Cell) => {
		return (arg0: string): Cell => {
			return getCell(arg0, s);
		};
	};

	const selectCell = (c: Cell): void => {
		if (state.selectedCell) {
			state.selectedCell.state = CellState.Idle;
		}
		state.selectedCell = c;
		state.selectedCell.state = CellState.Selected;
	};

	const deselectCell = (): void => {
		if (state.selectedCell) state.selectedCell = null;
	};

	const handleUpdate = (newState: Cell) => {
		updateCell(newState);
		updateCells();
		state.editedCell = null;
	};

	const editCell = (state: State): ((c: Cell) => void) => {
		return (c: Cell): void => {
			c.state = CellState.Edit
			state.editedCell = c;
		};
	};

 const incrementLetterIndex = (s: string): string => {
	 const lastChar = s.substring(s.length -1)
	 const newLastChar = String.fromCharCode(lastChar.charCodeAt(0) + 1)

	 if (lastChar  == 'Z')
	 	return s.concat('A')

	 return s.substring(0, s.length-1).concat(newLastChar)
 }

 const decrementLetterIndex = (s: string): string => {
	 const lastChar = s.substring(s.length -1)
	 const newLastChar = String.fromCharCode(lastChar.charCodeAt(0) - 1)

	 if (lastChar  == 'A')
	 	return s.substring(0,s.length-1)

	 return s.substring(0, s.length-1).concat(newLastChar)
 }

	const navigateCells = (s: State, keystroke: string): Cell => {
		if (!s.selectedCell) return state.selectedCell;
		let newRow: Row = s.selectedCell.position.row;
		let newCol: Column = s.selectedCell.position.column;
		switch (keystroke) {
			case 'ArrowUp':
				newRow--;
				break;
			case 'ArrowDown':
				newRow++;
				break;
			case 'ArrowLeft':
				newCol = decrementLetterIndex(newCol)
				break;
			case 'ArrowRight':
				newCol = incrementLetterIndex(newCol)
				break;
		}
		const nextSelectedCellPosition = newPosition(newRow, newCol);
		const nextSelectedCell = getCellFromPosition(nextSelectedCellPosition, state.cells);
		return nextSelectedCell;
	};

	const handleKeydown = (e) => {
		const key = e.key;
		console.log(key);
		switch (key) {
			case 'ArrowUp':
				e.preventDefault()
				selectCell(navigateCells(state,'ArrowUp'))
				break;
			case 'ArrowLeft':
				e.preventDefault()
				selectCell(navigateCells(state,'ArrowLeft'))
				break;
			case 'ArrowRight':
				e.preventDefault()
				selectCell(navigateCells(state,'ArrowRight'))
				break;
			case 'ArrowDown':
				e.preventDefault()
				selectCell(navigateCells(state,'ArrowDown'))
				break;
			case 'F2':
				if (state.selectedCell) state.selectedCell.state = CellState.Edit;
				break;
			case 'Delete':
				if (state.selectedCell) {
					state.selectedCell.function = '';
					state = state;
				}
				break;
			case 'Enter':
				if (state.editedCell) {
					const editedCell = state.editedCell
					handleUpdate(state.editedCell)
					state = state
					selectCell(editedCell)
					selectCell(navigateCells(state,'ArrowDown'))
				} else {
					selectCell(navigateCells(state,'ArrowDown'))
				}
				break;
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
