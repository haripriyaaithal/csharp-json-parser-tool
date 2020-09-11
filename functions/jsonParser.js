const cSharp = require("./csharpCodeBuilder");
const stringFormatter = require("./stringFormatter");

const classesMap = new Map();
const methodsMap = new Map();

let getMethodType = "";
let getterAccessModifier = "";
let variableAccessModifier = "";
let variablePrefix = "_";

const getClassId = (id) => {
  while (classesMap.has(id)) {
    id++;
  }
  return id;
};

const extractObjects = (obj, classId) => {
  for (key in obj) {
    if (typeof obj[key] == "object") {
      if (Array.isArray(obj[key])) {
        // Generate List code
        let dataType = "";
        if (typeof obj[key][0] != "object") {
          dataType = cSharp.getDataType(obj[key][0]);
        } else {
          dataType = stringFormatter.formatPascalCase(key);
        }
        let containsList = key
          .toLowerCase()
          .includes(cSharp.getListKeyWord().toLowerCase());
        let name = containsList ? key : key + cSharp.getListKeyWord();
        classesMap
          .get(classId)
          .push(
            cSharp.getJsonPropertyString(key) +
              cSharp.getSpace() +
              cSharp.declareList(
                variableAccessModifier,
                dataType,
                variablePrefix + stringFormatter.formatCamelCase(name)
              )
          );

        let method = cSharp.createMethod(
          getMethodType,
          getterAccessModifier,
          cSharp.getListReturnType(dataType),
          "Get" + stringFormatter.formatPascalCase(name),
          variablePrefix + stringFormatter.formatCamelCase(name)
        );
        methodsMap.get(classId).push(method);

        // If the list contains objects, then create classes for those objects
        if (typeof obj[key][0] == "object") {
          const newClassId = getClassId(classId);
          classesMap.set(newClassId, []);
          methodsMap.set(newClassId, []);
          classesMap
            .get(newClassId)
            .push(
              cSharp.declareClass(
                "public",
                stringFormatter.formatPascalCase(key)
              )
            );
          extractObjects(obj[key][0], newClassId);
        }
      } else if (obj[key] === null || Object.keys(obj[key]).length <= 0) {
        // If the value is null or empty, consider its data type as object
        let varDeclaration =
          cSharp.getJsonPropertyString(key) +
          cSharp.getSpace() +
          cSharp.declareVariable(
            variableAccessModifier,
            cSharp.getDataType({}),
            variablePrefix + stringFormatter.formatCamelCase(key)
          );
        classesMap.get(classId).push(varDeclaration);

        let method = cSharp.createMethod(
          getMethodType,
          getterAccessModifier,
          "object",
          "Get" + stringFormatter.formatPascalCase(key),
          variablePrefix + stringFormatter.formatCamelCase(key)
        );
        methodsMap.get(classId).push(method);
      } else {
        // Generate class code
        const newClassId = getClassId(classId);
        classesMap.set(newClassId, []);
        methodsMap.set(newClassId, []);

        // Declare class
        classesMap
          .get(newClassId)
          .push(
            cSharp.declareClass("public", stringFormatter.formatPascalCase(key))
          );

        // Declare method
        let method = cSharp.createMethod(
          getMethodType,
          getterAccessModifier,
          stringFormatter.formatPascalCase(key),
          "Get" + stringFormatter.formatPascalCase(key),
          variablePrefix + stringFormatter.formatCamelCase(key)
        );
        methodsMap.get(classId).push(method);

        // Add variable to class
        let variable =
          cSharp.getJsonPropertyString(key) +
          cSharp.getSpace() +
          cSharp.declareVariable(
            variableAccessModifier,
            stringFormatter.formatPascalCase(key),
            variablePrefix + stringFormatter.formatCamelCase(key)
          );
        classesMap.get(classId).push(variable);

        extractObjects(obj[key], newClassId);
      }
    } else {
      // Generate variable code
      let varDeclaration =
        cSharp.getJsonPropertyString(key) +
        cSharp.getSpace() +
        cSharp.declareVariable(
          variableAccessModifier,
          cSharp.getDataType(obj[key]),
          variablePrefix + stringFormatter.formatCamelCase(key)
        );
      classesMap.get(classId).push(varDeclaration);

      let method = cSharp.createMethod(
        getMethodType,
        getterAccessModifier,
        cSharp.getDataType(obj[key]),
        stringFormatter.formatPascalCase(key),
        variablePrefix + stringFormatter.formatCamelCase(key)
      );
      methodsMap.get(classId).push(method);
    }
  }
  classesMap.get(classId).push(cSharp.getClosingCurlyBrace());
};

const generateCSharpCode = () => {
  let csharpCode = "";
  classesMap.forEach((element, index) => {
    // element.length - 1 => To avoid appending of "}" before methods are appended
    for (let i = 0; i < element.length - 1; i++) {
      csharpCode += element[i];
    }

    csharpCode += cSharp.getNewLine();

    let methods = methodsMap.get(index);
    methods.forEach((method) => {
      csharpCode += method;
    });
    csharpCode += cSharp.getClosingCurlyBrace();
  });

  classesMap.clear();
  methodsMap.clear();
  cSharp.resetFormatting();
  return csharpCode;
};

const parseJSON = (json, codeConfig) => {
  // TODO: Refactor & filter user input
  variableAccessModifier = "private";
  getMethodType = codeConfig.methodType.get;
  getterAccessModifier = codeConfig.accessModifiers.get;
  variablePrefix = codeConfig.variablePrefix;

  cSharp.initialise(codeConfig);

  // If array is given as input
  if (json.trim().charAt(0) === "[") {
    let updatedJson = `{ "data":` + json;
    updatedJson += "}";
    json = updatedJson;
  }

  classesMap.set(1, []);
  methodsMap.set(1, []);
  classesMap.get(1).push(cSharp.declareClass("public", "Parent"));

  extractObjects(JSON.parse(json), 1);
  return generateCSharpCode().trim();
};

module.exports = parseJSON;
