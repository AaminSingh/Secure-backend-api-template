import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);       //
    console.log(`✔️ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message || error);
    throw error;
  }
};

export default connectDB;

// mongoose.connect()
// Connects Node.js to MongoDB.
// Returns a connection object, not just a success/failure value.