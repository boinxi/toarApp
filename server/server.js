// Requires
const express = require('express');
const cors = require('cors');
const http = require('http');
var MongoClient = require('mongodb').MongoClient;
const {Server} = require("socket.io");

// Init
const app = express();
const server = http.createServer(app);
var connection = null;
const io = new Server(server);
var socketToScreenIdMap = {};

// Functions
const handleConnection = (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        delete socketToScreenIdMap[socket.id]
        console.log('user disconnected, deleted socket:', socket.id);
    });
    socket.on('screenId', (id) => {
        socketToScreenIdMap[socket.id] = id;
        console.log('user sent screen info, sockets are:', socketToScreenIdMap)
        connection.find({screenId: parseInt(id)}).toArray(function (err, result) {
            if (err) res.send(err)
            io.to(socket.id).emit('data', result);
        });
    });
}


// Routes and middlewares
app.use(cors({
    origin: '*'
}));
app.use(express.static('../client'))

MongoClient.connect("mongodb://localhost:27017/mydb", function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    connection = dbo.collection("ads")
    console.log("successful connection to MONGO!")
});

app.get('/', (req, res) => {
    res.send('Successful response.');
});
app.get('/mongo', async (req, res) => {
    connection.find({}).toArray(function (err, result) {
        if (err) res.send(err)
        res.json(result)
    });
});
app.get('/screen/:screen', async (req, res) => {
    const {screen} = req.params;
    connection.find({screenId: parseInt(screen)}).toArray(function (err, result) {
        if (err) res.send(err)
        res.json(result)
    });
});

app.get('/msg/:msg', (req, res) => {
    const {msg} = req.params;
    console.log('emmiting', msg)
    io.emit('msg', msg)
    res.send("sent")
});

app.get('/resendAll', (req, res) => {
    var screenToSockets = {}
    for (const [key, value] of Object.entries(socketToScreenIdMap)) {
        if (value in screenToSockets) {
            screenToSockets[value].push(key)
        } else {
            screenToSockets[value] = [key]

        }
    }
    console.log("screenToSockets", screenToSockets);
    for (const [screenId, sockets] of Object.entries(screenToSockets)) {
        connection.find({screenId: parseInt(screenId)}).toArray(function (err, result) {
            if (err) res.send(err)
            console.log("sending to sockets", sockets, 'data', result)
            for (const sock of sockets) {
                io.to(sock).emit('data', result);
            }
        });
    }
    res.send("sending to map: " + screenToSockets.toString())
});

app.get('/testUpdate', (req, res) => {
    const {id} = req.query;
    var data = [{
        "screenId": parseInt(id),
        "name": "templateSocket",
        "template": "./templateSocket.html",
        "length": 3,
        "showTimes": [
            {
                "startDate": "10/1/2019",
                "endDate": "12/12/2025",
                "weekDays": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6
                ],
                "dayHours": {
                    "start": [
                        1,
                        0
                    ],
                    "end": [
                        23,
                        0
                    ]
                }
            }
        ]
    }];
    connection.insertMany(data, function (err, insertRes) {
        if (err) throw err;
        console.log("1 document inserted");
        var sockets = []
        for (const [key, value] of Object.entries(socketToScreenIdMap)) {
            if (value == id) {
                sockets.push(key)
            }
        }
        connection.find({screenId: parseInt(id)}).toArray(function (err, result) {
            if (err) res.send(err)
            for (const sock of sockets) {
                io.to(sock).emit('data', result);
            }
        });

        res.send("sending to sockets: " + sockets.toString())
    });

})

// SocketIO
io.on('connection', handleConnection);

// Starting the server
server.listen(8080, () => {
    console.log('Example app is listening on port 8080.');
});

