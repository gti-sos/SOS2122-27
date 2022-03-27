module.exports = (app) => {

    const FAMV_API = "/api/v1/smi_stats";
    //const db = new Datastore({ filename: datafile, autoload: true });
    var country = req.params.country;
    var year = req.params.year
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
    filteredCountries = smi_stats.filter((smi_stats)=>{
        return (smi_stats.country == country);
    })
    res.send(JSON.stringify(contacts, null, 2));
});

app.get(FAMV_API+"/:year",(req,res)=>{
    filteredYears = smi_stats.filter((smi_stats)=>{
        return (smi_stats.year == year);
    })
    res.send(JSON.stringify(contacts, null, 2));
});

app.put(FAMV_API+"/:country/:year", (req,res)=>{
    var newSMIStat = req.body;

    if (!newSMIStat.country
      || !newSMIStat.year
      || !newSMIStat['smi-local']
      || !newSMIStat['smi-variation']
      || !newSMIStat['smi-euros']
      || newSMIStat.country != country
      || newSMIStat.year != year) {

      console.log("Actualizacion de campos no valida")
      return res.sendStatus(400);

    } else {

      console.log(newSMIStat, year, country)

      db.update({ $and: [{ country: country }, { year: year }] }, { $set: newSMIStat }, {}, function (err, numReplaced) {
        if (err) {
          console.error("ERROR accesing DB in GET");
          res.sendStatus(500);
        } else {
          if (numReplaced == 0) {
            console.error("No data found");
            res.sendStatus(404);
          } else {
            console.log(`stat with country: <${country}> and date: <${year}> successfuly updated`)
            res.sendStatus(200);
          }
        }
    });
}

});

app.delete(FAMV_API,(req,res)=>{
    data = []
    res.sendStatus(200,"OK");
});

app.delete(FAMV_API+"/:country",(req,res)=>{
    smi_stats.filter((smi_stats)=>{
        return (smi_stats.country != country);
    })
    res.sendStatus(200,"OK");

});

app.delete(FAMV_API+"/:year",(req,res)=>{
    smi_stats.filter((smi_stats)=>{
        return (smi_stats.year != year);
    })
    res.sendStatus(200,"OK");

});


}