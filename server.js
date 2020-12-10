const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const EventSource = require("eventsource");

var constants = {}
try {
    constants = require('./constants')
} catch (error) {
    console.log("Module 'constants' not found, trying Heroku config vars.")
}

const eventListeners = require('./eventListeners.js');
var SSE = require('express-sse');

var sse = new SSE([]);
eventListeners.sse = sse;

const app = express();

app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use('/', express.static(path.join(__dirname, './client/src'))); //TODO: is das notwendig? ja, sonst nix events mit lokaler url :/

const port = process.env.PORT || '3001';
app.set('port', port);

const access_token = process.env.ACCESS_TOKEN || constants.access_token;
const device_id = process.env.DEVICE_ID || constants.device_id;

const server = http.createServer(app);

let eventURL = 'https://api.particle.io/v1/devices/' + device_id + '/events?access_token=' + access_token
var source = new EventSource(eventURL);
source.addEventListener('data', eventListeners.handleDataChanged)

// Read a variable. Example:
// GET /api/device/0/variable/buttonState
app.get('/api/device/variable/:name', (req, res) => {
    let variableName = req.params.name;

    let url = 'https://api.particle.io/v1/devices/' + device_id + '/' + variableName + '?access_token=' + access_token;
    axios.get(url)
        .then(response => {
            res.send({
                timeStamp: response.data.coreInfo.last_heard,
                result: response.data.result,
            });
        })
        .catch(error => {
            res.status(500).send({error: "could not read current value"});
        });

})

// Call a function. Example:
// POST /api/device/0/function/blinkRed
app.post('/api/device/function/:name', (req, res) => {

    let functionName = req.params.name;

    var data = {arg: req.body.arg};

    let url = 'https://api.particle.io/v1/devices/' + device_id + '/' + functionName + '?access_token=' + access_token;

    axios.post(url, data)
        .then(response => {
            res.send({result: response.data.return_value})
        })
        .catch(error => {
            res.status(500).send({error: "could not execute function " + functionName})
        });

})

// GET /api/events
app.get('/api/events', sse.init);

server.listen(port, () => {
    console.log("app listening on port " + port);
});
