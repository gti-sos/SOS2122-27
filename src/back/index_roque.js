module.exports = (app) => {

    const ROQUE_BASE_API_URL = "/api/v1/public-expenditure-stats";

    const API_DOC_PORTAL = "";

    var PEStats = [
        {
            country: "espana",
            year: 2020,
            public_expenditure: 588279.0,
            pe_to_gdp: 52.4,
            pe_on_defence: 2.6
    
        },   
    ];

    //var statCountryYear = req.params.country.year;

    //LOAD INITIAL DATA

    app.get(ROQUE_BASE_API_URL + "/loadInitialData", (req,res) => {
        res.send(JSON.stringify(PEStats, null, 2));
    });

    //GET
    
    app.get(ROQUE_BASE_API_URL, (req,res) => {
        res.send(JSON.stringify(PEStats, null, 2));
    });
    
    app.get(ROQUE_BASE_API_URL+"/:country/:year",(req,res)=>{
        filteredPEStats = PEStats.filter((stat)=>{
            return (stat.country.year == statCountryYear);
        })
        res.send(JSON.stringify(PEStats, null, 2));
    });
    
    app.get(ROQUE_BASE_API_URL+"/docs",(req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //POST
    
    app.post(ROQUE_BASE_API_URL, (req,res) => {
        PEStats.push(req.body);
        res.sendStatus(201,"CREATED");
    });

    app.post(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //PUT

    app.put(ROQUE_BASE_API_URL +"/:country/:year", (req,res) => {

        //aqui va el codigo

        res.sendStatus(200,"OK");
    });

    app.put(ROQUE_BASE_API_URL, (req,res) => {
        res.sendStatus(405,"METHOD NOT ALLOWED");
    });

    //DELETE

    app.delete(ROQUE_BASE_API_URL,(req,res)=>{
        PEStats = []
        res.sendStatus(200,"OK");
    
    });
    
    app.delete(ROQUE_BASE_API_URL + "/:country/:year",(req,res)=>{
        PEStats.filter((stat)=>{
            return (stat.country.year != statCountryYear);
        })
        res.sendStatus(200,"OK");
    
    });

};