const express = require("express");
const mainRouter=require("./routes/index")
const app=express()
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(cors())
app.use(express.json());
app.use("/api/v1",mainRouter);

app.listen(8080,()=>{
    console.log("Listening on PORT 8080")
})
