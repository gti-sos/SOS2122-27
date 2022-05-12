<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let data = [];
    let puntos = [];
    let rebotes = [];
    let asistencias = [];
    let names = ["A.Abrines", "L.James", "M.Teodosic"];

    //los ids de los jugadores son 237, 1, 437 en la API
    //Lebron James, Alex Abrines y Milos Teodosic
    

    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("https://www.balldontlie.io/api/v1/season_averages?season=2018&player_ids[]=237&player_ids[]=1&player_ids[]=437");
        if(res.ok){
            const info = await res.json();
            //informacion de jugadores de la NBA
            data = info["data"];
            
            data.forEach(e => {
                puntos.push(e["pts"]);
                rebotes.push(e["reb"]);
                asistencias.push(e["ast"]);
                
            });
            console.log("Data:", data);
            console.log("Asistencias: ",asistencias);
            console.log("Puntos: ",puntos);
            console.log("Rebotes: ",rebotes);
            //esperamos a que se carguen 
            await delay(1000);
            loadGraph();
            
            
            
                  
        }else{
            console.log("Error cargando los datos");
		}
    }

    function loadGraph(){
        var trace1 = {
            x: names,
            y: puntos,
            fill: 'tozeroy',
            type: 'scatter',
            mode: 'none',
            name: 'Puntos'
        };

        var trace2 = {
            x: names,
            y: asistencias,
            fill: 'tonexty',
            type: 'scatter',
            mode: 'none',
            name: 'Asistencias'
        };

        var trace3 = {
            x: names,
            y: rebotes,
            fill: 'tonexty',
            type: 'scatter',
            mode: 'none',
            name: 'Rebotes'
        };

        var layout = {
            title: 'Biblioteca: Plotly'
        };

        var dataPlot = [trace1, trace2, trace3];

        Plotly.newPlot('myDiv', dataPlot, layout);
    }

    
    

    onMount(getData);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <h1>Integración 3</h1>
    <h2>Estadísticas de puntos de la NBA de la temporada 2018</h2>
    <h4>Jugadores: Lebron James, Alex Abrines y Milos Teodosic</h4>
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

