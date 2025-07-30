import express from "express"
import http from "http"
import {Server} from "socket.io"

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const port = process.env.PORT || 5000

const userSocketMap = {}

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}


io.on('connection' , (socket) => {
    console.log('Socket connected' , socket.id);

    socket.on('join', ({roomId , username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id
            })
        })
    })

    socket.on('disconnecting' , () => {
        const rooms = [...socket.rooms];

        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })
})


server.listen(port , () => {
    console.log(`App is listening on port ${port}`);
})