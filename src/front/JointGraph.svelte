<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    //arrays de ROQUE
    let PEStats = [];
    let stats_country_date = [];
    let stats_public_expenditure = [];
    let stats_PE_on_defence = [];
    let stats_PE_to_gdp = []; 

    async function getChart(){
        getPEStats();
    }

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/public-expenditure-stats");
        if(res.ok){
            const data = await res.json();
            PEStats = data;
            console.log("Estadísticas recibidas: "+PEStats.length);
            //inicializamos los arrays para mostrar los datos
            PEStats.forEach(stat => {
                stats_country_date.push(stat.country+"-"+stat.year);
                stats_public_expenditure.push(stat["public_expenditure"]);
                stats_PE_to_gdp.push(stat["pe_to_gdp"]);
                stats_PE_on_defence.push(stat["pe_on_defence"]);            
            });
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph(){
        Highcharts.chart('container', {

            title: {
                text: 'Public expenditure stats by country and year'
            },

            subtitle: {
                text: 'Source: https://datosmacro.expansion.com'
            },

            yAxis: {
                title: {
                    text: 'Valor'
                }
            },

            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_date,
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            

            series: [
                {
                name: 'Public expenditure',
                data: stats_public_expenditure
                },
                {
                name: 'PE to GDP (%)',
                data: stats_PE_to_gdp
                },
                {
                name: 'PE on defence (%)',
                data: stats_PE_on_defence
                },
            ],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });

    }

    onMount(getChart);


    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>

    
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Basic line chart showing trends in a dataset. This chart includes the
            <code>series-label</code> module, which adds a label to each line for
            enhanced readability.
        </p>
    </figure>
</main>