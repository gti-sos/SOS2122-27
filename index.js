const express = require("express");
const path = require("path");

const backend_roque = require("./src/back/public_expenditure_stats/index");
const backend_alexis = require("./src/back/smi_stats/index");
const backend_jf = require("./src/back/public_debt_stats/index");

const app = express();

//BASE DE DATOS
var Datastore = require("nedb");
var PE_DB = new Datastore({filename: path.join(__dirname,"./src/back/public_expenditure_stats/publicExpenditureDB.db"), autoload: true});
var SMI_DB = new Datastore({filename: path.join(__dirname,"./src/back/smi_stats/smiDB.db"), autoload: true});
var PD_DB = new Datastore({filename: path.join(__dirname,"./src/back/public_debt_stats/publicDebtDB.db"), autoload: true});

const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

backend_roque(app,PE_DB);
backend_alexis(app, SMI_DB);
backend_jf(app,PD_DB);

app.use("/", express.static('public'))

app.listen(port, () => {
    console.log(`Server TRULY ready`);
});

console.log(`Server ready at port ${port}`);