// MODULE IMPORTS ------------------------------------

const express = require("express"); // Express framework module
const dotenv = require("dotenv"); // Dotenv module for managing environment variable
const connectDB = require("./config/db"); // Mongoose module for integrating MongoDB
const socketio = require("socket.io"); //socket.io module

// DEV-DEPENDENCIES
const morgan = require("morgan"); // Morgan module for logging API request objects
const cors = require("cors"); //CORS module for cross origin resource sharing i.e. between different ports in same ip

//
// MODULE IMPLEMENTATIONS ---------------------------------
//

dotenv.config({ path: "./config/config.env" }); // loading environment variables

connectDB(); // Database connection

const app = express(); // Express app

app.use(express.static(`${__dirname}/public/upload`));

app.use(express.json()); // Middleware for parsing requests into JSON format and store in req.body

if (process.env.NODE_ENV === "dev") app.use(morgan("dev")); // Logger for requests

app.use(cors()); // Cross origin enabler

// ROUTES ---
const apiRouter = require("./api/routes/apiRoutes");
app.use("/api", apiRouter); // (@param1: route, @param2 handler)
// routes ---

// SERVER ---
const PORT = process.env.PORT || process.argv[2] || 4000;
const server = app.listen(PORT, "0.0.0.0", () => console.log(`Server running at ${PORT}.`));
// server ---

// SOCKETS ---
const io = socketio(server);
//namespaces
const text = io.of("/text");
const video = io.of("/video");

// connection handlers
text.on("connection", (socket) =>
	console.log(`Socket connection made. Namespace:Chat, ID: ${socket.id}`)
);

video.on("connection", (socket) =>
	console.log(`Socket connection made. Namespace:VideoChat, ID: ${socket.id}`)
);
// sockets ---

module.exports = server;
