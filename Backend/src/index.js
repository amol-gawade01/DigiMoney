import dotenv from "dotenv"
import connectToDb from "./db/db.js"
import app from './app.js'


dotenv.config({
    path:'./env'
})

connectToDb()
.then(() => {
    
app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})
})
.catch((error) => {
    console.log("Connection to Databae failed!!",error)
})