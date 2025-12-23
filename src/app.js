
const express = require('express');

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

module.exports = app;
