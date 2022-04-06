<script>
    import { onMount } from 'svelte';
    
    let stats = [];
    let loading = true;

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
					Deuda pública total
				</th>
				<th>
					% de deuda pública respecto al PIB
				</th>
				<th>
					Deuda pública per cápita
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
					{stat.total_debt}
				</td>
				<td>
					{stat.debt_gdp}
				</td>
				<td>
					{stat.per_capita_debt}
				</td>
			</tr>
			{/each}
		</tbody>
	</table>

{/await}
</main>