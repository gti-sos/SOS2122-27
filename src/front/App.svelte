<script>
    import Router from 'svelte-spa-router';
    import Home from "./Home.svelte";
    import Info from "./Info.svelte";
    import JointGraph from './JointGraph.svelte';
   

    //Elementos de Roque
    import PEStats from './public_expenditure_stats/PEStats.svelte';
    import EditPEStatsTable from './public_expenditure_stats/EditPEStatsTable.svelte';
    import PeGraphV1 from './public_expenditure_stats/PEGraph_v1.svelte';

    //Elementos de Felipe
    import DebtStats from './public_debt_stats/DebtStats.svelte';
    import EditDebtStatsTable from './public_debt_stats/EditDebtStatsTable.svelte';

    //Elementos de Alexis
    import SmiStats from './smi_stats/SmiStats.svelte';
    import EditSmiStatsTable from './smi_stats/EditSmiStatsTable.svelte';


    const routes = {
        "/": Home,
        "/info": Info,
        "/graph": JointGraph,

        "/public-expenditure-stats": PEStats,
        "/public-expenditure-stats/:country/:year": EditPEStatsTable,
        "/public-expenditure-stats/graph-v1": PeGraphV1,


        "/public-debt-stats": DebtStats,
        "/public-debt-stats/:country/:year": EditDebtStatsTable,

        "/smi_stats": SmiStats,        
        "/smi_stats/:country/:year": EditSmiStatsTable,

    }

</script>

<main>
    <Router {routes}/>
</main>

