<template>
  <div>
    <div class="container">
      <p>Not available in the currently displayed tab.</p>
      <p>Only available via Github pull request.</p>
    </div>
  </div>
</template>

<script>
import { preventBack } from "@/utils.js";
export default {
  created() {
    preventBack();
  },
};
</script>

<style>
html {
  width: 350px;
  height: 80px;
}

p {
  margin-bottom: 0;
}

.container {
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 5px;
  background: #eeeeee;
  border-radius: 6px;
  width: 95%;
  text-align: center;
  justify-content: center;
  align-items: center;
}
</style>
