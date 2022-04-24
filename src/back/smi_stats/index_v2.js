

    var FAMV_API = "/api/v2/smi_stats";
    var API_DOC_PORTAL = "https://documenter.getpostman.com/view/19481651/UyrAGHTC";
    
    var initial_smi_stats = [
        {
            country: "spain",
            year: 2022,
            smi_local: 1166.70,
            smi_euros: 1166.70,
            smi_variation: 3.63
    
        }, 
        {
            country: "spain",
            year: 2012,
            smi_local: 1166.70,
            smi_euros: 1166.70,
            smi_variation: 3.63
    
        }, 
        {
            country: "china",
            year: 2017,
            smi_local: 2200.0,
            smi_euros: 281.3,
            smi_variation:  47.69
        },
        {
            country: "haiti",
            year: 2013,
            smi_local: 578.0,
            smi_euros: 131.3,
            smi_variation:  7.62
        },
        {
            country: "peru",
            year: 2011,
            smi_local: 798.0,
            smi_euros: 233.3,
            smi_variation:  1.43
        }, 
        {
            country: "venezuela",
            year: 2016,
            smi_local: 23002.0,
            smi_euros: 59.3,
            smi_variation:  -57.23,
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

module.exports.register = (app,db) => {
// GET Documentacion
    app.get(FAMV_API + "/docs", (req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });
// GET DATOS INICIALES
    app.get(FAMV_API + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < initial_smi_stats.length; i++) {
                    db.insert(initial_smi_stats[i]);
                }
                res.sendStatus(200, "OK: Data loaded");
                return;
            }else{
            res.sendStatus(200, "OK: Data loaded previously")
        }
        });
    });


//POST
    app.post(FAMV_API, (req, res) => {

        if (checkBody(req)) {
            res.sendStatus(400, "BAD REQUEST");
        } else {
            db.find({}, function (err, filteredList) {

                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                    return;
                }

                filteredList = filteredList.filter((reg) => {
                    return (req.body.country == reg.country && req.body.year == reg.year)
                });

                if (filteredList.length != 0) {
                    res.sendStatus(409, "CONFLICT");
                } else {
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            });
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
                var listFields = req.query.fields.split(",");
                for(var i = 0; i<listFields.length;i++){
                    var element = listFields[i];
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

app.get(FAMV_API + "/:country", (req, res) => {

    var country = req.params.country
    var year = req.params.year

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }
        filteredList = filteredList.filter((reg) => {
            return (reg.country == country);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //RESULTADO

        //Paginación
        if (req.query.limit != undefined || req.query.offset != undefined) {
            filteredList = paginationMaker(req, filteredList);
            res.send(JSON.stringify(filteredList, null, 2));
        }
        filteredList.forEach((element) => {
            delete element._id;
        });
        //Comprobamos fields
        if(req.query.fields!=null){
            //Comprobamos si los campos son correctos
            var listFields = req.query.fields.split(",");
            for(var i = 0; i<listFields.length;i++){
                var element = listFields[i];
                if(element != "country" && element != "year" && element != "smi_local"  && element != "smi_euros" && element != "smi_variation"){
                    res.sendStatus(400, "BAD REQUEST");
                    return;
                }
            }
            //Escogemos los fields correspondientes
            filteredList = checkFields(req,filteredList);
        }
        res.send(JSON.stringify(filteredList[0], null, 2));
    });
});

//GET CONCRETO CON AÑO

    app.get(FAMV_API + "/:country/:year", (req, res) => {

        var country = req.params.country
        var year = req.params.year

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            filteredList = filteredList.filter((reg) => {
                return (reg.country == country && reg.year == year);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }

            //RESULTADO

            //Paginación
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = paginationMaker(req, filteredList);
                res.send(JSON.stringify(filteredList, null, 2));
            }
            filteredList.forEach((element) => {
                delete element._id;
            });
            //Comprobamos fields
            if(req.query.fields!=null){
                //Comprobamos si los campos son correctos
                var listFields = req.query.fields.split(",");
                for(var i = 0; i<listFields.length;i++){
                    var element = listFields[i];
                    if(element != "country" && element != "year" && element != "smi_local"  && element != "smi_euros" && element != "smi_variation"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = checkFields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList[0], null, 2));
        });
    });



//PUT

app.put(FAMV_API + "/:country/:year", (req, res) => {

    //comprobamos body

    if (checkBody(req)) {
        res.sendStatus(400, "BAD REQUEST");
        return;
    }
    var countryR = req.params.country;
    var yearR = req.params.year;

    db.find({}, function (err, filteredList) {
        if (err) {
            res.sendStatus(500, "ERROR EN CLIENTE");
            return;
        }

        //comprobamos que el elemento exista
        filteredList = filteredList.filter((reg) => {
            return (reg.country == countryR && reg.year == yearR);
        });
        if (filteredList == 0) {
            res.sendStatus(404, "NOT FOUND");
            return;
        }

        //comprobamos que los campos coincidan
        if (countryR != req.body.country || yearR != req.body.year) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        //actualizamos valor
        db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: req.body}, {},function(err) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
            }else{
                res.sendStatus(200,"UPDATED");
            }
        });
    });
});
// PUT INVALIDO
app.put(FAMV_API, (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
});

//DELETE
app.delete(FAMV_API,(req, res)=>{
    db.remove({}, { multi: true }, (err, numRemoved)=>{
        if (err){
            res.sendStatus(500,"ERROR EN CLIENTE");
            return;
        }
        res.sendStatus(200,"DELETED");
        return;
    });
});


//DELETE DE UN RECURSO CONCRETO

app.delete(FAMV_API+"/:country/:year",(req, res)=>{
    var countryR = req.params.country;
    var yearR = req.params.year;

    db.find({country: countryR, year: parseInt(yearR)}, {}, (err, filteredList)=>{
        if (err){
            res.sendStatus(500,"ERROR EN CLIENTE");
            return;
        }
        if(filteredList==0){
            res.sendStatus(404,"NOT FOUND");
            return;
        }
        db.remove({country: countryR, year: parseInt(yearR)}, {}, (err)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
        
            res.sendStatus(200,"DELETED");
            return;
            
        });
    });

});

//DELETE DE UN RECURSO CONCRETO CON AÑO

app.delete(FAMV_API+"/:country/:year",(req, res)=>{
    var country = req.params.country;
    var year = req.params.year;

    db.find({country: country, year: parseInt(year)}, {}, (err, filteredList)=>{
        if (err){
            res.sendStatus(500,"ERROR EN CLIENTE");
            return;
        }
        if(filteredList==0){
            res.sendStatus(404,"NOT FOUND");
            return;
        }
        db.remove({country: country, year: parseInt(year)}, {}, (err)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
        
            res.sendStatus(200,"DELETED");
            return;
            
        });
    });

})

 //FUNCION PARA COMPROBAR LOS CAMPOS DE PETICION

 function checkBody(req) {
    return (req.body.country == null ||
        req.body.year == null ||
        req.body.smi_local == null ||
        req.body.smi_euros == null ||
        req.body.smi_variation == null
    )
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
//FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

function checkFields(req, data){
    var fields = req.query.fields;
    var hasCountry = false;
    var hasYear = false;
    var hasLocal = false;
    var hasEuros = false;
    var hasVariation = false;
    fields = fields.split(",");

    for(var i = 0; i<fields.length;i++){
        var element = fields[i];
        if(element=='country'){
            hasCountry=true;
        }
        if(element=='year'){
            hasYear=true;
        }
        if(element=='smi_local'){
            hasLocal=true;
        }
        if(element=='smi_euros'){
            hasEuros=true;
        }
        if(element=='smi_variation'){
            hasVariation=true;
        }
    }

    //Country
    if(!hasCountry){
        list.forEach((element)=>{
            delete element.country;
        })
    }

    //Year
    if(!hasYear){
        list.forEach((element)=>{
            delete element.year;
        })
    }

    //PE
    if(!hasLocal){
        list.forEach((element)=>{
            delete element.smi_local;
        })
    }

    //PE_to_gdp
    if(!hasEuros){
        list.forEach((element)=>{
            delete element.smi_euros;
        })
    }

    //PE_on_defence
    if(!hasVariation){
        list.forEach((element)=>{
            delete element.smi_variation;
        })
    }

    return list;

}

};