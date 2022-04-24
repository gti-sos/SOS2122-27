<script>
    import Router from 'svelte-spa-router';
    import Home from "./Home.svelte";
    import Info from "./Info.svelte";
   

    //Elementos de Roque
    import PEStats from './public_expenditure_stats/PEStats.svelte';
    import EditPEStatsTable from './public_expenditure_stats/EditPEStatsTable.svelte';

    //Elementos de Felipe
    import DebtStats from './public_debt_stats/DebtStats.svelte';
    import EditDebtStatsTable from './public_debt_stats/EditDebtStatsTable.svelte';

    //Elementos de Alexis
    import SmiStats from './smi_stats/SmiStats.svelte';


    const routes = {
        "/": Home,
        "/info": Info,

        "/public-expenditure-stats": PEStats,
        "/public-expenditure-stats/:country/:year": EditPEStatsTable,

        "/public-debt-stats": DebtStats,
        "/public-debt-stats/:country/:year": EditDebtStatsTable,

        "/smi-stats": SmiStats,

    }

</script>

<main>
    <Router {routes}/>
</main>

