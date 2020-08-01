let codeSettings;

const classKeyword = "class";
const systemSerializableKeyword = "[System.Serializable]";
const privateAccessModifier = "private";
const internalAccessModifier = "internal";
const publicAccessModifier = "public";
const protectedAccessModifier = "protected";

const getKeyword = "Get";
const listKeyword = "List";
const returnKeyword = "return";
const listDeclarationOpen = "List&lt";
const listDeclarationClose = "&gt;";

const space = "&nbsp;";
const tab = "&nbsp;&nbsp;&nbsp;&nbsp;";
const newLine = "<br>";
let openCurlyBrace = "{";
const closeCurlyBrace = "}" + newLine;
const openParentheses = "(";
const closeParenthses = ")";
const arrow = "=>";
const semicolon = ";";

const jsonPropertyOpen = '[JsonProperty("';
const jsonPropertyClose = '")]';

const getDataType = (data) => {
  switch (typeof (data)) {
    case "number":
      if (data.toString().includes(".")) {
        return "float";
      } else {
        return "int";
      }
    case "string":
      return "string";
    case "boolean":
      return "bool";
    default:
      return "object";
  }
};

const getClosingCurlyBrace = () => closeCurlyBrace;
const getNewLine = () => newLine;
const getListReturnType = (dataType) => listDeclarationOpen + dataType + listDeclarationClose;
const getListKeyWord = () => listKeyword;
const getSpace = () => space;

const getJsonPropertyString = (string) => tab + jsonPropertyOpen + string + jsonPropertyClose;

const declareClass = (accessModfier, className) => {
  let curlyBraceNewLine = codeSettings.newLine ? newLine : "";
  let classCode =  
    newLine +
    systemSerializableKeyword +
    newLine +
    accessModfier +
    space +
    classKeyword +
    space +
    className +
    space +
    curlyBraceNewLine +
    openCurlyBrace +
    newLine;
    return classCode;
};

const declareMethod = (accessModifier, returnType, methodName, variableName) => {
    let extraTab = codeSettings.newLine ? newLine + tab : "";
    let method =
    tab +
    accessModifier +
    space +
    returnType +
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

const declareLambdaFunction = (accessModifier, returnType, methodName, variableName) => {
  return (
    tab +
    accessModifier +
    space +
    returnType +
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

const declareVariable = (accessModifier, dataType, variableName) => {
  console.log(accessModifier, " : " , "| Data: ", dataType, "| DataType: ", getDataType(dataType), "| Name", variableName)
  return (
    accessModifier +
    space +
    dataType +
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
    dataType +
    listDeclarationClose +
    space +
    variableName +
    semicolon +
    newLine
  );
};

const createMethod = (methodType, accessModifier, returnType, methodName, variableName) => {
  switch(methodType) {
    case "lambda":
      return declareLambdaFunction(accessModifier, returnType, methodName, variableName);
    case "normal-methods":
      return declareMethod(accessModifier, returnType, methodName, variableName);
  }
}

const resetFormatting = () => {
  openCurlyBrace = "{";
}

const initialise = (codeConfig) => {
  codeSettings = codeConfig;
}

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
  resetFormatting: resetFormatting
};