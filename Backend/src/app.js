import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'

const app = express();


app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend URL
    credentials: true,  // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
}));

app.use(express.json(
    {
        limit:"16kb"
    }
))

app.use(cookieParser())
app.use(express.urlencoded())
app.use(express.static("public"))


import userRouter from "./routes/user.routes.js"
import accountRouter from './routes/account.routes.js'


app.use('/api/v1/users',userRouter);    
app.use('/api/v1/account',accountRouter); 




export {app};