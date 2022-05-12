<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let data = [];    

    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("/remoteAPIV4");
        if(res.ok){
            const info = await res.json();
            //informacion de CO2 de paises
            data = info;
            
            
            console.log("Data:", data);
            
            //esperamos a que se carguen 
            await delay(1000);
            loadGraph();
                      
                  
        }else{
            console.log("Error cargando los datos");
		}
    }

    function loadGraph(){
        
    }

    
    

    onMount(getData);
    
</script>

<svelte:head>
    
</svelte:head>

<main>
    <h1>Integración 4</h1>
    <h2>Estadísticas de generación de CO2 integradas con información de Gasto Público</h2>
      
</main>

<style>
    h1{
        text-align: center;
    }
    h2{
        text-align: center;
    }
    h4{
        text-align: center;
    }
</style>

