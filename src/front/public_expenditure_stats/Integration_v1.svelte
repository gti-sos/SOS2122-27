<script>
    import {onMount} from 'svelte';

    let data = [];
    let cityName = "";
    let countryName = "";
    let years = [];
    let population = [];

    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("/remoteApiV1");
        if(res.ok){
            const info = await res.json();
            //informacion de la ciudad de Insbruck
            data = info.data[116];
            cityName = data["city"];
            countryName = data["country"];
            
            data["populationCounts"].forEach(e => {
                years.push(e["year"]);
                population.push(e["value"]);
            });

            console.log("Data:", data);
            console.log("Poblacion de " + cityName + " en " + countryName);
            console.log("Años: ",years );
            console.log("Poblacion: ",population);
                  
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