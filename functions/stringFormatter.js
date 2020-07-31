const firstCharUppercase = (string) => {
  if (!string || string === "") {
    return;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const firstCharLowercase = (string) => {
  if (!string || string === "") {
    return;
  }
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const formatCamelCase = (string) => {
  if (!string || string === "") {
    return;
  }
  return firstCharLowercase(formatPascalCase(string));
};

const formatPascalCase = (string) => {
  const nameSplit = string.split("_");
  if (nameSplit.length > 1) {
    let newString = "";
    for (let i = 0; i < nameSplit.length; i++) {
      newString += firstCharUppercase(nameSplit[i]);
    }
    return newString;
  } else {
    return firstCharUppercase(string);
  }
};

module.exports = {
    formatCamelCase: formatCamelCase,
    formatPascalCase: formatPascalCase
}