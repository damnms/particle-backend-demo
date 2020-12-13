// react on the "dataChanged" Event
function handleDataChanged (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);

    //hier krachts
    //hacky workaround to get rid of NAN errors crashing my server!
    let evData = JSON.parse(ev.data.replace(/nan/g,"\"SensorError\"")); // the data from the argon event. temperature and humidity, separated with ;

    var temp = evData.curTemp;
    var humidity = evData.curHum;
    var prefHumLow = evData.prefHumLow;
    var prefHumHigh = evData.prefHumHigh;
    var prefTempHigh = evData.prefTempHigh;
    var prefTempLow = evData.prefTempLow;
    var userHasToReact = evData.userHasToReact;

    // the data we want to send to the clients
    let data = {
        temp, humidity, prefHumLow, prefHumHigh, prefTempHigh, prefTempLow, userHasToReact
    }

    // send data to all connected clients
    sendData("dataChanged", data);
}

// send data to the clients.
// You don't have to change this function
function sendData(evName, evData) {

    // the message that we send to the client
    let data = {
        eventName: evName,
        eventData: evData,
    };

    // send the data to all connected clients
    exports.sse.send(data)
}

exports.deviceIds = [];
exports.sse = null;

exports.handleDataChanged = handleDataChanged;