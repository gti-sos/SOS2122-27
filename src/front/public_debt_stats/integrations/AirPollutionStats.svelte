<script>

    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let pollutionStats = [];
    let pollutionCountryYear = [];
    let pollutionAgesZeroFifty = [];
    let pollutionAgesFiftySeventy = [];
    let pollutionAgesSeventy = [];

    let debtStats = [];
    let ds_country_date = [];
    let ds_total_debt = [];
    let ds_debt_gdp = [];
    let ds_per_capita_debt = []; 

    var colors = new Array("00","33","66","99","CC","FF");

    async function getData(){

        console.log("Fetching air pollution data...");
        const res = await fetch('https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats');
        const ds_data = await fetch('/api/v2/public-debt-stats');

        if( res.ok && ds_data.ok ){
            console.log("OK");
            pollutionStats = await res.json();
            console.log("Received "+ pollutionStats.length + " air pollution stats")

            pollutionStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            pollutionStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            
            pollutionStats.forEach(stat => {
                pollutionCountryYear.push(stat.country +"-"+ stat.year);
                pollutionAgesZeroFifty.push(stat.ages_zero_fifty);
                pollutionAgesFiftySeventy.push(stat.ages_fifty_seventy);
                pollutionAgesSeventy.push(stat.ages_seventy);
            });    

            console.log(JSON.stringify(pollutionStats[0], null, 2));

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

            console.log(JSON.stringify(debtStats[0], null, 2));

            await delay(500);         
            loadGraph();   

        }else{
            console.log("Error al cargar los datos");
        }
        
    }

    async function loadGraph(){

        console.log("Loading graph...");        
        var options = {

            series: [
                {
                    name: "pollution 0-50",
                    data: pollutionAgesZeroFifty
                },{
                    name: "pollution 50-70",
                    data: pollutionAgesFiftySeventy
                },{
                    name: "pollution 0-50",
                    data: pollutionAgesSeventy
                },{
                    name: "total debt",
                    data: ds_total_debt
                },{
                    name: "debt to gdp",
                    data: ds_debt_gdp
                },{
                    name: "debt per capita",
                    data: ds_per_capita_debt
                },
            ],
            title: {
                text: 'ApexChart.js'
            },
            chart: {
                height: 350,
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            xaxis: {
                type: 'País-Año',
                categories: pollutionCountryYear
            },
            yaxis: {
                tickAmount: 10
            }
            
        
            /*series: [{
                name: 'pollution 0-50',
                data: pollutionAgesZeroFifty
            },{
                name: 'pollution 50-70',
                data: pollutionAgesFiftySeventy
            },{
                name: 'pollution +70',
                data: pollutionAgesSeventy
            },{
                name: 'debt per capita',
                data: ds_per_capita_debt
            },{
                name: 'debt %PIB',
                data: ds_debt_gdp
            },{
                name: 'total debt',
                data: ds_total_debt
            }],

            chart: {
                height: 350,
                type: 'treemap'
            },
            dataLabels: {
                enabled: false
            },
            colors: ["#008FFB"],
            xaxis: {
                type: 'País-Año',
                categories: pollutionCountryYear
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            }*/        
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
    <h2>Integración de las estadística de contaminación del aire</h2>
    <div id='chart'></div>
    <p>En este gráfico aparecen integrados los datos de afectación de contaminación en el aire 
        junto a los ratios de Deuda Pública, clasificados estos por país y año.</p>
    <p>Fuente: <a href="https://sos2122-24.herokuapp.com/api/v1/air-pollution-stats"> SOS2122-24/api/v1/air-pollution-stats </a></p>

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
    p{
        text-align: center;
        margin-right: 100px;
        margin-left: 100px;
    }
    
</style>