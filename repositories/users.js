const fs = require("fs")
const crypto=require("crypto")
const util=require("util")
const scrypt=util.promisify(crypto.scrypt)

class UsersRepository {
    constructor(filename){
        if(!filename){
            throw new Error("Creating a repository needs a file name")
        }
        this.filename=filename
        try {
            (fs.accessSync(this.filename))
        }
        catch(err){
            fs.writeFileSync(this.filename, "[]")
        }
        this.users
    }

    getAll=async ()=>{
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding:"utf8"
        }))
    }
    
    getById=async(id)=>{
        const records=await this.getAll()
        return records.find(rec=>rec.id===id)
    }
    
    getOneBy=async(filters)=>{
        const records=await this.getAll()
        return records.find((rec)=>{
            for(let key in filters){
                if(rec[key]!==filters[key]){
                    return false
                }
            }
            return true
        })
    }
    
    create= async(attrs)=>{
        const salt = crypto.randomBytes(8).toString("hex")
        const buf= await scrypt(attrs.password, salt, 64)
        const records=await this.getAll()
        attrs.id=Math.floor(Math.random()*Date.now())
        const record={
            ...attrs,
            password:`${buf.toString('hex')}.${salt}`
        }
        records.push(record)
        await this.writeAll(records)
        return attrs
    }

    comparePasswords=async(saved,supplied)=>{
        const {hashed,salt}=saved.split(".")
        const buf=await scrypt(supplied, salt, 64)
        return buf.toString("hex")===hashed
    }

    authenticate=async({email,password})=>{
        const records=await this.getAll()
        const record=await this.getOneBy({email})
        const cryptPassword=record.password
        const salt=cryptPassword.split(".")[1]
        const buf=await scrypt(password, salt, 64)
        const decryptedPassword=`${buf.toString('hex')}.${salt}`
        if(decryptedPassword===cryptPassword){
            console.log("true")
            return record
        }else{
            console.log("false")
            return false
        }
    }
    
    delete=async(id)=>{
        const records=await this.getAll()
        const updatedRec=records.filter(rec=>rec.id!==id)
        await this.writeAll(updatedRec)
    }

    update=async(id,attrs)=>{
        const records=await this.getAll()
        let record=records.find(rec=>rec.id===id)
        if(!record){
            throw new Error("record not found")
        }
        Object.assign(record,attrs)
        await this.writeAll(records)
    }

    writeAll= async(records)=>{
        await fs.promises.writeFile(this.filename, 
            JSON.stringify(records, null,2)
            )
    }
}

module.exports=new UsersRepository("index.json")