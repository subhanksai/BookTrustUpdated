const express = require("express");
const server = express.Router();

const {
  parseQueryParams,
  updateQueryWithIdentifiers,
} = require("../utils/queryHelpers");
const FormDataSchema = require("../Mongo/FormDataSchema");

server.get("/fetchAllData", async (req, res) => {
  try {
    const parsedParams = parseQueryParams(req.query);
    // console.log(parsedParams);

    // Build filter object based on provided parameters
    let query = {};

    query = updateQueryWithIdentifiers(parsedParams, query);
    // console.log(query);

    const data = await FormDataSchema.find(query); // Fetch data with the applied filters
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
}); // Endpoint to fetch data based on a specific year

server.get("/fetchYearlyData", async (req, res) => {
  try {
    const { year } = req.query;
    // console.log(year);

    const startDate = new Date(year, 0, 1); // January 1st of the given year
    const endDate = new Date(year, 11, 31); // December 31st of the given year

    const data = await FormDataSchema.find({
      invoiceDate: { $gte: startDate, $lt: endDate },
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching yearly data" });
  }
});
server.get("/fetchSpecificYearlyData", async (req, res) => {
  try {
    const { year, ...identifiers } = req.query;
    const parsedParams = parseQueryParams(identifiers);

    // Validate `year`
    if (!year || isNaN(year)) {
      return res.status(400).json({ message: "Invalid year parameter." });
    }

    const parsedYear = parseInt(year, 10);
    const startDate = new Date(parsedYear, 0, 1); // January 1st of the given year
    const endDate = new Date(parsedYear, 11, 31, 23, 59, 59, 999); // December 31st of the given year

    // Construct the base query for date range
    let query = {
      invoiceDate: { $gte: startDate, $lt: endDate },
    };

    // Update the query with additional identifiers
    query = updateQueryWithIdentifiers(parsedParams, query);

    // console.log("Constructed Query:", query);

    // Query the database with the constructed query object
    const data = await FormDataSchema.find(query);

    // console.log("Fetched Data:", data);

    res.json({ data });
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    res
      .status(500)
      .json({ message: "Error fetching yearly data", error: error.message });
  }
});

server.get("/fetchMonthlyData", async (req, res) => {
  try {
    const { month } = req.query;

    // Validate the `month` parameter
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res
        .status(400)
        .json({ message: "Invalid month format. Use YYYY-MM." });
    }

    // Parse the year and month
    const [year, monthIndex] = month.split("-").map(Number);

    // Create start and end dates for the given month
    const startDate = new Date(year, monthIndex - 1, 1); // Start of the month
    const endDate = new Date(year, monthIndex, 0, 23, 59, 59, 999); // End of the month

    // console.log("Start Date:", startDate, "End Date:", endDate);

    // Query the database for records within the specified date range
    const data = await FormDataSchema.find({
      invoiceDate: { $gte: startDate, $lt: endDate },
    });

    res.json({ data });
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    res
      .status(500)
      .json({ message: "Error fetching monthly data", error: error.message });
  }
});
server.get("/fetchSpecificMonthlyData", async (req, res) => {
  try {
    const { month, ...identifiers } = req.query;
    const parsedParams = parseQueryParams(identifiers);

    // Validate `year`
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res
        .status(400)
        .json({ message: "Invalid month format. Use YYYY-MM." });
    }
    const [year, monthIndex] = month.split("-").map(Number);

    const startDate = new Date(year, monthIndex - 1, 1); // Start of the month
    const endDate = new Date(year, monthIndex, 0, 23, 59, 59, 999); // End of the month

    // console.log("Start Date:", startDate, "End Date:", endDate);

    let query = {
      invoiceDate: { $gte: startDate, $lt: endDate },
    };

    // Update the query with additional identifiers
    query = updateQueryWithIdentifiers(parsedParams, query);

    // console.log("Constructed Query:", query);

    // Construct the base query for date range

    // Query the database with the constructed query object
    const data = await FormDataSchema.find(query);

    // console.log("Fetched Data:", data);

    res.json({ data });
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    res
      .status(500)
      .json({ message: "Error fetching yearly data", error: error.message });
  }
});
server.get("/fetchTimeFrameData", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate the `startDate` and `endDate` parameters
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Both startDate and endDate are required." });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // console.log("Start Date:", parsedStartDate, "End Date:", parsedEndDate);

    // Query the database for records within the specified date range
    const data = await FormDataSchema.find({
      invoiceDate: { $gte: parsedStartDate, $lt: parsedEndDate },
    });

    res.json({ data });
  } catch (error) {
    console.error("Error fetching time frame data:", error);
    res.status(500).json({
      message: "Error fetching time frame data",
      error: error.message,
    });
  }
});

server.get("/fetchSpecificTimeFrameData", async (req, res) => {
  // console.log("here");

  try {
    const { startDate, endDate, ...identifiers } = req.query;
    const parsedParams = parseQueryParams(identifiers);

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Both startDate and endDate are required." });
    }
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // console.log("Start Date:", parsedStartDate, "End Date:", parsedEndDate);

    let query = {
      invoiceDate: { $gte: startDate, $lt: endDate },
    };

    // Update the query with additional identifiers
    query = updateQueryWithIdentifiers(parsedParams, query);

    // console.log("Constructed Query:", query);

    // Construct the base query for date range

    // Query the database with the constructed query object
    const data = await FormDataSchema.find(query);

    // console.log("Fetched Data:", data);

    res.json({ data });
  } catch (error) {
    console.error("Error fetching yearly data:", error);
    res
      .status(500)
      .json({ message: "Error fetching yearly data", error: error.message });
  }
});
module.exports = server;
