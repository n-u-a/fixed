let preventBack = () => {
  history.pushState(null, null, null);

  window.addEventListener("popstate", function () {
    history.pushState(null, null, null);
  });
};

export { preventBack };
