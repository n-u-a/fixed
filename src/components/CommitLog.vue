<template>
  <div>
    <div>
      <div class="toggle-button">
        <label class="toggle">
          <input type="checkbox" class="toggle__input" @click="toggle" />
          <span class="toggle__content"></span>
          <span class="toggle__circle"></span>
        </label>
        <span class="about-displayed"
          ><b>{{ displayedCommit }}</b> are shown.</span
        >
      </div>
    </div>
    <div class="table-container">
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
                    show: copied && commit.sha === sha,
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
    <SignOut />
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import SignOut from "@/components/SignOut.vue";
import { baseUrl, header } from "@/constants.js";
import { fetchCurrentTabInformation } from "@/background.js";
import { preventBack } from "@/utils.js";

export default {
  name: "CommitLog",
  props: {
    githubtoken: {
      type: String,
    },
  },
  components: {
    SignOut,
  },
  data() {
    return {
      commits: [],
      extractCommit: false,
      copied: false,
      sha: "",
      displayedCommit: "All commits",
    };
  },
  created() {
    preventBack();
  },
  mounted() {
    this.createCommitList(this.githubtoken);
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
    toggle() {
      this.extractCommit = !this.extractCommit;
      if (this.extractCommit) {
        let extractedCommit = _.takeRight(this.commits, 10);
        this.displayedCommit = "Last 10 commits";
        this.commits = extractedCommit;
      } else {
        this.displayedCommit = "All commits";
        this.createCommitList(this.githubtoken);
      }
    },
    createCommitList(token) {
      this.commits = [];
      fetchCurrentTabInformation.then((pullRequestData) => {
        if (pullRequestData.owner) {
          const request = axios.create({
            baseURL: baseUrl,
          });

          const owner = pullRequestData.owner;
          const repository = pullRequestData.repository;
          const pullRequestNumber = pullRequestData.pullRequestNumber;
          const pullRequestUrl = `/repos/${owner}/${repository}/pulls/${pullRequestNumber}`;

          request
            .get(pullRequestUrl, {
              headers: {
                Accept: header,
                Authorization: `token ${token}`,
              },
            })
            .then((pullRequest) => {
              const commitsUrl = `/repos/${owner}/${repository}/pulls/${pullRequestNumber}/commits`;
              let pages = Math.ceil(pullRequest.data.commits / 100);
              this._fetchCommits(commitsUrl, pages.length, 0, token);
            })
            .catch(() => {
              this.$router.push({
                name: "AuthError",
                params: { errorReason: "Getting commits" },
              });
            });
        }
      });
    },
    _fetchCommits(url, pages, page, token) {
      const instance = this;

      const request = axios.create({
        baseURL: baseUrl,
      });

      let targetPage = page + 1;
      request
        .get(url, {
          headers: {
            Accept: header,
            Authorization: `token ${token}`,
          },
          params: {
            per_page: 100,
            page: targetPage,
          },
        })
        .then((commits) => {
          for (let data of commits.data) {
            let sha = data.sha.substr(0, 7);
            let originalMessage = data.commit.message;
            let commitMessage = (() => {
              // eslint-disable-next-line
              if (originalMessage.length > 15) return originalMessage.substr(0, 14) + "...";
              return originalMessage;
            })();

            let commit = {
              copyText: sha + " - " + originalMessage,
              sha: sha,
              url: data.html_url,
              commiter: data.commit.committer.name,
              message: commitMessage,
            };
            instance.commits.push(commit);
          }
          if (pages === targetPage) {
            return "finish";
          } else {
            this._fetchCommits(url, pages, targetPage, token);
          }
        })
        .catch(() => {
          this.$router.push({
            name: "AuthError",
            params: { errorReason: "Getting commits" },
          });
        });
    },
  },
};
</script>

<style scoped>
.toggle-button {
  padding: 5px;
  z-index: 10000;
  background-color: #ffffff;
  position: relative;
}

.toggle {
  width: 37px;
  position: relative;
  display: inline-block;
  padding-top: 3px;
}
.toggle__content {
  display: block;
  cursor: pointer;
  position: relative;
  border-radius: 7px;
  height: 14px;
  background-color: rgba(34, 31, 31, 0.26);
  -webkit-transition: all 0.1s 0.4s;
  -moz-transition: all 0.1s 0.4s;
  -ms-transition: all 0.1s 0.4s;
  -o-transition: all 0.1s 0.4s;
  transition: all 0.1s 0.4s;
  overflow: hidden;
}
.toggle__content:after {
  content: "";
  display: block;
  position: absolute;

  width: 0;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 7px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}
.toggle__input {
  display: none;
}
.toggle__circle {
  display: block;
  top: 0px;
  left: 0px;
  position: absolute;
  width: 20px;
  height: 20px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -ms-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
  -webkit-box-shadow: 0 2px 2px #ccc;
  box-shadow: 0 2px 2px #ccc;
}
.toggle__input:checked ~ .toggle__circle {
  left: 18px;
  background-color: #76a3ff;
}
.toggle__input:checked ~ .toggle__content {
  border-color: transparent;
  -webkit-transition: all 0s;
  -moz-transition: all 0s;
  -ms-transition: all 0s;
  -o-transition: all 0s;
  transition: all 0s;
}
.toggle__input:checked ~ .toggle__content:after {
  background-color: rgba(55 100 176 / 25%);
  width: 100%;
}

.about-displayed {
  font-size: 12px;
  padding-left: 10px;
  display: inline-block;
  text-align: center;
}

p {
  font-size: 12px;
}

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
  border: none;
  border-radius: 6px;
  text-align: center;
  text-decoration: none !important;
  width: 20px;
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
</style>
