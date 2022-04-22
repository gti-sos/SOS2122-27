module.exports = (app,db) => {

    const ROQUE_BASE_API_URL = "/api/v1/public-expenditure-stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/8975262/UVyn2yyn";

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
            year: 2018,
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

    var PEStats = InitialPEStats;

    //DOCUMENTACION DE LA API
    
    app.get(ROQUE_BASE_API_URL+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

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

    

    //GET DE UN RECURSO CONCRETO
    
    app.get(ROQUE_BASE_API_URL+"/:country/:year",(req,res)=>{
        filteredPEStats = PEStats.filter((stat)=>{
            return (stat.country == req.params.country && stat.year == req.params.year);
        })
        if(filteredPEStats.length === 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            //se devuelve un unico objeto
            res.send(JSON.stringify(filteredPEStats[0], null, 2));
        }
    });

    //GET GENERAL
    
    app.get(ROQUE_BASE_API_URL, (req,res) => {
        //hay busqueda
        if(Object.keys(req.query).length > 0){
            console.log("Query:",req.query);
            selectedStats = filterQuery(req,PEStats);

            if(req.query.limit != undefined || req.query.offset != undefined){
                selectedStats = paginationMaker(req,selectedStats);
            }
        }
        //no hay busqueda
        else{
            selectedStats = PEStats;
        }

        if(selectedStats.includes("ERROR")) {
            res.sendStatus(400,"BAD REQUEST"); 
        } else if(selectedStats.length === 0) {
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(selectedStats, null, 2));
        } 
    });

    //POST CORRECTO
    
    app.post(ROQUE_BASE_API_URL, (req,res) => {
        //comprobamos que los parametros existan
        if( 
            Object.keys(req.body).length != 5 ||
            req.body.country == null ||
            req.body.year == null ||
            req.body.public_expenditure == null ||
            req.body.pe_to_gdp == null ||
            req.body.pe_on_defence == null
        ){ 
            res.sendStatus(400,"BAD REQUEST");  
        }else{
            filteredPEStats = PEStats.filter((stat)=>{
                return (
                    stat.country == req.body.country && 
                    stat.year == req.body.year &&
                    stat.public_expenditure == req.body.public_expenditure &&
                    stat.pe_to_gdp == req.body.pe_to_gdp &&
                    stat.pe_on_defence == req.body.pe_on_defence
                    );
            })
    
            if(filteredPEStats.length === 0){
                PEStats.push(req.body);
                res.sendStatus(201,"CREATED");
            }else{
                res.sendStatus(409,"CONFLICT");
            }
        }
    });

    //POST NO PERMITIDO

    app.post(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {

        //comprobamos que los parametros del req existan
        if(
            Object.keys(req.body).length != 5 ||
            req.body.country == null ||
            req.body.year == null ||
            req.body.public_expenditure == null ||
            req.body.pe_to_gdp == null ||
            req.body.pe_on_defence == null
        ){ 
            res.sendStatus(400,"BAD REQUEST");  
        }else{
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
                PEStats[indice].pe_on_defence = req.body.pe_on_defence;
                PEStats[indice].pe_to_gdp = req.body.pe_to_gdp;
                PEStats[indice].public_expenditure = req.body.public_expenditure;
                res.sendStatus(200,"OK");
            } 
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
        PEStats = PEStats.filter((stat)=>{
            return (stat.country != req.params.country || stat.year != req.params.year);
        })
        res.sendStatus(200,"OK");
    
    });

    //FUNCION DE FILTRADO
    function filterQuery(req,stats){
        filteredStats = stats.filter((stat)=>{
            
            var flag = true;

            if(req.query.year != undefined) {
                if(stat.year != req.query.year)  {
                    flag = false;
                }
            }
            if(req.query.country != undefined) {
                if(stat.country != req.query.country)  {
                    flag = false;
                }
            }
            if(req.query.public_expenditure != undefined) {
                if(stat.public_expenditure != req.query.public_expenditure)  {
                    flag = false;
                }
            }
            if(req.query.pe_to_gdp != undefined) {
                if(stat.pe_to_gdp != req.query.pe_to_gdp)  {
                    flag = false;
                }
            }
            if(req.query.pe_on_defence != undefined) {
                if(stat.pe_on_defence != req.query.pe_on_defence)  {
                    flag = false;
                }
            }
            return flag  
        });
        return filteredStats;
    }

    //FUNCION DE PAGINACION

    function paginationMaker(req, stats) {
        var res = [];
        const offset = req.query.offset;
        const limit = req.query.limit;
    
        if(limit < 0 || offset < 0 || offset > stats.length) {
            console.error(`Error in pagination, you have exceded limits`);
            res.push("ERROR");
            return res;	
        }
        const startIndex = offset;
        const endIndex = startIndex + limit;
    
        res = stats.slice(startIndex, endIndex);
        return res;
    }

    function paginationMaker(req, stats) {
        var res = [];
        const offset = req.query.offset;
        const limit = req.query.limit;
    
        if(limit < 0 || offset < 0 || offset > stats.length) {
            console.error(`Error in pagination, you have exceded limits`);
            res.push("ERROR");
            return res;	
        }
        const startIndex = offset;
        const endIndex = startIndex + limit;
    
        res = stats.slice(startIndex, endIndex);
        return res;
    }

};
