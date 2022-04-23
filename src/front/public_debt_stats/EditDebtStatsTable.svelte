<script>
    import { onMount } from 'svelte';
    export let params = {};
    import { pop } from "svelte-spa-router";
    import { Table,Button } from "sveltestrap";
    
    onMount(getDebtStats);
    let stat = {};
    let updatedTotalDebt;
    let updatedDebtGdp;
    let updatedPerCapitaDebt;    
    
    async function getStat(){
        console.log("Fetching contacts....");
        const res = await fetch("/api/v1/public-debt-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            stat = data;
            updatedTotalDebt = stat.total_debt;
            updatedDebtGdp = contact.debt_gdp;
            updatedPerCapitaDebt = contact.per_capita_debt;
            
            console.log("Received stat.");
        }
    }
    async function editStat(){
    }
</script>

<main>
    <h1>Edit contact "{params.country}+"-"+{params.year}" </h1>
    {#await stat}
    loading
        {:then stat}        
    
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
                    <td>{stat.country}</td>
                    <td>{stat.year}</td>
                    <td><input bind:value="{updatedTotalDebt}"></td>
                    <td><input bind:value="{updatedDebtGdp}"></td>
                    <td><input bind:value="{updatedPerCapitaDebt}"></td>
                    <td><Button 
                            outline 
                            color="primary" 
                            on:click="{editStat}">
                        Edit
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}">Back</Button>

    </main>