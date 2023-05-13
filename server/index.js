const {Server} = require("socket.io");

// import { Server } from "socket.io";

const io = new Server(8000, {
    cors: true,
});

const emailToSocketIdMap = new Map();
const socketIdToEmail = new Map();

io.on("connection", (socket)=>{
    console.log("Socket connection established", socket.id);
    socket.on("room:join", data=>{
        const {email, roomId} = data;

        emailToSocketIdMap.set(email, socket.id);
        socketIdToEmail.set(socket.id, email);

        io.to(roomId).emit("user:joined",{email, id:socket.id});
        socket.join(roomId)
 
        io.to(socket.id).emit("room:join", data)
    })

    socket.on("user:call", ({to , offer})=>{
        io.to(to).emit("incoming:call",{from:socket.id, offer})
    })
})