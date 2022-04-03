module.exports = (app,db) => {
    const JF_API_URL = "/api/v1/public-debt-stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/14853996/UVypzxct";

    var DebtStats = [];

    var initial_DebtStat = [
        {
            country: "espana",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 120,
            per_capita_debt: 28393    
        },   
        {
            country: "alemania",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 120,
            per_capita_debt: 28393    
        }, 
        {
            country: "francia",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 120,
            per_capita_debt: 28393    
        }, 
        {
            country: "italia",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 120,
            per_capita_debt: 28393    
        }, 
        {
            country: "portugal",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 120,
            per_capita_debt: 28393    
        }, 
    ];

    //DOCUMENTACION DE LA API

    //Por persona: 10.
    app.get(JF_API_URL + "/docs", (req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //LOAD INITIAL DATA

    app.get(JF_API_URL + "/loadInitialData", (req,res) => {
        //inicializamos el vector
        if(DebtStats.length === 0){
            initial_DebtStat.forEach((a)=>{
                DebtStats.push(a);
            });
        }
        res.send(JSON.stringify(DebtStats,null,2));
    });

    //GET GENERAL
    
    app.get(JF_API_URL, (req,res) => {

        if(Object.keys(req.query).length > 0){
            console.log("Query:",req.query);
            selectedStats = filterQuery(req,DebtStats);
            
            if(req.query.limit != undefined || req.query.offset != undefined){
                selectedStats = paginationMaker(req,selectedStats);
            }

        }else{
            selectedStats = DebtStats;
        }

        if(selectedStats.includes("ERROR")) {
            res.sendStatus(400,"BAD REQUEST"); 
        } else if(selectedStats.length === 0) {
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(selectedStats, null, 2));
        } 

    });

    //GET DE LOS DATOS DE UN PAIS
    
    app.get(JF_API_URL + "/:country",(req,res)=>{
        filteredDebtStats = DebtStats.filter((stat)=>{
            return (stat.country == req.params.country);
        })
        if(filteredDebtStats == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            res.send(JSON.stringify(filteredDebtStats, null, 2));
        }
        
    });

    //GET DE UN RECURSO CONCRETO
    
    app.get(JF_API_URL + "/:country/:year",(req,res)=>{
        filteredDebtStats = DebtStats.filter((stat)=>{
            return (stat.country == req.params.country && stat.year == req.params.year);
        })
        if(filteredDebtStats == 0){
            res.sendStatus(404,"NOT FOUND");
        }else{
            //se devuelve un unico objeto
            res.send(JSON.stringify(filteredDebtStats[0], null, 2));
        }
    });

    //POST CORRECTO
    
    app.post(JF_API_URL, (req,res) => {
        //comprobamos que los parametros existan
        if( 
            Object.keys(req.body).length != 5 ||
            req.body.country == null ||
            req.body.year == null ||
            req.body.total_debt == null ||
            req.body.debt_gdp == null ||
            req.body.per_capita_debt == null
        ){ 
            res.sendStatus(400,"BAD REQUEST");  
        }else{
            filteredDebtStats = DebtStats.filter((stat)=>{
                return (
                    stat.country == req.body.country && 
                    stat.year == req.body.year &&
                    stat.total_debt == req.body.total_debt &&
                    stat.debt_gdp == req.body.debt_gdp &&
                    stat.per_capita_debt == req.body.per_capita_debt
                    );
            })
    
            if(filteredDebtStats.length === 0){
                DebtStats.push(req.body);
                res.sendStatus(201,"CREATED");
            }else{
                res.sendStatus(409,"CONFLICT");
            }
        }
    });

    //POST NO PERMITIDO

    app.post(JF_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(JF_API_URL +"/:country/:year", (req,res) => {

    //comprobamos que los parametros del req existan
    if(
        Object.keys(req.body).length != 5 ||
        req.body.country == null ||
        req.body.year == null ||
        req.body.total_debt == null ||
        req.body.debt_gdp == null ||
        req.body.per_capita_debt == null
    ){ 
        res.sendStatus(400,"BAD REQUEST");  
    }else{
        existsStat = DebtStats.filter((stat)=>{
            return (
                stat.country == req.params.country && 
                stat.year == req.params.year
                );
        })

        var indice = DebtStats.indexOf(existsStat[0]);

        if(existsStat.length === 0){
            res.sendStatus(404,"NOT FOUND");
        }
        else{
            DebtStats[indice].total_debt = req.body.total_debt;
            DebtStats[indice].debt_gdp = req.body.debt_gdp;
            DebtStats[indice].per_capita_debt = req.body.per_capita_debt;
            res.sendStatus(200,"OK");
        } 
    }   
    });

    //PUT NO PERMITIDO

    app.put(JF_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

     //DELETE GENERAL

     app.delete(JF_API_URL,(req,res)=>{
        DebtStats = []
        res.sendStatus(200,"OK");
    
    });

    //DELETE DE UN RECURSO CONCRETO
    
    app.delete(JF_API_URL + "/:country/:year",(req,res)=>{
        DebtStats = DebtStats.filter((stat)=>{
            return (stat.country != req.params.country || stat.year != req.params.year);
        })
        res.sendStatus(200,"OK");
    
    });

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
                if(statpe_on_defence != req.query.pe_on_defence)  {
                    flag = false;
                }
            }
            return flag  
        });
        return filteredStats;
    }
};