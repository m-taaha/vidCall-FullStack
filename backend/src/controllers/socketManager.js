import { Server } from "socket.io";

let connections = {};
let message = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
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



      socket.to(path).emit("User joined", //notifying others a new user joined except the user itself
         {socketId: socket.id})
    })


    const otherUsers = connections[path].filter((id) => id !== socket.id);
    io.to(socket.id).emit("all users", 
      otherUsers
    )




    socket.on("disconnect", () => {
      console.log("User left:", socket.id);
    });
  });

  return io;
};



    // //passing signaling data between peers as a middle-man
    // socket.on("signal", (toId, message) => {
    //   io.to(toId).emit("signal", socket.id, message);
    // });

    // //chat messages
    // socket.on("chat-message", (data, sender) => {
    //   const { roomId, messageText } = data;

    //   if (!message[roomId]) {
    //     message[roomId] = []; // initialize message - if not exists
    //   }

    //   //save message in memory
    //   message[roomId].push({
    //     sender,
    //     text: messageText,
    //     time: new Date(),
    //   });

    //   //broadcast to all in room
    //   io.to(roomId).emit("chat-message", { sender, text: messageText });
    // });

    // Clean up function - When someone closes their tab, your code loops through all rooms to find that user, removes them from the list, and notifies the remaining people so they can stop trying to show that person's video.
