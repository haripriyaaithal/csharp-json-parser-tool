const LOCAL_STORAGE_SETTINGS_KEY = "settings";

const useNewtonSoft = document.querySelector("#useNewtonSoft");
const input = document.querySelector("#jsonInput");
const result = document.querySelector("#result");
const getAccessModifier = document.querySelector("#getterAccessModifier");
const getMethodType = document.querySelector("#getMethodType");
const newLine = document.querySelector("#newLine");
const variablePrefix = document.querySelector("#variablePrefix");
const serializable = document.querySelector("#serializable");
const resultDiv = document.querySelector("#resultDiv");
const loader = document.querySelector("#loader");
const fullScreenButton = document.querySelector("#fullscreenButton");
const fullScreenExitButton = document.querySelector("#fullscreenExitButton");
const csFileImage = document.querySelector("#csFileImage");
const jsonFileImage = document.querySelector("#jsonFileImage");
const generateGetters = document.querySelector("#generateGetters");
const url = document.querySelector("#url");

document.addEventListener("DOMContentLoaded", function () {
  registerServiceWorker();
  M.AutoInit();
  showLoader(false);
  applySettings();
  showButton(false, fullScreenExitButton);
});

document.querySelector("#submit").addEventListener("click", () => {
  getCSharpCode(true);
});

input.addEventListener("focus", () => {
  showElement(jsonFileImage, false);
});

input.addEventListener("blur", () => {
  if (input.value.length <= 0) {
    showElement(jsonFileImage, true);
  }
});

input.addEventListener("change", () => {
  const updatedJson = validateJSON(input.value);
  if (updatedJson !== null) {
    input.value = JSON.stringify(updatedJson, null, "\t");
  }
});

const shouldUseNewtonSoft = () => {
  const dropdownObj = M.FormSelect.getInstance(variablePrefix);
  Array.from(dropdownObj.el.options).forEach((option, index) => {
    if (option.value === "") {
      option.selected = !useNewtonSoft.checked;
      variablePrefix.options[index].selected = true;
    }
  });
  serializable.checked = true;
  serializable.disabled = !useNewtonSoft.checked;
  dropdownObj.input.value = "None";
  dropdownObj.input.disabled = !useNewtonSoft.checked;
  showElement(generateGetters.parentElement, !useNewtonSoft.checked);
  getCSharpCode();
};

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

const copyToClipboard = (result, callback) => {
  if (result.innerText.length === 0) {
    return;
  }
  const range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(result);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  callback();
};

const copyResultToClipboard = () => {
  copyToClipboard(result, () => {
    showRoundedToast("C# code copied to clipboard!");
  });
};

const copyUrlToClipboard = () => {
  copyToClipboard(url, () => {
    showRoundedToast("URL copied to clipboard!");
  });
};

const saveSettings = () => {
  let storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  const currentSettings = JSON.stringify({
    useNewtonSoft: useNewtonSoft.checked,
    generateGetters: generateGetters.checked,
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
    showElement(generateGetters.parentElement, !useNewtonSoft.checked);
    return;
  }
  storedSettings = JSON.parse(storedSettings);

  useNewtonSoft.checked = storedSettings.useNewtonSoft;
  generateGetters.checked = storedSettings.generateGetters;
  shouldUseNewtonSoft();

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
    showElement(csFileImage, true);
    if (onClickSubmit) {
      showRoundedToast("Please enter a valid JSON");
    }
    return;
  }
  showLoader(true);
  showElement(csFileImage, false);

  const updatedJson = validateJSON(input.value);
  if (updatedJson !== null) {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        data: encodeURIComponent(JSON.stringify(updatedJson)),
        codeConfig: {
          useNewtonSoft: useNewtonSoft.checked,
          generateGetters: generateGetters.checked,
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
        copyToClipboard(result, () => {
          showRoundedToast("C# code copied to clipboard!");
        });
      });
  } else {
    showLoader(false);
    showElement(csFileImage, true);
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

const showElement = (element, canShow) => {
  const display = canShow ? "block" : "none";
  element.style.display = display;
};
