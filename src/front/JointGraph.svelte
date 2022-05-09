<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let xLabel = [];
    //arrays de ROQUE
    let PEStats = [];
    let stats_country_date = [];
    let stats_public_expenditure = [];
    let stats_PE_on_defence = [];
    let stats_PE_to_gdp = []; 

    //DEBT STATS
    let debtStats = [];
    let ds_country_date = [];
    let ds_total_debt = [];
    let ds_debt_gdp = [];
    let ds_per_capita_debt = []; 

    //SMI STATS
    let smi_stats=[];
    let smi_country_date = [];
    let smi_local = [];
    let smi_euros = [];
    let smi_variation = [];


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
            await delay(500);
        }else{
            console.log("Error cargando los datos");
		}
    }

    async function getDebtStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/public-debt-stats");
        if(res.ok){
            const data = await res.json();
            debtStats = data;
            console.log("Estadísticas recibidas: "+debtStats.length);
            //inicializamos los arrays para mostrar los datos
            debtStats.forEach(stat => {
                ds_country_date.push(stat.country+"-"+stat.year);
                ds_total_debt.push(stat["total_debt"]);
                ds_debt_gdp.push(stat["debt_gdp"]);
                ds_per_capita_debt.push(stat["per_capita_debt"]);            
            });
            await delay(500);
        }else{
            console.log("Error cargando los datos");
        }
    }

    async function getSmiStats() {
        console.log("Fetching data...");
        const res = await fetch("/api/v2/smi_stats");
        smi_stats = await res.json();
        if (res.ok) {
          smi_stats.forEach(stat => {
            smi_country_date.push(stat.country+"-"+stat.year);
            smi_local.push(parseFloat(stat.smi_local));
            smi_euros.push(parseFloat(stat.smi_euros));
            smi_variation.push(parseFloat(stat.smi_variation));
            });
            cargados=true;
            }
    }

    async function getData(){
        const smiData = await fetch("/api/v2/smi_stats");
        const pdData = await fetch("/api/v2/public-debt-stats");
        const peData = await fetch("/api/v2/public-expenditure-stats");

        if (smiData.ok && pdData.ok && peData.ok){
            smi_stats = await smiData.json();
            PEStats = await peData.json();
            debtStats = await pdData.json();

            smi_stats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            PEStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            debtStats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            //smi
            smi_stats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            smi_stats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            smi_stats.forEach(element=>{
                smi_local.push(parseFloat(element.smi_local));
                smi_euros.push(parseFloat(element.smi_euros));
                smi_variation.push(parseFloat(element.smi_variation));
            });
            //PE
            PEStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            PEStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            PEStats.forEach(element=>{
                stats_public_expenditure.push(parseFloat(element.public_expenditure));
                stats_PE_on_defence.push(parseFloat(element.pe_on_defence));
                stats_PE_to_gdp.push(parseFloat(element.pe_to_gdp));
            });
            //PD
            debtStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            debtStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            debtStats.forEach(element=>{
                ds_total_debt.push(parseFloat(element.total_debt));
                ds_per_capita_debt.push(parseFloat(element.per_capita_debt));
                ds_debt_gdp.push(parseFloat(element.debt_gdp));
            });

            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            loadGraph();
        }   
    }

    async function loadGraph(){
        Highcharts.chart('container', {

            chart: {
                type: 'line'
            },

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
               // categories: stats_country_date,
               categories: xLabel,
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            

            series: [
                //PE STATS
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

                //DEBT STATS
                {
                name: 'total_debt (M.€)',
                data: ds_total_debt
                },
                {
                name: 'debt_to_gdp (%)',
                data: ds_debt_gdp,
                },
                {
                name: 'per_capita_debt (€)',
                data: ds_per_capita_debt
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

    /*onMount(getPEStats);
    onMount(getDebtStats);
    onMount(getSmiStats);*/
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