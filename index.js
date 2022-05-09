const express = require("express");
const path = require("path");
const request = require('request');
const cors = require('cors');

const backend_roque_v1 = require("./src/back/public_expenditure_stats/index_v1");
const backend_roque_v2 = require("./src/back/public_expenditure_stats/index_v2");
const backend_jf_v1 = require("./src/back/public_debt_stats/index_v1");
const backend_jf_v2 = require("./src/back/public_debt_stats/index_v2");
const backend_alexis_v1 = require("./src/back/smi_stats/index_v1");
const backend_alexis_v2 = require("./src/back/smi_stats/index_v2");



const app = express();

//BASE DE DATOS
var Datastore = require("nedb");

PD_DB = new Datastore();
PE_DB = new Datastore();
SMI_DB = new Datastore();


const port = process.env.PORT || 8090;

app.use(cors());
const bodyParser = require("body-parser");

app.use(bodyParser.json());

//BACKEND
backend_roque_v1(app,PE_DB);
backend_alexis_v1(app, SMI_DB);
backend_jf_v1(app,PD_DB);
//ServerAPI
backend_jf_v2.register(app,PD_DB);
backend_roque_v2.register(app,PE_DB);
backend_alexis_v2.register(app, SMI_DB);

//Integraciones
var extPathV1='/remoteAPI';
var extApiServerHostV1 = 'https://sos2122-pfm.herokuapp.com/api/v1/contacts';


app.use(extPathV1, function(req, res) {
    var url = extApiServerHostV1 + req.url;
    console.log('piped: ' + req.url);
    req.pipe(request(url)).pipe(res);
});

app.use("/", express.static('public'));

app.listen(port, () => {
    console.log(`Server TRULY ready`);
});

console.log(`Server ready at port ${port}`);