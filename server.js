import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Enable CORS for development so frontend on 5173 can connect to server on 3000
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve production static assets from 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// For SPA routing, direct all unresolved GET requests to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// In-memory Room States: Map<roomId, Room>
// Room interface: { roomId, hostSocketId, gameState, players: Map<socketId, Player> }
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  // 1. Host creates a Room
  socket.on('host-create-room', (roomId) => {
    socket.join(roomId);
    rooms.set(roomId, {
      roomId,
      hostSocketId: socket.id,
      gameState: null,
      players: new Map()
    });
    console.log(`Room [${roomId}] created by Host ${socket.id}`);
  });

  // 2. Player joins a Room
  socket.on('player-join-room', ({ roomId, teamId, name }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('join-error', 'Phòng không tồn tại hoặc đã đóng!');
      return;
    }

    socket.join(roomId);
    
    // Register player
    const player = { socketId: socket.id, teamId, name };
    room.players.set(socket.id, player);

    console.log(`Player ${name} joined Room [${roomId}] as Team ${teamId}`);

    // Notify the host about connection
    io.to(room.hostSocketId).emit('player-connected', {
      socketId: socket.id,
      teamId,
      name
    });

    // If host has an active game state, sync the new player immediately
    if (room.gameState) {
      socket.emit('state-updated', room.gameState);
    }
  });

  // 3. Player sends an action to Host
  socket.on('player-action', ({ roomId, action }) => {
    const room = rooms.get(roomId);
    if (room && room.hostSocketId) {
      // Forward player's action (e.g. select question, click card) to Host
      io.to(room.hostSocketId).emit('host-receive-action', {
        socketId: socket.id,
        action
      });
    }
  });

  // 4. Host broadcasts updated state to all clients in the Room
  socket.on('host-broadcast-state', ({ roomId, gameState }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.gameState = gameState;
      // Broadcast state to all connected players in the room
      socket.to(roomId).emit('state-updated', gameState);
    }
  });

  // 5. Client Disconnects
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
    
    // Clean up rooms
    for (const [roomId, room] of rooms.entries()) {
      // If Host disconnected
      if (room.hostSocketId === socket.id) {
        console.log(`Host left Room [${roomId}], shutting down room.`);
        socket.to(roomId).emit('host-disconnected');
        rooms.delete(roomId);
        break;
      }
      
      // If Player disconnected
      if (room.players.has(socket.id)) {
        const player = room.players.get(socket.id);
        console.log(`Player ${player.name} left Room [${roomId}]`);
        
        io.to(room.hostSocketId).emit('player-disconnected', {
          socketId: socket.id,
          teamId: player.teamId,
          name: player.name
        });
        
        room.players.delete(socket.id);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`=== SERVER ONLINE: Listening on http://localhost:${PORT} ===`);
});
