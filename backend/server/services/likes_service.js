const mongoose = require('mongoose');

// Define the schema for likes counter
const likesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: 'main_counter'
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

const Likes = mongoose.model('Likes', likesSchema);

class LikesService {
  // Initialize the counter if it doesn't exist
  async initializeCounter() {
    try {
      const existingCounter = await Likes.findOne({ id: 'main_counter' });
      if (!existingCounter) {
        const newCounter = new Likes({ id: 'main_counter', count: 0 });
        await newCounter.save();
        return newCounter;
      }
      return existingCounter;
    } catch (error) {
      throw new Error(`Failed to initialize counter: ${error.message}`);
    }
  }

  // Get current likes count
  async getLikesCount() {
    try {
      const counter = await Likes.findOne({ id: 'main_counter' });
      if (!counter) {
        const newCounter = await this.initializeCounter();
        return newCounter.count;
      }
      return counter.count;
    } catch (error) {
      throw new Error(`Failed to get likes count: ${error.message}`);
    }
  }

  // Increment likes count
  async incrementLikes() {
    try {
      const counter = await Likes.findOneAndUpdate(
        { id: 'main_counter' },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      return counter.count;
    } catch (error) {
      throw new Error(`Failed to increment likes: ${error.message}`);
    }
  }
}

module.exports = new LikesService();