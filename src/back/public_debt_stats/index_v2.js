

    const JF_API_URL = "/api/v2/public-debt-stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/14853996/UyrAGHgT";

    var initial_DebtStat = [
        {
            country: "Espana",
            year: 2021,
            total_debt: 1427235,
            debt_gdp: 118.40,
            per_capita_debt: 30157    
        },
        {
            country: "Espana",
            year: 2020,
            total_debt: 1345783,
            debt_gdp: 120,
            per_capita_debt: 28393    
        },
        {
            country: "Espana",
            year: 2019,
            total_debt: 1223355,
            debt_gdp: 98.3,
            per_capita_debt: 25846    
        },   
        {
            country: "Alemania",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 68.7,
            per_capita_debt: 27832    
        },
        {
            country: "Alemania",
            year: 2019,
            total_debt: 1345784,
            debt_gdp: 68.7,
            per_capita_debt: 27832    
        },  
        {
            country: "Alemania",
            year: 2018,
            total_debt: 1021031,
            debt_gdp: 66.4,
            per_capita_debt: 25194    
        },
        {
            country: "Reino Unido",
            year: 2020,
            total_debt: 2479993,
            debt_gdp: 104.47,
            per_capita_debt: 37001    
        },
        {
            country: "Reino Unido",
            year: 2019,
            total_debt: 2479993,
            debt_gdp: 104.47,
            per_capita_debt: 37001    
        },
        {
            country: "Francia",
            year: 2020,
            total_debt: 2649261,
            debt_gdp: 115,
            per_capita_debt: 28393    
        }, 
        {
            country: "Italia",
            year: 2020,
            total_debt: 2573468,
            debt_gdp: 155.6,
            per_capita_debt: 43429    
        }, 
        {
            country: "Portugal",
            year: 2020,
            total_debt: 270491,
            debt_gdp: 135.2,
            per_capita_debt: 26266    
        }, 
    ];
    
    var DebtStats = initial_DebtStat;

module.exports.register = (app,db) => {

    //DOCUMENTACION DE LA API
    
    app.get(JF_API_URL+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //LOAD INITIAL DATA

    app.get(JF_API_URL + "/loadInitialData", (req, res) => {

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }
            if (filteredList == 0) {
                for (var i = 0; i < initial_DebtStat.length; i++) {
                    db.insert(initial_DebtStat[i]);
                }
                res.sendStatus(200, "OK: datos inicializados correctamente.");
                return;
            }else{
            res.sendStatus(200, "Aviso: datos ya inicializados anteriormente")
        }
        });
    })

    //GET GENERAL
    
    app.get(JF_API_URL, (req, res) => {

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

        //¿from==to?
        if (from > to) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }
        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            // Búsqueda por año
            if (year != null) {
                var filteredList = filteredList.filter((reg) => {
                    return (reg.year == year);
                });
                if (filteredList == 0) {
                    res.sendStatus(404, "NOT FOUND");
                    return;
                }
            }

            // From y To
            if (from != undefined && to != undefined) {
                if(from != undefined && to == undefined){
                    to = 100000000;
                }
                else if(from == null && to != null){
                    from = 0;
                }
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
    
    app.get(JF_API_URL + "/:country/:year", (req, res) => {

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
                    if(element != "country" && element != "year" && element != "total_debt"  && element != "debt_gdp" && element != "per_capita_debt"){
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

    //CARGAR DATOS DE ESPAÑA EN LA GRAFICA

    app.get(JF_API_URL + "/graph-espana", (req, res) => {

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

    });

    //POST CORRECTO
    
    app.post(JF_API_URL, (req, res) => {

        if (checkBody(req)) {
            res.sendStatus(400, "BAD REQUEST");
        } else {
            db.find({}, function (err, filteredList) {

                if (err) {
                    res.sendStatus(500, "CLIENT ERROR");
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

    app.post(JF_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT CORRECTO

    app.put(JF_API_URL + "/:country/:year", (req, res) => {

        //comprobamos body
        if (checkBody(req)) {
            res.sendStatus(400, "BAD REQUEST");
            return;
        }

        var countryR = req.params.country;
        var yearR = req.params.year;
        var body = req.body;

        db.find({}, function (err, filteredList) {
            if (err) {
                res.sendStatus(500, "CLIENT ERROR");
                return;
            }

            //¿Existe el elemento?
            filteredList = filteredList.filter((reg) => {
                return (reg.country == countryR && reg.year == yearR);
            });
            if (filteredList == 0) {
                res.sendStatus(404, "NOT FOUND");
                return;
            }

            //comprobamos que los campos coincidan
            if (countryR != body.country || yearR != body.year) {
                res.sendStatus(400, "BAD REQUEST");
                return;
            }

            //actualizamos valor
            db.update({$and:[{country: String(countryR)}, {year: parseInt(yearR)}]}, {$set: body}, {},function(err, numUpdated) {
                if (err) {
                    res.sendStatus(500, "ERROR EN CLIENTE");
                }else{
                    res.sendStatus(200,"UPDATED");
                }
            });
        })
    })

    //PUT NO PERMITIDO

    app.put(JF_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE GENERAL

    app.delete(JF_API_URL,(req, res)=>{
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
    
    app.delete(JF_API_URL+"/:country/:year",(req, res)=>{
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
            db.remove({country: countryR, year: parseInt(yearR)}, {}, (err, numRemoved)=>{
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
            if(req.query.total_debt != undefined) {
                if(stat.total_debt != req.query.total_debt)  {
                    flag = false;
                }
            }
            if(req.query.debt_gdp != undefined) {
                if(stat.debt_gdp != req.query.debt_gdp)  {
                    flag = false;
                }
            }
            if(req.query.total_debt != undefined) {
                if(stat.total_debt != req.query.total_debt)  {
                    flag = false;
                }
            }
            return flag  
        });
        return filteredStats;
    }

    //FUNCION DE PAGINACION

    function pagingMaker(req, lista){
        var res = [];
        var limit = req.query.limit;
        var offset = req.query.offset;
        
        if(limit < 1 || offset < 0 || offset > lista.length){
            res.push("ERROR EN PARAMETROS LIMIT Y/O OFFSET");
            return res;
        }

        //limit no definido
        if(limit == undefined && offset != undefined){
            limit = lista.length - offset;
        }
        //offset no definido
        else if(limit != undefined && offset == undefined){
            offset = 0;
        }

        res = lista.slice(offset,parseInt(limit)+parseInt(offset));
        return res;
    }

    //FUNCION PARA COMPROBAR LOS CAMPOS DE PETICION

    function checkBody(req) {
        return (req.body.country == null |
            req.body.year == null |
            req.body.total_debt == null |
            req.body.debt_gdp == null |
            req.body.per_capita_debt == null
        );
    }

    //FUNCION PARA COMPROBAR LOS CAMPOS DEL OBJETO

    function checkFields(req, lista){
        var fields = req.query.fields;
        var hasCountry = false;
        var hasYear = false;
        var hasTotalDebt = false;
        var hasDebtGdp = false;
        var hasPCDebt = false;
        fields = fields.split(",");

        for(var i = 0; i<fields.length;i++){
            var element = fields[i];
            if(element=='country'){
                hasCountry=true;
            }
            if(element=='year'){
                hasYear=true;
            }
            if(element=='total_debt'){
                hasTotalDebt=true;
            }
            if(element=='debt_gdp'){
                hasDebtGdp=true;
            }
            if(element=='per_capita_debt'){
                hasPCDebt=true;
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

        //TotalDebt
        if(!hasTotalDebt){
            lista.forEach((element)=>{
                delete element.total_debt;
            })
        }

        //DebtGdp
        if(!hasDebtGdp){
            lista.forEach((element)=>{
                delete element.debt_gdp;
            })
        }

        //PerCapitaDebt
        if(!hasPCDebt){
            lista.forEach((element)=>{
                delete element.per_capita_debt;
            })
        }

        return lista;

    }

};
