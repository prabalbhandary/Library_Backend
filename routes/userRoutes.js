const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }



        // Create a new user instance
        const newUser = new User({ email, username, password });
        const salt = await bcrypt.genSalt(10)
        
        newUser.password = await bcrypt.hash(password, salt);

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if email and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        

        // Password is correct, create a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return success response with the JWT token
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get user by ID
router.get("/getUser/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json({
            message: "User Fetched Successfully",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching user"
        });
    }
});

// Update user by ID
router.put("/updateUser/:id", async (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
        res.status(200).json({
            message: "User Updated Successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error updating user"
        });
    }
});

// Delete user by ID
router.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({
            message: "User Deleted Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error deleting user"
        });
    }
});

module.exports = router;
