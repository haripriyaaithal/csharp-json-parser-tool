const stringFormatter = require("./stringFormatter");

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
const openCurlyBrace = "{";
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
      case "object":
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
  return (
    newLine +
    systemSerializableKeyword +
    newLine +
    accessModfier +
    space +
    classKeyword +
    space +
    className +
    space +
    openCurlyBrace +
    newLine
  );
};

const declareMethod = (accessModifier, returnType, methodName, variableName) => {
  return (
    tab +
    accessModifier +
    space +
    returnType +
    space +
    methodName +
    openParentheses +
    closeParenthses +
    space +
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
    newLine
  );
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
  return (
    accessModifier +
    space +
    getDataType(dataType) +
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

module.exports = { 
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
    getSpace: getSpace
};