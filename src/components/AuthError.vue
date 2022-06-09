<template>
  <div>
    <div class="no-commit">
      <div class="no-commit-container">
        <h3>{{ errorReason }} failure</h3>
        <hr />
        <p>
          {{ errorReason }} has failed. <br />
          Please wait for a while and try again, or clear your browser cache
          before trying again.
        </p>
        <p>
          If the situation still does not improve, please contact
          <span
            class="login-link"
            target="_blank"
            rel="noopener noreferrer"
            href="freizeit.g@gmail.com"
          >
            freizeit.g@gmail.com</span
          >
        </p>
        <p>
          <span class="login-link" @click="logout">Click here </span>to
          re-login.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { preventBack } from "@/utils.js";
export default {
  props: {
    errorReason: {
      type: String,
    },
  },
  created() {
    preventBack();
  },
  methods: {
    logout() {
      this.$store.state.userName = "";
      Cookies.remove("userName");
      Cookies.remove("githubToken");
      Cookies.remove("userName");
      this.$router.push({
        name: "SignIn",
      });
    },
  },
};
</script>

<style scoped>
.no-commit {
  height: 400px !important;
}

.no-commit-container {
  margin: auto;
  margin-top: 20px;
  border-radius: 6px;
  height: 95%;
  width: 90%;
  padding: 5%;
  background: #eeeeee;
  justify-content: center;
  align-items: center;
}

.no-commit a {
  color: #0969da;
}

.login-link {
  color: #0969da;
}

.login-link:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
</style>
