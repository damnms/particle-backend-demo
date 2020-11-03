
var app = new Vue({
    el: "#app",
    data: {
        messages: [],
        lastMessage: ""
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

                    //hacky workaround to use buttonStateChanged method to test our new method but without printing pressed/released
                    if(ev.eventData.message === "pressed" || ev.eventData.message === "released")
                        return;

                    this.messages.push(ev.eventData.message);
                    this.lastMessage = ev.eventData.message;
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        }
    }
})
