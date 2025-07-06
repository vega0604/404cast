const fs = require('fs');
const path = require('path');

// Function to load JSON file
function loadJsonFile(filename) {
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading JSON file ${filename}:`, error.message);
        return null;
    }
}

// Load JSON files once when module is imported
const neighbourhoodRisks = loadJsonFile('neighbourhood_risks.json');
const coordsHoodMap = loadJsonFile('coords_hood_map.json');
console.log(neighbourhoodRisks)
console.log(coordsHoodMap)

// Points calculation function (returns score)
function calculateScore(lat, long, streak, time, guess, timeFactor = 0.8, streakFactor = 0.5) {
    const hood = getHood(lat, long);
    const risk = getRiskRating(hood);
    const diff = Math.abs(guess - risk);
    
    // Base score calculation based on accuracy (0-100 scale)
    // Perfect guess (diff = 0) = 100 points
    // Maximum difference (diff = 100) = 10 points
    const accuracyScore = Math.max(10, 100 - diff);
    
    // Streak bonus: rewards consecutive correct guesses (0-100 points)
    const streakBonus = Math.min(100, streak * 20);
    
    // Time bonus: only applies if the guess is accurate (small difference)
    // No time bonus for inaccurate guesses
    let timeBonus = 0;
    if (diff <= 20) { // Only give time bonus for reasonably accurate guesses
        // Faster is better (0-50 points)
        // Assuming time is in seconds, max bonus for very fast guesses
        timeBonus = Math.max(0, Math.min(50, (30 - time) * 2));
    }
    
    // Calculate total score
    const totalScore = accuracyScore + timeBonus + streakBonus;
    
    return {
        score: Math.round(totalScore), 
        answer: risk,
        breakdown: {
            accuracy: Math.round(accuracyScore),
            timeBonus: Math.round(timeBonus),
            streakBonus: Math.round(streakBonus)
        }
    };
}

function getHood(lat, long) {
    if (!coordsHoodMap) return null;

    // Find the closest coordinate match
    let closestHood = null;
    let minDistance = Infinity;

    for (const coord of coordsHoodMap) {
        const [coordLat, coordLong, hoodCode] = coord;
        const distance = Math.sqrt(
            Math.pow(lat - coordLat, 2) + Math.pow(long - coordLong, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closestHood = hoodCode;
        }
    }

    return closestHood;
}

function getRiskRating(hood) {
    if (!hood) return 50; // Default risk if no hood found
    if (!neighbourhoodRisks) return 50; // Default risk if data not loaded

    return neighbourhoodRisks[hood] || 50; // Return 50 as default if hood not found
}

module.exports = {
    calculateScore,
    loadJsonFile,
    getHood,
    getRiskRating
};
