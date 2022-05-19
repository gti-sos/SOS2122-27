<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let PEStats = []; 
    let stats_public_expenditure = [];   
    let stats_PE_on_defence = [];
    let stats_PE_to_gdp = [];

    let registrationStats = []; 
    let registration_primarylevel = [];
    let registration_secondarylevel = [];
    let registration_tertiarylevel = [];

    let yLabel = [];

    async function getData(){
        const registrationData = await fetch("/remoteAPIV5");
        const PEData = await fetch("/api/v2/public-expenditure-stats");

        if (registrationData.ok && PEData.ok){
            registrationStats = await registrationData.json();
            PEStats = await PEData.json();

            
            //registration
            registrationStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            registrationStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            registrationStats.forEach(element=>{
                registration_primarylevel.push(parseFloat(element.primarylevel));
                registration_secondarylevel.push(parseFloat(element.secondarylevel));
                registration_tertiarylevel.push(parseFloat(element.tertiarylevel));
            });
            
            //PE
            PEStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            PEStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            PEStats.forEach(element=>{
                stats_public_expenditure.push(parseFloat(element.public_expenditure));
                stats_PE_on_defence.push(parseFloat(element.pe_on_defence));
                stats_PE_to_gdp.push(parseFloat(element.pe_to_gdp));
            });

            registrationStats.forEach(element =>{
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

            console.log("registration stats: ",registrationStats);
            console.log("xLabel: ",yLabel);
            console.log("Paises totales: ",yLabel.length);
            console.log("Paises PEStats: ",stats_PE_on_defence.length);
            console.log("Paises registration: ",registration_primarylevel.length);

            

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
                values: registration_primarylevel,
                labels: yLabel,
                domain: {
                    column: 0,
                    row: 1
                },
                name: 'Nivel primario',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: registration_secondarylevel,
                labels: yLabel,
                domain: {
                    column: 1,
                    row: 1
                },
                name: 'Nivel secundario',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },
            {
                values: registration_tertiarylevel,
                labels: yLabel,
                domain: {
                    column: 2,
                    row: 1
                },
                name: 'Nivel terciario',
                hoverinfo: 'label+percent+name',
                hole: .4,
                type: 'pie'
            },


        ];

        var layout = {
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
    <h2>Estadísticas de educación en diferentes niveles con información de Gasto Público</h2>
    <h4>Obtenidas de <a href="https://sos2122-31.herokuapp.com/api/v2/registration-stats"> registration-stats</a></h4>
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

