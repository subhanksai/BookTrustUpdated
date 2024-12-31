const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const FormDataSchema = require("./Mongo/FormDataSchema"); // Assuming this is a Mongoose Schema
const createRoutes = require("./Routes/createRoutes");
const updateRoutes = require("./Routes/updateRoutes");
const fetchRoutes = require("./Routes/fetchRoutes"); // Import routes

const server = express();
server.use(cors());
server.use(express.json()); // Middleware to parse JSON body

const url =
  "mongodb+srv://admin:admin@backend.3fn3q.mongodb.net/BookTrust?retryWrites=true&w=majority&appName=BackEnd";

// const url =
//   "mongodb://127.0.0.1:27017/BookTrust?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.4";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// API to get the order data based on orderProformaNo or paypalInvoiceNo

server.use("/api", createRoutes);
server.use("/api", fetchRoutes);
server.use("/api", updateRoutes);

server.listen(8085, () => {
  console.log("Server Listening at port 8085");
});
