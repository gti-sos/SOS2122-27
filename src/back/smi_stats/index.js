module.exports = (app,db) => {

    const FAMV_API = "/api/v1/smi_stats";

    const API_DOC_PORTAL = "";

    var smi_stats = [
        {
            country: "espana",
            year: 2022,
            smi_local: 1166.70,
            smi_euros: 1166.70,
            smi_variation: 3.63
    
        },  
        {
            country: "china",
            year: 2020,
            smi_local: 1166.70,
            smi_euros: 1166.70,
            smi_variation: 3.63 
        }
    ];


    app.get(FAMV_API + "/loadInitialData", (req,res) => {
        
        //Obtenemos los elementos
        db.find({}, (error)=>{ 

            if(error){
                console.log("Error en Load Initial Data");
                res.sendStatus(500); 
            }
            else{
                dataBase.remove({}, {multi: true});
                dataBase.insert(smi_stats);
                res.sendStatus(200,"Datos correctamente cargados a la BD");                        
            }
        }); 
    });


//POST
app.post(FAMV_API,(req,res)=>{
    smi_stats.push(req.body);
    res.sendStatus(201, "CREATED");
});

//GET
app.get(FAMV_API,(req,res)=>{
    res.send(JSON.stringify(smi_stats, null, 2));
});

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

app.get(FAMV_API+"/:year",(req,res)=>{
    var year = req.params.year;
    filteredYears = smi_stats.filter((stat)=>{
        return (stat.year == year);
    })
    res.send(JSON.stringify(smi_stats, null, 2));
});

app.get(FAMV_API+"/:country/:year",(req,res)=>{
    var SMIcountry = req.params.country;
    var year = req.params.year;
    filteredCountries = smi_stats.filter((stat)=>{
        return (stat.country == SMIcountry && stat.year == year);
    })
    res.send(JSON.stringify(smi_stats, null, 2));
});

app.get(FAMV_API+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
});


//DELETE
app.delete(FAMV_API,(req,res)=>{
    smi_stats = []
    res.sendStatus(200,"OK");
});

app.delete(FAMV_API+"/:country",(req,res)=>{
    var SMIcountry = req.params.country;
    smi_stats.filter((stat)=>{
        return (stat.country != SMIcountry);
    })
    res.sendStatus(200,"OK");

});

app.delete(FAMV_API+"/:year",(req,res)=>{
    var year = req.params.year;
    smi_stats.filter((stat)=>{
        return (stat.year != year);
    })
    res.sendStatus(200,"OK");

});


};