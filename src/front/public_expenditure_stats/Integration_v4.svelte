<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let PEStats = []; 
    let stats_public_expenditure = [];   
    let stats_PE_on_defence = [];
    let stats_PE_to_gdp = [];

    let inequalityStats = []; 
    let inequality_coefficients = [];
    let inequality_educations = [];
    let inequality_lifes = [];

    let yLabel = [];

    async function getData(){
        const inequalityData = await fetch("/remoteAPIV4");
        const PEData = await fetch("/api/v2/public-expenditure-stats");

        if (inequalityData.ok && PEData.ok){
            inequalityStats = await inequalityData.json();
            PEStats = await PEData.json();

            
            //inequality
            inequalityStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            inequalityStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            inequalityStats.forEach(element=>{
                inequality_coefficients.push(parseFloat(element.coefficients));
                inequality_educations.push(parseFloat(element.educations));
                inequality_lifes.push(parseFloat(element.lifes));
            });
            
            //PE
            PEStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            PEStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            PEStats.forEach(element=>{
                stats_public_expenditure.push(parseFloat(element.public_expenditure));
                stats_PE_on_defence.push(parseFloat(element.pe_on_defence));
                stats_PE_to_gdp.push(parseFloat(element.pe_to_gdp));
            });

            inequalityStats.forEach(element =>{
                var categoria = element.country.toLowerCase() +"-"+element.year.toString();
                yLabel.push(categoria);
            });
            PEStats.forEach(element =>{
                var categoria = element.country.toLowerCase() +"-"+element.year.toString();
                if(!yLabel.includes(categoria))
                    yLabel.push(categoria);
            });

            yLabel=new Set(yLabel);
            yLabel=Array.from(yLabel);
            yLabel.sort();

            console.log("Inequality stats: ",inequalityStats);
            console.log("xLabel: ",yLabel);
            console.log("Paises totales: ",yLabel.length);
            console.log("Paises PEStats: ",stats_PE_on_defence.length);
            console.log("Paises inequality: ",inequality_coefficients.length);

            

            
            loadGraph();
        }   
    }

    function loadGraph(){

        var trace1 = {
            y: yLabel,
            x: stats_PE_on_defence,
            name: 'Gasto público en defensa (%)',
            orientation: 'h',
            marker: {
                color: 'rgba(55,128,191,0.6)',
                width: 1
            },
            type: 'bar'
        };

        var trace2 = {
            y: yLabel,
            x: stats_PE_to_gdp,
            name: 'Gasto público respecto a PIB (%)',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgba(255,153,51,0.6)',
                width: 1
            }
        };

        var trace3 = {
            y: yLabel,
            x: stats_public_expenditure,
            name: 'Gasto público',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgba(32,32,32,0.8)',
                width: 1
            }
        };

        var trace4 = {
            y: yLabel,
            x: inequality_coefficients,
            name: 'Coeficiente de desigualdad',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgba(255,51,51,0.6)',
                width: 1
            }
        };

        var trace5 = {
            y: yLabel,
            x: inequality_educations,
            name: 'Desigualdad en educacion',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgba(55,153,51,0.6)',
                width: 1
            }
        };

        var trace6 = {
            y: yLabel,
            x: inequality_lifes,
            name: 'Desigualdad en la vida',
            orientation: 'h',
            type: 'bar',
            marker: {
                color: 'rgba(153,153,255,0.6)',
                width: 1
            }
        };

        var dataPlot = [trace1, trace2, trace3, trace4, trace5, trace6];

        var layout = {
            barmode: 'stack'
        };

        Plotly.newPlot('myDiv', dataPlot, layout);
        
    }

    
    

    onMount(getData);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <h1>Integración 4</h1>
    <h2>Estadísticas de generación de desigualdad integradas con información de Gasto Público</h2>
    <h4>Obtenidas de <a href="https://sos2122-11.herokuapp.com/api/v2/inequality-stats"> inequality-stats</a></h4>
    <h6>Biblioteca: Plotly</h6>

    <div id='myDiv' style="margin: auto;"><!-- Plotly chart will be drawn inside this DIV --></div>          
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
    h6{
        text-align: center;
    }
</style>

