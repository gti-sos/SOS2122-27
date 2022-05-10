    const request = require('request');


    const ROQUE_BASE_API_URL = "/api/v2/public-expenditure-stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/8975262/Uyr8nyWh";

    var initialPEStats = [
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
            public_expenditure: 526613.0,
            pe_to_gdp: 42.1,
            pe_on_defence: 2.94
    
        },
        {
            country: "espana",
            year: 2018,
            public_expenditure: 503308.0,
            pe_to_gdp: 41.8,
            pe_on_defence: 2.23
    
        },
        {
            country: "espana",
            year: 2017,
            public_expenditure: 480036.0,
            pe_to_gdp: 41.3,
            pe_on_defence: 2.2
    
        },
        {
            country: "espana",
            year: 2016,
            public_expenditure: 473145.0,
            pe_to_gdp: 42.5,
            pe_on_defence: 1.91
    
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
    
        },
        {
            country: "brasil",
            year: 2020,
            public_expenditure: 544871.3,
            pe_to_gdp: 42.87,
            pe_on_defence: 3.21
    
        },
        {
            country: "belgica",
            year: 2020,
            public_expenditure: 277969.3,
            pe_to_gdp: 54.8,
            pe_on_defence: 1.78
    
        },
        {
            country: "finlandia",
            year: 2018,
            public_expenditure: 124491.0,
            pe_to_gdp: 53.3,
            pe_on_defence: 2.66
    
        },
        {
            country: "grecia",
            year: 2018,
            public_expenditure: 87133.0,
            pe_to_gdp: 48.5,
            pe_on_defence: 5.23
    
        },
        {
            country: "austria",
            year: 2018,
            public_expenditure: 40033.0,
            pe_to_gdp: 47.5,
            pe_on_defence: 2.23
    
        }


    ];

    var PEStats = initialPEStats;

    //VARIABLES PARA LAS INTEGRACIONES

    var extPathV1='/remoteAPIV1';
    var extApiServerHostV1 = 'https://sos2122-pfm.herokuapp.com/api/v1/contacts';


module.exports.register = (app,db) => {

    //INTEGRACIONES

    app.use(extPathV1, function(req, res) {
        var url = extApiServerHostV1 + req.url;
        console.log('piped: ' + req.baseUrl + req.url);
        req.pipe(request(url)).pipe(res);
    });

    

    //DOCUMENTACION DE LA API
    
    app.get(ROQUE_BASE_API_URL+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //LOAD INITIAL DATA

    app.get(ROQUE_BASE_API_URL + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "ERROR EN CLIENTE");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < initialPEStats.length; i++) {
                    db.insert(initialPEStats[i]);
                }
                res.sendStatus(200, "OK.");
                return;
            }else{
            res.sendStatus(200, "Ya inicializados")
        }
        });
    })

    //GET GENERAL
    
    app.get(ROQUE_BASE_API_URL, (req, res) => {

        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

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
                //comprobamos que haya elementos
                if (filteredList == 0) {
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
                    
            }

            // Apartado para from y to
            if (from != undefined || to != undefined) {
                if(from != undefined && to == undefined){
                    to = 100000000;
                }
                else if(from == null && to != null){
                    from = 0;
                }
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

                //comprobamos que haya elementos
                if (filteredList == 0) {
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
            }

            

            // Resultado sin ID
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = pagingMaker(req, filteredList);
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
                    if(element != "country" && element != "year" && element != "public_expenditure"  && element != "pe_on_defence" && element != "pe_to_gdp"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los campos correspondientes
                filteredList = checkFields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList, null, 2));
        })
    })

    //GET DE UN RECURSO CONCRETO
    
    app.get(ROQUE_BASE_API_URL + "/:country/:year", (req, res) => {

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
                filteredList = pagingMaker(req, filteredList);
                res.send(JSON.stringify(filteredList, null, 2));
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
                    if(element != "country" && element != "year" && element != "public_expenditure"  && element != "pe_on_defence" && element != "pe_to_gdp"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los fields correspondientes
                filteredList = checkFields(req,filteredList);
            }
            res.send(JSON.stringify(filteredList[0], null, 2));
        });
    })

    //POST CORRECTO
    
    app.post(ROQUE_BASE_API_URL, (req, res) => {

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
                })

                if (filteredList.length != 0) {
                    res.sendStatus(409, "CONFLICT");
                } else {
                    db.insert(req.body);
                    res.sendStatus(201, "CREATED");
                }
            })
        }
    })

    //POST NO PERMITIDO

    app.post(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(ROQUE_BASE_API_URL + "/:country/:year", (req, res) => {

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
        })
    })

    //PUT NO PERMITIDO

    app.put(ROQUE_BASE_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE GENERAL

    app.delete(ROQUE_BASE_API_URL,(req, res)=>{
        db.remove({}, { multi: true }, (err, numRemoved)=>{
            if (err){
                res.sendStatus(500,"ERROR EN CLIENTE");
                return;
            }
            res.sendStatus(200,"DELETED");
            return;
        });
    })

    //DELETE DE UN RECURSO CONCRETO
    
    app.delete(ROQUE_BASE_API_URL+"/:country/:year",(req, res)=>{
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

    })

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

    function pagingMaker(req, list){
        var res = [];
        var limit = req.query.limit;
        var offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > list.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }

        //limit no definido
        if(limit == undefined && offset != undefined){
            limit = list.length - offset;
        }
        //offset no definido
        else if(limit != undefined && offset == undefined){
            offset = 0;
        }

        res = list.slice(offset,parseInt(limit)+parseInt(offset));
        return res;
    }

    //FUNCION PARA COMPROBAR LOS CAMPOS DE PETICION

    function checkBody(req) {
        return (req.body.country == null ||
            req.body.year == null ||
            req.body.public_expenditure == null ||
            req.body.pe_to_gdp == null ||
            req.body.pe_on_defence == null
        )
    }

    //FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

    function checkFields(req, lista){
        var fields = req.query.fields;
        var hasCountry = false;
        var hasYear = false;
        var hasPE = false;
        var hasPEToGDP = false;
        var hasPEOnDefence = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                hasCountry=true;
            }
            if(element=='year'){
                hasYear=true;
            }
            if(element=='public_expenditure'){
                hasPE=true;
            }
            if(element=='pe_to_gdp'){
                hasPEToGDP=true;
            }
            if(element=='pe_on_defence'){
                hasPEOnDefence=true;
            }
        }

        //Country
        if(!hasCountry){
            lista.forEach((element)=>{
                delete element.country;
            })
        }

        //Year
        if(!hasYear){
            lista.forEach((element)=>{
                delete element.year;
            })
        }

        //PE
        if(!hasPE){
            lista.forEach((element)=>{
                delete element.public_exxpenditure;
            })
        }

        //PE_to_gdp
        if(!hasPEToGDP){
            lista.forEach((element)=>{
                delete element.pe_to_gdp;
            })
        }

        //PE_on_defence
        if(!hasPEOnDefence){
            lista.forEach((element)=>{
                delete element.pe_on_defence;
            })
        }

        return lista;

    }

    
    //CARGAR DATOS DE ESPAÑA EN LA GRAFICA
    app.get(ROQUE_BASE_API_URL + "/graph-espana", (req, res) => {

        var year = req.query.year;
        var from = req.query.from;
        var to = req.query.to;

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
                //comprobamos que haya elementos
                if (filteredList == 0) {
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
                    
            }

            // Apartado para from y to
            if (from != undefined || to != undefined) {
                if(from != undefined && to == undefined){
                    to = 100000000;
                }
                else if(from == null && to != null){
                    from = 0;
                }
                filteredList = filteredList.filter((reg) => {
                    return (reg.year >= from && reg.year <= to);
                });

                //comprobamos que haya elementos
                if (filteredList == 0) {
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
            }

            

            // Resultado sin ID
            if (req.query.limit != undefined || req.query.offset != undefined) {
                filteredList = pagingMaker(req, filteredList);
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
                    if(element != "country" && element != "year" && element != "public_expenditure"  && element != "pe_on_defence" && element != "pe_to_gdp"){
                        res.sendStatus(400, "BAD REQUEST");
                        return;
                    }
                }
                //Escogemos los campos correspondientes
                filteredList = checkFields(req,filteredList);
            }
            var espana = [];
            filteredList.forEach(stat =>{
                if(stat.country === "espana" && stat.year >= 2016){
                    espana.push(stat.public_expenditure);
                }
            })
            //console.log("Filtered list->",JSON.stringify(filteredList))
            console.log("Array Espana-> ",JSON.stringify(espana))
            res.send(JSON.stringify(espana, null, 2));
            //res.send(JSON.stringify([43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]));
        })
    })

};
