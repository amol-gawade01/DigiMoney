import express from "express"

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


import userRouter from "./routes/user.routes"


app.use('/api/v1/users',userRouter); 





export {app};