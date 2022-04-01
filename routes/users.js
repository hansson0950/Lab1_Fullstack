const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Getting all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });     
    }
});

// Getting a user
router.get("/:id", getUser, (req, res) => {
    res.json(res.user);
});

// Creating a user
router.post("/", async (req, res) => {

    const userExists = await User.exists({ name: req.body.name });

    if (userExists) {
        res.status(400).json({ message: "Name is already in use"})
        return;
    }
    const user = new User({
        name: req.body.name,
        age: req.body.age
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// Updating a user
router.patch("/:id", getUser, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name;
    }
    if (req.body.age != null) {
        res.user.age = req.body.age;
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deleting a user
router.delete("/:id", getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: "User deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User does not exist" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.user = user;
    next();
}

module.exports = router;