const express = require('express');
const cors = require('cors');
var nStatic = require('node-static');

const app = express();
var MongoClient = require('mongodb').MongoClient;
var connection = null;

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
        console.log(result)
        res.json(result)
    });
});

app.listen(8080, () => console.log('Example app is listening on port 8080.'));