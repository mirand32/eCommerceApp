const express = require("express")
const app = express()
const bodyParser= require("body-parser")

app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res)=>{
    res.send(`
    "get request"
    `)
})

app.post("/", (req,res)=>{
   console.log(req.body)
    res.send("post request")
})

app.listen(3000, ()=>{
    console.log("listening")
}) 