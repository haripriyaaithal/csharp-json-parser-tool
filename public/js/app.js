const LOCAL_STORAGE_SETTINGS_KEY = "settings";

const input = document.querySelector("#json-input");
const result = document.querySelector("#result");
const getAccessModifier = document.querySelector("#getter-access-modifier");
const getMethodType = document.querySelector("#get-method-type");
const newLine = document.querySelector("#new-line");
const variablePrefix = document.querySelector("#variablePrefix");
const serializable = document.querySelector("#serializable");

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems, {});
});

document.querySelector("#submit").addEventListener("click", () => {
  getCSharpCode();
});

window.addEventListener("load", () => {
  applySettings();
});

function getCSharpCode() {
  saveSettings();
  if (input.value.length === 0) {
    result.innerHTML = "";
    return;
  }

  try {
    let json = input.value;
    let regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    let updatedJson = json.replace(regex, "");

    JSON.parse(updatedJson);
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        data: encodeURIComponent(updatedJson),
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
        result.innerHTML = data.data;

        // Copy the response to clipboard
        const range = document.createRange();
        window.getSelection().removeAllRanges();
        range.selectNode(result);
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        M.toast({
          html: "C# code copied to clipboard!",
          classes: "rounded",
          displayLength: 1500,
        });
      });
  } catch (e) {
    result.innerHTML = "Please enter valid JSON";
    console.log(e);
  }
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
  console.log("Applying settings");
  storedSettings = JSON.parse(storedSettings);
  getAccessModifier.selectedIndex = storedSettings.getAccessModifier;
  getMethodType.selectedIndex = storedSettings.getMethodType;
  newLine.checked = storedSettings.newLine;
  variablePrefix.selectedIndex = storedSettings.variablePrefix;
  serializable.checked = storedSettings.serializable;
}
