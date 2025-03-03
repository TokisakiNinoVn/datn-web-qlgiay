import router from './routers/index';
import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/main.css';
import './styles/main.css';
import './styles/main.css';

if (!localStorage.getItem('isLoggedIn')) {
  localStorage.setItem('isLoggedIn', 'false');
}
createApp(App)
  .use(router)
  .mount('#app');
