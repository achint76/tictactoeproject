// // routes/scores.js
// const express = require('express');
// const ScoresModel = require('../models/scores.model');
// const User = require('../models/users.model');

// const router = express.Router();

// // Leaderboard endpoint
// router.get('/leaderboard', async (req, res) => {
//     try {
//         // Finding all scores and using populate for user details
//         const scores = await ScoresModel.find()
//             .populate('userId', 'username')
//             .sort({ points: -1 }); // Sort by points in descending order

//         res.status(200).json(scores);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// });

// // Score update endpoint
// router.post('/update-score', async (req, res) => {
//     const { userId, points } = req.body;

//     try {
//         // Find the score document for the user
//         let score = await ScoresModel.findOne({ userId });

//         if (!score) {
//             // If no score document exists, create a new one
//             score = new ScoresModel({ userId, points });
//         } else {
//             // Update the existing score
//             score.points += points;
//         }

//         // Save the score document
//         await score.save();

//         res.status(200).json({ message: 'Score updated successfully!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// });

// module.exports = router;




const express = require('express');
const ScoresModel = require('../models/scores.model');

const router = express.Router();

// Leaderboard endpoint
router.get('/leaderboard', async (req, res) => {
    try {
        const scores = await ScoresModel.find()
            .populate('userId', 'username')
            .sort({ points: -1 });

        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Handle game result endpoint
router.post('/handle-result', async (req, res) => {
    const { winnerId, loserId } = req.body;

    try {
        // Update winner's score
        console.log("handleresult in score.js");
        let winnerScore = await ScoresModel.findOne({ userId: winnerId });

        if (!winnerScore) {
            winnerScore = new ScoresModel({ userId: winnerId, points: 2 });
        } else {
            winnerScore.points += 2;
        }

        await winnerScore.save();

        // Update loser's score
        let loserScore = await ScoresModel.findOne({ userId: loserId });

        if (!loserScore) {
            loserScore = new ScoresModel({ userId: loserId, points: -1 });
        } else {
            loserScore.points -= 1;
        }

        await loserScore.save();

        res.status(200).json({ message: 'Game result handled successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
