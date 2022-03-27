module.exports = (app,db) => {

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
            country: "espana",
            year: 2019,
            public_expenditure: 524037.0,
            pe_to_gdp: 42.1,
            pe_on_defence: 2.94
    
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

    //LOAD INITIAL DATA

    app.get(ROQUE_BASE_API_URL + "/loadInitialData", (req,res) => {
        
        //Obtenemos los elementos
        db.find({}, (error)=>{ 

            if(error){
                console.log("Error en Load Initial Data");
                res.sendStatus(500); 
            }
            else{
                dataBase.remove({}, {multi: true});
                dataBase.insert(PEStats);
                res.sendStatus(200,"Datos correctamente cargados a la BD");                        
            }
        }); 
    });

    //GET GENERAL
    
    app.get(ROQUE_BASE_API_URL, (req,res) => {
        res.send(JSON.stringify(PEStats, null, 2));
    });

    //GET DE LOS DATOS DE UN PAIS
    
    app.get(ROQUE_BASE_API_URL+"/:country",(req,res)=>{
        filteredPEStats = PEStats.filter((stat)=>{
            return (stat.country == req.params.country);
        })
        if(filteredPEStats == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredPEStats, null, 2));
        }
        
    });

    //GET DE UN RECURSO CONCRETO
    
    app.get(ROQUE_BASE_API_URL+"/:country/:year",(req,res)=>{
        filteredPEStats = PEStats.filter((stat)=>{
            return (stat.country == req.params.country && stat.year == req.params.year);
        })
        if(filteredPEStats == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredPEStats, null, 2));
        }
    });

    //DOCUMENTACION DE LA API
    
    app.get(ROQUE_BASE_API_URL+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //POST CORRECTO
    
    app.post(ROQUE_BASE_API_URL, (req,res) => {
        PEStats.push(req.body);
        res.sendStatus(201,"CREATED");
    });

    //POST NO PERMITIDO

    app.post(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {

        //aqui va el codigo

        res.sendStatus(200,"OK");
    });

    //PUT NO PERMITIDO

    app.put(ROQUE_BASE_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE GENERAL

    app.delete(ROQUE_BASE_API_URL,(req,res)=>{
        PEStats = []
        res.sendStatus(200,"OK");
    
    });

    //DELETE DE UN RECURSO CONCRETO
    
    app.delete(ROQUE_BASE_API_URL + "/:country/:year",(req,res)=>{
        PEStats.filter((stat)=>{
            return (stat.country != req.params.year || stat.year != req.params.year);
        })
        res.sendStatus(200,"OK");
    
    });

};