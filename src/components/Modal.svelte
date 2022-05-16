<script type="text/javascript">

let show = true;

</script>

{#if (show)}
    <div class="backdrop">
        <div class="modal">
            <span> Welcome to lisp-calc! Stay calm, use polish notation, and don't expect any features. </span>
            <button on:click="{ () => show=false}">X</button>
        </div>
    </div>
{/if}

<style type="text/css" media="screen">
 .backdrop {
     background-color: gray;
     margin: 0.2em;
 }

 .modal {
     background: white;
 }

 p {
     margin: 0;
 }

 button {
     background-color: #ff6e4a;
     border-radius: 3px;
     border-color: #ff6e4a;
 }
 
</style>
