const cool = require("cool-ascii-faces");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use("/", express.static('public'))

app.get("/cool",(req,res)=>{
    console.log("Requested / route");
    res.send(`<html><body><h1>`+cool()+`</html></body></h1>`);
});

app.listen(port, () => {
    console.log(`Server TRULY ready`);
});

console.log(`Server ready at port ${port}`);