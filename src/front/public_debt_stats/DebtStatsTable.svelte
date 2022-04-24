<script>
    import { onMount } from 'svelte';
	import {Pagination, PaginationItem, PaginationLink, Table, Button, Alert } from "sveltestrap";

	//vatiables para mostrar mensajes
	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";


	//variables para la paginacion
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;

	//variables para filtrar por año
	let from = 2017;
	let to = 2022;
    
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
        const res = await fetch("/api/v2/public-debt-stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Received stats: "+stats.length);
        }	
    }

	async function getDebtStatsPaging() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/public-debt-stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("getDebtStatsPaging Ok.");
			const data = await res.json();
			stats = data;
			console.log("Estadísticas recibidas: "+stats.length);
			update();
		}else{
			errors(res.status);
		}
  	}

	async function getDebtStatsByYear(){
		console.log("Fetching stats from ",from," to ",to," ......");
        const res = await fetch("/api/v2/public-debt-stats"+"?from="+from+"&to="+to);
        if(res.ok){
            const data = await res.json();
            stats = data;
			total = data.length;
			update();
            console.log("Estadísticas recibidas: "+stats.length);
        }else{
			errors(res.status);
		}
	}

	async function loadDebtStats(){
        console.log("Loading stats....");
        const res = await fetch("/api/v2/public-debt-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				if (res.ok) {
					getDebtStats();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadísticas inicializadas con éxito";
				}else{
					errors(res.status);
				}
			});
    }

	async function deleteDebtStats(){
        console.log("Deleting stats....");
        const res = await fetch("/api/v2/public-debt-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getDebtStats();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadísticas eliminadas con éxito";
				}
				else{
					errors(res.status);
				}
			});
    }

	async function deleteStat(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/public-debt-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getDebtStats();
					visibleError = false;
					visibleMsg = true;
					msg = "Entrada eliminada con éxito";
				}
				else{
					errors(res.status);
				}
			});
    }

	async function insertStat(){
		console.log("Inserting stat...."+JSON.stringify(newStat));
		if(!!newStat.country && !!newStat.year){
			const res = await fetch("/api/v2/public-debt-stats",
			{
				method: "POST",
				body: JSON.stringify(newStat),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				if(res.ok){
					newStat.country ="";
					newStat.year = "";
					newStat.total_debt = "";
					newStat.debt_gdp = "";
					newStat.per_capita_debt = "";
					getDebtStats();
					getDebtStatsPaging();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadística introducida con éxito";
					console.log("Total: ",total);
				
				}else{
					errors(res.status);
				}
			});
		}else{
			visibleError = true;
			errorMsg = "Faltan los campos país y año";
		}
	}

	function errors(code){
        let msg;
		switch (code) {
			case 404:
				msg = "La entrada" + newStat.country + "/" + newStat.year + "no existe"
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
			default:
				msg = "Error desconocido"
		}

        visibleMsg=false;
		visibleError=true;
		errorMsg = msg;
        return;
    }

	async function update() {
      const res = await fetch("/api/v2/public-debt-stats");
      if (res.status == 200) {
        const json = await res.json();
        total = json.length;
        changePage(c_page, c_offset);
      } 
    }

	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function changePage(page, offset) {
      
      lastPage = Math.ceil(total/limit);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getDebtStats();
		getDebtStatsPaging();
      }
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

	<Alert color="danger" isOpen={visibleError} toggle={() => (visibleError = false)}>
		{#if errorMsg}
			<p>ERROR: {errorMsg}</p>
		   {/if}
	</Alert>
	<Alert color="success" isOpen={visibleMsg} toggle={() => (visibleMsg = false)}>
		{#if msg}
			<p>Correcto: {msg}</p>
		{/if}
	</Alert>

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
						window.location.href = `/#/public-debt-stats/${stat.country}/${stat.year}`
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

	<div>
		<Pagination ariaLabel="Web pagination">
		  <PaginationItem class = {c_page === 1 ? "disabled" : ""}>
				<PaginationLink previous href="#/public-debt-stats" on:click={() => changePage(c_page - 1, c_offset - 10)}/>
		  </PaginationItem>
		  {#each range(lastPage, 1) as page}
				<PaginationItem class = {c_page === page ? "active" : ""}>
				  <PaginationLink previous href="#/public-debt-stats" on:click={() => changePage(page, (page - 1) * 10)}>
					  {page}
				  </PaginationLink>
				</PaginationItem>
		  {/each}
		  <PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
				<PaginationLink next href="#/public-debt-stats" on:click={() => changePage(c_page + 1, c_offset + 10)}/>
		  </PaginationItem>
		</Pagination>

  </div>

{/await}
</main>



