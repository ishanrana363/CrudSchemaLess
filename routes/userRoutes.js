const express = require("express");
const {
    createUser,
    loginUser,
    userProfile, 
    updateUserProfile,
    allUsers,
    deleteUser
    
} = require("../controllers/userController");
const { isLogIn } = require("../middleware/authMiddleware");

function userRoutes(usersCollection) {
    const router = express.Router();

    // Route to create a user
    router.post("/users", (req, res) => createUser(req, res, usersCollection));
    router.get("/all-user", (req, res) => allUsers(req, res, usersCollection));
    router.delete("/delete-user/:id", (req, res) => deleteUser(req, res, usersCollection));

    // Route to log in a user
    router.post("/login", (req, res) => loginUser(req, res, usersCollection));

    // Route to get user profile (protected route)
    router.get(
        "/user-profile",
        isLogIn, // Middleware to verify if the user is logged in
        (req, res) => userProfile(req, res, usersCollection)
    );
    router.put(
        "/update-profile", isLogIn, // Middleware to verify
        (req, res) => updateUserProfile(req, res, usersCollection)
    )

    return router;
}

module.exports = userRoutes;
