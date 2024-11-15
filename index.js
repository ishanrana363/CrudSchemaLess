const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// MongoDB Connection
const uri = "mongodb+srv://schema:DpuKr64sQcMZxd6Y@cluster0.zuvfpqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Connect to MongoDB and setup routes
async function run() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        const database = client.db("userData");
        const usersCollection = database.collection("users");

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Routes
        app.post("/register", async (req, res) => {
            const user = req.body;

            try {
                const result = await usersCollection.insertOne(user);
                res.status(201).json({
                    status: "success",
                    data: result,
                    message: "User registered successfully",
                });
            } catch (error) {
                res.status(500).json({
                    status: "fail",
                    message: error.message,
                });
            }
        });

        

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}

run();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
