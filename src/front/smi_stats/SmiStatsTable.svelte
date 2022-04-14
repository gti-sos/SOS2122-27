<script>
    import { onMount } from 'svelte';
	import Table from 'sveltestrap/src/Table.svelte'
    
    let stats = [];
    let loading = true;

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
	<Table bordered>
		<thead>
			<tr>
				<th>
					País
				</th>
				<th>
					Año
				</th>
				<th>
					Sueldo Mon. Local
				</th>
				<th>
					Sueldo en euros
				</th>
				<th>
					% Variación
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
					{stat.smi_local}
				</td>
				<td>
					{stat.smi_euros}
				</td>
				<td>
					{stat.smi_variation}
				</td>
			</tr>
			{/each}
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
