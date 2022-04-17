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
        "/api/v1/public-expenditure-stats/frontend": PEStats,
        "/api/v1/smi_stats/frontend": SmiStats,
        "/api/v1/public-debt-stats/frontend": DebtStats        
    }

</script>

<main>
    <Router {routes}/>
</main>

