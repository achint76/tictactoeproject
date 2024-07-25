const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    points: {
        type: Number,
        default: 0
    }
});

const ScoresModel = mongoose.model('scores', scoreSchema);
module.exports = ScoresModel;