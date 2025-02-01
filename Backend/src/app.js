import express from "express"
import cors from "cors"
import cookieParser from 'cookie-parser'
import {ApiError} from "./utils/ApiError.js"
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
app.use(express.urlencoded({ extended: true }))




import userRouter from "./routes/user.routes.js"
import accountRouter from './routes/account.routes.js'

  
  app.use('/api/v1/users',userRouter);    
  app.use('/api/v1/account',accountRouter); 
  
  
  app.use(express.static("public"))
  
  app.use((err, req, res, next) => {
    console.error("Error:", err.stack);
      if (err instanceof ApiError) {
          console.log("we found error ")
        return res.status(err.statusCode).json({ message: err.message });
      }
    
      res.status(500).json({ message: "Internal Server Error" });
    });

export {app};