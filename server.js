// i will be writing in the comment why I have used these all tfor set-up  and other things so that it sill help easier to understand to others as well as for me in future


// Importing the Express.js library and assigning it to the constant 'express'
const express = require('express');

// Importing Node.js's built-in HTTP module and assigning it to 'http'
const http = require('http');

// Importing the Socket.io library and assigning it to 'socketIo'
const socketIo = require('socket.io');

// Creating an Express application instance and assigning it to 'app'
const app = express();

// Creating an HTTP server using the Express application 'app' and assigning it to 'server'
const server = http.createServer(app);

// Creating a Socket.io instance attached to the HTTP server 'server' and assigning it to 'io'
const io = socketIo(server);

// Defining the port number for the server to listen on, defaulting to 3000 or using environment variable PORT
const PORT = process.env.PORT || 3000;


// Serve static files from the public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// // Setting up a route handler in Express for the root URL ('/') that sends a response 'Server is running'
// app.get('/', (req, res) => {
//     res.send('Server is running');
// });

let turn = "X";   //serveer maintains the current turn

// Event listener in Socket.io for when a client connects to the server
io.on('connection', (socket) => {
    console.log('A user connected'); // Logging when a user connects

    socket.emit('turn', turn);  //send the current turn to the client when they connect

    socket.on('move', (data) => {
        io.emit('move', data);   //broadcast the move to all clients
        turn = turn === "X" ? "O" : "X"; // Change turn
        io.emit('turn', turn); // Broadcast the new turn to all clients
    });

    socket.on('reset', () => {
        turn = "X";
        io.emit('reset');   //broadcast the reset event to all clients
        io.emit('turn', turn);
    });

    // Event listener for when a client disconnects from the server
    socket.on('disconnect', () => {
        console.log('User disconnected'); // Logging when a user disconnects
    });
});

// Making the server listen on the specified port number (PORT) and logging a message upon successful start
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
