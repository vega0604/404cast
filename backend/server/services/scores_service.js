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
    // Simple formula: streakBoost + timeBoost + basePoints
    const baseFactor = 100; // Add missing baseFactor variable

    const hood = getHood(lat, long);
    const risk = getRiskRating(hood);
    const diff = guess - risk;
    const streakBoost = streak * streakFactor;
    const timeBoost = time * timeFactor * (streak + 0.001);
    const basePoints = 1 / (Math.abs(diff) + 0.001) * baseFactor;
    return {score: Math.round(streakBoost + timeBoost + basePoints), answer: risk};
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
