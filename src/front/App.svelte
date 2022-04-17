<script>
    import Router from 'svelte-spa-router';
    import Home from "./Home.svelte";
   

    //Elementos de Roque
    import PEStats from './public_expenditure_stats/PEStats.svelte';

    //Elementos de Felipe
    import DebtStats from './public_debt_stats/DebtStats.svelte';

    //Elementos de Alexis
    import SmiStats from './smi_stats/SmiStats.svelte';


    const routes = {
        "/": Home,
        "/public-expenditure-stats": PEStats,
        "/smi_stats": SmiStats,
        "/public-debt-stats": DebtStats        
    }

</script>

<main>
    <Router {routes}/>
</main>

