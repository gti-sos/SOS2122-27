<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let data = [];
    let stats_country_date = [];
    let stats_public_expenditure = [];
    let stats_PE_on_defence = [];
    let stats_PE_to_gdp = []; 

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/public-expenditure-stats");
        if(res.ok){
            const data = await res.json();
            console.log("Estadísticas recibidas: "+data.length);
            //inicializamos los arrays para mostrar los datos
            data.forEach(stat => {
                stats_country_date.push(stat.country+"-"+stat.year);
                stats_public_expenditure.push(stat["public_expenditure"]);
                stats_PE_to_gdp.push(stat["pe_to_gdp"]);
                stats_PE_on_defence.push(stat["pe_on_defence"]);            
            });
            loadGraph();
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph(){
        var trace1 = {
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            type: 'scatter'
        };

        var trace2 = {
             x: [1, 2, 3, 4],
            y: [16, 5, 11, 9],
            type: 'scatter'
        };

        var data = [trace1, trace2];

        Plotly.newPlot('myDiv', data);
        
 
    }

    onMount(getPEStats);


    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js' on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <div id='myDiv'><!-- Plotly chart will be drawn inside this DIV --></div>
</main>