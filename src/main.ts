import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './config/yup';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);

const toastOptions = {
  // position: "bottom-right",
  // timeout: 5000,
  // closeOnClick: true,
  // pauseOnFocusLoss: true,
  // pauseOnHover: true,
  // draggable: true,
  // draggablePercent: 0.6,
  // showCloseButtonOnHover: false,
  // hideProgressBar: false,
  // closeButton: "button",
  // icon: true,
  // rtl: false
};
app.use(Toast, toastOptions);

app.mount('#app');
