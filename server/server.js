const express = require('express');
const cors = require('cors');

const app = express();
const {MongoClient, ServerApiVersion} = require('mongodb');

app.use(cors({
    origin: '*'
}));


const data = [
    {
        screenId: 1,
        name: 'ad1',
        template: './templateA.html',
        length: 3,
        showTimes: [
            {
                startDate: '10/1/2019',
                endDate: '31/12/2019',
                weekDays: [2],
                dayHours: {
                    start: [6, 0],
                    end: [12, 0]
                }
            },
            {
                startDate: '10/1/2019',
                endDate: '31/12/2019',
                weekDays: [4],
                dayHours: {
                    start: [13, 0],
                    end: [20, 0]
                }
            },
        ]
    },
    {
        screenId: 2,
        name: 'ad1',
        template: './templateA.html',
        length: 3,
        showTimes: [
            {
                startDate: '10/1/2019',
                endDate: '31/12/2019',
                weekDays: [2],
                dayHours: {
                    start: [6, 0],
                    end: [12, 0]
                }
            },
            {
                startDate: '10/1/2019',
                endDate: '31/12/2019',
                weekDays: [4],
                dayHours: {
                    start: [13, 0],
                    end: [20, 0]
                }
            },
        ]
    },
    {
        screenId: 1,
        name: 'ad2',
        template: './templateB.html',
        length: 3,
        showTimes: [
            {
                startDate: '1/3/2019',
                endDate: '30/4/2019',
                weekDays: [3, 4],
                dayHours: {
                    start: [10, 0],
                    end: [16, 0]
                }
            },
        ]
    },
    {
        screenId: 3,
        name: 'ad2',
        template: './templateB.html',
        length: 3,
        showTimes: [
            {
                startDate: '1/3/2019',
                endDate: '30/4/2019',
                weekDays: [3, 4],
                dayHours: {
                    start: [10, 0],
                    end: [16, 0]
                }
            },
        ]
    },
    {
        screenId: 2,
        name: 'ad3',
        template: './templateC.html',
        length: 3,
        showTimes: [
            {
                startDate: '1/5/2019',
                endDate: '15/6/2019',
                weekDays: [1, 2, 3, 4, 5, 6, 7],
                dayHours: {
                    start: [8, 0],
                    end: [22, 0]
                }
            },
        ]
    },
    {
        screenId: 3,
        name: 'ad3',
        template: './templateC.html',
        length: 3,
        showTimes: [
            {
                startDate: '1/5/2019',
                endDate: '15/6/2019',
                weekDays: [1, 2, 3, 4, 5, 6, 7],
                dayHours: {
                    start: [8, 0],
                    end: [22, 0]
                }
            },
        ]
    },
    {
        screenId: 1,
        name: 'ad4',
        template: './templateA.html',
        length: 3,
        showTimes: [
            {
                startDate: '29/3/2019',
                endDate: '15/4/2019',
                weekDays: [2],
                dayHours: {
                    start: [15, 0],
                    end: [19, 0]
                }
            },
        ]
    },
    {
        screenId: 3,
        name: 'ad5',
        template: './templateB.html',
        length: 3,
        showTimes: [
            {
                startDate: '1/4/2019',
                endDate: '30/4/2019',
                weekDays: [2, 3, 4],
                dayHours: {
                    start: [1, 0],
                    end: [23, 0]
                }
            },
        ]
    },
];

app.get('/', (req, res) => {
    res.send('Successful response.');
});
app.get('/screen/:id', (req, res) => {
    const screen = req.params.id
    const ads = data.filter((value, index) => value.screenId.toString() === screen.toString());
    res.json(ads);
});
app.get('/mongo', (req, res) => {
    const uri = "mongodb+srv://admin:admin@amitscluster.cwj2a.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });
    client.connect(err => {
        const collection = client.db("test").collection("tst");
        console.log(collection)
        var myobj = {
            screenId: 1,
            name: 'ad1',
            template: './templateA.html',
            length: 3,
            showTimes: [
                {
                    startDate: '10/1/2019',
                    endDate: '31/12/2019',
                    weekDays: [2],
                    dayHours: {
                        start: [6, 0],
                        end: [12, 0]
                    }
                },
                {
                    startDate: '10/1/2019',
                    endDate: '31/12/2019',
                    weekDays: [4],
                    dayHours: {
                        start: [13, 0],
                        end: [20, 0]
                    }
                },
            ]
        };
        collection.insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
        });

        // perform actions on the collection object

    });

    res.send("ok")
});

app.listen(8080, () => console.log('Example app is listening on port 8080.'));