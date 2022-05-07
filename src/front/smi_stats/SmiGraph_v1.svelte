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
            chart: {
                type: 'bar'
            },
            title: {
                text:  'SmiStats'
            },
            subtitle: {
                text: 'Fuente: https://datosmacro.expansion.com/smi'
            },
            xAxis: {
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Salario en euros',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' millions'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Year 1800',
                data: [107, 31, 635, 203, 2]
            }, {
                name: 'Year 1900',
                data: [133, 156, 947, 408, 6]
            }, {
                name: 'Year 2000',
                data: [814, 841, 3714, 727, 31]
            }, {
                name: 'Year 2016',
                data: [1216, 1001, 4436, 738, 40]
            }]
        });
    }

    onMount(getSmiStats);
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Bar chart showing horizontal columns. This chart type is often
            beneficial for smaller screens, as the user can scroll through the data
            vertically, and axis labels are easy to read.
        </p>
    </figure>
</main>