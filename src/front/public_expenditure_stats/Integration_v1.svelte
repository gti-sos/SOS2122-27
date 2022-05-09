<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let data = [];

    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("/remoteApi");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
            console.log("Datos: ",data);
                  
        }else{
            console.log("Error cargando los datos");
		}
    }

    

    onMount(getData);


    
</script>

<svelte:head>
  

    
</svelte:head>

<main>
    {#await data}
            {#each data as d}
                Nombre: {d.name}
            {/each}
    {/await}
    
    
</main>