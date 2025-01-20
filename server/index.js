const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Ensure the uploads directory exists
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// User routes
let users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// File upload route
app.post('/uploads', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({
        message: 'File uploaded successfully',
        filePath: `/uploads/${req.file.filename}`
    });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
