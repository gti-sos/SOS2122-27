<script>
    import { onMount } from "svelte";
    import {Navbar, Nav, NavItem, NavLink, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Button} from 'sveltestrap';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    

    let xLabel = [];
    let smi_stats=[];
    let country=[];

    let smi_local=["Mon. Local"];
    let smi_euros=["Smi Euros"];
    let smi_variation=["Variacion %"];


   

    

    async function loadChart(){
        const smiData = await fetch("/api/v2/smi_stats");

        if (smiData.ok){
            smi_stats = await smiData.json();
            

            //smi
            smi_stats.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
            smi_stats.sort((a,b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
            smi_stats.forEach(element=>{
                smi_local.push(parseFloat(element.smi_local));
                smi_euros.push(parseFloat(element.smi_euros));
                smi_variation.push(parseFloat(element.smi_variation));
            });
            

            smi_stats.forEach(element =>{
                xLabel.push(element.country+","+parseInt(element.year));
            });
            

            xLabel=new Set(xLabel);
            xLabel=Array.from(xLabel);
            xLabel.sort();
            await delay(500);
            loadGraph();
        }   
    }



    async function loadGraph() {
        var chart = bb.generate({
        data: {
            columns: [
            ["data1", 30],
	        ["data2", 120],
            ["data3", 210],
          ],
          type: "area-spline",
         
          onclick: function(d, i) {
          console.log("onclick", d, i);
         },
          onover: function(d, i) {
          console.log("onover", d, i);
         },
          onout: function(d, i) {
          console.log("onout", d, i);
         }
        },
        axis: {
            x: {
                type: "category",
                categories: xLabel
            },
        },
        bindto: "#areaChart"
      });
      
      setTimeout(function() {
          chart.load({
              columns: [
                  smi_euros,
                  smi_local,
                  smi_variation,
              ]
          });
      });
      
      setTimeout(function() {
        chart.unload({ ids: "data1" });
	    chart.unload({ ids: "data2" });
        chart.unload({ ids: "data3" });
      }, 500);
    }

    onMount(loadChart);
</script>

<svelte:head>
    <script type="text/javascript" src="https://d3js.org/d3.v6.min.js"></script>
    <link rel="stylesheet" href="./billboard.js/dist/billboard.css">
    <link rel="stylesheet" href="./billboard.js/dist/theme/insight.css">
    <script type="text/javascript" src="./billboard.js/dist/billboard.js" on:load="{loadGraph}"></script>
    
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
            <NavLink href="#/charts">Gráficas personales</NavLink>
          </NavItem>
        <NavItem>
          <NavLink href="#/smi_stats">Datos</NavLink>
        </NavItem>
    </Nav>
    <div>
        <h2>
          Gráfica SMI_STATS con Billboard.js
        </h2>
      </div>
    <div id="areaChart"></div>
    <br>
    <br>
    <p> Gráfico de columnas que muestran datos del SMI por países.
    </p>
</main>