<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import {Table, Button, Alert } from "sveltestrap";  
    
    let stat = {};
    let updatedCountry;
    let updatedYear;
    let updatedTotalDebt;
    let updatedDebtGdp;
    let updatedPerCapitaDebt;   

    let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";
    
    onMount(getEntries);
    
    async function getEntries(){
        console.log("Fetching stats....");
        const res = await fetch("/api/v2/public-debt-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            stat = data;
            updatedCountry = stat.country;
            updatedYear = stat.year;
            updatedTotalDebt = stat.total_debt;
            updatedDebtGdp = stat.debt_gdp;
            updatedPerCapitaDebt = stat.per_capita_debt;
            
            console.log("Received stat.");
        }else{
            errors(res.status,params.country+"/"+params.year);
            pop();
        }
    }

    async function editEntry(){
        console.log("Updating entry...."+updatedCountry);
        newStat.total_debt = parseFloat(newStat.total_debt);
		newStat.debt_gdp = parseFloat(newStat.debt_gdp);
		newStat.per_capita_debt = parseFloat(newStat.per_capita_debt);
        const res = await fetch("/api/v2/public-debt-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    total_debt: updatedTotalDebt,
                    debt_gdp: updatedDebtGdp,
                    per_capita_debt: updatedPerCapitaDebt
                }),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res){
                if(res.ok){
					visibleError = false;
					visibleMsg = true;
					msg = "Estadística modificada con éxito";
				}
				else{
					errors(res.status);
				}
            }); 

    }

    async function errors(code,entrada){
        
        let msg;
        if(code == 404){
            msg = "La entrada "+entrada+" no existe"
        }
        if(code == 400){
            msg = "La petición no está correctamente formulada"
        }
        if(code == 409){
            msg = "El dato introducido ya existe"
        }
        if(code == 401){
            msg = "No autorizado"
        }
        if(code == 405){
            msg = "Método no permitido"
        }
        window.alert(msg)
            return;
    }

</script>

<main>
    <h1>Editar estadística "{params.country}"/"{params.year}" </h1>
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
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedTotalDebt}"></td>
                    <td><input bind:value="{updatedDebtGdp}"></td>
                    <td><input bind:value="{updatedPerCapitaDebt}"></td>
                    <td><Button 
                            outline 
                            color="primary" 
                            on:click="{editEntry}">
                        Edit
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    <Button outline color="secondary" on:click="{pop}">Back</Button>

    </main>