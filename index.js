const cool = require("cool-ascii-faces");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const ROQUE_BASE_API_URL = "/api/v1";

var PEStats = [
    {
        country: "espana",
        year: 2020,
        public_expenditure: 588279.0,
        pe_to_gdp: 52.4,
        pe_on_defence: 2.6

    },   
];

app.use("/", express.static('public'))

app.get("/cool",(req,res)=>{
    console.log("Requested / route");
    res.send(`<html><body><h1>`+cool()+`</html></body></h1>`);
});

app.listen(port, () => {
    console.log(`Server TRULY ready`);
});

//OPERACIONES DE LA PARTE DE ROQUE

app.get(ROQUE_BASE_API_URL + "/public-expenditure-contacts", (req,res) => {
    
    var countryName = req.params.country;

    filteredPEStats = PEStats.filter((stat) =>{
        return stat.country == countryName;
    });

    if(filteredPEStats == 0){
        res.sendStatus(404,"NOT FOUND");
    }else{
        res.send(JSON.stringify(filteredContacts[0],null,2));
    }

});

app.post(ROQUE_BASE_API_URL + "/public-expenditure-contacts", (req,res) => {
    PEStats.push(req.body);
    res.sendStatus(201,"CREATED");
});

console.log(`Server ready at port ${port}`);