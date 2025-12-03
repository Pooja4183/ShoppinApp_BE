require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/mongoose');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

connectDB();

// Step 1: Create HTTP server
const server = http.createServer(app);

// Step 2: Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin:[ process.env.FRONTEND_URL || "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  
});
io.engine.on("initial_headers", (headers, req) => {
  console.log("⚡ Socket.IO handshake attempt from:", req.headers.origin);
});
  
// Optional: Debug socket errors
io.engine.on("connection_error", (err) => {
  console.log(" SOCKET.IO ENGINE ERROR:");
  console.log(err.message, err.code, err.context);
});

// Step 3: Handle socket events
io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED:", socket.id);

  // When client sends a message
  socket.on("clientMessage", (data) => {
    console.log(`Message from ${data.user}: ${data.message}`);
    io.emit("receivedMessage", data); // broadcast to all users
  });

  

  // When a user disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      console.log(` ${socket.username} disconnected`);
      io.emit("userLeft", socket.username);
    } else {
      console.log(`Client disconnected: ${socket.id}`);
    }
  });
});

// Step 4: Start server
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
