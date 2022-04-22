<script>
    import { onMount } from 'svelte';
	import { Table, Button} from 'sveltestrap';
	import {Pagination, PaginationItem, PaginationLink } from "sveltestrap";

	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;
    
    let stats = [];
    
	let newStat = 
		{
            country: "",
            year: "",
            public_expenditure: "",
            pe_to_gdp: "",
            pe_on_defence: ""
    
        }; 

    onMount(getPEStats);

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/public-expenditure-stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
			total = data.length;
			update();
            console.log("Estadísticas recibidas: "+stats.length);
        }	
    }

	async function getPEStatsPaging() {
    	console.log("Fetching data...");
   		const res = await fetch("/api/v2/public-expenditure-stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("getPEStatsPaging Ok.");
			const json = await res.json();
			stats = json;
			console.log(`We have ${stats.length} stats.`);
			for(let i=0; i<stats.length ; i++){
				let data = [];
				let y = stats[i].year;
				if(y > yFrom && y<yTo){
					data.push(y);
					stats = data;
				}
			}
			update();
		}else{
			console.log("Error");
		}
  	}

	async function loadPEStats(){
        console.log("Loading stats....");
        const res = await fetch("/api/v2/public-expenditure-stats/loadInitialData",
			{
				method: "GET"
			}).then(function (res){
				getPEStats();
				window.alert("Estadísticas cargadas con éxito");
			});
    }

	async function deletePEStats(){
        console.log("Deleting stats....");
        const res = await fetch("/api/v2/public-expenditure-stats/",
			{
				method: "DELETE"
			}).then(function (res){
				getPEStats();
				window.alert("Estadísticas elimidas con éxito");
			});
    }

	async function deleteStat(countryDelete, yearDelete){
        console.log("Deleting entry....");
        const res = await fetch("/api/v2/public-expenditure-stats/"+countryDelete+"/"+yearDelete,
			{
				method: "DELETE"
			}).then(function (res){
				getPEStats();
				window.alert("Entrada eliminada con éxito");
			});
    }

	async function insertStat(){
		console.log("Inserting stat...."+JSON.stringify(newStat));
		if(!!newStat.country && !!newStat.year){
			const res = await fetch("/api/v2/public-expenditure-stats",
			{
				method: "POST",
				body: JSON.stringify(newStat),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
				newStat.country ="";
				newStat.year = "";
            	newStat.public_expenditure = "";
            	newStat.pe_to_gdp = "";
            	newStat.pe_on_defence = "";
				getPEStats();
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

	async function update() {
      const res = await fetch("/api/v2/public-expenditure-stats");
      if (res.status == 200) {
        const json = await data.json();
        total = json.length;
        changePage(c_page, c_offset);
      } 
    }

	function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}

	function changePage(page, offset) {
      
      lastPage = Math.ceil(total/10);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getPEStats();
		getPEStatsPaging();
      }
    } 

</script>

<style>
/*table {
   width: 100%;
   border: 1px solid #000;
}*/
thead{
	background-color: #9381ff;
}
tbody{
	background-color: #f8f7ff;
}
th, td {
   width: 15%;
   text-align: center;
   vertical-align: center;
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
				<th>Gasto público</th>
				<th>% de gasto público respecto a PIB</th>
                <th>% destinado a defensa en GP</th>
				<th colspan="2">Operaciones</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newStat.country}"></td>
				<td><input bind:value="{newStat.year}"></td>
				<td><input bind:value="{newStat.public_expenditure}"></td>
                <td><input bind:value="{newStat.pe_to_gdp}"></td>
                <td><input bind:value="{newStat.pe_on_defence}"></td>
				<td><Button outline color="primary" on:click="{insertStat}">
					Añadir
					</Button>
				</td>
			</tr>
			{#each stats as stat}
				<tr>
					<td>{stat.country}</td>
					<td>{stat.year}</td>
					<td>{stat.public_expenditure}</td>
                    <td>{stat.pe_to_gdp}</td>
                    <td>{stat.pe_on_defence}</td>
					<td><Button outline color="warning" on:click={function (){
						window.location.href = `/#/public-expenditure-stats/${stat.country}/${stat.year}`
					}}>
						Editar
					</Button>
					<td><Button outline color="danger" on:click={deleteStat(stat.country,stat.year)}>
						Borrar
					</Button>
					</td>
				</tr>
			{/each}
			<tr>
				<td><Button outline color="success" on:click={loadPEStats}>
					Cargar datos
				</Button></td>
				<td><Button outline color="danger" on:click={deletePEStats}>
					Borrar todo
				</Button></td>
			</tr>
		</tbody>

		<div>
			<Pagination ariaLabel="Web pagination">
			  <PaginationItem class = {c_page === 1 ? "enable" : ""}>
					<PaginationLink previous href="#/public-expenditure-stats" on:click={() => changePage(c_page - 1, c_offset - 10)}/>
			  </PaginationItem>
			  {#each range(lastPage, 1) as page}
					<PaginationItem class = {c_page === page ? "active" : ""}>
					  <PaginationLink previous href="#/public-expenditure-stats" on:click={() => changePage(page, (page - 1) * 10)}>
						  {page}
					  </PaginationLink>
					</PaginationItem>
			  {/each}
			  <PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
					<PaginationLink next href="#/public-expenditure-stats" on:click={() => changePage(c_page + 1, c_offset + 10)}/>
			  </PaginationItem>
			</Pagination>
  
	  </div>

	</Table>

{/await}
</main>


