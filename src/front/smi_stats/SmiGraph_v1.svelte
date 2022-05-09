<script>
    import{Nav, NavItem, NavLink } from "sveltestrap";
    const BASE_API_PATH = "/api/v2/smi_stats";
    let smi_stats=[];
    let smi_country_year = [];
    let smi_local = [];
    let smi_euros = [];
    let smi_variation = [];
 
	let errorMsg="Tiene que cargar los datos para visualizar las analíticas.";
    let cargados = false;

    async function loadChart() {
        console.log("Fetching data...");
        const res = await fetch(BASE_API_PATH);
        smi_stats = await res.json();
        if (res.ok) {
          smi_stats.forEach(stat => {
            smi_country_year.push(stat.country+"-"+stat.year);
            smi_local.push(parseFloat(stat.smi_local));
            smi_euros.push(parseFloat(stat.smi_euros));
            smi_variation.push(parseFloat(stat.smi_variation));
            });
            cargados=true;
    }
        
    console.log("smi chart data: " + smi_stats);
            
    Highcharts.chart('container', {
      chart: {
          type: 'column'
      },
      title: {
          text: 'Salario Mínimo Interprofesional medio en diferentes países'
      },
      xAxis: {
          categories: smi_country_year,
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Unidades Monetarias'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} U.M</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: [{
          name: 'SMI Mon. Local',
          data: smi_local
      }, {
          name: 'SMI Euros',
          data: smi_euros
      }, {
          name: 'SMI % Variación',
          data: smi_variation
      }]
  });
    }
  </script>
  
  <svelte:head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/series-label.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script
    src="https://code.highcharts.com/modules/accessibility.js"
    on:load={loadChart}></script>
  </svelte:head>
  
  <main>
    <Nav>
        <NavItem>
          <NavLink href="/">Página Principal</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/analytics">Gráfica conjunta</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#/smi_stats">Datos</NavLink>
        </NavItem>
    </Nav>
  
    <div>
        <h2>
          Gráfica SMI_STATS
        </h2>
      </div>
  
    <div>
        <figure class="highcharts-figure">
          <div id="container" />
          <p class="highcharts-description">
            Gráfico de columnas que muestran datos del SMI por países.
          </p>
        </figure>
    </div>
    
  
    <div>
      {#if !cargados}
        <p class="error">{errorMsg}</p>
      {/if}
    </div>
  </main>
  
  <style>
    main {
        text-align: center;
        padding: 30px;       
    }
    p.error{
      color: red; 
      text-align:center;
      font-size: 20px;
      margin-top:80px;
    }
    
   
  </style>