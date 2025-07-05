const mongoose = require('mongoose');

// Define the schema for leaderboard entries
const leaderboardSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = {
  Leaderboard
};
