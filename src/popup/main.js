import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import VTooltip from "v-tooltip";
import router from "../router";
import store from "../store";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VTooltip);
// eslint-disable-next-line
VTooltip.options.defaultTemplate = '<div class="tooltip-vue" role="tooltip-vue"><div class="tooltip-vue-arrow"></div><div class="tooltip-vue-inner"></div></div>';
// eslint-disable-next-line
VTooltip.options.defaultArrowSelector = '.tooltip-vue-arrow, .tooltip-vue__arrow';
// eslint-disable-next-line
VTooltip.options.defaultInnerSelector = '.tooltip-vue-inner, .tooltip-vue__inner';
VTooltip.options.defaultHideOnTargetClick = true;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
