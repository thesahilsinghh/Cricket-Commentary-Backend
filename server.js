import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
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

app.set('io', io);

// Routes
import matchesRouter from './routes/matches.js';
app.use('/matches', matchesRouter);

// socket connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinMatch', (matchId) => {
        socket.join(`match-${matchId}`);
        console.log(`Client ${socket.id} joined match ${matchId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// connect to MongoDB
connectDB()

// rtart server
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
