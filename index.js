import dotenv from "dotenv";
import app from "./app.js";
import connectDB from  "./src/db/database.js"

// dotenv.config({
//     path:"./.env",
// });
dotenv.config({ path:"./.env" });

// let MySecret = process.env.secretkey;

// console.log("value:",MySecret)
// console.log("Start of a backend project");

 const port = process.env.PORT || 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// }) 

// app.get('/mysecret',(req,res)=>{
//     res.send("My secret is pikaboo!!")
// })

// Start the server first, so it is active and listening even if the database fails to connect immediately.
app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}`);
  
  // Connect to the database asynchronously
  connectDB()
    .then(() => {
      console.log("💾 Database connection initialized successfully");
    })
    .catch((err) => {
      console.error("\n⚠️  WARNING: Database connection failed!");
      console.error("⚠️  Please verify your internet connection and make sure your MONGO_URI in .env is correct.");
      console.error("⚠️  Note: The Express server is still running and listening for requests.\n");
    });
});
