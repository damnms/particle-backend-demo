export default {

    data() {
        return {
            prefTemp: 0,
            prefHumidity: 0,
        }
    },

    methods: {
        saveButtonClicked(event) {
            var rootUrl = window.location.origin;
            var data = {};
            data.prefTempLow = this.prefTemp.split("-")[0];
            data.prefTempHigh = this.prefTemp.split("-")[1];
            data.prefHumLow = this.prefHumidity.split("-")[0];
            data.prefHumHigh = this.prefHumidity.split("-")[1];
            var jsonData = JSON.stringify(data);
            axios.post(rootUrl + "/api/device/function/initialize", { arg: jsonData })
                .then(response => {
                    // Handle the response from the server
                    console.log(response.data); // we could to something meaningful with the return value here ...
                })
                .catch(error => {
                    alert("Could not call the function 'saveButtonClicked'." + "\n\n" + error)
                })
        }
    },

    template: `<section>
            <form action="/#" id="submitForm" method="post">
                <div class="group">
                    <input id="prefTemp" maxlength="200" minlength="1" name="prefTemp" pattern="^[0-9]+$"
                           placeholder=" " required
                           v-model='prefTemp'
                           type="text">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="prefTemp">Preferred Temperature in °C, given as range (e.g.: 20-25)</label>
                </div>
                
                 <div class="group">
                    <input id="prefHumidity" maxlength="200" minlength="1" name="prefHumidity" pattern="^[0-9]+$"
                           placeholder=" " required
                           v-model='prefHumidity'
                           type="text">
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="prefTemp">Preferred Humidity in %, given as range (e.g.: 40-60)</label>
                </div>
                <div class="btn-box">
                    <router-link to="/dashboard" @click.native="saveButtonClicked">Save</router-link>
                </div>
            </form>
        </section>`
}