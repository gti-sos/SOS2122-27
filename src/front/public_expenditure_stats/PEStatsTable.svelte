<script>
    import { onMount } from 'svelte';

    
    let stats = [];
    let loading = true;

    onMount(getPEStats);

    async function getPEStats(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v1/public-expenditure-stats");
        if(res.ok){
            const data = await res.json();
            stats = data;
            console.log("Received stats: "+stats.length);
        }	
    }
</script>

<style>
table {
   width: 100%;
   border: 1px solid #000;
}
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
	<table>
		<thead>
			<tr>
				<th>
					País
				</th>
				<th>
					Año
				</th>
				<th>
					Gasto público
				</th>
				<th>
					% de gasto público respecto a PIB
				</th>
				<th>
					% destinado a defensa en GP
				</th>
			</tr>
		</thead>
		<tbody>
			{#each stats as stat}
			<tr>
				<td>
					{stat.country}
				</td>
				<td>
					{stat.year}
				</td>
				<td>
					{stat.public_expenditure}
				</td>
				<td>
					{stat.pe_to_gdp}
				</td>
				<td>
					{stat.pe_on_defence}
				</td>
			</tr>
			{/each}
		</tbody>
	</table>

{/await}
</main>



<!-- 

	<ul class="responsive-table">
		<li class="table-header">
		  <div class="col col-1">País</div>
		  <div class="col col-2">Año</div>
		  <div class="col col-3">Gasto público</div>
		  <div class="col col-4">% de gasto público respecto a PIB</div>
		  <div class="col col-5">% destinado a defensa en GP</div>
		</li>
		{#each stats as stat}
		<li class="table-row">
		  <div class="col col-1" data-label="País">{stat.country}</div>
		  <div class="col col-2" data-label="Año">{stat.year}</div>
		  <div class="col col-3" data-label="Gasto público">{stat.public_expenditure}</div>
		  <div class="col col-4" data-label="% de gasto público respecto a PIB">{stat.pe_to_gdp}</div>
		  <div class="col col-4" data-label="% destinado a defensa en GP">{stat.pe_on_defence}</div>
		</li>
		{/each}
	</ul>
-->
