import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_DATABASE = "database1";

const MONGODB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.cuirh.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=${MONGODB_CLUSTER}`;

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export const checkMongoConnection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (mongoose.connection.readyState === 1) {
    next(); // MongoDB is connected, proceed with the request
  } else {
    res.status(500).json({ message: "MongoDB is not connected." });
  }
};
