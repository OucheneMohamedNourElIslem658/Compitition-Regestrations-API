const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const authRouter = require('./features/auth/routes/auth');
const adminRouter = require('./features/admin/routes/admin_actions');
const engagementRouter = require('./features/engage/routes/engage');
const userHandler = require('./features/auth/sockets/user');
const teamHandler = require('./features/engage/websockets/teams');

app.use(express.json());
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/engage', engagementRouter);


const io = require('socket.io')(server, {
    cors: { origin: "*" }
})

io.of('/auth').on('connection', userHandler)
io.of('/teams').on('connection', teamHandler)

let PORT = 5000;
let host = '127.0.0.1';
app.get('/', (_, res) => {
    res.send('Welcome To A Hackathon Registrations API!');
});

server.listen(PORT, host, () => {
    let url = `http://${host}:${PORT}/`;
    console.log(`Listening from ${url}`);
});