const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
const conn_string = 'mongodb+srv://admin:xEExa9A6G0xuYSC3@notfound.fi3bmfs.mongodb.net/?retryWrites=true&w=majority&appName=NotFound';
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
const leaderboardsRouter = require('./routers/leaderboards');
const scoresRouter = require('./routers/scores');
const predictionsRouter = require('./routers/predictions');
const likesRouter = require('./routers/likes');

// Middleware
app.use(express.json());
app.use(cors())

// Mount routers
app.use('/api/leaderboards', leaderboardsRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/likes', likesRouter);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;