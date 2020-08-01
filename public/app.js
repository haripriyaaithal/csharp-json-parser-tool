const input = document.querySelector("#json-input");
const result = document.querySelector("#result");

document.querySelector("#submit").addEventListener("click", () => {
  result.innerHTML = "Loading...";
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
            get: document.querySelector("#getter-access-modifier").value,
          },
          methodType: {
            get: document.querySelector('input[name="get-method-type"]:checked').value,
          },
          newLine: document.querySelector("#new-line").checked,
          variablePrefix: document.querySelector("#variablePrefix").value,
          serializable: document.querySelector("#serializable").checked
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => (result.innerHTML = data.data));
  } catch (e) {
    result.innerHTML = "Please enter valid JSON";
    console.log(e);
  }
});
