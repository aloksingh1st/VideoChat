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

    socket.on("user:call", data => {
        const {to, offer} = data;

        // console.log("User:call ", to);
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });

    socket.on("call:accepted", ({to, ans})=>{
        io.to(to).emit("accepted", {from: socket.id, ans});
    });

    socket.on("peer:nego:needed", ({to , offer})=>{
        io.to(to).emit("peer:nego:needed", {from: socket.id, offer});
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        // console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });


});