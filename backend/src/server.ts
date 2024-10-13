// general
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";

// components
import { connectToDatabase, checkMongoConnection } from "./database";

// setting up env variables
import dotenv from "dotenv";
dotenv.config();

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION;

// config
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;
import { MongoClient, ObjectId } from "mongodb";

connectToDatabase();
app.use(checkMongoConnection);

interface QueryResult {
  _id: ObjectId;
  categoryId: number;
  categoryName: string;
  serviceId: number;
  questionFunnel: string;
}

const queryResultSchema = new mongoose.Schema<QueryResult>({
  _id: mongoose.Schema.Types.ObjectId,
  categoryId: Number,
  categoryName: String,
  serviceId: Number,
  questionFunnel: String,
});

const QueryResultModel = mongoose.model<QueryResult>(
  MONGODB_COLLECTION as string,
  queryResultSchema
);

app.get("/fetch-category-data", async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    // console.log(categoryId);

    const result = await QueryResultModel.find({
      "Category ID": Number(categoryId),
    }).exec();

    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/update-service-id", async (req, res) => {
  const questionFunnel = req.headers["question-funnel"];

  try {
    const matchingRow = await QueryResultModel.findOne({
      questionFunnel: questionFunnel,
    });

    if (matchingRow) {
      const serviceId = matchingRow.serviceId;
      res.status(200).json({ serviceId });
    } else {
      res.status(404).send("No matching Question Funnel found.");
    }
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    res.status(500).send("Internal server error.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
