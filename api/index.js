const express = require("express");
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const morgan = require("morgan");
const app = express();
// Middleware
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());

// Routes
app.use('/api', routes);
app.get("/", (req, res) => res.json("Express on Vercel"));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

module.exports = app;
