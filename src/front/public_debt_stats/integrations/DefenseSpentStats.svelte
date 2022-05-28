<script>

    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let nElements = 6;
    
    let debtStats = [];
    let ds_country_date = [];
    let ds_total_debt = [];
    let ds_debt_gdp = [];
    let ds_per_capita_debt = []; 

    let defenseStats = [];
    let defenseCountryYear = [];
    let defenseSpen_mill_eur = [];
    let defensePib_percent = [];
    let defensePer_capita = [];

    async function getData(){

        console.log("Fetching defense data...");
        const defense_data = await fetch('/remoteDefenseAPI'+'?limit='+nElements+'?offset=3');
        const ds_data = await fetch('/api/v2/public-debt-stats?limit='+nElements);
        
        if( defense_data.ok && ds_data.ok ){
            console.log("OK");
            defenseStats = await defense_data.json();

            //Defense stats - Ordenar y parsear

            console.log("Received "+ defenseStats.length + " defense stats");            

            defenseStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            defenseStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            
            defenseStats.forEach(stat => {
                defenseCountryYear.push(stat.country +"-"+ stat.year);
                defenseSpen_mill_eur.push(stat.spen_mill_eur);
                defensePib_percent.push(stat.pib_percent);
                defensePer_capita.push(stat.per_capita);
            });    

            console.log(JSON.stringify(defenseCountryYear[0], null, 2));
            console.log(JSON.stringify(defenseSpen_mill_eur[0], null, 2));
            console.log(JSON.stringify(defensePib_percent[0], null, 2));
            console.log(JSON.stringify(defensePer_capita[0], null, 2));

            //Debt stats - Ordenar y parsear

            
            debtStats = await ds_data.json();

            console.log("Received "+ debtStats.length + " debt stats");

            debtStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            debtStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            
            debtStats.forEach(x => {
                ds_country_date.push(x.country+"-"+x.year);
                ds_total_debt.push(x["total_debt"]);
                ds_debt_gdp.push(x["debt_gdp"]);
                ds_per_capita_debt.push(x["per_capita_debt"]);            
            });                 
            
            console.log(JSON.stringify(ds_country_date[0], null, 2));
            console.log(JSON.stringify(ds_total_debt[0], null, 2));
            console.log(JSON.stringify(ds_debt_gdp[0], null, 2));
            console.log(JSON.stringify(ds_per_capita_debt[0], null, 2));
            
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
                name: 'Gasto en defensa %PIB',
                data: defensePib_percent
            },{
                name: 'Deuda pública %PIB',
                data: ds_debt_gdp
            },{
                name: 'Gasto en defensa per capita',
                data: defensePer_capita
            },{
                name: 'Deuda pública per capita',
                data: ds_per_capita_debt
            }
        ],

            chart: {
                height: 350,
                type: 'line'
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

    }

    onMount(getData);
    
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</svelte:head>

<main>

    <br>
    <h2>Integración de estadísticas de deuda pública y gasto en defensa</h2>
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
