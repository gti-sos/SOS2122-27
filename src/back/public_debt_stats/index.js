module.exports = (app,db) => {
    const JF_API_URL = "/api/v1/public-debt-stats";
    const API_DOC_PORTAL = "";

    var DebtStats = [];

    var initial_DebtStat = [
        {
            country: "espana",
            year: 2020,
            total_debt: 1345784,
            debt_gdp: 120,
            per_capita_debt: 28393    
        },   
    ];

    //DOCUMENTACION DE LA API
    //Por persona: 10.
    app.get(JF_API_URL + "/docs", (req,res)=>{
        res.redirect(API_DOC_PORTAL);
    });

    //LOAD INITIAL DATA

    app.get(JF_API_URL + "/loadInitialData", (req,res) => {
        //inicializamos el vector
        if(DebtStats.length === 0){
            initial_DebtStat.forEach((a)=>{
                DebtStats.push(a);
            });
        }
        res.send(JSON.stringify(DebtStats,null,2));
    });
};