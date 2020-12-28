const fs = require("fs")

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
        const records=await this.getAll()
        if(!records.some(rec=>rec.email===attrs.email)){
            attrs.id=Math.floor(Math.random()*Date.now())
            records.push(attrs)
            await this.writeAll(records)
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