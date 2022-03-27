module.exports = (app) => {

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
    
    app.get(ROQUE_BASE_API_URL + "/public-expenditure-stats", (req,res) => {
        res.send(JSON.stringify(PEStats, null, 2));
    });
    
    app.post(ROQUE_BASE_API_URL + "/public-expenditure-stats", (req,res) => {
        PEStats.push(req.body);
        res.sendStatus(201,"CREATED");
    });

};