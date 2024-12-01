const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3001;
const host = 'localhost';

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

// Connect to MongoDB  
mongoose.connect('mongodb://localhost:27017/projectdb')
    .then(() => {
        console.log("Database successfully connected!");
    })
    .catch((error) => {
        console.error("Database connection failed. Please try again later.", error);
    });

// Define Schema  
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
},{collection:'admin'});

const admin = mongoose.model('admin', adminSchema);

// Get admin information  
app.get('/admin', async (req, res) => {
    try {
        const adminInfo = await admin.find(); // Fetch all admin records from the database  
        res.json(adminInfo);
        console.log(adminInfo);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server connection error. Please try again later.', error: error.message });
    }
});

// Start the server  
app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});