<script>

    import {onMount} from 'svelte';
    import {Button,Table,NavLink,NavItem,Nav} from 'sveltestrap';

    let pokemons = [];

    async function getPokemons(){
        console.log("Fetching pokemoms data...");
        const resData = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_stats.json", {
            "method" : "GET",
            "headers":{
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com",
                "x-rapidapi-key": "1ffb76c03dmsh3fb87e4dcd08115p1d9482jsn63e6275c09b1",
            }
        });
        if(resData.ok){
            console.log("OK");
            const json = await resData.json();
            pokemons = json;
            console.log("Received "+ pokemoms.length + " pokemons data")
        }
        else{
            console.log("Error");
        }
    }

    async function loadGraph(){

        let ejeX = ["Ataque", "Defensa", "Estamina"];
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
                text: 'Fuente: <a href="https://rapidapi.com/brianiswu/api/pokemon-go1">rapidapi.com/pokemon-go1</a>'
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
    {#await getPokemons}
        Loading pokemons data ...
    {:then getPokemons}

        <figure class="highcharts-figure">
            <div id="container"></div>
                <p class="highcharts-description" style="text-align:center;">
                    La anterior gráfica muestra información sobre las habilidades de los diferentes pokemons.
                </p>
                <p style="text-align:center;">Tabla de datos</p>	
        </figure>

        <Table bordered>
			<thead>
				<tr>
					<th>Pokemon</th>
					<th>Ataque</th>
					<th>Defensa</th>
					<th>Estamina</th>
                    

				</tr>
			</thead>
			<tbody>
				{#each pokemons as pokemon}
				{#if pokemon.form=="Normal"}
                <tr>
                    <td>{pokemon.pokemon_name}</td>
                    <td>{pokemon.base_attack}</td>
                    <td>{pokemon.base_defense}</td>
                    <td>{pokemon.base_stamina}</td>
                    
                
				</tr>
                {/if}
				{/each}
			</tbody>
		</Table>

	{/await}
</main>