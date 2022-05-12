<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let data = []; 
    let estados = [];
    let muertes = [];
    let tests = [];
    let casos = [];   

    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("/remoteAPIV6");
        if(res.ok){
            const info = await res.json();
            //informacion de covid de EEUU
            //cogemos los 50 primeros datos
            data = info.slice(0,51);

            data.forEach(e => {
                estados.push(e["state"]);
                muertes.push(e["deaths"]);
                casos.push(e["cases"]);
                tests.push(e["tests"]);
                
            });
            
            console.log("Data:", data);
            console.log("Estados:", estados);
            console.log("Muertes:", muertes);
            console.log("Casos:", casos);
            console.log("Tests:", tests);
            
            //esperamos a que se carguen 
            await delay(1000);
            loadGraph();
                      
                  
        }else{
            console.log("Error cargando los datos");
		}
    }

    function loadGraph(){
        var trace1 = {
            x: estados,
            y: casos,
            mode: 'markers',
            name: 'Casos',
            text: estados,
            marker: {
                color: 'rgb(164, 194, 244)',
                size: 12,
                line: {
                color: 'white',
                width: 0.5
                }
            },
            type: 'scatter'
            };

        var trace2 = {
            x: estados,
            y: muertes,
            mode: 'markers',
            name: 'Muertes',
            text: estados,
            marker: {
                color: 'rgb(255, 217, 102)',
                size: 12
            },
            type: 'scatter'
        };

        var trace3 = {
            x: estados,
            y: tests,
            mode: 'markers',
            name: 'Tests',
            text: estados,
            marker: {
                color: 'rgb(234, 153, 153)',
                size: 12
            },
            type: 'scatter'
        };

        var dataPlot = [trace1, trace2, trace3];

        var layout = {
            xaxis: {
                title: 'Estados',
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                title: 'Valor',
                showline: false
            }
        };

        Plotly.newPlot('myDiv', dataPlot, layout);
        
    }

    
    

    onMount(getData);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <h1>Integración 6</h1>
    <h2>Estadísticas de Covid-19 en los EEUU</h2>
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

