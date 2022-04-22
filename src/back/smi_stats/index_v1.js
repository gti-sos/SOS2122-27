module.exports = (app,db) => {

    const FAMV_API = "/api/v1/smi_stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19481651/UVyn3K1F";
    
    var smi_stats = []
    var initial_smi_stats = [
        {
            country: "spain",
            year: 2022,
            smi_local: 1166.70,
            smi_euros: 1166.70,
            smi_variation: 3.63
    
        },  
        {
            country: "china",
            year: 2020,
            smi_local: 2200.0,
            smi_euros: 281.3,
            smi_variation:  47.69
        },
        {
            country: "UK",
            year: 2021,
            smi_local: 1536.2,
            smi_euros: 1708.7,
            smi_variation:  7.92
        },
        {
            country: "bolivia",
            year: 2019,
            smi_local: 2122.0,
            smi_euros: 270.3,
            smi_variation:  7.49
        },
        {
            country: "brazil",
            year: 2022,
            smi_local: 1212.0,
            smi_euros: 192.1,
            smi_variation:  11.29
        },
    ];

   //var smi_stats = initial_smi_stats;
    
// GET Documentacion
    app.get(FAMV_API + "/docs", (req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });
// GET DATOS INICIALES
    app.get(FAMV_API + "/loadInitialData", (req,res) => {
        
        if(smi_stats.length === 0){
            initial_smi_stats.forEach((a)=>{
                smi_stats.push(a);
            });
        }
        res.send(JSON.stringify(smi_stats,null,2)); 
    });


//POST
app.post(FAMV_API,(req,res)=>{
    if(
        req.body.country == null ||
        req.body.year == null ||
        req.body.smi_euros == null ||
        req.body.smi_local == null ||
        req.body.smi_variation == null
    ){ 
        res.sendStatus(400,"BAD REQUEST");  
    }else{
        filteredSMI = smi_stats.filter((stat)=>{
            return (
                stat.country == req.body.country && 
                stat.year == req.body.year &&
                stat.smi_euros == req.body.smi_euros &&
                stat.smi_local == req.body.smi_local &&
                stat.smi_variation == req.body.smi_variation
                );
        })

        if(filteredSMI.length === 0){
            smi_stats.push(req.body);
            res.sendStatus(201,"CREATED");
        }else{
            res.sendStatus(409,"CONFLICT");
        }
    }
});

//POST ERROR

app.post(FAMV_API +"/:country/:year", (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//GET GENERAL
   
app.get(FAMV_API, (req,res) => {

    console.log("Obteniendo smi_stats..");
    var query = req.query;
    for(i in query){
        if (i == 'year') {
            query[i] = parseInt(query[i]);
          } else if (i == 'smi_local') {
            query[i] = parseFloat(query[i]);
          } else if (i == 'smi_euros') {
            query[i] = parseFloat(query[i]);
          } else if (i == 'smi_variation') {
            query[i] = parseFloat(query[i]);
          }
        }
        //Paginacion
        var limit = query.limit;
        var offset = query.offset;
        delete query.offset;
        delete query.limit;

        db.find(query).skip(offset).limit(limit).exec((errro, smi_stats) =>{
            if (error){
                console.error("Error accediendo a DB con GET")
                res.sendStatus(500);
            }
            smi_stats.forEach((r) =>{
                delete r._id;
            });

            res.status(200).send(JSON.stringify(smi_stats, null, 2));
            console.log("Datos enviados: " + JSON.stringify(smi_stats, null, 2));
        });

        console.log("OK.");

          
    });


    /*
    if(Object.keys(req.query).length > 0){
        console.log("Query:",req.query);
        selectedStats = filterQuery(req,smi_stats);

        if(req.query.limit != undefined || req.query.offset != undefined){
            selectedStats = paginationMaker(req,selectedStats);
        }
    }

    else{
        selectedStats = smi_stats;
    }

    if(selectedStats.includes("ERROR")) {
        res.sendStatus(400,"BAD REQUEST"); 
    } else if(selectedStats.length === 0) {
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(selectedStats, null, 2));
    } */


//GET CONCRETO

app.get(FAMV_API+"/:country",(req,res)=>{
    filteredSMI = smi_stats.filter((stat)=>{
        return (stat.country == req.params.country);
    })
    if(filteredSMI == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredSMI, null, 2));
    }

});

//GET CONCRETO CON AÑO

app.get(FAMV_API+"/:country/:year",(req,res)=>{
    filteredSMI = smi_stats.filter((stat)=>{
        return (stat.country == req.params.country && stat.year == req.params.year);
    })
    if(filteredSMI == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredSMI[0], null, 2));
    }
});



//PUT

app.put(FAMV_API +"/:country/:year", (req,res) => {

    //comprobamos que los parametros del req existan
    if(
        req.body.country == null ||
        req.body.year == null ||
        req.body.smi_euros == null ||
        req.body.smi_local == null ||
        req.body.smi_variation == null
    ){ 
        res.sendStatus(400,"BAD REQUEST");  
    }else{
        existsStat = smi_stats.filter((stat)=>{
            return (
                stat.country == req.params.country && 
                stat.year == req.params.year
                );
        })

        var indice = smi_stats.indexOf(existsStat[0]);

        if(existsStat.length === 0){
            res.sendStatus(404,"NOT FOUND");
        }
        else{
            smi_stats[indice].smi_euros = req.body.smi_euros;
            smi_stats[indice].smi_local = req.body.smi_local;
            smi_stats[indice].smi_variation = req.body.smi_variation;
            res.sendStatus(200,"OK");
        } 
    }   
});
// PUT INVALIDO
app.put(FAMV_API, (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//DELETE
app.delete(FAMV_API,(req,res)=>{
    smi_stats = []
    res.sendStatus(200,"OK");
});


//DELETE DE UN RECURSO CONCRETO

app.delete(FAMV_API+"/:country",(req,res)=>{
    var SMIcountry = req.params.country;
    smi_stats.filter((stat)=>{
        return (stat.country != SMIcountry);
    })
    res.sendStatus(200,"OK");

});

//DELETE DE UN RECURSO CONCRETO CON AÑO

app.delete(FAMV_API + "/:country/:year",(req,res)=>{
    smi_stats = smi_stats.filter((stat)=>{
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
        if(req.query.smi_euros != undefined) {
            if(stat.smi_euros != req.query.smi_euros)  {
                flag = false;
            }
        }
        if(req.query.smi_local != undefined) {
            if(stat.smi_local != req.query.smi_local)  {
                flag = false;
            }
        }
        if(req.query.smi_variation != undefined) {
            if(stat.smi_variation != req.query.smi_variation)  {
                flag = false;
            }
        }
        return flag  
    });
    return filteredStats;
}

//FUNCION DE PAGINACION
/*
function paginationMaker(req, stats) {
    var res = [];
    const offset = req.query.offset;
    const limit = req.query.limit;

    if(limit < 0 || offset < 0 || offset > stats.length) {
        console.error(`Error in pagination, you have exceded limits`);
        res.push("ERROR");
        return res;	
    }


    res = stats.slice(offset, limit+offset);
    return res;
}*/

};