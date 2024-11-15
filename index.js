const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

        app.get("/users", async (req, res) => {
            try {
                const users = await usersCollection.find().toArray();
                res.status(200).json({
                    status: "success",
                    data: users,
                    message: "All users retrieved successfully",
                });
            } catch (error) {
                res.status(500).json({
                    status: "fail",
                    message: error.message,
                });
            }
        });

        app.get("/user/:id", async (req, res) => {
            const id = req.params.id;
            try {
                const user = await usersCollection.findOne({ _id: new ObjectId(id) });
                if (user) {
                    res.status(200).json({
                        status: "success",
                        data: user,
                        message: "User retrieved successfully",
                    });
                } else {
                    res.status(404).json({
                        status: "fail",
                        message: "User not found",
                    });
                }
            } catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "An error occurred while retrieving the user",
                    error: error.message,
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
