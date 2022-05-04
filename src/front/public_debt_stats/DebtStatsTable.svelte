<script>
    import { onMount } from 'svelte';
	import { Pagination,PaginationItem,PaginationLink,
		Table,Button,Alert,NavLink,NavItem,Nav 
	} from "sveltestrap";

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
        const res = await fetch("/api/v2/public-debt-stats?limit=10");
        if(res.ok){
            const data = await res.json();
            stats = data;
			getDebtStatsPagination();
            console.log("Estadísticas recibidas: "+stats.length);
		}
    }

	//PAGINACION
	async function getDebtStatsPagination() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/public-debt-stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("getDebtStatsPagination Ok.");
			const data = await res.json();
			stats = data;
			console.log("Estadísticas recibidas: "+stats.length);
			update();
		}else{
			errors(res.status);
		}
  	}

	async function getDebtStatsByYear(){
		if(!!to == false){
			var toQuery = 9999;
		}
		else{
			var toQuery = to;
		}
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
        const res = await fetch("/api/v2/public-debt-stats/loadInitialData?limit=10",
			{
				method: "GET"
			}).then(function (res){
				if (res.ok) {
					getDebtStats();
					update();
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
					getDebtStatsPagination();
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
					total-=1;
				}
				else{
					errors(res.status);
				}
			});
    }

	async function insertStat(){
		console.log("Inserting stat...."+JSON.stringify(newStat));
		if(!!newStat.country && !!newStat.year){
			newStat.year = parseInt(newStat.year);
			newStat.total_debt = parseFloat(newStat.total_debt);
			newStat.debt_gdp = parseFloat(newStat.debt_gdp);
			newStat.per_capita_debt = parseFloat(newStat.per_capita_debt);
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
					getDebtStatsPagination();
					visibleError = false;
					visibleMsg = true;
					msg = "Estadística introducida con éxito";
					total+=1;
					printPagingEstate();
				
				}else{
					errors(res.status);
				}
			});
		}else{
			visibleMsg = false;
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
			getDebtStatsPagination();
		}
    }

</script>

<style>

thead{
	background-color: #23ac01;
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
h3, h4{
	text-align: center;
}

</style>

<svelte:head>
	<title>Deuda Pública</title>
</svelte:head>

<main>

	<br>

	<Nav class="bg-light">
        <NavItem>
            <NavLink id="nav-home" href="/" style="text-decoration:none">Home</NavLink>
        </NavItem>
        <NavItem>
            <NavLink id="nav-info" href="/#/info" style="text-decoration:none">Info</NavLink>
        </NavItem>
		<NavItem>
            <NavLink id="nav-info" href="#" style="text-decoration:none" on:click={deleteDebtStats}>Eliminar Todo</NavLink>
        </NavItem>
		<NavItem>
            <NavLink id="nav-info" href="#" style="text-decoration:none" class="text-succcess" on:click={loadDebtStats}>Iniciar Datos</NavLink>
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
	<br>
	<h4>Búsqueda por intervalo temporal</h4>	
	<Table bordered class="w-50 text-center mx-auto">
		<thead>
			<tr class="bg-light">
				<th>Fecha inicio</th>
				<th>Fecha fin</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="number" min="2000" bind:value="{from}"></td>
				<td><input type="number" min="2000" bind:value="{to}"></td>
				<td>
					<Button outline color="primary" on:click="{()=>{
						if (from == null || to == null) {
							visibleMsg = false;
							visibleError = true;
							errorMsg = "Los campos fecha inicio y fecha fin no pueden estar vacíos";
						}else{
							getDebtStatsByYear();
						}
					}}">Buscar
					</Button>
				</td>
				<td align="center"><Button outline color="info" on:click="{()=>{
					from = 2017;
					to = 2022;
					getDebtStats();				
				}}">
					Limpiar Búsqueda
					</Button>
				</td>
			</tr>
		</tbody>
			
	</Table>

	<br>

	<h3>Archivo de estadísticas</h3>

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



