import { Server } from 'socket.io';

let io;

export const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', data);
        });

        socket.on('stop typing', () => {
            socket.broadcast.emit('stop typing');
        });
    });

    return io;
};

export default io; 