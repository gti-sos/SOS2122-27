module.exports = (app,db) => {

    const FAMV_API = "/api/v2/smi_stats";
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
        }
    ];

   //var smi_stats = initial_smi_stats;
    
// GET Documentacion
    app.get(FAMV_API + "/docs", (req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });
// GET DATOS INICIALES
app.get(FAMV_API + "/loadInitialData", (req, res) => {

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }
        if (filteredList == 0) {
            for (var i = 0; i < initial_smi_stats.length; i++) {
                db.insert(initial_smi_stats[i]);
            }
            res.sendStatus(200, "OK.");
            return;
        }else{
        res.sendStatus(200, "Ya inicializados")
    }
    });
})


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

    var query = req.query;
    var year = query.year;
    var from = query.from;
    var to = query.to;
    
    //Comprobamos query

    for (var i = 0; i < Object.keys(req.query).length; i++) {
        var element = Object.keys(req.query)[i];
        if (element != "year" && element != "from" && element != "to" && element != "limit" && element != "offset") {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
    }


    //Comprobamos si from es mas pequeño o igual a to
    if (from > to) {
        res.sendStatus(400, "BAD REQUEST");
        return;
    }
    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }

        // Apartado para búsqueda por año
        if (year != null) {
            var filteredList = filteredList.filter((reg) => {
                return (reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
        }

        // Apartado para from y to
        if (from != null && to != null) {
            filteredList = filteredList.filter((reg) => {
                return (reg.year >= from && reg.year <= to);
            });

            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }
        }

        // Resultado sin ID
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginationMaker(req, filteredList);
        }
        filteredList.forEach((element) => {
            delete element._id;
        });

        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listaFields = req.query.fields.split(",");
            for(var i = 0; i<listaFields.length;i++){
                var element = listaFields[i];
                if(element != "country" && element != "year" && element != "smi_local"  && element != "smi_euros" && element != "smi_variation"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los campos correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList, null, 2));
    })
});
    




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

function paginationMaker(req, stats) {
    var res = [];
    var limit = req.query.limit;
    var offset = req.query.offset;
    
    if(limit < 1 || offset < 0 || offset > stats.length){
        res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
        return res;
    }

    //limit no definido
    if(limit == undefined && offset != undefined){
        limit = stats.length - offset;
    }
    //offset no definido
    else if(limit != undefined && offset == undefined){
        offset = 0;
    }

    res = stats.slice(offset,parseInt(limit)+parseInt(offset));
    return res;
}

    

};