import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();



//basic configurations
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
//cors configuration
app.use(cors({
    origin:process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
    credentials : true,
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

//import routes

import healthCheckRouter  from "./src/routes/healthcheck.routes.js";
import authRouter from "./src/routes/auth.route.js"

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);



app.get('/',(req,res)=>{
    res.send("This is the second page of the backend project!!")
})


export default app;