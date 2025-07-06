const fs = require('fs');
const path = require('path');

class NeighbourhoodService {
    constructor() {
        this.neighbourhoods = null;
        this.loadNeighbourhoods();
    }

    loadNeighbourhoods() {
        try {
            const dataPath = path.join(__dirname, '../data/kidnap_risk_scores.json');
            const data = fs.readFileSync(dataPath, 'utf8');
            this.neighbourhoods = JSON.parse(data);
            console.log(`Loaded ${Object.keys(this.neighbourhoods).length} neighbourhoods with coordinates`);
        } catch (error) {
            console.error('Error loading neighbourhood data:', error);
            this.neighbourhoods = {};
        }
    }

    // Calculate distance between two coordinates using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Find nearest neighbourhood to given coordinates
    findNearestNeighbourhood(lat, lng) {
        if (!this.neighbourhoods) {
            console.error('Neighbourhoods not loaded');
            return null;
        }

        let nearestNeighbourhood = null;
        let minDistance = Infinity;

        for (const [name, data] of Object.entries(this.neighbourhoods)) {
            const distance = this.calculateDistance(
                lat, lng, 
                data.latitude, data.longitude
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestNeighbourhood = {
                    name: name,
                    riskScore: data.risk_score,
                    coordinates: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    },
                    distance: distance
                };
            }
        }

        return nearestNeighbourhood;
    }

    // Get risk prediction for coordinates
    predictRiskForLocation(lat, lng) {
        try {
            const nearest = this.findNearestNeighbourhood(lat, lng);
            
            if (!nearest) {
                return {
                    location: { lat, lng },
                    neighbourhood: 'Unknown',
                    riskScore: 50,
                    distance: null,
                    success: false
                };
            }

            return {
                location: { lat, lng },
                neighbourhood: nearest.name,
                riskScore: nearest.riskScore,
                distance: Math.round(nearest.distance * 100) / 100, // Round to 2 decimal places
                neighbourhoodCoordinates: nearest.coordinates,
                success: true
            };

        } catch (error) {
            console.error('Error predicting risk for location:', error);
            return {
                location: { lat, lng },
                neighbourhood: 'Error',
                riskScore: 50,
                distance: null,
                success: false,
                error: error.message
            };
        }
    }

    // Get all neighbourhoods (for debugging)
    getAllNeighbourhoods() {
        return this.neighbourhoods;
    }

    // Get random neighbourhood coordinates (for testing)
    getRandomNeighbourhoodCoordinates() {
        if (!this.neighbourhoods) return null;
        
        const neighbourhoodNames = Object.keys(this.neighbourhoods);
        const randomName = neighbourhoodNames[Math.floor(Math.random() * neighbourhoodNames.length)];
        const data = this.neighbourhoods[randomName];
        
        return {
            name: randomName,
            latitude: data.latitude,
            longitude: data.longitude,
            riskScore: data.risk_score
        };
    }
}

module.exports = new NeighbourhoodService();