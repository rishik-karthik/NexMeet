import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
//to reduce imports in this file of socket
import { connectToSocket } from "./controllers/socketManager.js";
//routes
import userRoutes from "./routes/users.routes.js";
import cors from "cors";
import { connect } from "node:http2";

const app = express();
//we need direct access to serevr not express app i.e raw http server
//so we create a instance of it
const server = createServer(app);
//attaches websocket capability to http sevrer
const io = connectToSocket(server);

//to get port from env file
app.set("port", process.env.PORT || 8000);

//adding middleware -> app.use()
//add cord middleware
app.use(cors());
//allow req to be json
app.use(express.json());
//This middleware parses form data sent by HTML forms
app.use(express.urlencoded({ limit: "40kb", extended: true }));

//using routes and adding prefix to routes
//api-> backend v->version
app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.send("hello");
});

const start = async () => {
  app.set("mongo_user");
  const connectionDb = await mongoose.connect(
    "mongodb+srv://rishik_db_user:pflh4y26PVLeqetF@cluster0.qxn98eb.mongodb.net/?appName=Cluster0"
  );
  console.log(`DB connected, Host : ${connectionDb.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("server runnning from 8000");
  });
};

start();
