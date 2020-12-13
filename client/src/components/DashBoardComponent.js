export default {
    data() {
        return {
            curTemp: 0,
            curHumidity: 0,
            prefHumHigh: 0,
            prefHumLow: 0,
            prefTempHigh: 0,
            prefTempLow: 0,
            userHasToReact: false
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

                    this.prefHumLow = ev.eventData.prefHumLow;
                    this.prefHumHigh = ev.eventData.prefHumHigh;
                    this.prefTempHigh = ev.eventData.prefTempHigh;
                    this.prefTempLow = ev.eventData.prefTempLow;
                    this.userHasToReact = ev.eventData.userHasToReact;
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        }
    },

    template: `

      <div class="group">
        <label id="curTemp">Current temperature: {{ curTemp }} °C</label><br/>
      </div>
      <div class="group">
        <label id="curHumidity">Current humidity: {{ curHumidity }} %</label><br/>
      </div>
      <div class="group">
        <label id="prefHumidity">Preferred humidity: {{ prefHumLow }}-{{ prefHumHigh }} %</label><br/>
      </div>
      <div class="group">
        <label id="prefHumidity">Preferred temperature: {{ prefTempLow }}-{{ prefTempHigh }} %</label><br/>
      </div>
      <div v-if="curHumidity > prefHumHigh || curHumidity < prefHumLow || curTemp > prefTempHigh || curTemp < prefTempLow" >
        <p>Houston, we have a problem! </p>
        <img src="../memes/angry.png" alt="problem!">
      </div>
      <div v-else-if="userHasToReact === true">
        <p>Houston, we are going into trouble! Check the values. The humidity raises faster than expected and YOU MUST REACT</p>
        <img src="../memes/thinking.png" alt="problem!">
      </div>
      
      <div v-else>
        <p>Congratz! All looks good!</p>
        <img src="../memes/allgood.png" alt="all good!">
      </div>
        
      <router-link to="/config">Configuration</router-link>

    `
}