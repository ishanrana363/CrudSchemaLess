const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const createUser = async (req, res, userCollection) => {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Name, email, and password are required",
        });
    }

    try {
        // Check if email already exists
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "Email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        // Insert new user
        const result = await userCollection.insertOne(newUser);

        // Respond with success
        res.status(201).json({
            status: "success",
            data: {
                id: result.insertedId,
                name: newUser.name,
                email: newUser.email,
            },
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to create user",
        });
    }
};

const loginUser = async (req, res, userCollection) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required",
        });
    }

    try {
        // Check if user exists
        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Replace with your JWT secret
            { expiresIn: "1h" } // Token expiration time
        );

        // Respond with token
        res.status(200).json({
            status: "success",
            data : token,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to log in",
        });
    }
};

module.exports = { createUser,loginUser };
