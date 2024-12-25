const express = require("express");
const server = express.Router();

const {
  parseQueryParams,
  updateQueryWithIdentifiers,
} = require("../utils/queryHelpers");
const FormDataSchema = require("../Mongo/FormDataSchema");

server.get("/getOrder", (req, res) => {
  const parsedParams = parseQueryParams(req.query);
  console.log("Parsed Params:", parsedParams);

  let query = {};

  query = updateQueryWithIdentifiers(parsedParams, query); // Apply the filter (e.g., RemittercustomerId)

  // Sort by createdAt in descending order to get the latest record first
  // Limit the results to 1 to fetch only the latest order
  // console.log(query);

  FormDataSchema.find(query)
    .sort({ OrderUpdatedAt: -1 }) // Sort by createdAt in descending order
    .limit(1) // Fetch only the latest order
    .then((orders) => {
      if (!orders || orders.length === 0) {
        return res.json({ message: "Orders not found" });
      }
      // console.log("Orders fetched from DB:", orders);
      res.json({ message: "Orders fetched successfully", orders });
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});
async function processData(data) {
  try {
    // Perform any operations you need on the received data
    // console.log("Data received in index.js:", data);

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

// API to update order data
server.post("/updateOrder", async (req, res) => {
  // POST route to receive data from fronten
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
