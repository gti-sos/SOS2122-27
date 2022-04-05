<script>
    import { onMount } from 'svelte';

    export let name;
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