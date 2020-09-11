const LOCAL_STORAGE_SETTINGS_KEY = "settings";

const input = document.querySelector("#json-input");
const result = document.querySelector("#result");
const getAccessModifier = document.querySelector("#getter-access-modifier");
const getMethodType = document.querySelector("#get-method-type");
const newLine = document.querySelector("#new-line");
const variablePrefix = document.querySelector("#variablePrefix");
const serializable = document.querySelector("#serializable");
const resultDiv = document.querySelector("#resultDiv");
const loader = document.querySelector("#loader");
const fullScreenButton = document.querySelector("#fullscreenButton");
const fullScreenExitButton = document.querySelector("#fullscreenExitButton");
const csFileImage = document.querySelector("#csFileImage");
const jsonFileImage = document.querySelector("#jsonFileImage");

document.addEventListener("DOMContentLoaded", function () {
  registerServiceWorker();
  M.FormSelect.init(document.querySelectorAll("select"), {});
  showLoader(false);
  applySettings();
  showButton(false, fullScreenExitButton);
});

document.querySelector("#submit").addEventListener("click", () => {
  getCSharpCode(true);
});

input.addEventListener("focus", () => {
  showImage(jsonFileImage, false);
});

input.addEventListener("blur", () => {
  if (input.value.length <= 0) {
    showImage(jsonFileImage, true);
  }
});

input.addEventListener("change", () => {
  const updatedJson = validateJSON(input.value);
  if (updatedJson !== null) {
    input.value = JSON.stringify(updatedJson, null, "\t");
  }
});

const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }
};

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
    showImage(csFileImage, true);
    if (onClickSubmit) {
      showRoundedToast("Please enter a valid JSON");
    }
    return;
  }
  showLoader(true);
  showImage(csFileImage, false);

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
    showImage(csFileImage, true);
    if (onClickSubmit) {
      showRoundedToast("Please enter a valid JSON");
    }
  }
};

const showButton = (show, element) => {
  element.style.display = show ? "inline-block" : "none";
};

const enableFullscreen = (isFullscreen) => {
  if (isFullscreen) {
    document.body.style.overflow = "hidden";
    resultDiv.classList.remove("shrink");
    resultDiv.classList.add("expand");
    showButton(false, fullScreenButton);
    showButton(true, fullScreenExitButton);
  } else {
    resultDiv.classList.remove("expand");
    resultDiv.classList.add("shrink");
    document.body.style.overflowY = "auto";
    showButton(false, fullScreenExitButton);
    showButton(true, fullScreenButton);
  }
};

const showImage = (element, canShow) => {
  const display = canShow ? "block" : "none";
  element.style.display = display;
};
