const mongoose = require("mongoose");

const url =
  "mongodb+srv://admin:admin@backend.3fn3q.mongodb.net/BookTrust?retryWrites=true&w=majority&appName=BackEnd";

// Connect to the MongoDB cluster
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB successfully!");

    // Now you can specify your database and collection
    const database = mongoose.connection.db; // Access the 'BookTrust' database
    console.log("Accessed database:", database.databaseName);

    // Specify the collection you want to interact with
    const collectionName = "fakedatas"; // Replace with your collection name
    const collection = database.collection(collectionName);
    console.log("Interacting with collection:", collectionName);

    // Example: Query the collection
    collection.find({}).toArray((err, docs) => {
      if (err) {
        console.error("Error fetching documents:", err);
      } else {
        console.log("Documents fetched:", docs);
        if (docs.length === 0) {
          console.log("No documents found in the collection.");
        } else {
          console.log("Number of documents fetched:", docs.length);
        }
      }
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Log any MongoDB specific warnings or errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection disconnected");
});

// Monitor if the connection to MongoDB is successful or failed
mongoose.connection.on("open", () => {
  console.log("MongoDB connection is open and active");
});
