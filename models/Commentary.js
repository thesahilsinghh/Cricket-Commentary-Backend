import mongoose from 'mongoose';

const commentarySchema = new mongoose.Schema({
    matchId: { type: Number, required: true },
    over: { type: Number, required: true },
    ball: { type: Number, required: true },
    eventType: {
        type: String,
        required: true,
        enum: ['run', 'wicket', 'wide', 'no-ball', 'bye', 'leg-bye', 'boundary', 'six']
    },
    runs: { type: Number, default: 0 },
    description: { type: String, required: true },
    batsman: { type: String },
    bowler: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Commentary', commentarySchema);
