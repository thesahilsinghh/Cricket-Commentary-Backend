import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 1000 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Function to get next match ID
const getNextMatchId = async () => {
    const counter = await Counter.findByIdAndUpdate(
        'matchId',
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return counter.sequence_value;
};

export { Counter, getNextMatchId };
