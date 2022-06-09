<script lang="ts">
 import type { Cell } from './Cell';
 import { CellState } from './Cell';

 export let data: Cell;
 export let callback: (c: Cell) => void;
 export let selectCell: (c: Cell) => void;
 export let deselectCell: () => void;
 export let editCell: (c: Cell) => void;

 const setValue = (data: Cell) => {
     callback(data)
 }

 const handleCellClick = (): void => {
     if (data.state == CellState.Idle)  {
        selectCell(data)
     } else {
         deselectCell()
         editCell(data)
     }
 }

</script>
{#if data}
<div class="cell {data.state}" on:click={handleCellClick}>
    <div class="value">
        {#if (data.state == 'edit')}
            <input autofocus on:blur="{ () => setValue(data)}" bind:value={data.function}/>
        {:else }
            <span>
                {#if (data.value)}
                    {data.value}
                {:else if (data.function)}
                    {data.function}
                {/if}
            </span>
        {/if}
    </div>
</div>
{/if}

<style>
 .selected {
     outline-style: solid;
     outline-width: 1px;
     outline-color: green;
     box-shadow: 0px 0px 2px 2px green;
 }
 .cell {
     /* border-style: solid;
        border-width: 1px; */
     min-width: 5em;
     margin: 0;
     padding: 0;
     width: 80px;
     height: 1.5em;
     display: table;
 }
 input {
	 font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
     max-width: 60px;
     background: none;
     border: none;
     font-size: 1em;
     padding-left: 0;
     margin: 0;
 }
 input:focus {
     outline: none;
 }

 .value {
     display: inline-block;
     vertical-align: middle;
     padding-left: 0.2em;
 }

</style>
