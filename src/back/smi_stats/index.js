module.exports = (app,db) => {

    const FAMV_API = "/api/v1/smi_stats";
    const API_DOC_PORTAL = "https://documenter.getpostman.com/view/19481651/UVyn3K1F";
    
    var smi_stats = [];
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

app.post(FAMV_API +"/:country/:year", (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
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

app.get(FAMV_API+"/:country/:year",(req,res)=>{
    filteredSMI = smi_stats.filter((stat)=>{
        return (stat.country == req.params.country && stat.year == req.params.year);
    })
    if(filteredSMI == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredSMI, null, 2));
    }
});

app.get(FAMV_API+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
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

app.put(FAMV_API, (req,res) => {
    res.sendStatus(405,"METHOD NOT ALLOWED");
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

app.delete(FAMV_API + "/:country/:year",(req,res)=>{
    smi_stats.filter((stat)=>{
        return (stat.country != req.params.country || stat.year != req.params.year);
    })
    res.sendStatus(200,"OK");

});

};