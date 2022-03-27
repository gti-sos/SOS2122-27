const express = require("express");

const backend_roque = require("./src/back/index_roque");
const backend_alexis = require("./src/back/index_alexis");

const app = express();

backend_roque(app);
backend_alexis(app);

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