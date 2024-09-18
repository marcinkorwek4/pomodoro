import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ConfirmationService from 'primevue/confirmationservice';
import './style.css';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
});

app.use(ConfirmationService);

app.mount('#app')
