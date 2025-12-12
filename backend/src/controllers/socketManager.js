import { Server } from "socket.io";

//Keeps track of which sockets are in which "room" (path)
// [path1 : [socket1, socket2 ....], path2 = [.....], .... ]
let connections = {};
// [ path1 : [{
//     "data": "hello",
//     "sender": "username",
//     "socket-id-sender": "abcd1234"
// }, { ...... }, .....], path2 : ..... ]
let messages = {};
//Stores when each socket joined
let timeOnline = {};
//Stores username for each socket
let usernames = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected");
    socket.on("join-call", (path, username) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();
      usernames[socket.id] = username || `User ${socket.id.substring(0, 6)}`;

      //send message to each user in curr path with username info
      connections[path].forEach((s) => {
        io.to(s).emit("user-joined", socket.id, connections[path], usernames);
      });
      if (messages[path] !== undefined) {
        messages[path].forEach((message) => {
          //if a new socket joins, load chat histroy to that socket
          io.to(socket.id).emit(
            "chat-message",
            message["data"],
            message["sender"],
            message["socket-id-sender"]
          );
        });
      }
    });
    //? p2p
    socket.on("signal", (told, message) => {
      io.to(told).emit("signal", socket.id, message);
    });
    //when client sends a message
    socket.on("chat-message", (data, sender) => {
      //object.entries() -> converts a object into array of key, value elements
      //in connections find the matching room which has curr socket id
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        [" ", false]
      );
      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log(`${messages[matchingRoom]}`);

        //for each person in room send data
        connections[matchingRoom].forEach((s) => {
          io.to(s).emit("chat-message", data, sender, socket.id);
        });
      }
    });
    socket.on("disconnect", () => {
      let diffTime = Math.abs(timeOnline[socket.id] - new Date());
      for (const [room, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          //notify everyone in room
          users.forEach((user) => {
            io.to(user).emit("user-left", socket.id);
          });
          //remove current user
          connections[room] = users.filter((id) => id != socket.id);
          //delete username
          delete usernames[socket.id];
          //delete empty room
          if (connections[room].length === 0) {
            delete connections[room];
          }
          break;
        }
      }
    });
  });
  return io;
};
