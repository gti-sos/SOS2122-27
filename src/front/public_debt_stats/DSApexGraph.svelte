<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let stats = [];
    let stats_country_date = [];
    let stats_total_debt = [];
    let stats_debt_gdp = [];
    let stats_per_capita_debt = []; 

    async function getDebtStats(){
      console.log("Fetching stats....");
      const res = await fetch("/api/v2/public-debt-stats");

      if(res.ok){
          const data = await res.json();
          stats = data;
          console.log("Estadísticas recibidas: "+stats.length);
          //inicializamos los arrays para mostrar los datos
          stats.forEach(stat => {
            stats_country_date.push(stat.country+"-"+stat.year);
            stats_total_debt.push(stat["total_debt"]);
            stats_debt_gdp.push(stat["debt_gdp"]);
            stats_per_capita_debt.push(stat["per_capita_debt"]);            
          });
          await delay(500);
          loadGraph();
      }else{
          console.log("Error cargando los datos");
      }
    }

    async function loadGraph(){

      var options = {
        
        series: [{
          name: 'Total debt (M.€)',
          data: stats_total_debt
        }, {
          name: 'Total debt to GDP (%)',
          data: stats_debt_gdp
        }, {
          name: 'Per capita debt (€)',
          data: stats_per_capita_debt
        }],

        chart: {
        height: 350,
        type: 'area'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'País-Año',
          categories: stats_country_date
        },
        yAxis: {
          title: {
              text: 'Valor'
          }
        },
        
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();

    }

    onMount(getDebtStats);
    
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</svelte:head>

<main>
    <h2>Estadísticas de deuda pública por país y año</h2>
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