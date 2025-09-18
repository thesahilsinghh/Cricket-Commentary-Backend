import { getNextMatchId } from "../models/Counter.js";
import Match from "../models/Match.js";
import Commentary from '../models/Commentary.js'


export const createNewMatch = async (req, res) => {
    try {
        const { team1, team2, venue } = req.body;

        if (!team1 || !team2 || !venue) {
            return res.status(400).json({ error: 'Team1, Team2, and venue are required' });
        }

        const matchId = await getNextMatchId();

        const match = new Match({
            matchId,
            team1,
            team2,
            venue
        });

        await match.save();

        res.status(201).json({
            message: 'Match started successfully',
            match: {
                matchId: match.matchId,
                team1: match.team1,
                team2: match.team2,
                venue: match.venue,
                status: match.status,
                createdAt: match.createdAt
            }
        });
    } catch (error) {
        console.error('Error starting match:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



export const addCommentary = async (req, res) => {
    try {
        const matchId = parseInt(req.params.id);
        const { over, ball, eventType, runs, description, batsman, bowler } = req.body;

        if (!over || !ball || !eventType || !description) {
            return res.status(400).json({ error: 'Over, ball, eventType, and description are required' });
        }

        // Check if match exists
        const match = await Match.findOne({ matchId });
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const commentary = new Commentary({
            matchId,
            over,
            ball,
            eventType,
            runs: runs || 0,
            description,
            batsman,
            bowler
        });

        await commentary.save();

        // Emit real-time update
        req.app.get('io').emit('commentaryUpdate', {
            matchId,
            commentary: {
                over: commentary.over,
                ball: commentary.ball,
                eventType: commentary.eventType,
                runs: commentary.runs,
                description: commentary.description,
                batsman: commentary.batsman,
                bowler: commentary.bowler,
                timestamp: commentary.timestamp
            }
        });

        res.status(201).json({
            message: 'Commentary added successfully',
            commentary: {
                over: commentary.over,
                ball: commentary.ball,
                eventType: commentary.eventType,
                runs: commentary.runs,
                description: commentary.description,
                batsman: commentary.batsman,
                bowler: commentary.bowler,
                timestamp: commentary.timestamp
            }
        });
    } catch (error) {
        console.error('Error adding commentary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


export const getMatchDetailsById = async (req, res) => {
    try {
        const matchId = parseInt(req.params.id);

        const match = await Match.findOne({ matchId });
        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        const commentary = await Commentary.find({ matchId }).sort({ over: 1, ball: 1 });

        res.json({
            match: {
                matchId: match.matchId,
                team1: match.team1,
                team2: match.team2,
                venue: match.venue,
                status: match.status,
                createdAt: match.createdAt,
                updatedAt: match.updatedAt
            },
            commentary: commentary.map(c => ({
                over: c.over,
                ball: c.ball,
                eventType: c.eventType,
                runs: c.runs,
                description: c.description,
                batsman: c.batsman,
                bowler: c.bowler,
                timestamp: c.timestamp
            }))
        });
    } catch (error) {
        console.error('Error fetching match details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({ createdAt: -1 });

        res.json({
            matches: matches.map(match => ({
                matchId: match.matchId,
                team1: match.team1,
                team2: match.team2,
                venue: match.venue,
                status: match.status,
                createdAt: match.createdAt,
                updatedAt: match.updatedAt
            }))
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}