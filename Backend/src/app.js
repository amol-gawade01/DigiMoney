import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true,
    }
))  

app.use(express.json(
    {
        limit:"16kb"
    }
))

app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import accountRouter from './routes/account.routes.js'


app.use('/api/v1/users',userRouter);    
app.use('/api/v1/account',accountRouter); 




export {app};