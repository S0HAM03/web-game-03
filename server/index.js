require('dotenv').config();
const express = require('express');
const http = require('http');
const geckos = require('@geckos.io/server').default;
const { Packr, Unpackr } = require('msgpackr');
const cors = require('cors');

const path = require('path');

const packr = new Packr();
const unpackr = new Unpackr();

const app = express();
app.use(cors());

// Serve static client assets
app.use(express.static(path.join(__dirname, '../client/dist')));

// Fallback all non-API/non-Geckos routes to React Router
app.get('*', (req, res, next) => {
  if (req.path.includes('geckos.io')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const server = http.createServer(app);
const io = geckos({
  cors: {
    origin: '*', // allow all origins for dev
    allowMethods: ['GET', 'POST']
  }
});
io.addServer(server);

const rooms = {}; // { roomCode: { players: [{id, name, isHost, scores: [], channel: channelObj}], state: 'lobby', round: 0, expectedResponses: 0, currentResponses: 0 } }

function generateRoomCode() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getPlayerList(roomCode) {
  return rooms[roomCode].players.map((p, index) => ({ id: p.id, name: p.name, isHost: p.isHost, color: index }));
}

// Synchronized rounds removed. Players complete rounds independently.

io.onConnection((channel) => {
  console.log('User connected:', channel.id);

  channel.on('create_room', (data) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      players: [{ id: channel.id, name: data.playerName, isHost: true, scores: [], channel }],
      state: 'lobby',
      round: 0
    };
    channel.join(roomCode);
    channel.emit('room_created', { roomCode });
    io.room(roomCode).emit('player_list', getPlayerList(roomCode));
  });

  channel.on('join_room', (data) => {
    const roomCode = data.roomCode.toUpperCase();
    if (rooms[roomCode]) {
      if (rooms[roomCode].state !== 'lobby') {
        channel.emit('room_error', { message: 'Game already in progress' });
        return;
      }
      if (rooms[roomCode].players.length >= 6) {
        channel.emit('room_error', { message: 'Room is full (max 6)' });
        return;
      }
      rooms[roomCode].players.push({ id: channel.id, name: data.playerName, isHost: false, scores: [], channel });
      channel.join(roomCode);
      channel.emit('room_joined', { roomCode });
      io.room(roomCode).emit('player_list', getPlayerList(roomCode));
    } else {
      channel.emit('room_error', { message: 'Invalid room code' });
    }
  });

  channel.on('start_game', (data) => {
    const { roomCode } = data;
    const room = rooms[roomCode];
    if (room && room.players[0].id === channel.id) {
      room.state = 'instructions';
      // Reset ready state for all players
      room.players.forEach(p => p.isReady = false);
      io.room(roomCode).emit('game_started');
    }
  });

  channel.on('player_finished', (data) => {
    const { roomCode, scores } = data;
    const room = rooms[roomCode];
    if (room) {
      const player = room.players.find(p => p.id === channel.id);
      if (player) {
        player.scores = scores;
        player.finished = true;
        
        // Check if all players are finished
        const allFinished = room.players.every(p => p.finished);
        if (allFinished) {
          room.state = 'game_over';
          
          const results = room.players.map(p => {
            const validScores = p.scores.filter(s => s > 0 && s < 10000);
            const best = validScores.length > 0 ? Math.min(...validScores) : 9999;
            return { id: p.id, name: p.name, best: best, scores: p.scores };
          });

          results.sort((a, b) => a.best - b.best);
          io.room(roomCode).emit('game_over', { results });
        }
      }
    }
  });

  channel.onDisconnect(() => {
    console.log('User disconnected:', channel.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === channel.id);
      if (playerIndex !== -1) {
        const isHost = room.players[playerIndex].isHost;
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          delete rooms[roomCode];
        } else {
          if (isHost) {
            room.players[0].isHost = true; // Reassign host
          }
          io.room(roomCode).emit('player_list', getPlayerList(roomCode));
          
          // Check if the remaining players are all finished
          if (room.state !== 'game_over') {
            const allFinished = room.players.every(p => p.finished);
            if (allFinished) {
              room.state = 'game_over';
              const results = room.players.map(p => {
                const validScores = p.scores.filter(s => s > 0 && s < 10000);
                const best = validScores.length > 0 ? Math.min(...validScores) : 9999;
                return { id: p.id, name: p.name, best: best, scores: p.scores };
              });
              results.sort((a, b) => a.best - b.best);
              io.room(roomCode).emit('game_over', { results });
            }
          }
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Geckos.io Server listening on port ${PORT}`);
});
