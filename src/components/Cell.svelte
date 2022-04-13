<script type="text/javascript" lang="ts">
 export let content: string = '';
 export let state: string;
 export let callback;

 let value = content;
 function updateCell(newValue): void {
     content = newValue;
     state = "idle";
     callback();
 }

</script>

<div class="cell">
    {#if (state == 'edit')}
        <input autofocus on:blur={updateCell(value)} bind:value={value}/>
    {:else if (state == 'idle')}
        <div on:click="{() => state = "edit"}">
        {content}
        </div>
    {/if}
</div>

<style>
 .cell {
     border-style: solid;
     border-width: 1px;
     height: 1.5em;
     min-width: 5em;
     margin: 0;
     padding: 0;
 }
 input {
     max-width: 5em;
 }
</style>
