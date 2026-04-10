const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const rooms = {};

// Lists for Random Name Generation
const adjectives = ["Calculus", "Matrix", "Fraction", "Decimal", "Geometry", "Algebra", "Integer"];
const animals = ["Cheetah", "Meerkat", "Falcon", "Dolphin", "Gecko", "Iguana", "Alligator"];

io.on('connection', (socket) => {
    // Handle Creating a Room
    socket.on('createRoom', () => {
        const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        const assignedName = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + animals[Math.floor(Math.random() * animals.length)];
        
        rooms[roomId] = {
            players: [{ id: socket.id, name: assignedName, score: 0 }]
        };

        socket.join(roomId);
        socket.emit('roomJoined', { roomId, name: assignedName, isHost: true });
    });

    // Handle Joining a Room
    socket.on('joinRoom', (roomId) => {
        const room = rooms[roomId.toUpperCase()];
        if (room && room.players.length < 4) {
            const assignedName = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + animals[Math.floor(Math.random() * animals.length)];
            
            room.players.push({ id: socket.id, name: assignedName, score: 0 });
            socket.join(roomId.toUpperCase());
            
            socket.emit('roomJoined', { roomId, name: assignedName, isHost: false });
            io.to(roomId.toUpperCase()).emit('updatePlayers', room.players);
        } else {
            socket.emit('error', 'Room not found or full!');
        }
    });
});

http.listen(process.env.PORT || 3000, () => {
    console.log('Server is running!');
});
