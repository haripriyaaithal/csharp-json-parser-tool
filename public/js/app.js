const LOCAL_STORAGE_SETTINGS_KEY = "settings";

const input = document.querySelector("#json-input");
const result = document.querySelector("#result");
const getAccessModifier = document.querySelector("#getter-access-modifier");
const getMethodType = document.querySelector("#get-method-type");
const newLine = document.querySelector("#new-line");
const variablePrefix = document.querySelector("#variablePrefix");
const serializable = document.querySelector("#serializable");
const loader = document.querySelector("#loader");

const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service worker registered. ", reg))
      .catch((error) => console.log("Service worker not registered. ", error));
  }
};

document.addEventListener("DOMContentLoaded", function () {
  registerServiceWorker();
  M.FormSelect.init(document.querySelectorAll("select"), {});
  showLoader(false);
});

document.querySelector("#submit").addEventListener("click", () => {
  getCSharpCode(true);
});

window.addEventListener("load", () => {
  applySettings();
});

input.addEventListener("change", () => {
  const updatedJson = validateJSON(input.value);
  if (updatedJson !== null) {
    input.value = JSON.stringify(updatedJson, null, "\t");
  }
});

const validateJSON = (json) => {
  try {
    const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    const updatedJson = json.replace(regex, "");
    return JSON.parse(updatedJson);
  } catch (e) {
    return null;
  }
};

const copyToClipboard = (result) => {
  const range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(result);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  showRoundedToast("C# code copied to clipboard!");
};

const copyResultToClipboard = () => {
  copyToClipboard(result);
};

const saveSettings = () => {
  let storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  const currentSettings = JSON.stringify({
    getAccessModifier: getAccessModifier.selectedIndex,
    getMethodType: getMethodType.selectedIndex,
    newLine: newLine.checked,
    variablePrefix: variablePrefix.selectedIndex,
    serializable: serializable.checked,
  });
  if (storedSettings === null) {
    storedSettings = "{}";
  }
  if (storedSettings !== currentSettings) {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, currentSettings);
  }
};

const applySettings = () => {
  let storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (storedSettings === null) {
    return;
  }
  storedSettings = JSON.parse(storedSettings);

  let selectedIndex = storedSettings.getAccessModifier;
  getAccessModifier.selectedIndex = selectedIndex;
  M.FormSelect.getInstance(getAccessModifier).input.value =
    getAccessModifier.options[selectedIndex].innerText;

  selectedIndex = storedSettings.getMethodType;
  getMethodType.selectedIndex = selectedIndex;
  M.FormSelect.getInstance(getMethodType).input.value =
    getMethodType.options[selectedIndex].innerText;

  selectedIndex = storedSettings.variablePrefix;
  variablePrefix.selectedIndex = selectedIndex;
  M.FormSelect.getInstance(variablePrefix).input.value =
    variablePrefix.options[selectedIndex].innerText;

  newLine.checked = storedSettings.newLine;
  serializable.checked = storedSettings.serializable;
};

const showRoundedToast = (message) => {
  M.toast({
    html: message,
    classes: "rounded",
    displayLength: 1500,
  });
};

const showLoader = (enable) => {
  result.innerHTML = "";
  const visibility = enable ? "flex" : "none";
  loader.style.display = visibility;
};

const getCSharpCode = (onClickSubmit = false) => {
  saveSettings();
  if (input.value.length === 0) {
    result.innerHTML = "";
    if (onClickSubmit) {
      showRoundedToast("Please enter a valid JSON");
    }
    return;
  }
  showLoader(true);

  const updatedJson = validateJSON(input.value);
  if (updatedJson !== null) {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        data: encodeURIComponent(JSON.stringify(updatedJson)),
        codeConfig: {
          accessModifiers: {
            get: getAccessModifier.value,
          },
          methodType: {
            get: getMethodType.value,
          },
          newLine: newLine.checked,
          variablePrefix: variablePrefix.value,
          serializable: serializable.checked,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        showLoader(false);
        result.innerHTML = data.data;
        copyToClipboard(result);
      });
  } else {
    showLoader(false);
    if (onClickSubmit) {
      showRoundedToast("Please enter a valid JSON");
    }
  }
};
