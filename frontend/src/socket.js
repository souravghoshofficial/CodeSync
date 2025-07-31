import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 3000,
        timeout: 30000,
        transports: ['websocket'],

    };
    return io(import.meta.env.VITE_BACKEND_URL, options);
};