// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css'
import Vue from 'vue'
import App from './App'
import VueWorker from 'vue-worker';
import Croppa from 'vue-croppa'

//import './styles/index.scss'
//import 'cropperjs/dist/cropper.css';

import 'vue-croppa/dist/vue-croppa.css'


Vue.config.productionTip = false;

Vue.use(VueWorker);
Vue.use(Croppa);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});
