<script>
    import {onMount} from 'svelte';
    import{Nav, NavItem, NavLink } from "sveltestrap";

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let lol = [];
    let name = [];
    let pickP = [];
    let winP = [];
    let banP = [];

    


    async function getLol(){
        console.log("Fetching LOL data...");
        const resData = await fetch("https://mobafire-lol-builds.p.rapidapi.com/api/champions", {
            "method" : "GET",
            "headers":{
                "x-rapidapi-host": "mobafire-lol-builds.p.rapidapi.com",
                "x-rapidapi-key": "32c0b6eb01msh02d19df1210c431p103d4ajsn9d32192863d4",
            }
        });
        if(resData.ok){
            console.log("OK");
            const data = await resData.json();
            lol = data;
            console.log("Received "+ lol.length + " lol data");

            lol.forEach(element => {
                name.push(element.name);
                pickP.push(parseInt(element.pickP));
                winP.push(parseInt(element.winP));
                banP.push(parseInt(element.banP));
                
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
                type: 'bar',
                zoomType: 'x'
            },

            title: {
                text: 'Integración externa Lol Stats'
            },

            subtitle: {
                text: 'Source: https://mobafire-lol-builds.p.rapidapi.com'
            },

            yAxis: {
                title: {
                    text: 'Valor'
                }
            },

            xAxis: {
                title: {
                    text: "Campeón",
                },
            
            categories: name,
            },
            plotOptions: {
                series: {
                stacking: 'normal'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },            

            series: [


                //SMI STATS
                {
                name: '% Elección',
                data: pickP
                }, {
                name: '% Victoria',
                data: winP
                }, {
                name: '% Ban',
                data: banP
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

    onMount(getLol);
    
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
