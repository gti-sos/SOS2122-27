<script>

    import {onMount} from 'svelte';
    import {Button,Table,NavLink,NavItem,Nav} from 'sveltestrap';

    let debtStats = [];
    let ds_country_date = [];
    let ds_total_debt = [];
    let ds_debt_gdp = [];
    let ds_per_capita_debt = []; 

    let defenseStats = [];
    let defenseCountryYear = [];
    let defenseSpen_mill_eur = [];
    //let defenseChartPublic_percent = [];
    let defensePib_percent = [];
    let defensePer_capita = [];

    onMount(getData);

    async function getData(){

        console.log("Fetching defense data...");
        const defenseData = await fetch('/remoteDefenseAPI');
        //const debtData = await fetch('/api/v2/public-debt-stats');
        
        if( defenseData.ok && debtData.ok){
            defenseStats = await defenseData.json();
            //debtStats = await debtData.json();

            //Defense stats - Ordenar y parsear
            defenseStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            defenseStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            
            defenseStats.forEach(x => {
                defenseCountryYear.push(defenseStats.country+"-"+defenseStats.year);
                defenseSpen_mill_eur.push(parseFloat(defenseStats.spen_mill_eur));
                defensePib_percent.push(parseFloat(defenseStats.pib_percent));
                defensePer_capita.push(parseFloat(defenseStats.per_capita));
            })

        }else{
            console.log("Error al cargar los datos");
        }
    }

    async function loadGraph(){

        console.log("Fetching debt stats data...");
        
        debtStatsData = await  res.json();

        let ejeX = [D];
        let valores = [];
        let valor ={};

                
        var cont = 0;
        DataPokemons.forEach((data2)=>{
            if(cont<=10){//Mostrando solo los pokemons con la forma normal y a un número limitado de 10
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

    onMount(getData);
    
</script>

<svelte:head>
    
</svelte:head>

<main>
    {#await getData}
        Loading data ...
    {:then getData}

        <Table bordered>
			<thead>
				<tr>
					<th>Country-year</th>
					<th>Spen</th>
					<th>Pib percent</th>
					<th>Per capita</th>
                    

				</tr>
			</thead>
			<tbody>
				{#each defenseStats as defenseStats}
				{#if defenseStats.form=="Normal"}
                <tr>
                    <td>{defenseStats.defenseCountryYear}</td>
                    <td>{defenseStats.defenseSpen_mill_eur}</td>
                    <td>{defenseStats.defensePib_percent}</td>
                    <td>{defenseStats.defensePer_capita}</td>
				</tr>
                {/if}
				{/each}
			</tbody>
		</Table>

	{/await}
</main>

<style>
       
</style>