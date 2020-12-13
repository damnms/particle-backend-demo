export default {
    data() {
        return {
            curTemp: 0,
            curHumidity: 0,
        }
    },
    mounted: function () {
        this.initSse();
    },
    methods: {
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = window.location.origin + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => {
                    let ev = JSON.parse(event.data);
                    if(ev.eventData.temp === "SensorError") {
                        this.curTemp = "Sensor Error!";
                    }
                    else {
                        this.curTemp = Math.round(ev.eventData.temp);
                    }

                    if(ev.eventData.humidity === "SensorError"){
                        this.curHumidity = "Sensor Error!";
                    } else {
                        this.curHumidity = Math.round(ev.eventData.humidity);
                    }
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        },
        calibrationButtonClicked: function () {
            var rootUrl = window.location.origin;
            axios.post(rootUrl + "/api/device/function/startCalibrate")
                .then(response => {
                    // Handle the response from the server
                    console.log(response); // we could to something meaningful with the return value here ...
                })
                .catch(error => {
                    alert("Could not call the function 'startCalibrate'." + "\n\n" + error)
                })
        },
        okButtonClicked: function () {
            var rootUrl = window.location.origin;
            axios.post(rootUrl + "/api/device/function/finishCalibrate")
                .then(response => {
                    // Handle the response from the server
                    console.log(response); // we could to something meaningful with the return value here ...
                    this.$router.push("/config");
                })
                .catch(error => {
                    alert("Could not call the function 'finishCalibrate'." + "\n\n" + error)
                })
        },
    },


    template: `<section>

            <p>Raise your humidity to the highest possible level. Then press "start calibration" button and start lowering your humidity as fast as possible. 
              After that, press "Ok" to finish the calibration</p>
            
                <div class="group">
                    <div v-if="curTemp === 'Sensor Error!'">
                        <label id="curTemp">There is an error in your temperature sensor!!!!</label><br />
                    </div>
                    <div v-else>
                        <label id="curTemp">Current temperature: {{curTemp}}°C</label>
                    </div>
                </div>
                
                 <div class="group">
                 <div v-if="curHumidity === 'Sensor Error!'">
                        <label id="curHumidity">There is an error in your humidity sensor!!!!</label><br />
                    </div>
                    <div v-else>
                        <label id="curHumidity">Current humidity: {{curHumidity}}%</label><br />
                    </div>
                    
                </div>
                <div class="btn-box">
                  <button v-on:click="calibrationButtonClicked">Start calibration</button>
                  <button v-on:click="okButtonClicked">Ok</button>
                </div>
            
        </section>`
};