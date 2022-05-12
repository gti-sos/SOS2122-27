<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let PEStats = [];    
    let inequalityStats = [];    

    async function getData(){
        const inequalityData = await fetch("/remoteAPIV4");
        const PEData = await fetch("/api/v2/public-expenditure-stats");

        if (inequalityData.ok && PEData.ok){
            inequalityStats = await inequalityData.json();
            PEStats = await PEData.json();
            debtStats = await pdData.json();

            inequalityStats.forEach(element =>{
                xLabel.push(element.country.toLowerCase() +","+parseInt(element.year));
            });
            PEStats.forEach(element =>{
                xLabel.push(element.countrytoLowerCase() +","+parseInt(element.year));
            });
            
            //inequality
            inequalityStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            inequalityStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            inequalityStats.forEach(element=>{
                inequality_local.push(parseFloat(element.inequality_local));
                inequality_euros.push(parseFloat(element.inequality_euros));
                inequality_variation.push(parseFloat(element.inequality_variation));
            });
            //PE
            PEStats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            PEStats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            PEStats.forEach(element=>{
                stats_public_expenditure.push(parseFloat(element.public_expenditure));
                stats_PE_on_defence.push(parseFloat(element.pe_on_defence));
                stats_PE_to_gdp.push(parseFloat(element.pe_to_gdp));
            });
            

            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            loadGraph();
        }   
    }

    function loadGraph(){
        
    }

    
    

    onMount(getData);
    
</script>

<svelte:head>
    
</svelte:head>

<main>
    <h1>Integración 4</h1>
    <h2>Estadísticas de generación de CO2 integradas con información de Gasto Público</h2>
      
</main>

<style>
    h1{
        text-align: center;
    }
    h2{
        text-align: center;
    }
    h4{
        text-align: center;
    }
</style>

