const express = require("express")
const app = express()
const bodyParser= require("body-parser")
const users=require("./repositories/users")

app.use(bodyParser.urlencoded({extended:true}))

app.get("/", (req,res)=>{
    res.send(`
    "<div>
        <form method="POST">
            <label for="email">Enter Email:</label>
            <input type="email" name="email" id="email">
            <label for="password">Enter Password:</label>
            <input type="password" name="password" id="password">
            <label for="passwordConfirm">Re-Enter Password:</label>
            <input type="password" name="passwordConfirm" id="passwordConfirm">
            <button class="submit">Submit</button>
        </form>
    </div> "
    `)
})

app.post("/", (req,res)=>{
   console.log(req.body)
    res.send("account created")
})

app.listen(3000, ()=>{
    console.log("listening")
}) 