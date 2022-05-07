<script>

    import {onMount} from 'svelte';
    import {NavLink,NavItem,Nav} from 'sveltestrap';

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
                text: 'Public debt stats by country and year'
            },

            subtitle: {
                text: 'Source: https://datosmacro.expansion.com/deuda'
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
                name: 'Total debt (M.€)',
                data: stats_total_debt
                },
                {
                name: 'Total debt to GDP (%)',
                data: stats_debt_gdp,
                },
                {
                name: 'Per capita debt (€)',
                data: stats_per_capita_debt
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

    onMount(getDebtStats);
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
    
</svelte:head>

<main>
    <h1 align="center">Gráfico de barras</h1>	
    <Nav class="bg-light">
        <NavItem>
            <NavLink id="nav-info" href="/#/public-debt-stats" style="text-decoration:none">Volver</NavLink>
        </NavItem>
        <NavItem>
            <NavLink id="nav-home" href="/" style="text-decoration:none">Home</NavLink>
        </NavItem>        
    </Nav>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            <code>-> Total debt:</code> Deuda pública total<br>
            <code>-> Total debt to GDP:</code> Deuda total en proporción al PIB<br>
            <code>-> Per cápida debt:</code> Deuda pública por persona<br>
        </p>
    </figure>
</main>