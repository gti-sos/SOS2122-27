module.exports = (app) => {

    const ROQUE_BASE_API_URL = "/api/v1/public-expenditure-stats";

    const API_DOC_PORTAL = "";

    var PEStats = [
        {
            country: "espana",
            year: 2020,
            public_expenditure: 588279.0,
            pe_to_gdp: 52.4,
            pe_on_defence: 2.66
    
        },
        {
            country: "alemania",
            year: 2020,
            public_expenditure: 1712131.0,
            pe_to_gdp: 50.8,
            pe_on_defence: 2.6
    
        },
        {
            country: "francia",
            year: 2020,
            public_expenditure: 1419593.0,
            pe_to_gdp: 61.6,
            pe_on_defence: 3.29
    
        },
        {
            country: "italia",
            year: 2020,
            public_expenditure: 944486.0,
            pe_to_gdp: 57.1,
            pe_on_defence: 2.63
    
        },
        {
            country: "portugal",
            year: 2020,
            public_expenditure: 98725.0,
            pe_to_gdp: 49.3,
            pe_on_defence: 4.16
    
        } 
    ];

    //VARIABLES DE LA BD

    var Datastore = require("nedb");

    const dbFileName = path.join(__dirname,"public_expenditure_stats.db");

    const db = new Datastore({
        filename: dbFileName, 
        autoload: true
    });

    var statCountry = req.params.country;
    var statYear = req.params.year;


    //LOAD INITIAL DATA

    app.get(ROQUE_BASE_API_URL + "/loadInitialData", (req,res) => {
        db.find({}, (error, ee_db)=>{ // Comprobamos si los elementos están

            if(error){
                console.log("Se ha producido un error de servdor al hacer petición Get all");
                res.sendStatus(500); //Error de servidor
            }
            else{
                dataBase.remove({}, {multi: true});
                dataBase.insert(datos_EE);
                res.sendStatus(200);                        
            }
        }); 
        dbFood.insert(PEStats);
        res.send("Datos correctamente cargados");
    });

    //GET
    
    app.get(ROQUE_BASE_API_URL, (req,res) => {
        res.send(JSON.stringify(PEStats, null, 2));
    });
    
    app.get(BASE_API_URL+"/:country/:year",(req,res)=>{
        filteredPEStats = PEStats.filter((stat)=>{
            return (stat.country.year == statCountryYear);
        })
        res.send(JSON.stringify(PEStats, null, 2));
    });
    
    app.get(BASE_API_URL+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //POST
    
    app.post(ROQUE_BASE_API_URL, (req,res) => {
        PEStats.push(req.body);
        res.sendStatus(201,"CREATED");
    });

    app.post(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT

    app.put(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {

        //aqui va el codigo

        res.sendStatus(200,"OK");
    });

    app.put(ROQUE_BASE_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE

    app.delete(BASE_API_URL,(req,res)=>{
        PEStats = []
        res.sendStatus(200,"OK");
    
    });
    
    app.delete(BASE_API_URL + "/:country/:year",(req,res)=>{
        PEStats.filter((stat)=>{
            return (stat.country.year != statCountryYear);
        })
        res.sendStatus(200,"OK");
    
    });

};