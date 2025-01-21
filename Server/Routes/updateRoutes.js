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

// server.post("/updateOrder", async (req, res) => {
//   // POST route to receive data from fronten
//   try {
//     const receivedData = req.body;
//     // console.log("Received data:", receivedData);

//     // Forward the data to processData function
//     const response = await processData(receivedData);

//     // Send a response back to the client
//     res.status(200).json({
//       message: "Data received and processed successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error("Error processing the data:", error);
//     res.status(500).json({ error: "Failed to process the data" });
//   }
// });
// server.put("/UpdateOrder", async (req, res) => {
//   console.log("Here", req.body);
//   try {
//     const receivedData = req.body; // Receiving the complete data from frontend

//     const {
//       orderProformaNo,
//       paypalInvoiceNo,
//       paypalTransactionId,
//       invoiceNo,
//       ...updateFields
//     } = receivedData; // Destructuring to get identifier fields and the rest

//     // Validate that at least one identifier field is provided
//     if (
//       !orderProformaNo &&
//       !paypalInvoiceNo &&
//       !paypalTransactionId &&
//       !invoiceNo
//     ) {
//       return res
//         .status(400)
//         .json({ error: "At least one identifier field is required" });
//     }

//     // Build the query to find the record based on one of the identifier fields
//     const query = {};
//     if (orderProformaNo) query.orderProformaNo = orderProformaNo;
//     if (paypalInvoiceNo) query.paypalInvoiceNo = paypalInvoiceNo;
//     if (paypalTransactionId) query.paypalTransactionId = paypalTransactionId;
//     if (invoiceNo) query.invoiceNo = invoiceNo;
//     console.log("query", query);

//     // Fetch the order using the getOrder logic
//     const orders = await FormDataSchema.find(query)
//       .sort({ OrderUpdatedAt: -1 }) // Sort by OrderUpdatedAt in descending order
//       .limit(1); // Fetch only the latest order
//     console.log("Orders", orders);

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ error: "No matching order found" });
//     }

//     const orderToUpdate = orders[0]; // Get the first (latest) order

//     // Update the order with the received fields
//     Object.keys(updateFields).forEach((field) => {
//       orderToUpdate[field] = updateFields[field]; // Update the order fields with new data
//     });

//     // Save the updated order
//     await orderToUpdate.save();

//     // Send a success response with the updated order
//     res.status(200).json({
//       message: "Order updated successfully",
//       data: orderToUpdate,
//     });
//   } catch (error) {
//     console.error("Error processing the data:", error);
//     res.status(500).json({ error: "Failed to process the data" });
//   }
// });
server.put("/UpdateOrder", async (req, res) => {
  console.log("Here", req.body);
  try {
    const receivedData = req.body; // Receiving the complete data from frontend

    const {
      orderProformaNo,
      paypalInvoiceNo,
      paypalTransactionId,
      invoiceNo,
      ...updateFields
    } = receivedData; // Destructuring to get identifier fields and the rest

    // Validate that at least one identifier field is provided
    if (
      !orderProformaNo &&
      !paypalInvoiceNo &&
      !paypalTransactionId &&
      !invoiceNo
    ) {
      return res
        .status(400)
        .json({ error: "At least one identifier field is required" });
    }

    // Variable to store the order that will be updated
    let orderToUpdate = null;

    // Search each identifier field separately and update the first matched order
    if (orderProformaNo) {
      orderToUpdate = await FormDataSchema.findOne({ orderProformaNo });
    }

    if (!orderToUpdate && paypalInvoiceNo) {
      orderToUpdate = await FormDataSchema.findOne({ paypalInvoiceNo });
    }

    if (!orderToUpdate && paypalTransactionId) {
      orderToUpdate = await FormDataSchema.findOne({ paypalTransactionId });
    }

    if (!orderToUpdate && invoiceNo) {
      orderToUpdate = await FormDataSchema.findOne({ invoiceNo });
    }

    // If no order is found, return a 404 error
    if (!orderToUpdate) {
      return res.status(404).json({ error: "No matching order found" });
    }

    // Replace the entire order data with receivedData
    orderToUpdate.set(receivedData);

    // Save the updated order
    await orderToUpdate.save();

    // Send a success response with the updated order
    res.status(200).json({
      message: "Order updated successfully",
      data: orderToUpdate,
    });
  } catch (error) {
    console.error("Error processing the data:", error);
    res.status(500).json({ error: "Failed to process the data" });
  }
});

module.exports = server;
