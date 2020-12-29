const express = require("express")
const bodyParser= require("body-parser")
const cookieSession=require("cookie-session")
const usersRepo=require("./repositories/users")
const { getOneBy } = require("./repositories/users")
const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieSession({
    keys:['ndifanAe3Duoinf38j9AWD3']
}))

app.get("/signup", (req,res)=>{
    res.send(`
    <div>
        Your ID is ${req.session.userID}
        <form method="POST">
            <label for="email">Enter Email:</label>
            <input type="email" name="email" id="email">
            <label for="password">Enter Password:</label>
            <input type="password" name="password" id="password">
            <label for="passwordConfirm">Re-Enter Password:</label>
            <input type="password" name="passwordConfirm" id="passwordConfirm">
            <button class="submit">Sign Up</button>
        </form>
    </div>
    `)
})

app.get("/signin", (req,res)=>{
    res.send(`
    <div>
        <form method="POST">
            <label for="email">Enter Email:</label>
            <input type="email" name="email" id="email">
            <label for="password">Enter Password:</label>
            <input type="password" name="password" id="password">
            <button class="submit">Sign In</button>
        </form>
    </div>
    `)
})

app.get("/signout",(req,res)=>{
    req.session=null
    res.send("logged out")
})

app.post("/signup", async (req,res)=>{
    const {email,password,passwordConfirm}=req.body
    const existingUser=await usersRepo.getOneBy(email)
    if(existingUser){
        return res.send("account already exists")
    }else if(password !== passwordConfirm){
        return res.send("passwords don't match")
    }
    const user =await usersRepo.create({email,password})
    req.session.userID=user.id
    res.send("account created")
})  

app.post("/signin", async (req,res)=>{
    const {email,password}=req.body
    const user=await usersRepo.getOneBy({email})
    if(!user){
        return res.send("Invalid email")
    }
    const verified=await usersRepo.comparePasswords(user.password, password)
    if(!verified){
        return res.send("Password is incorrect")
    }
    req.session.userId=user.id
    res.send("signed in")
})  

app.listen(3000,()=>{
    console.log("Listening")
})