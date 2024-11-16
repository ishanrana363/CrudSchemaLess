const express = require("express");
const {
    createUser,
    loginUser,

} = require("../controllers/userController");

function userRoutes(usersCollection) {
    const router = express.Router();
    router.post("/users", (req, res) => createUser(req, res, usersCollection));
    router.post("/login",(req,res)=>loginUser(req, res,usersCollection));
    return router;
}

module.exports = userRoutes;
