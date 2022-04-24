<script>

    export let params = {};
    import {pop} from "svelte-spa-router";
    import { onMount } from 'svelte';
    import Button from 'sveltestrap/src/Button.svelte';
    import Table from 'sveltestrap/src/Table.svelte';

    let stat = {};

    let updatedCountry;
    let updatedYear;
    let updatedLocal;
    let updatedEuros;
    let updatedVariation;

    onMount(getStats);

    async function getStats(){
        console.log("Fetching entries....");
        const res = await fetch("/api/v2/smi_stats/"+params.country+"/"+params.year); 
        if(res.ok){
            const data = await res.json();
            stat = data;
            updatedCountry = stat.country;
            updatedYear = stat.year;
            updatedLocal = stat.smi_local;
            updatedEuros = stat.smi_euros;
            updatedVariation = stat.smi_variation;
        }else{
            errors(res.status,params.country+"/"+params.year);
            pop();
        }
    }

    async function editStat(){
        console.log("Updating entry...."+updatedCountry);
        const res = await fetch("/api/v2/smi_stats/"+params.country+"/"+params.year,
			{
				method: "PUT",
				body: JSON.stringify({
                    country: updatedCountry,
                    year: updatedYear,
                    smi_local: updatedLocal,
                    smi_euros: updatedEuros,
                    smi_variation: updatedVariation
                }),
				headers: {
					"Content-Type": "application/json"
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
    {#await stat}
    loading
        {:then stat}
        
    
        <Table bordered>
            <thead>
                <tr>
                    <th>País</th>
				    <th>Año</th>
				    <th>Sueldo Mon. Local</th>
                    <th>Sueldo en euros</th>
                    <th>% Variación</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{updatedCountry}</td>
                    <td>{updatedYear}</td>
                    <td><input bind:value="{updatedLocal}"></td>
                    <td><input bind:value="{updatedEuros}"></td>
                    <td><input bind:value="{updatedVariation}"></td>
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