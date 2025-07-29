import express from "express"
import http from "http"
import {Server} from "socket.io"

const app = express();

const server = http.createServer(app);

const io = new Server(server);

const port = process.env.PORT || 5000


io.on('connection' , (socket) => {
    console.log('Socket connected' , socket.id);
})


server.listen(port , () => {
    console.log(`App is listening on port ${port}`);
})