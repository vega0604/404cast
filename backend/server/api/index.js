require('module-alias/register')
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
const conn_string = process.env.MONGODB_URI || 'mongodb://localhost:27017/404cast';
mongoose.connect(conn_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Import routers
const leaderboardsRouter = require('@routers/leaderboards');
const scoresRouter = require('@routers/scores');
const likesRouter = require('@routers/likes');

// Middleware
app.use(express.json());
app.use(cors())

// Mount routers
app.use('/api/leaderboards', leaderboardsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/likes', likesRouter);

app.get("/", (req, res) => res.send("Express on Vercel"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;