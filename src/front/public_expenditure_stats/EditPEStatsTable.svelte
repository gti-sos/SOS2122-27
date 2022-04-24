<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import {Table, Button, Alert } from "sveltestrap";


    let stat = {};

    let updatedCountry;
    let updatedYear;
    let updatedPE;
    let updatedPEToGDP;
    let updatedPEOnDefence;

    //vatiables para mostrar mensajes
	let visibleError = false;
	let visibleMsg = false;
	let errorMsg = "";
	let msg = "";

    onMount(getStats);

    async function getStats(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/public-expenditure-stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            stat = data;
            updatedCountry = stat.country;
            updatedYear = stat.year;
            updatedPE = stat.public_expenditure;
            updatedPEToGDP = stat.pe_to_gdp;
            updatedPEOnDefence = stat.pe_on_defence;
        }else{
            errors(res.status,params.country+"/"+params.year);
            pop();
        }
    }

    async function editStat(){
        console.log("Updating entry...."+updatedCountry);
        updatedPE = parseFloat(updatedPE);
		updatedPEToGDP = parseFloat(updatedPEToGDP);
		updatedPEOnDefence = parseFloat(updatedPEOnDefence);
        const res = await fetch("/api/v2/public-expenditure-stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    public_expenditure: updatedPE,
                    pe_to_gdp: updatedPEToGDP,
                    pe_on_defence: updatedPEOnDefence
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
    <h1>Editar estadística {params.country}/{params.year}</h1>

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

    {#await stat}
    loading
        {:then stat}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
				    <th>Año</th>
				    <th>Gasto público</th>
				    <th>% de gasto público respecto a PIB</th>
                    <th>% destinado a defensa en GP</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedPE}"></td>
                    <td><input bind:value="{updatedPEToGDP}"></td>
                    <td><input bind:value="{updatedPEOnDefence}"></td>
                    <td><Button outline color="primary" on:click="{editStat}">
                        Editar
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
    
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    </main>