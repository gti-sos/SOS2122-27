<script>
    import Router from 'svelte-spa-router';
    import Home from "./Home.svelte";
   

    //Elementos de Roque
    import PEStats from './public_expenditure_stats/PEStats.svelte';
    import EditPEStatsTable from './public_expenditure_stats/EditPEStatsTable.svelte';

    //Elementos de Felipe
    import DebtStats from './public_debt_stats/DebtStats.svelte';

    //Elementos de Alexis
    import SmiStats from './smi_stats/SmiStats.svelte';


    const routes = {
        "/": Home,

        "/public-expenditure-stats": PEStats,
<<<<<<< HEAD
        "/public-expenditure-stats/:country/:year": EditPEStatsTable,


        "/smi-stats": SmiStats,

        "/public-debt-stats": DebtStats   

=======
        "/smi_stats": SmiStats,
        "/public-debt-stats": DebtStats        
>>>>>>> 98c5af95d4667dd51756d372448a80af5f3e4e26
    }

</script>

<main>
    <Router {routes}/>
</main>

