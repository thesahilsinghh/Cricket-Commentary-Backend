import express from 'express';
import { addCommentary, createNewMatch, getAllMatches, getMatchDetailsById } from '../controller/matchController.js';

const router = express.Router();

// Start a new match
router.post('/start', createNewMatch);

// Add commentary for to match
router.post('/:id/commentary', addCommentary);

// Get match details by id
router.get('/:id', getMatchDetailsById);

// Get all matches
router.get('/', getAllMatches);

export default router;
