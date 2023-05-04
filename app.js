const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const { connectDB } = require('./db/connect');
const routes = require("./routes/indexRoutes");
const app = express();

app.use(express.static('public'));

// Middleware
app.use(bodyParser.json());

// Routes
app.use(routes);

// Start server and connectDB

connectDB();
module.exports = app;