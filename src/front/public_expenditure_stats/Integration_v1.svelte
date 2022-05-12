<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

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
            //esperamos a que se carguen 
            await delay(500);
            loadGraph();
                  
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph(){
        var dataPlot = [
            {
                x: years,
                y: population,
                type: 'bar'
            }
        ];

        Plotly.newPlot('myDiv', dataPlot);

    }

    onMount(getData);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.12.1.min.js'></script>
</svelte:head>

<main>
    <h1>Integración 1</h1>
    <h2>Población de {cityName}, {countryName} </h2>
    <h4>Biblioteca: Plotly</h4>
    <div id='myDiv'><!-- Plotly chart will be drawn inside this DIV --></div>
    
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