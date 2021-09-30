<template>
  <div>
    <footer>
      <hr />
      <div class="header-item">
        <p>
          Logged in as <span class="user-name">{{ userName }}</span>
        </p>
        <button @click="signOutOAuth" class="btn-clipboard inline-block">
          <div class="clipboard-icon">
            <span>
              <svg>
                <use xlink:href="/icons/logout.svg#logout"></use></svg
            ></span>
          </div>
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { preventBack } from "@/utils.js";
export default {
  computed: {
    userName() {
      return this.$store.state.userName;
    },
  },
  created() {
    preventBack();
  },
  methods: {
    signOutOAuth() {
      const auth = getAuth();
      Cookies.remove("githubToken");
      Cookies.remove("userName");

      signOut(auth)
        .then(() => {
          this.$store.state.userName = "";
          this.$router.push({
            name: "SignIn",
          });
        })
        .catch((error) => {
          this.$store.state.userName = "";
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
footer {
  width: 100%;
  position: relative;
  bottom: 0;
  height: 0px;
}

hr {
  margin-top: 0;
  margin-bottom: 10px;
}

.header-item {
  display: flex;
  justify-content: left;
  position: relative;
  padding-bottom: 10px;
}

p {
  margin: 0;
  margin-top: 4px;
  font-size: 12px;
  line-height: 20px;
  margin-left: 20px;
}

.user-name {
  font-weight: bold;
}

.btn-clipboard {
  position: relative;
  display: block;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  border-radius: 6px;
  text-align: center;
  text-decoration: none !important;
  width: 30px;
}
.btn-clipboard:before {
  display: inline-block;
  background-size: contain;
}
.btn-clipboard:hover {
  background: #9a9a9a;
}
.inline-block {
  display: inline-block;
}
.clipboard-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  fill: #ffffff;
}
svg {
  width: 18px;
  height: 18px;
}
</style>
