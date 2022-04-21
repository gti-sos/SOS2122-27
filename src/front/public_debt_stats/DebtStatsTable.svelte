<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
	import Button from 'sveltestrap/src/Button.svelte';
    
    let stats = [];

    let newStat = 
		{
            country: "",
            year: "",
            total_debt: "",
            debt_gdp: "",
            per_capita_debt: ""    
        }; 

    onMount(getDebtStats);

    async function getDebtStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/public-debt-stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Received stats: "+stats.length);
        }	
    }

	async function loadDebtStats(){
        console.log("Loading stats....");
        const res = await fetch("/api/v1/public-debt-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getDebtStats();
				window.alert("Estadísticas cargadas con éxito");
			});
    }

	async function deleteDebtStats(){
        console.log("Deleting stats....");
        const res = await fetch("/api/v1/public-debt-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getDebtStats();
				window.alert("Estadísticas elimidas con éxito");
			});
    }

	async function deleteStat(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/public-debt-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getDebtStats();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function insertStat(){
		console.log("Inserting stat...."+JSON.stringify(newStat));
		if(!!newStat.country && !!newStat.year){
			const res = await fetch("/api/v1/public-debt-stats",
			{
				method: "POST",
				body: JSON.stringify(newStat),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getDebtStats();
				window.alert("Estadística introducida con éxito");
			});
		}else{
			window.alert("Faltan los campos país y año");
		}
		
	}

	function errors(code){
        let msg;
		switch (code) {
			case 404:
				msg = "La entrada seleccionada no existe"
				break;
			case 400:
            	msg = "La petición no está correctamente formulada"
				break;
			case 409:
           		msg = "El dato introducido ya existe"
				break;
			case 401:
            	msg = "No autorizado"
				break;
			case 405:
				msg = "Método no permitido"
				break;
		}
        window.alert(msg)
            return;
    }

</script>

<style>

thead{
	background-color: #9381ff;
}
tbody{
	background-color: #f8f7ff;
}
th, td {
   width: 15%;
   text-align: center;
   vertical-align: top;
   border: 1px solid #000;
   border-spacing: 0;
}
</style>

<main>
{#await stats}
loading
	{:then stats}
	<Table bordered>
		<thead>
			<tr>
				<th>País</th>
				<th>Año</th>
				<th>Deuda pública total</th>
				<th>% de deuda pública respecto al PIB</th>
				<th>Deuda pública per cápita</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newStat.country}"></td>
				<td><input bind:value="{newStat.year}"></td>
				<td><input bind:value="{newStat.total_debt}"></td>
				<td><input bind:value="{newStat.debt_gdp}"></td>
				<td><input bind:value="{newStat.per_capita_debt}"></td>
				<td><Button outline color="primary" on:click="{insertStat}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each stats as stat}
				<tr>
					<td>{stat.country}</td>
					<td>{stat.year}</td>
					<td>{stat.total_debt}</td>
					<td>{stat.debt_gdp}</td>
					<td>{stat.per_capita_debt}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/api/v1/public-debt-stats/frontend/${stat.country}/${stat.year}`
					}}>
						Editar
					</Button></td>
					<td><Button outline color="danger" on:click={deleteStat(stat.country,stat.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={loadDebtStats}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={deleteDebtStats}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>

{/await}
</main>



