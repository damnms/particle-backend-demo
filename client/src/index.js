import LoadingComponent from './components/LoadingComponent.js';
import NotFoundComponent from './components/NotFoundComponent.js';
import CalibrationComponent from './components/CalibrationComponent.js';
import ConfigurationComponent from './components/ConfigurationComponent.js';
import DashBoardComponent from './components/DashBoardComponent.js';
import ErrorComponent from './components/ErrorComponent.js';

const routes = [
    {path: '/', name: 'home', component: LoadingComponent},
    {path: '/loading', name: 'loading', component: LoadingComponent},
    {path: '/calibration', name: 'calibration', component: CalibrationComponent},
    {path: '/config', name: 'config', component: ConfigurationComponent},
    {path: '/dashboard', name: 'dashboard', component: DashBoardComponent},
    {path: '/error', name: 'error', component: ErrorComponent, props: true},
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})


const InitApp = {
    data() {
        return {
            phase: "/loading"
        }
    },

    beforeCreate() {
        var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com
        axios.get(rootUrl + "/api/device/variable/initializePhase")
            .then(response => {
                if (response.data.result === true) {
                    this.$router.push('/calibration');
                } else
                    this.$router.push("/dashboard");
            })
            .catch(error => {
                console.log(error);
                this.$router.push({name: "error", params: {msg: error}});
            })
    }
}

const app = Vue.createApp(InitApp);
app.use(router)
app.mount('#app')