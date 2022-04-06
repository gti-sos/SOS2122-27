<script>
    import Router from 'svelte-spa-router';
   

    //Elementos de Roque
    import PEStats from './public_expenditure_stats/PEStats.svelte';

    //Elementos de Felipe
    import DebtStats from './public_debt_stats/DebtStats.svelte';


    const routes = {
        "/api/v1/public-expenditure-stats/frontend": PEStats,
        "/api/v1/public-debt-stats/frontend": DebtStats
    }

</script>

<main>
    <Router {routes}/>
</main>

<style>
    main {
		text-align: left;
		padding: 2.5em;
		max-width: 240px;
		margin: 0 auto;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>