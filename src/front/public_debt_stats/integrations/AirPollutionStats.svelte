<script>

    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let pollutionStats = [];
    let pollutionAgesZeroFifty = [];
    let pollutionAgesZeroSeventy = [];
    let defensePib_percent = [];
    let defensePer_capita = [];

    async function getData(){

        console.log("Fetching air pollution data...");
        const res = await fetch('https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats');

        if( res.ok ){
            console.log("OK");
            const data = await res.json();
            defenseStats = data;
            console.log("Received "+ defenseStats.length + " defense stats")

            //debtStats = await debtData.json();

            //Defense stats - Ordenar y parsear

            defenseStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            defenseStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            
            defenseStats.forEach(stat => {
                defenseCountryYear.push(stat.country +"-"+ stat.year);
                defenseSpen_mill_eur.push(stat.spen_mill_eur);
                defensePib_percent.push(stat.pib_percent);
                defensePer_capita.push(stat.per_capita);
            });    

            await delay(500);         
            loadGraph();   

        }else{
            console.log("Error al cargar los datos");
        }
        
    }

    async function loadGraph(){

        console.log("Loading graph...");        
        var options = {
        
            series: [{
                name: 'Gasto en defensa',
                data: defenseSpen_mill_eur
            }, 
            {
                name: 'Deuda pública',
                data: defensePib_percent
            }, 
            {
                name: 'Per capita',
                data: defensePer_capita
            }],

            chart: {
                height: 350,
                type: 'bar'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'País-Año',
                categories: defenseCountryYear
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            }        
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();

        console.log(JSON.stringify(defenseCountryYear[0], null, 2));
        console.log(JSON.stringify(defenseSpen_mill_eur[0], null, 2));
        console.log(JSON.stringify(defensePib_percent[0], null, 2));
        console.log(JSON.stringify(defensePer_capita[0], null, 2));

    }

    onMount(getData);
    
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</svelte:head>

<main>

    <h2>Uso de las estadística de contaminación del aire</h2>
    <h4>Biblioteca: ApexChart.js</h4>
    <div id='chart'></div>

</main>

<style>

    #chart {
      width: 90%;
      margin: 35px auto;
      border: 1px solid black;
    }
    h2{
      text-align: center;
    }
    h4{
      text-align: center;
    }
    
</style>