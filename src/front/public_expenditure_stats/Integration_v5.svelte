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
        const inequalityData = await fetch("/remoteAPIV5");
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

            

            //esperamos a que se carguen 
            await delay(500);
            loadGraph();
        }   
    }

    function loadGraph(){

        var dataPlot = [
            {
                values: stats_PE_on_defence,
                labels: yLabel,
                domain: {
                    column: 0,
                    row: 0
                },
                name: 'Gasto público en defensa (%)',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: stats_public_expenditure,
                labels: yLabel,
                domain: {
                    column: 1, 
                    row: 0
                },
                name: 'Gasto público',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: stats_PE_to_gdp,
                labels: yLabel,
                domain: {
                    column: 2, 
                    row: 0
                },
                name: 'Gasto público respecto al PIB (%)',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: inequality_coefficients,
                labels: yLabel,
                domain: {
                    column: 0,
                    row: 1
                },
                name: 'Coeficiente de deses',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: inequality_educations,
                labels: yLabel,
                domain: {
                    column: 1,
                    row: 1
                },
                name: 'Gffff',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: inequality_lifes,
                labels: yLabel,
                domain: {
                    column: 2,
                    row: 1
                },
                name: 'fdafdas',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },


        ];

        var layout = {
            annotations: [
                {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: 'GHG',
                    x: 0.17,
                    y: 0.5
                },
                {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: 'CO2',
                    x: 0.82,
                    y: 0.5
                }
            ],
            height: 800,
            width: 1200,
            showlegend: true,
            grid: {rows: 2, columns: 3}
        };

        Plotly.newPlot('myDiv', dataPlot, layout);
        
    }

    onMount(getData);
    
</script>

<svelte:head>
    <script src='https://cdn.plot.ly/plotly-2.11.1.min.js'></script>
</svelte:head>

<main>
    <h1>Integración 5</h1>
    <h2>Otra</h2>
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

