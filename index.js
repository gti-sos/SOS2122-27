const express = require("express");
const path = require("path");

const backend_roque = require("./src/back/public_expenditure_stats/index");
const backend_alexis = require("./src/back/smi_stats/index");
const backend_jf = require("./src/back/public_debt_stats/index");

const API_ROQUE = "/api/v1/public-expenditure-stats"
const JF_API = "/api/v1/public-debt-stats"
const FA_API = "/api/v1/smi_stats"

const app = express();

//BASE DE DATOS
var Datastore = require("nedb");
var PE_DB = new Datastore({filename: path.join(__dirname,"./src/back/public_expenditure_stats/publicExpenditureDB.db"), autoload: true});
var SMI_DB = new Datastore({filename: path.join(__dirname,"./src/back/smi_stats/smiDB.db"), autoload: true});
var PD_DB = new Datastore({filename: path.join(__dirname,"./src/back/public_debt_stats/publicDebtDB.db"), autoload: true});

const port = process.env.PORT || 8090;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

//FRONTEND
/*
app.use(API_ROQUE+"/frontend",express.static("./public/public_expenditure_stats"));
app.use(JF_API+"/frontend",express.static("./public/public_debt_stats"));
app.use(FA_API+"/frontend",express.static("./public/smi_stats"));
*/

//BACKEND
backend_roque(app,PE_DB);
backend_alexis(app, SMI_DB);
backend_jf(app,PD_DB);

app.use("/", express.static('public'));

app.listen(port, () => {
    console.log(`Server TRULY ready`);
});

console.log(`Server ready at port ${port}`);