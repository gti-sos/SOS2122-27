<script>
    import Router from 'svelte-spa-router';
    import Home from "./Home.svelte";
    import Info from "./Info.svelte";
    import JointGraph from './JointGraph.svelte';
    import Integrations from './Integrations.svelte';
    import Charts from './Charts.svelte';
    import NewHome from './NewHome.svelte'; 

    //Elementos de Roque
    import PEStats from './public_expenditure_stats/PEStats.svelte';
    import EditPEStatsTable from './public_expenditure_stats/EditPEStatsTable.svelte';
    import PeGraphV1 from './public_expenditure_stats/PEGraph_v1.svelte';
    import PeGraphV2 from './public_expenditure_stats/PEGraph_v2.svelte';
    import IntegrationV1 from './public_expenditure_stats/Integration_v1.svelte';
    import IntegrationV2 from './public_expenditure_stats/Integration_v2.svelte';
    import IntegrationV3 from './public_expenditure_stats/Integration_v3.svelte';


    //Elementos de Felipe
    import DebtStats from './public_debt_stats/DebtStats.svelte';
    import EditDebtStatsTable from './public_debt_stats/EditDebtStatsTable.svelte';
    import DsGraph from './public_debt_stats/DSGraph.svelte';
    import DsApexGraph from './public_debt_stats/DSApexGraph.svelte';

    //Elementos de Alexis
    import SmiStats from './smi_stats/SmiStats.svelte';
    import EditSmiStatsTable from './smi_stats/EditSmiStatsTable.svelte';
    import SmiGraphV1 from './smi_stats/SmiGraph_v1.svelte';


    const routes = {
        "/": NewHome,
        "/home": Home,
        "/info": Info,
        "/analytics": JointGraph,
        "/integrations": Integrations,
        "/charts": Charts,

        "/public-expenditure-stats": PEStats,
        "/public-expenditure-stats/:country/:year": EditPEStatsTable,
        "/public-expenditure-stats/graph-v1": PeGraphV1,
        "/public-expenditure-stats/graph-v2": PeGraphV2,
        "/public-expenditure-stats/int-v1": IntegrationV1,
        "/public-expenditure-stats/int-v2": IntegrationV2,
        "/public-expenditure-stats/int-v3": IntegrationV3,



        "/public-debt-stats": DebtStats,
        "/public-debt-stats/:country/:year": EditDebtStatsTable,
        "/public-debt-stats/graph": DsGraph,
        "/public-debt-stats/apexGraph": DsApexGraph,

        "/smi_stats": SmiStats,        
        "/smi_stats/:country/:year": EditSmiStatsTable,
        "/smi_stats/graph-v1": SmiGraphV1

    }

</script>

<main>
    <Router {routes}/>
</main>

