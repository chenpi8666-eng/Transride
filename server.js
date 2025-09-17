const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Root route - serve the upload page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No video file uploaded' 
            });
        }

        const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            message: 'Video uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            url: videoUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Upload failed',
            error: error.message
        });
    }
});

// Get list of uploaded videos
app.get('/videos', (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir);
        const videoFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].includes(ext);
        });

        const videos = videoFiles.map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            return {
                filename: file,
                url: `${req.protocol}://${req.get('host')}/uploads/${file}`,
                size: stats.size,
                uploadDate: stats.birthtime
            };
        });

        res.json({
            success: true,
            videos: videos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get video list',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 100MB.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: error.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Upload videos at http://localhost:${PORT}`);
});