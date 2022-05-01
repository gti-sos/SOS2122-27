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
        var trace_pe_to_gdp = {
            x: stats_country_date,
            y: stats_PE_to_gdp,
            type: 'scatter',
            name: 'PE to GDP (%)'
        };

        var trace_pe_on_defence = {
            x: stats_country_date,
            y: stats_PE_on_defence,
            type: 'scatter',
            name: 'PE on Defence (%)'
        };

        var trace_PE = {
            x: stats_country_date,
            y: stats_public_expenditure,
            type: 'scatter',
            name: 'Public expenditure'
        };

        var dataPlot = [trace_pe_on_defence, trace_pe_to_gdp, trace_PE];

        Plotly.newPlot('myDiv', dataPlot);
        
 
    }

    onMount(getPEStats);


    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js' on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2>Public expenditure stats by country and year</h2>
    <h4>Biblioteca: Plotly</h4>
    <div id='myDiv'><!-- Plotly chart will be drawn inside this DIV --></div>
</main>

<style>
    h2{
        text-align: center;
    }
    h4{
        text-align: center;
    }
</style>