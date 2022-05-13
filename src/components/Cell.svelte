<script lang="ts">
 import type { Cell } from './Cell';
 import { CellState } from './Cell';

 export let data: Cell;
 export let callback: (c: Cell) => void;

 const setValue = (data: Cell) => {
     data.state = 'idle'
     callback(data)
 }

</script>

<div class="cell {data.state}" on:dblclick="{() => data.state = CellState.Edit}">
    <div class="value">
        {#if (data.state == 'edit')}
            <input autofocus on:blur={setValue(data)} bind:value={data.function}/>
        {:else if (data.state == 'idle')}
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

<style>
 /* .edit {
    border-style: solid;
    border-width: 1px;
    border-color: blue;
    } */
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
