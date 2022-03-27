const express = require("express");
const path = require("path");

const backend_roque = require("./src/back/public_expenditure_stats/index");
const backend_alexis = require("./src/back/smi_stats/index");

const app = express();

//BASE DE DATOS
var Datastore = require("nedb");
var PE_DB = new Datastore({filename: path.join(__dirname,"./src/back/public_expenditure_stats/publicExpenditureDB.db"), autoload: true});
var SMI_DB = new Datastore({filename: path.join(__dirname,"./src/back/smi_stats/smiDB.db"), autoload: true});
backend_roque(app,PE_DB);
backend_alexis(app, SMI_DB);

const port = process.env.PORT || 8080;

const bodyParser = require("body-parser");


const JF_API = "/api/v1";

app.use(bodyParser.json());

var DebtStat = [
    {
        country: "espana",
        year: 2020,
        total_debt: 1345784,
        debt_gdp: 120,
        per_capita_debt: 28393

    },   
];

app.use("/", express.static('public'))


app.listen(port, () => {
    console.log(`Server TRULY ready`);
});


// OPERACIONES JF

app.get(JF_API + "/public-debt-stats", (req,res)=>{
    res.send(JSON.stringify(DebtStat, null, 2));
});

app.post(JF_API + "/public-debt-stats", (req,res)=>{
    DebtStat.push(req.body);
    res.sendStatus(201, "CREATED");
});

console.log(`Server ready at port ${port}`);