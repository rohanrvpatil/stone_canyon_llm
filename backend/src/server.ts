// general
import express from "express";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";

// components
import { connectToDatabase, checkMongoConnection } from "./database";
import userDataQuestions from "../data/userDataQuestions.json";

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

app.post("/update-service-id", async (req, res) => {
  try {
    const questionFunnel = req.headers["question-funnel"];

    // console.log(`Question Funnel: ${questionFunnel}`);
    const result = await QueryResultModel.findOne({
      "Question Funnel": questionFunnel,
    }).exec();

    res.json(result);
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    return res.status(500).send("Internal server error.");
  }
});

app.get("/fetch-category-data", async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    // console.log(`Category ID: ${categoryId}`);

    const result = await QueryResultModel.find({
      "Category ID": Number(categoryId),
    }).exec();

    console.log(`Matched result: ${result}`);

    res.json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/user-data-questions", async (req, res) => {
  let currentQuestionIndex = 0;
  if (currentQuestionIndex < userDataQuestions.length) {
    res.json(userDataQuestions[currentQuestionIndex]);
    currentQuestionIndex++;
  } else {
    res.json({ message: "All questions have been answered" });
    currentQuestionIndex = 0; // Reset for next session or set appropriate handling
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
