const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {connectToDatabase} = require("./db");
const userRoutes = require("./routes/userRoutes");



const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

(async () => {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users")

    app.use("/api/v1", userRoutes(usersCollection));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
