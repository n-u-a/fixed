<template>
  <div>
    <div class="table-container" v-if="!isNoCommit">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead class="table-dark stick-top">
            <th class="stick-top">commit id</th>
            <th class="stick-top">commit message</th>
            <th class="stick-top"></th>
          </thead>
          <tbody>
            <tr v-for="commit in commits" :key="commit.sha">
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="commit.url"
                  >{{ commit.sha }}</a
                >
              </td>
              <td>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="commit.url"
                  >{{ commit.message }}</a
                >
              </td>
              <td>
                <button
                  @click="copy(commit.copyText, commit.sha)"
                  v-tooltip.left="{
                    content: 'copied!',
                    show: isDisable && commit.sha === sha,
                    trigger: 'manual',
                  }"
                  class="btn-clipboard inline-block"
                >
                  <div class="clipboard-icon">
                    <span>
                      <svg>
                        <use
                          xlink:href="/icons/clipboard_icon.svg#clipboard"
                        ></use></svg
                    ></span>
                  </div>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="no-commit" v-if="isNoCommit">
      <div class="no-commit-container">
        <p>
          Either not a single commit has been pushed, it may be a private
          repository, or you may have exceeded
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.github.com/en/rest#rate-limiting"
            >the rate limit of the GitHub API</a
          >.
        </p>
        <p>
          If it's a private repository, or you have exceeded the rate limit of
          the GitHub API, you can't use it as a guest, so
          <span class="login-link" @click="logout">login with Github OAuth</span
          >.
        </p>
      </div>
    </div>
    <SignOut />
  </div>
</template>

<script>
import axios from "axios";
import SignOut from "@/components/SignOut.vue";
import { baseUrl, header } from "@/constants.js";
import { fetchCurrentTabInformation } from "@/background.js";
import Cookies from "js-cookie";
import { preventBack } from "@/utils.js";

export default {
  name: "CommitLogGuest",
  data() {
    return {
      commits: [],
      isNoCommit: false,
      isDisable: false,
      sha: "",
    };
  },
  created() {
    preventBack();
  },
  mounted() {
    this.fetchCommits();
  },
  components: {
    SignOut,
  },
  methods: {
    copy(text, sha) {
      this.sha = sha;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.copied = true;
          setTimeout(() => {
            this.copied = false;
          }, 1000);
        })
        .catch((e) => {
          console.error(e);
        });
    },
    fetchCommits() {
      const instance = this;
      fetchCurrentTabInformation.then((pullRequestData) => {
        if (pullRequestData.owner) {
          const request = axios.create({
            baseURL: baseUrl,
          });

          const owner = pullRequestData.owner;
          const repository = pullRequestData.repository;
          const pullRequestNumber = pullRequestData.pullRequestNumber;
          const URL = `/repos/${owner}/${repository}/pulls/${pullRequestNumber}/commits`;

          request
            .get(URL, {
              headers: {
                Accept: header,
              },
              params: {
                per_page: 100,
              },
            })
            .then((res) => {
              if (res.data) {
                this.isNoCommit = false;
                for (let data of res.data) {
                  let sha = data.sha.substr(0, 7);
                  let originalCommitMessage = data.commit.message;
                  let commitMessage = (() => {
                    // eslint-disable-next-line
                    if (originalCommitMessage.length > 16) return originalCommitMessage.substr(0, 15) + "...";
                    return data.commit.message;
                  })();
                  let commit = {
                    copyText: sha + " - " + originalCommitMessage,
                    sha: sha,
                    url: data.html_url,
                    commiter: data.commit.committer.name,
                    message: commitMessage,
                  };
                  instance.commits.push(commit);
                }
              } else {
                this.isNoCommit = true;
              }
            })
            .catch(() => {
              this.isNoCommit = true;
            });
        }
      });
    },
    logout() {
      this.$store.state.userName = "";
      Cookies.remove("userName");
      this.$router.push({
        name: "SignIn",
      });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #222222;
}

a:hover {
  color: #0969da;
  text-decoration: underline;
}

.table-dark {
  background-color: #76a3ff !important;
  word-wrap: break-word;
}

.table-responsive {
  height: 400px !important;
  margin-bottom: 0;
}

thead {
  z-index: 10000;
}

th {
  padding: 0.5rem 10px;
  height: 20px;
}

tr {
  height: 20px !important;
}

.stick-top {
  position: sticky !important;
  top: 0 !important;
}

button {
  border: none !important;
}

.btn-clipboard {
  display: block;
  background-color: rgba(0, 0, 0, 0);
  border: none !important;
  border-radius: 6px;
  text-align: center;
  text-decoration: none !important;
  width: 30px;
}
.btn-clipboard:before {
  display: inline-block;
  background-size: contain;
}
.inline-block {
  display: inline-block;
}
.clipboard-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
}
svg {
  width: 20px;
  height: 25px;
  opacity: 0.7;
}
svg:hover {
  opacity: 0.3;
}

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
