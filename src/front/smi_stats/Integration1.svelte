<script>
    import {onMount} from 'svelte';
    import {Button} from 'sveltestrap';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let xLabel = [];

    //API COMPAÑERO
    let energy_consumptions = [];
    let percentages_access_elecetricity=[];
    let non_renewable_energy_consumptions=[];
    let renewable_energy_consumptions=[];

    //SMI STATS
    let smi_stats=[];
    let smi_local = [];
    let smi_euros = [];
    let smi_variation = [];


   

    

    async function getData(){
        const smiData = await fetch("/api/v2/smi_stats");
        const ECData = await fetch("/remoteAPI1");
        
        if (smiData.ok && ECData.ok){
            smi_stats = await smiData.json();
            energy_consumptions = await ECData.json();
            

            //smi
            smi_stats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            smi_stats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            smi_stats.forEach(element=>{
                smi_local.push(parseFloat(element.smi_local));
                smi_euros.push(parseFloat(element.smi_euros));
                smi_variation.push(parseFloat(element.smi_variation));
            });
            //EC
            energy_consumptions.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            energy_consumptions.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            energy_consumptions.forEach(element=>{
                percentages_access_elecetricity.push(parseFloat(element.percentages_access_elecetricity));
                non_renewable_energy_consumptions.push(parseFloat(element.non_renewable_energy_consumptions));
                renewable_energy_consumptions.push(parseFloat(element.renewable_energy_consumptions));
            });

            smi_stats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            energy_consumptions.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });

            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            await delay(500);
            loadGraph();
        }   
    }

    async function loadGraph(){
        Highcharts.chart('container', {

            chart: {
                type: 'area'
            },

            title: {
                text: 'Integración con Energy-consumptions'
            },

            subtitle: {
                text: 'Source: https://sos2122-10.herokuapp.com/api/v2/energy-consumptions'
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
               
               categories: xLabel,
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            

            series: [
                //EC STATS
                {
                name: 'percentages_access_elecetricity',
                data: percentages_access_elecetricity
                },
                {
                name: 'non_renewable_energy_consumptions',
                data: non_renewable_energy_consumptions
                },
                {
                name: 'renewable_energy_consumptions',
                data: renewable_energy_consumptions
                },


                //SMI STATS
                {
                name: 'SMI Mon. Local',
                data: smi_local
                }, {
                name: 'SMI Euros',
                data: smi_euros
                }, {
                name: 'SMI % Variación',
                data: smi_variation
                }
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

    onMount(getData);
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>    
</svelte:head>

<main>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>

    <Button outline color="secondary" href="/">Volver</Button>
</main>

