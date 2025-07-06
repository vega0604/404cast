// Points calculation function (returns score)
function calculateScore({ streak, diff, timeToGuess, streakFactor = 2, timeFactor = 0.1, baseFactor = 100 }) {
  // Simple formula: streakBoost + timeBoost + basePoints
  const streakBoost = streak * streakFactor;
  const timeBoost = timeToGuess * timeFactor * (streak + 0.001);
  const basePoints = 1 / (Math.abs(diff) + 0.001) * baseFactor;
  return streakBoost + timeBoost + basePoints;
}

module.exports = {
  calculateScore
};
