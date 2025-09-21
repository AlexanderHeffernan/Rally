import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import './assets/main.css';

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus, faUser, faRightFromBracket, faChevronDown } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus);
library.add(faUser);
library.add(faRightFromBracket);
library.add(faChevronDown);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).mount('#app');