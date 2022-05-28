<script>
    import {onMount} from 'svelte';
    import{Nav, NavItem, NavLink } from "sveltestrap";

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let covid = [];
    let Country = [];
    let TotalCases = [];
    let TotalDeaths = [];
    let Population = [];

    


    async function getCovid(){
        console.log("Fetching covid data...");
        const resData = await fetch("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/africa", {
            "method" : "GET",
            "headers":{
                "x-rapidapi-host": "vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com",
                "x-rapidapi-key": "32c0b6eb01msh02d19df1210c431p103d4ajsn9d32192863d4",
            }
        });
        if(resData.ok){
            console.log("OK");
            const data = await resData.json();
            covid = data;
            console.log("Received "+ covid.length + " covid data");

            covid.forEach(element => {
                Country.push(element.Country);
                TotalCases.push(parseInt(element.TotalCases));
                TotalDeaths.push(parseInt(element.TotalDeaths));
                Population.push(parseInt(element.Population));
                
            });

        }
        else{
            console.log("Error");
        }
        loadGraph();
    }

    async function loadGraph(){
        Highcharts.chart('container', {

            chart: {
                type: 'scatter',
                zoomType: 'y'
            },

            title: {
                text: 'Integración externa covid Stats'
            },

            subtitle: {
                text: 'Source: https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com'
            },

            yAxis: {
                title: {
                    text: 'Valor'
                }
            },

            xAxis: {
                title: {
                    text: "País",
                },
            
            categories: Country,
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                marker: {
                    radius: 5,
                    states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                    }
                },
                states: {
                    hover: {
                    marker: {
                        enabled: false
                    }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
                }
            },           

            series: [


                //SMI STATS
                {
                name: 'Casos totales',
                data: TotalCases
                }, {
                name: 'Muertes totales',
                data: TotalDeaths
                }, {
                name: 'Población',
                data: Population
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

    onMount(getCovid);
    
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

    <Nav>
        <NavItem>
          <NavLink href="/">Página Principal</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/analytics">Gráfica conjunta</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/smi_stats">Datos</NavLink>
        </NavItem>
    </Nav>

    
</main>
