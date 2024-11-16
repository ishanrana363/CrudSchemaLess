const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

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

module.exports = { createUser };
