const express = require('express');
const http = require("http");
const mongoDB = require('./mongoDB');
const { redis } = require('./redis');
const app = express();
const server = http.createServer(app);
const { getKey, getTopLeaders } = require("./utils")


const io = require("socket.io")(server, { cors: { origin: "*" } });




io.on('connection', (socket) => {

    socket.on("fetchingTopLeader", (data) => {
        getTopLeaders.bind(io)(data);
    })

});





app.get('/addUser/:count', async (req, res) => {
    req.params.count = req.params.count < 1 ? 1 : req.params.count;
    for (let i = 0; i < req.params.count; i++) {
        let data = {
            country: "Turkey",
            username: `user-${i}`,
            money: Math.floor(Math.random() * 100),
            playerId: `p:${i}`
        }
        await mongoDB.insertUser(data);
        redis().zAdd(getKey("Yesterday"), [{
            score: Math.floor(Math.random() * 100),
            value: `p:${i}`
        }]).zAdd(getKey("Today"), [{
            score: Math.floor(Math.random() * 200),
            value: `p:${i}`
        }]);
    }

    getTopLeaders.bind(io)();
    res.json({ success: true });

})


app.get('/zincrby/:memberID/:amount', async (req, res) => {
    redis().zIncrBy(getKey("today"), req.params.amount, req.params.memberID);
    getTopLeaders.bind(io)();
    res.json({ success: true });

});
server.listen(9000);