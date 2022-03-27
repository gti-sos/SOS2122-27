module.exports = (app,db) => {

    const ROQUE_BASE_API_URL = "/api/v1/public-expenditure-stats";
    const API_DOC_PORTAL = "";

    var PEStats = [];

    var InitialPEStats = [
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

        //inicializamos el vector
        if(PEStats.length === 0){
            InitialPEStats.forEach((a)=>{
                PEStats.push(a);
            });
        }
        res.send(JSON.stringify(PEStats,null,2));
        
        
        //Obtenemos los elementos
        /*
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
        */
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
        //comprobamos que los parametros existan
        if(
            //Object.keys(req).length != 5 ||
            req.params.country == null ||
            req.params.year == null ||
            req.params.public_expenditure == null ||
            req.params.pe_to_gdp == null ||
            req.params.pe_on_defence == null
        ){
            res.sendStatus(400,"BAD REQUEST");  
        }

        filteredPEStats = PEStats.filter((stat)=>{
            return (
                stat.country == req.params.country && 
                stat.year == req.params.year &&
                stat.public_expenditure == req.params.public_expenditure &&
                stat.pe_to_gdp == req.params.pe_to_gdp &&
                stat.pe_on_defence == req.params.pe_on_defence
                );
        })

        if(filteredPEStats.length === 0){
            PEStats.push(req.body);
            res.sendStatus(201,"CREATED");
        }else{
            res.sendStatus(409,"CONFLICT");
        }
    });

    //POST NO PERMITIDO

    app.post(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {

        //comprobamos que los parametros existan
        if(
            //Object.keys(req).length != 5 ||
            req.params.country == null ||
            req.params.year == null ||
            req.params.public_expenditure == null ||
            req.params.pe_to_gdp == null ||
            req.params.pe_on_defence == null
        ){
            res.sendStatus(400,"BAD REQUEST");  
        }

        existsStat = PEStats.filter((stat)=>{
            return (
                stat.country == req.params.country && 
                stat.year == req.params.year
                );
        })

        var indice = PEStats.indexOf(existsStat[0]);

        if(existsStat.length === 0){
            res.sendStatus(404,"NOT FOUND");
        }
        else{
            PEStats[indice].pe_on_defence = req.params.pe_on_defence;
            PEStats[indice].pe_to_gdp = req.params.pe_to_gdp;
            PEStats[indice].public_expenditure = req.params.public_expenditure;
            res.sendStatus(200,"OK");
        } 
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
            return (stat.country != req.params.year && stat.year != req.params.year);
        })
        res.sendStatus(200,"OK");
    
    });

};