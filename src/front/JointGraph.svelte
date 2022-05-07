<script>
    import {onMount} from 'svelte';    
    import {Button} from 'sveltestrap';

    const delay = ms => new Promise(res => setTimeout(res,ms));

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

    onMount(getPEStats);
    onMount(getDebtStats)
    
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
            
        </p>
    </figure>

    <Button outline color="secondary" href="/">Volver</Button>
</main>