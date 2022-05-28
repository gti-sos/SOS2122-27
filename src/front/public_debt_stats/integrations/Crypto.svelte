<script>

    import {onMount} from 'svelte';
    import {Button,Table,NavLink,NavItem,Nav} from 'sveltestrap';

    let isOpen = false;
    var marketCap = [];

    async function getData(){

        const allData = await fetch("https://coinranking1.p.rapidapi.com/coins?limit=10",
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key":
                        "b8725c41c3msh1a6b8216d9f4f17p1fa8dcjsn85cd61011197",
                    "x-rapidapi-host": "coinranking1.p.rapidapi.com",
                    useQueryString: true,
                },
            }
        );

        let criptos = [];
        criptos = await allData.json();

        for (let coin of criptos.data.coins) {
            console.log(coin)
            let obj = {};
            obj["name"] = coin.name;
            obj["value"] = coin.marketCap;
            marketCap.push(obj);
        }
        console.log(marketCap)
    }
    

    async function loadGraph(){

        let ejeX = ["", "", ""];
        let valores = [];
        let valor ={};
       
        //Hago el fetch a la API externa, en este caso de RapidAPI
        const resData = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_stats.json", {
            "method" : "GET",
            "headers":{
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
                "x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
            }
        });

        let DataPokemons = await resData.json();
                
        var cont = 0;
        DataPokemons.forEach((data2)=>{
            if(data2.form=="Normal" & cont<=10){//Mostrando solo los pokemons con la forma normal y a un número limitado de 10
            valor = {
                name: data2.pokemon_name,
                data: [data2.base_attack, data2.base_defense, data2.base_stamina]
            }
            valores.push(valor);
            cont++;
            }
            
        });
        
        console.log("Loading Chart...");
        
    
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Uso API externa Pokémons'
            },
            subtitle: {
                text: 'Fuentes: <a href="https://rapidapi.com/brianiswu/api/pokemon-go1">rapidapi.com/pokemon-go1</a> || highcharts.com'
            },
            xAxis: {
                categories: ejeX,
                crosshair: true,
                tickmarkPlacement: 'on',
                type: 'category',
                
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Valor'
                },
                labels: {
                    formatter: function(){
                        return this.value;
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column:{
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            legend: {
                enabled: true
            },
            
            series: valores
        });

    }

    onMount(getPokemons);
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/export-data.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
    
</svelte:head>

<main>
    <h3> de las 10 cryptomonedas más importantes</h3>
    {#await getData}
        Loading pokemons data ...
    {:then getData}
        <figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                    La anterior gráfica muestra .
                </p>
        </figure>

	{/await}
</main>

<style>
    h3{
      text-align: center;
    }    
</style>