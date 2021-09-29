import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

let fetchCurrentTabInformation = new Promise((resolve) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];
    const url = tab.url;
    let splittedUrl = url.split("/");
    const hostname = splittedUrl[2];

    // eslint-disable-next-line
    if (hostname === "github.com" && splittedUrl.length > 4 && splittedUrl[5] === "pull") {
      const pullRequestData = {};
      pullRequestData["owner"] = splittedUrl[3];
      pullRequestData["repository"] = splittedUrl[4];
      pullRequestData["pullRequestNumber"] = splittedUrl[6];
      resolve(pullRequestData);
    } else {
      const pullRequestData = {};
      pullRequestData["isNotPullRequest"] = true;
      resolve(pullRequestData);
    }
  });
});

let firebaseAuthentication = new Promise((resolve) => {
  const env =  process.env;
  const firebaseConfig = {
    apiKey: env.VUE_APP_API_KEY,
    authDomain: env.VUE_APP_AUTH_DOMAIN,
    projectId: env.VUE_APP_PROJECT_ID,
    storageBucket: env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: env.VUE_APP_MESSAGING_SENDER_ID,
    appId: env.VUE_APP_APP_ID,
    measurementId: env.VUE_APP_MESUREMENT_ID,
  };

  // Initialize Firebase
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    getAnalytics(app);
  } else {
    console.log("E5");
  }
  resolve("S0");
});

export { fetchCurrentTabInformation, firebaseAuthentication };
