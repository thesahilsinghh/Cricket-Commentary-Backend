import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    matchId: { type: Number, required: true, unique: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    venue: { type: String, required: true },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

matchSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Match', matchSchema);
