import { Server } from "socket.io";

let connections = {};
let message = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // join-room logic
    socket.on("join-room", (path) => {
      // checking if connection exists or not other wise the server will crash
      if (!connections[path]) {
        connections[path] = []; //initialize if doesn't exist
      }

      connections[path].push(socket.id); //whatever the socket id is push it into the connections
      timeOnline[socket.id] = new Date(); //track when user joined

      socket.join(path); // is like a user turning their radio dial to that specific frequency.

      console.log(`${socket.id} joined the room ${path}`);

      socket.to(path).emit(
        "User joined", //notifying others a new user joined except the user itself
        { socketId: socket.id }
      );

        const otherUsers = connections[path].filter((id) => id !== socket.id);
        io.to(socket.id).emit("all users", otherUsers);
    });

  

    // the signal - this is a way SDP (Session Description Protocol) - like a digital business card that contains - what does codecs i support, what audio formats i can handle, my security fingerprints - all comes under SDP - to exchange these business card we need a way for one user to send a message to as specific person via our server. that is called signal

    // Passing a signalling data between peers as a middleman
    socket.on("signal", (data) => {
      const {userToSignal, signal, callerId} = data;
      // we send the the message to the specific toId
      // but we also include the 'socket.id' of the sender so the reciever knows who to reply to!
      io.to(userToSignal).emit("signal", {
        senderId: callerId,
        signal: signal
      })
    });

    //chat messages
    socket.on("chat-message", (data, sender) => {
      const { roomId, messageText } = data;

      if (!message[roomId]) {
        message[roomId] = []; // initialize message - if not exists
      }

      //save message in memory
      message[roomId].push({
        sender,
        text: messageText,
        time: new Date(),
      });

      //broadcast to all in room
      socket.to(roomId).emit("chat-message", { sender, text: messageText });
    });



    // Clean up function - When someone closes their tab, your code loops through all rooms to find that user, removes them from the list, and notifies the remaining people so they can stop trying to show that person's video.

    socket.on("disconnect", () => {
      console.log("User left:", socket.id);

      // loop through all rooms in our conection object
      for (const path in connections) {
        // we filter out the disconnected socket.id from teh room's array
        connections[path] = connections[path].filter((id) => id !== socket.id);

        // if the room now is empty, ew can delete the room entirely to save memory
        if (connections[path].length === 0) {
          delete connections[path];
        } else {
          // if people are still there, notify them that this user left
          socket.to(path).emit("user-left", socket.id);
        }
      }
    });
  });

  return io;
};


