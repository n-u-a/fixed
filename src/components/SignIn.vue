<template>
  <div>
    <div class="container" v-if="!loading">
      <div class="login">
        <div class="clipboard-icon">
          <span>
            <svg class="icon-svg">
              <use
                xlink:href="/icons/commit_in_clip_100x100.svg#icon"
              ></use></svg
          ></span>
        </div>

        <div class="login-button">
          <button class="btn-green inline-block" @click="signIn">
            <div class="github-icon">
              <span>
                <svg>
                  <use xlink:href="/icons/mark-github.svg#github"></use></svg
              ></span>
            </div>
            <span> Login With Github </span>
          </button>

          <div>
            <p class="head-border">OR</p>
          </div>

          <button class="btn-green guest inline-block" @click="signInAsGuest">
            <div class="guest-icon">
              <span>
                <svg>
                  <use xlink:href="/icons/customer.svg#guest"></use></svg
              ></span>
            </div>
            <span> Login As Guest </span>
          </button>
        </div>
      </div>
      <div class="message">
        <hr />
        In order to use this extension even for private repositories, login with
        Github OAuth. <br />If you are using it as a guest, you can use it only
        in Public repository.
      </div>
    </div>
    <div class="loading-title" v-if="loading">Authenticating...</div>
    <div class="loading" v-if="loading">
      <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { firebaseAuthentication } from "@/background.js";
import Cookies from "js-cookie";
import { preventBack } from "@/utils.js";
export default {
  data() {
    return {
      loading: false,
    };
  },
  created() {
    preventBack();

    const userName = Cookies.get("userName");
    if (userName) {
      const token = Cookies.get("githubToken");
      this.$store.state.userName = userName;

      if (token) {
        this.$router.push({
          name: "CommitLog",
          params: { githubtoken: token },
        });
      } else if (userName && userName === "Guest") {
        this.$router.push({
          name: "GuestCommitLog",
        });
      }
    }
  },
  methods: {
    signIn() {
      this.loading = !this.loading;

      const instance = this;
      this.auth = getAuth();
      Cookies.set("auth", this.auth);

      firebaseAuthentication.then(() => {
        const provider = new GithubAuthProvider();
        // privateリポジトリも認証できるようにスコープを追加
        provider.addScope("repo");
        signInWithPopup(this.auth, provider)
          .then((result) => {
            const credential = GithubAuthProvider.credentialFromResult(result);

            const token = credential.accessToken;
            Cookies.set("githubToken", token);

            const userName = result._tokenResponse.screenName;
            Cookies.set("userName", userName);
            instance.$store.state.userName = userName;

            instance.$router.push({
              name: "CommitLog",
              params: { githubtoken: token },
            });
          })
          .catch((error) => {
            console.error("error", error);
            // The AuthCredential type that was used.
            // const credential = GithubAuthProvider.credentialFromError(error);
            // console.error("credential", credential);
            instance.$router.push({
              name: "AuthError",
              params: { errorReason: "Github Authentication" },
            });
          });
      });
    },
    signInAsGuest() {
      document.cookie = `userName=Guest`;
      this.$store.state.userName = "Guest";
      this.$router.push({
        name: "GuestCommitLog",
      });
    },
  },
};
</script>

<style scoped>
.container {
  margin: auto;
  margin-top: 10px;
  background: #eeeeee;
  border-radius: 6px;
  padding: 10px;
  width: 90%;
  height: 380px;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.clipboard-icon {
  width: 60px;
  height: 60px;
  display: inline-block;
}
.icon-svg {
  width: 60px;
  height: 60px;
  opacity: 0.7;
}

.head-border {
  position: relative;
  display: inline-block;
  padding: 0 85px;
}

.head-border:before,
.head-border:after {
  content: "";
  position: absolute;
  top: 50%;
  display: inline-block;
  width: 75px;
  height: 1px;
  background-color: #9a9a9a;
}

.head-border:before {
  left: 0;
}

.head-border:after {
  right: 0;
}

p {
  margin: 0;
  color: #666;
}

button {
  margin: 0;
}

.message {
  margin-top: 7%;
  font-size: 14px;
  text-align: left;
}

.login {
  margin-top: 5%;
}

.login-button {
  margin-top: 5%;
}

.btn-green {
  padding: 0.4em;
  margin: 8px 0;
  display: block;
  color: #fff !important;
  background: #2da44e;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  border: 1px solid;
  border-radius: 6px;
  text-align: center;
  text-decoration: none !important;
  width: 200px;
}
.guest {
  background: #aaaaaa;
}
.btn-green:before {
  content: "";
  display: inline-block;
  height: 18px;
  margin: 0px 5px 0 0;
  background-size: contain;
  vertical-align: middle;
}
.btn-green:hover {
  background: #1d943e;
}
.guest:hover {
  background: #9a9a9a;
}
.inline-block {
  display: inline-block;
}
.github-icon {
  fill: #ffffff;
  width: 20px;
  height: 20px;
  display: inline-block;
}
.guest-icon {
  fill: #ffffff;
  height: 20px;
  display: inline-block;
}
svg {
  width: 20px;
  height: 20px;
}
.guest-icon svg {
  width: 18px;
  height: 18px;
}
@media screen and (min-width: 768px) {
  .btn-green {
    padding: 0.5em 2em;
    margin: 10px auto;
    font-size: 20px;
    display: inline-block;
  }
  .btn-green:before {
    margin: -3px 10px 0 0;
  }
}

.loading {
  top: 40%;
  left: 43%;
  width: 100%;
  height: 100%;
  position: absolute;
}

.loading-title {
  top: 27%;
  left: 31%;
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
}

.sk-chase {
  width: 60px; /* サイズ - 可変 */
  height: 60px; /* サイズ - 可変 */
  position: relative;
  animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: sk-chase-dot 2s infinite ease-in-out both;
}

.sk-chase-dot:before {
  content: "";
  display: block;
  width: 25%;
  height: 25%;
  background-color: #76a3ff; /* ベースの色 - 可変 */
  border-radius: 100%;
  animation: sk-chase-dot-before 2s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2) {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3) {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4) {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5) {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6) {
  animation-delay: -0.6s;
}
.sk-chase-dot:nth-child(1):before {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2):before {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3):before {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4):before {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5):before {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6):before {
  animation-delay: -0.6s;
}

@keyframes sk-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot {
  80%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  }
  100%,
  0% {
    transform: scale(1);
  }
}
</style>
