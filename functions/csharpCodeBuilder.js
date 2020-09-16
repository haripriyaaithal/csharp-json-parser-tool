const codeHighlighter = require("./codeHighlighter");

let codeSettings;

const classKeyword = codeHighlighter.keywordColor("class");
let systemSerializableKeyword = `[System.${codeHighlighter.classColor(
  "Serializable"
)}]`;

const privateAccessModifier = codeHighlighter.keywordColor("private");
const internalAccessModifier = codeHighlighter.keywordColor("internal");
const publicAccessModifier = codeHighlighter.keywordColor("public");
const protectedAccessModifier = codeHighlighter.keywordColor("protected");

const listKeyword = "List";
const returnKeyword = codeHighlighter.keywordColor("return");
const listDeclarationOpen = `${codeHighlighter.classColor("List")}&lt`;
const listDeclarationClose = "&gt;";

const space = "&nbsp;";
const tab = "&nbsp;&nbsp;&nbsp;&nbsp;";
const newLine = "\n";
let openCurlyBrace = "{";
const closeCurlyBrace = "}" + newLine;
const openParentheses = "(";
const closeParenthses = ")";
const arrow = codeHighlighter.arrowColor("=>");
const semicolon = ";";

const jsonPropertyOpen = `[JsonProperty(${codeHighlighter.stringColor('"')}`;
const jsonPropertyClose = `${codeHighlighter.stringColor('"')})]`;

const getDataType = (data) => {
  switch (typeof data) {
    case "number":
      if (data.toString().includes(".")) {
        return codeHighlighter.keywordColor("float");
      } else {
        return codeHighlighter.keywordColor("int");
      }
    case "string":
      return codeHighlighter.keywordColor("string");
    case "boolean":
      return codeHighlighter.keywordColor("bool");
    default:
      return codeHighlighter.keywordColor("object");
  }
};

const getClosingCurlyBrace = () => closeCurlyBrace;
const getNewLine = () => newLine;
const getListReturnType = (dataType) =>
  listDeclarationOpen + dataType + listDeclarationClose;
const getListKeyWord = () => listKeyword;
const getSpace = () => space;

const getJsonPropertyString = (string) =>
  tab +
  jsonPropertyOpen +
  codeHighlighter.stringColor(string) +
  jsonPropertyClose;

const declareClass = (accessModifier, className) => {
  let curlyBraceNewLine = codeSettings.newLine ? newLine : "";
  let classCode =
    newLine +
    systemSerializableKeyword +
    newLine +
    accessModifier +
    space +
    classKeyword +
    space +
    codeHighlighter.classColor(className) +
    space +
    curlyBraceNewLine +
    openCurlyBrace +
    newLine;
  return classCode;
};

const declareMethod = (
  accessModifier,
  returnType,
  methodName,
  variableName
) => {
  let extraTab = codeSettings.newLine ? newLine + tab : "";
  let method =
    tab +
    accessModifier +
    space +
    codeHighlighter.dataTypeColor(returnType) +
    space +
    methodName +
    openParentheses +
    closeParenthses +
    space +
    extraTab +
    openCurlyBrace +
    newLine +
    tab +
    tab +
    returnKeyword +
    space +
    variableName +
    semicolon +
    newLine +
    tab +
    closeCurlyBrace +
    newLine;
  return method;
};

const declareLambdaFunction = (
  accessModifier,
  returnType,
  methodName,
  variableName
) => {
  return (
    tab +
    accessModifier +
    space +
    codeHighlighter.dataTypeColor(returnType) +
    space +
    methodName +
    space +
    arrow +
    space +
    variableName +
    semicolon +
    newLine
  );
};

const declareGetSet = (accessModifier, returnType, propertyName) => {
  let extraTab = codeSettings.newLine ? newLine + tab : " ";
  let getSet =
    tab +
    accessModifier +
    space +
    codeHighlighter.dataTypeColor(returnType) +
    space +
    propertyName
      .slice(codeSettings.variablePrefix.length)
      .charAt(0)
      .toUpperCase() +
    propertyName.slice(codeSettings.variablePrefix.length + 1) +
    `${extraTab}${openCurlyBrace} ${newLine} ${tab} ${codeHighlighter.keywordColor(
      "get"
    )} { ${codeHighlighter.keywordColor(
      "return"
    )} ${propertyName}; } ${newLine} ${tab} ${codeHighlighter.keywordColor(
      "set"
    )} { ${propertyName} = value; } ${newLine}${tab}}` +
    newLine +
    newLine;
  return getSet;
};

const declareGet = (accessModifier, returnType, propertyName) => {
  let extraTab = codeSettings.newLine ? newLine + tab : " ";
  let get =
    tab +
    accessModifier +
    space +
    codeHighlighter.dataTypeColor(returnType) +
    space +
    propertyName
      .slice(codeSettings.variablePrefix.length)
      .charAt(0)
      .toUpperCase() +
    propertyName.slice(codeSettings.variablePrefix.length + 1) +
    `${extraTab}${openCurlyBrace} ${newLine} ${tab} ${codeHighlighter.keywordColor(
      "get"
    )} { ${codeHighlighter.keywordColor(
      "return"
    )} ${propertyName}; } ${newLine}${tab}}` +
    newLine +
    newLine;
  return get;
};

const declareVariable = (accessModifier, dataType, variableName) => {
  return (
    accessModifier +
    space +
    codeHighlighter.dataTypeColor(dataType) +
    space +
    variableName +
    semicolon +
    newLine
  );
};

const declareList = (accessModifier, dataType, variableName) => {
  return (
    accessModifier +
    space +
    listDeclarationOpen +
    codeHighlighter.dataTypeColor(dataType) +
    listDeclarationClose +
    space +
    variableName +
    semicolon +
    newLine
  );
};

const createMethod = (
  methodType,
  accessModifier,
  returnType,
  methodName,
  variableName
) => {
  switch (methodType) {
    case "lambda":
      return declareLambdaFunction(
        accessModifier,
        returnType,
        methodName,
        variableName
      );
    case "normal-methods":
      return declareMethod(
        accessModifier,
        returnType,
        "Get" + methodName,
        variableName
      );
    case "get":
      return declareGet(accessModifier, returnType, variableName);
    case "get-set":
      return declareGetSet(accessModifier, returnType, variableName);
    default:
      return declareGet(accessModifier, returnType, variableName);
  }
};

const resetFormatting = () => {
  openCurlyBrace = "{";
  systemSerializableKeyword = `[System.${codeHighlighter.classColor(
    "Serializable"
  )}]`;
};

const initialise = (codeConfig) => {
  codeSettings = codeConfig;
  if (!codeSettings.serializable) {
    systemSerializableKeyword = "";
  }
};

module.exports = {
  initialise: initialise,
  declareClass: declareClass,
  declareVariable: declareVariable,
  createMethod: createMethod,
  declareList: declareList,
  getClosingCurlyBrace: getClosingCurlyBrace,
  getJsonPropertyString: getJsonPropertyString,
  getNewLine: getNewLine,
  getDataType: getDataType,
  getListReturnType: getListReturnType,
  getListKeyWord: getListKeyWord,
  getSpace: getSpace,
  resetFormatting: resetFormatting,
  privateAccessModifier: privateAccessModifier,
  internalAccessModifier: internalAccessModifier,
  publicAccessModifier: publicAccessModifier,
  protectedAccessModifier: protectedAccessModifier,
  getTab: tab,
};
