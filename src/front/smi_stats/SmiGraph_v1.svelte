<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));
    let stats = [];
    let stats_country_year = [];
    let stats_smi_local = [];
    let stats_smi_euros = [];
    let stats_smi_variation = [];


    async function getSmiStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/smi-stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Estadísticas recibidas: "+stats.length);

            stats.forEach(stat => {
                stats_country_year.push(stat.stats_country+"-"+stat.year);
                stats_smi_local.push(stat["smi_local"]);
                stats_smi_euros.push(stat["smi_euros"]);
                stats_smi_variation.push(stat["smi_variation"]);            
            });
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function loadGraph(){
        Highcharts.chart('container', {

            title: {
                text: 'SmiStats'
            },

            subtitle: {
                text: 'Fuente: https://datosmacro.expansion.com/smi'
            },

            yAxis: {
                title: {
                    text: 'Salario en euros'
                }
            },

            xAxis: {
                title: {
                    text: "País-Año",
                },
                categories: stats_country_year,
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    },
                    pointStart: 2017
                }
            },

            series: [{

                name: 'SMI moneda local',
                data: stats_smi_local,
            },{

                name: 'SMI en euros',
                data: stats_smi_euros,
            },
            {

                name: 'SMI variacion',
                data: stats_smi_variation,
            }],

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

    onMount(getSmiStats);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js}" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"  on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        
    </figure>
</main>