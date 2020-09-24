const LOCAL_STORAGE_DARK_MODE_SETTINGS_KEY = "darkMode";

const darkModeDisableButton = document.querySelector("#darkModeDisableButton");
const darkModeEnableButton = document.querySelector("#darkModeEnableButton");
const sideNavDarkModeDisableButton = document.querySelector(
  "#sidenavDarkModeDisableButton"
);
const sideNavDarkModeEnableButton = document.querySelector(
  "#sidenavDarkModeEnableButton"
);

const showElement = (element, canShow) => {
  const display = canShow ? "block" : "none";
  element.style.display = display;
};

const enableDarkTheme = (enable) => {
  if (enable === null) {
    return;
  }

  localStorage.setItem(LOCAL_STORAGE_DARK_MODE_SETTINGS_KEY, enable);
  if (enable == "true" || enable === true) {
    document.body.classList.add("dark-mode");
    showElement(darkModeEnableButton, false);
    showElement(darkModeDisableButton, true);
    showElement(sideNavDarkModeEnableButton, false);
    showElement(sideNavDarkModeDisableButton, true);
  } else {
    document.body.classList.remove("dark-mode");
    showElement(darkModeDisableButton, false);
    showElement(darkModeEnableButton, true);
    showElement(sideNavDarkModeDisableButton, false);
    showElement(sideNavDarkModeEnableButton, true);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let shouldEnableDarkTheme;
  const osDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
  shouldEnableDarkTheme = osDarkTheme.matches ? true : false;
  shouldEnableDarkTheme =
    shouldEnableDarkTheme === true
      ? shouldEnableDarkTheme
      : localStorage.getItem(LOCAL_STORAGE_DARK_MODE_SETTINGS_KEY);

  enableDarkTheme(shouldEnableDarkTheme);
  document.body.style.display = "flex";
  M.AutoInit();
  M.Tooltip.init(document.querySelectorAll(".tooltipped"), {
    enterDelay: 300,
  });
});
