<script>

    import {onMount} from 'svelte';
    import {Button,Table,NavLink,NavItem,Nav} from 'sveltestrap';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let covidStats = [];    
    let statcountry = [];
    let statcasesPerOneMillion = [];
    let statdeathsPerOneMillion = [];
    let statcriticalcases = [];

    async function getCovidStats(){
        console.log("Fetching Covid Stats...");
        const resData = await fetch("https://coronavirus-19-api.herokuapp.com/countries");
        if(resData.ok){
            console.log("OK");
            const stats = await resData.json();
            console.log("Received " + stats.length + " Covid Stats");

            covidStats = stats.slice(1,25);
            console.log("Received " + covidStats.length + " Covid Stats")

            covidStats.forEach(element => {
                statcountry.push(element.country);
                statcasesPerOneMillion.push(element.casesPerOneMillion);
                statdeathsPerOneMillion.push(element.deathsPerOneMillion);
                statcriticalcases.push(element.critical);
            });

            console.log(JSON.stringify(statcountry[0], null, 2));
            console.log(JSON.stringify(statcasesPerOneMillion[0], null, 2));
            console.log(JSON.stringify(statdeathsPerOneMillion[0], null, 2));
            console.log(JSON.stringify(statcriticalcases[0], null, 2));

            await delay(500);
            loadGraph();
        }
        else{
            console.log("Error");
        }
    }

    async function loadGraph(){    
        
        console.log("Loading graph...");        
        var options = {
        
            series: [{
                name: 'Casos por millón',
                data: statcasesPerOneMillion
            },{
                name: 'Muertes por millón',
                data: statdeathsPerOneMillion
            },{
                name: 'Casos críticos',
                data: statcriticalcases
            }
            ],
            title: {
                text: 'ApexChart.js'
            },
            chart: {
                height: 400,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'País',
                categories: statcountry
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

    onMount(getCovidStats);
    
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</svelte:head>

<main>
    <h3>Estadísticas de COVID-19</h3>   
    <figure id="chart"></figure>
    <p>En este gráfico están representados los datos covid por países</p>
    <p>Fuente: <a href="https://github.com/javieraviles/covidAPI">github.com/javieraviles/covidAPI </a></p>
   
</main>

<style>
    #chart {
      width: 90%;
      margin: 35px auto;
      border: 1px solid black;
    }
    h3{
      text-align: center;
    }    
    p{
        text-align: center;
    }
</style>