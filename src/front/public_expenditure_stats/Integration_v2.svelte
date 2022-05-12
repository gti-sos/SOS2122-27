<script>
    import {onMount} from 'svelte';

    const delay = ms => new Promise(res => setTimeout(res,ms));

    let data = [];
    let pares = [];
    let impares = [];
    
    let number = 
        {
            name: '',
            value: 0
        }
    

    async function getData(){
        console.log("Fetching data....");
        const res = await fetch("https://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=50");
        if(res.ok){
            const info = await res.json();

            data = info;
            //clasificamos los numeros obtenidos
            data.forEach(element => {
                let number = 
                {
                    name: element.toString(),
                    value: element
                }
                if(element%2 == 0)
                    pares.push(number);
                else
                    impares.push(number)
                
            });

            console.log("Data:", data);
            console.log("Impares: ", impares);
            console.log("Pares: ",pares);
            
            //esperamos a que se carguen 
            await delay(1000);
            loadGraph();
            
                    
        }else{
            console.log("Error cargando los datos");
		}
    }

    function loadGraph(){
        Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '{point.name}'
        },
        plotOptions: {
            packedbubble: {
                minSize: '30%',
                maxSize: '120%',
                zMin: 0,
                zMax: 1000,
                layoutAlgorithm: {
                    splitSeries: false,
                    gravitationalConstant: 0.02
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [{
            name: 'Pares',
            data: pares
        }, {
            name: 'Impares',
            data: impares
    
        }]
    });
    }

    
    

    onMount(getData);
    
</script>

<svelte:head>
    
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<main>
    <h1>Integración 2</h1>
    <h2>Números aleatorios dividos en pares e impares</h2>
    
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>

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

