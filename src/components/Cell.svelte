<script lang="ts">
 import type { Cell } from './Cell';
 import { CellState } from './Cell';

 export let data: Cell;
 export let callback: (c: Cell) => void;

</script>

<div class="cell">
    {#if (data.state == 'edit')}
        <input autofocus on:blur={callback(data)} bind:value={data.function}/>
    {:else if (data.state == 'idle')}
        <div class="value" on:dblclick="{() => data.state = CellState.Edit}">
            <span>
                {#if (data.value)}
                    {data.value}
                {:else if (data.function)}
                    {data.function}
                {/if}
            </span>
        </div>
    {/if}
</div>

<style>
 .cell {
     /* border-style: solid;
        border-width: 1px; */
     height: 1.5em;
     min-width: 5em;
     margin: 0;
     padding: 0;
 }
 input {
     max-width: 5em;
 }

 .value {
     width: 100%;
     height: 100%;
     display: table;
 }

 span {
     display: inline-block;
     vertical-align: middle;
     margin: 2px;
 }
</style>
