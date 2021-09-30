/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
const CommitLog = () => import(/* webpackChunkName: "CommitLog" */ "../components/CommitLog.vue");
const CommitLogGuest = () => import(/* webpackChunkName: "CommitLogGuest" */ "../components/CommitLogGuest.vue");
const SignIn = () => import(/* webpackChunkName: "SignIn" */ "../components/SignIn.vue");
const Notice = () => import(/* webpackChunkName: "Notice" */ "../components/Notice.vue");
const AuthError = () => import(/* webpackChunkName: "AuthError" */ "../components/AuthError.vue");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/commits/log",
    name: "CommitLog",
    component: CommitLog,
    props: true,
  },
  {
    path: "/commits/log/guest",
    name: "GuestCommitLog",
    component: CommitLogGuest,
    props: true,
  },
  {
    path: "/signin",
    name: "SignIn",
    component: SignIn,
    props: true,
  },
  {
    path: "/notice",
    name: "Notice",
    component: Notice,
  },
  {
    path: "/error",
    name: "AuthError",
    component: AuthError,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
