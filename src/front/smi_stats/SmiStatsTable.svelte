<script>
    import { onMount } from 'svelte';
	import{Nav, NavItem, NavLink } from "sveltestrap";
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
	let from = 2000;
	let to = 2022;
    
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


	//GETS
    async function getSmiStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/smi_stats?limit=10");
        if(res.ok){
            const data = await res.json();
            stats = data;
			update();
            console.log("Received stats: "+stats.length);
        }	
    }
	async function getSmiStatsByYear(){
		if(!!to == false){
			var toQuery = 9999;
			console.log("NO Existe to");
		}
		else{
			var toQuery = to;
			console.log("Existe to");
		}
		console.log("Fetching stats from ",from," to ",to," ......");
		const res = await fetch("/api/v2/smi_stats"+"?from="+from+"&to="+toQuery);
		
        if(res.ok){
            const data = await res.json();
            stats = data;
			total = data.length;
			//update();
			getSmiStatsPagination();
            console.log("Estadísticas recibidas: "+stats.length);
        }else{
			errors(res.status);
		}
	}

	//CARGA INICIAL
	async function loadSmiStats(){
        console.log("Loading stats....");
        const res = await fetch("/api/v2/smi_stats/loadInitialData?limit=10",
			{
				method: "GET"
			}).then(function (res){
				if(res.ok){
					getSmiStats();
					update(); //#
					visibleError = false;
					visibleMsg = true;
					msg = "Estadísticas cargadas con éxito";
				}else{
					errors(res.status);
				}
			});
    }


	//DELETES
	async function deleteSmiStats(){
        console.log("Deleting stats....");
        const res = await fetch("/api/v2/smi_stats/",
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getSmiStats();
					getSmiStatsPagination(); //#
					visibleError = false;
					visibleMsg = true;
					msg = "Estadísticas eliminadas con éxito";
				}else{
					errors(res.status);
				}
			});
    }

	async function deleteSmiStat(countryRM, yearRM){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/smi_stats/"+countryRM+"/"+yearRM,
			{
				method: "DELETE"
			}).then(function (res){
				if(res.ok){
					getSmiStats();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadística eliminada con éxito";
				}else{
					errors(res.status);
				}
			});
    }
	//PAGINACION
	async function getSmiStatsPagination() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/smi_stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("getSmiStatsPagination Ok.");
			const data = await res.json();
			stats = data;
			console.log("Estadísticas recibidas: "+stats.length);
			update();
		}else{
			errors(res.status);
		}
  	}

	  async function update() {
      const res = await fetch("/api/v2/smi_stats");
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
        getSmiStats();
		getSmiStatsPagination();
      }
    } 

	//AÑADIR DATO
	async function insertStat(){
		console.log("Inserting stat...."+JSON.stringify(newStat));
		if(!!newStat.country && !!newStat.year){
			newStat.year = parseInt(newStat.year);
			newStat.smi_local = parseFloat(newStat.smi_local);
			newStat.smi_euros = parseFloat(newStat.smi_euros);
			newStat.smi_variation = parseFloat(newStat.smi_variation);
			const res = await fetch("/api/v2/smi_stats",
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
					newStat.smi_local = "";
					newStat.smi_euros = "";
					newStat.smi_variation = "";
					getSmiStats();
					getSmiStatsPagination();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadística introducida con éxito";
					console.log("Total: ",total);
				}
				else{
					errors(res.status);
				}
			});
		}else{
			window.alert("Faltan los campos país y año");
		}
		
	}

	//ERRORES
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
			default:
				error = "Error desconocido"
		}
        visibleMsg=false;
		visibleError=true;
        errorMsg = error;
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

	<Nav>
        <NavItem>
          <NavLink href="/">Página Principal</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/analytics">Gráfica conjunta</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/smi_stats/graph-v1">Gráfica SMI</NavLink>
        </NavItem>
    </Nav>
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
				<td colspan="2"><Button block color="primary" on:click="{insertStat}">
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
					<td><Button  block color="warning" on:click={function (){
						window.location.href = `#/smi_stats/${stat.country}/${stat.year}`
					}}>
						Editar
					</Button></td>
					<td><Button block color="danger" on:click={deleteSmiStat(stat.country,stat.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button block color="success" on:click={loadSmiStats}>
					Cargar datos
				</Button></td>
				<td><Button block color="danger" on:click={deleteSmiStats}>
					Borrar todo
				</Button></td>
				
					<td>desde</td>
					<td><input bind:value="{from}"></td>
					<td>hasta</td>
					<td><input bind:value="{to}"></td>
					<td><Button block color="success" on:click={getSmiStatsByYear}>
						Filtrar
					</Button></td>
			
				
			</tr>
		</tbody>
	</Table>

	<div>
		<Pagination ariaLabel="Web pagination">
		  <PaginationItem class = {c_page === 1 ? "disabled" : ""}>
				<PaginationLink previous href="#/smi_stats" on:click={() => changePage(c_page - 1, c_offset - 10)}/>
		  </PaginationItem>
		  {#each range(lastPage, 1) as page}
				<PaginationItem class = {c_page === page ? "active" : ""}>
				  <PaginationLink previous href="#/smi_stats" on:click={() => changePage(page, (page - 1) * 10)}>
					  {page}
				  </PaginationLink>
				</PaginationItem>
		  {/each}
		  <PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
				<PaginationLink next href="#/smi_stats" on:click={() => changePage(c_page + 1, c_offset + 10)}/>
		  </PaginationItem>
		</Pagination>

  </div>

{/await}
</main>