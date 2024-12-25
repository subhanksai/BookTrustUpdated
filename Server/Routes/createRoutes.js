const express = require("express");
const server = express.Router();
const FormDataSchema = require("../Mongo/FormDataSchema");
const cors = require("cors");
server.use(cors());
server.use(express.json()); // Middleware to parse JSON body
async function processData(data) {
  try {
    // Perform any operations you need on the received data
    // console.log("Data received in index.js:", data);
    console.log(data);

    // Save this data to MongoDB
    const formData = new FormDataSchema(data); // assuming `data` matches the schema
    await formData.save();

    // Return a result after processing
    return { processed: true, receivedData: data };
  } catch (error) {
    console.error("Error saving data:", error);
    throw error; // Ensure errors are propagated to be handled by the calling function
  }
}

// Export the function to be used in server.js
module.exports = { processData };

// POST route to receive data from frontend
server.post("/create", async (req, res) => {
  try {
    const receivedData = req.body;
    // console.log("Received data:", receivedData);

    // Forward the data to processData function
    const response = await processData(receivedData);

    // Send a response back to the client
    res.status(200).json({
      message: "Data received and processed successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error processing the data:", error);
    res.status(500).json({ error: "Failed to process the data" });
  }
});

module.exports = server;
