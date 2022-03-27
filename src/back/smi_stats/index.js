module.exports = (app) => {

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
    ];

    
app.post(FAMV_API,(req,res)=>{
    smi_stats.push(req.body);
    res.sendStatus(201, "CREATED");
});


app.get(FAMV_API,(req,res)=>{
    res.send(JSON.stringify(smi_stats, null, 2));
});

app.get(FAMV_API+"/:country",(req,res)=>{
    var country = req.params.country;
    filteredCountries = smi_stats.filter((smi_stats)=>{
        return (smi_stats.country == country);
    })
    res.send(JSON.stringify(contacts, null, 2));
});

app.get(FAMV_API+"/:year",(req,res)=>{
    var year = req.params.year;
    filteredYears = smi_stats.filter((smi_stats)=>{
        return (smi_stats.year == year);
    })
    res.send(JSON.stringify(contacts, null, 2));
});

app.get(FAMV_API+"/docs",(req,res)=>{
    res.redirect(API_DOC_PORTAL);
});

app.delete(FAMV_API,(req,res)=>{
    data = []
    res.sendStatus(200,"OK");
});

app.delete(FAMV_API+"/:country",(req,res)=>{
    var country = req.params.country;
    smi_stats.filter((smi_stats)=>{
        return (smi_stats.country != country);
    })
    res.sendStatus(200,"OK");

});

app.delete(FAMV_API+"/:year",(req,res)=>{
    var year = req.params.year;
    smi_stats.filter((smi_stats)=>{
        return (smi_stats.year != year);
    })
    res.sendStatus(200,"OK");

});


}