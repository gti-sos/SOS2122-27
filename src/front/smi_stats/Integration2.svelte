<script>
    import {onMount} from 'svelte';
    import {Button} from 'sveltestrap';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let xLabel = [];

    //API COMPAÑERO
    let co2__stats = [];
    let co2_tot=[];
    let co2_kg=[];
    let co2_tpc=[];

    //SMI STATS
    let smi_stats=[];
    let smi_local = [];
    let smi_euros = [];
    let smi_variation = [];


   

    

    async function getData(){
        const smiData = await fetch("/api/v2/smi_stats");
        const Co2Data = await fetch("/remoteAPI2");
        
        if (smiData.ok && Co2Data.ok){
            smi_stats = await smiData.json();
            co2__stats = await Co2Data.json();
            

            //smi
            smi_stats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            smi_stats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            smi_stats.forEach(element=>{
                smi_local.push(parseFloat(element.smi_local));
                smi_euros.push(parseFloat(element.smi_euros));
                smi_variation.push(parseFloat(element.smi_variation));
            });
            //EC
            co2__stats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            co2__stats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            co2__stats.forEach(element=>{
                co2_tot.push(parseFloat(element.co2_tot));
                co2_kg.push(parseFloat(element.co2_kg));
                co2_tpc.push(parseFloat(element.co2_tpc));
            });

            smi_stats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            co2__stats.forEach(element =>{
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
                type: 'bar'
            },

            title: {
                text: 'Integración con Co2-Stats'
            },

            subtitle: {
                text: 'Source: https://sos2122-22.herokuapp.com/api/v2/co2-stats'
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
                //CO2 STATS
                {
                name: 'co2_tot',
                data: co2_tot
                },
                {
                name: 'co2_kg',
                data: co2_kg
                },
                {
                name: 'co2_tpc',
                data: co2_tpc
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

