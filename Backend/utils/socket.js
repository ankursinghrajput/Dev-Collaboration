const Socket = require("socket.io");

const initializeSocket = (server) => {
    const io = Socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        // Handle Events
        socket.on("joinChat", () => {

        });

        socket.on("sendMessage", () => {

        });

        socket.on("typing", () => {

        });

        socket.on("disconnect", () => {

        });

    });
};

module.exports = initializeSocket;
