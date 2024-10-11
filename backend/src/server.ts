// general
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";

// components
import { connectToDatabase, checkMongoConnection } from "./database";

// config
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
import { MongoClient, ObjectId } from "mongodb";

interface QueryResult {
  _id: ObjectId;
  categoryId: number;
  categoryName: string;
  serviceId: number;
  questionFunnel: string;
}
// const DataModel = mongoose.model("collection1", Schema);

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;
const MONGODB_DATABASE = "database1";

const MONGODB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.cuirh.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=${MONGODB_CLUSTER}`;

const dbName = "database1";
const collectionName = "collection1";
let isConnected = false;

connectToDatabase();
app.use(checkMongoConnection);

const queryResultSchema = new mongoose.Schema<QueryResult>({
  _id: mongoose.Schema.Types.ObjectId,
  categoryId: Number,
  categoryName: String,
  serviceId: Number,
  questionFunnel: String,
});

const QueryResultModel = mongoose.model<QueryResult>(
  "collection1",
  queryResultSchema
);

app.get("/fetch-category-data", async (req, res) => {
  try {
    const result = await QueryResultModel.find().exec();
    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
