const LOCAL_STORAGE_SETTINGS_KEY = "settings";

const input = document.querySelector("#json-input");
const result = document.querySelector("#result");
const getAccessModifier = document.querySelector("#getter-access-modifier");
const getMethodType = document.querySelector("#get-method-type");
const newLine = document.querySelector("#new-line");
const variablePrefix = document.querySelector("#variablePrefix");
const serializable = document.querySelector("#serializable");
const loader = document.querySelector("#loader");

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
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

function getCSharpCode(onClickSubmit = false) {
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
}

function validateJSON(json) {
  try {
    const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    const updatedJson = json.replace(regex, "");
    return JSON.parse(updatedJson);
  } catch (e) {
    return null;
  }
}

function copyToClipboard(result) {
  const range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(result);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  showRoundedToast("C# code copied to clipboard!");
}

function copyResultToClipboard() {
  copyToClipboard(result);
}

function saveSettings() {
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
}

function applySettings() {
  let storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  if (storedSettings === null) {
    return;
  }
  storedSettings = JSON.parse(storedSettings);
  getAccessModifier.selectedIndex = storedSettings.getAccessModifier;
  getMethodType.selectedIndex = storedSettings.getMethodType;
  newLine.checked = storedSettings.newLine;
  variablePrefix.selectedIndex = storedSettings.variablePrefix;
  serializable.checked = storedSettings.serializable;
}

function showRoundedToast(message) {
  M.toast({
    html: message,
    classes: "rounded",
    displayLength: 1500,
  });
}

function showLoader(enable) {
  result.innerHTML = "";
  const visibility = enable ? "flex" : "none";
  loader.style.display = visibility;
}
