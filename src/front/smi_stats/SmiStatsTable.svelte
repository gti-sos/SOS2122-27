<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte';
    import Button from 'sveltestrap/src/Button.svelte';

	let loading = true;
    let stats = [];
    let newStat = 
	{
		country: "",
		year: "",
		smi_local: "",
		smi_euros: "",
		smi_variation: ""

	};

    onMount(getSmiStats);

    async function getSmiStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/smi_stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Received stats: "+stats.length);
        }	
    }

	async function loadSmiStats(){
        console.log("Loading stats....");
        const res = await fetch("/api/v1/smi_stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getSmiStats();
				window.alert("Estadísticas cargadas con éxito");
			});
    }

	async function deleteSmiStats(){
        console.log("Deleting stats....");
        const res = await fetch("/api/v1/smi_stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getSmiStats();
				window.alert("Estadísticas elimidas con éxito");
			});
    }

	async function deleteSmiStat(countryRM, yearRM){
        console.log("Deleting entry....");
        const res = await fetch("/api/v1/smi_stats/"+countryRM+"/"+yearRM,
			{
				method: "DELETE"
			}).then(function (res){
				getSmiStats();
				window.alert("Entrada eliminada con éxito");
			});
    }


	async function insertStat(){
		console.log("Inserting stat...."+JSON.stringify(newStat));
		if(!!newStat.country && !!newStat.year){
			const res = await fetch("/api/v1/smi_stats",
			{
				method: "POST",
				body: JSON.stringify(newStat),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				getSmiStats();
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
/*table {
   width: 100%;
   border: 1px solid #000;
}*/
thead{
	background-color: #FF8C32;
}
tbody{
	background-color: #DDDDDD;
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
				<th>Sueldo Mon. Local</th>
				<th>Sueldo en euros</th>
				<th>% Variación</th>
				<th colspan="2">Operaciones</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newStat.country}"></td>
				<td><input bind:value="{newStat.year}"></td>
				<td><input bind:value="{newStat.smi_local}"></td>
				<td><input bind:value="{newStat.smi_euros}"></td>
				<td><input bind:value="{newStat.smi_variation}"></td>
				<td><Button outline color="primary" on:click="{insertStat}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each stats as stat}
				<tr>
					<td>{stat.country}</td>
					<td>{stat.year}</td>
					<td>{stat.smi_local}</td>
                    <td>{stat.smi_euros}</td>
                    <td>{stat.smi_variation}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/api/v1/smi_stats/frontend/${stat.country}/${stat.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={deleteSmiStat(stat.country,stat.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={loadSmiStats}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={deleteSmiStats}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>
	</Table>

{/await}
</main>



<!-- 

	<ul class="responsive-table">
		<li class="table-header">
		  <div class="col col-1">País</div>
		  <div class="col col-2">Año</div>
		  <div class="col col-3">Sueldo Mon. Local</div>
		  <div class="col col-4">Sueldo en euros</div>
		  <div class="col col-5">% Variación</div>
		</li>
		{#each stats as stat}
		<li class="table-row">
		  <div class="col col-1" data-label="País">{stat.country}</div>
		  <div class="col col-2" data-label="Año">{stat.year}</div>
		  <div class="col col-3" data-label="Sueldo Mon. Local">{stat.smi_local}</div>
		  <div class="col col-4" data-label="Sueldo en euros">{stat.smi_euros}</div>
		  <div class="col col-4" data-label="% Variación">{stat.smi_variation}</div>
		</li>
		{/each}
	</ul>
-->
