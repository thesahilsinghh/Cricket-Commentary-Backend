import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from './config.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// Middleware
dotenv.config();
app.use(cors());
app.use(express.json());

// Store io instance for use in routes
app.set('io', io);

// Routes
import matchesRouter from './routes/matches.js';
app.use('/matches', matchesRouter);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join match room for real-time updates
    socket.on('joinMatch', (matchId) => {
        socket.join(`match-${matchId}`);
        console.log(`Client ${socket.id} joined match ${matchId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Connect to MongoDB
connectDB()
// Start server
server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});
