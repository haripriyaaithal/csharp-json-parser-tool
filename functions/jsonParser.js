const codeHighlighter = require("./codeHighlighter");
const cSharp = require("./csharpCodeBuilder");
const stringFormatter = require("./stringFormatter");

const classesMap = new Map();
const methodsMap = new Map();

let getMethodType = "";
let getterAccessModifier = "";
let variableAccessModifier = "";
let variablePrefix = "";
let useNewtonSoft;
let generateGetters;

/**
 *  Returns an unique id for a class.
 *
 *  @param {number} id Id of calling class. This id will be used to generate Id for new class.
 *  @return {number} id new unique id.
 */
const getClassId = (id) => {
  while (classesMap.has(id)) {
    id++;
  }
  return id;
};

/**
 * Declares a list in C# and generates a getter function/property for the list.
 * If that list contains non primitives, it will call extractObjects recursive function.
 *
 * @param {object} obj Main object being parsed.
 * @param {string} key Key that represents the list.
 * @param {number} classId Current class id to save the code in the map.
 */
const declareList = (obj, key, classId) => {
  let dataType = "";
  if (typeof obj[key][0] != "object") {
    dataType = cSharp.getDataType(obj[key][0]);
  } else {
    dataType = stringFormatter.formatPascalCase(key);
  }
  const containsList = key
    .toLowerCase()
    .includes(cSharp.getListKeyWord().toLowerCase());
  const name = useNewtonSoft
    ? containsList
      ? key
      : key + cSharp.getListKeyWord()
    : key;
  classesMap
    .get(classId)
    .push(
      getJSONPropertyString(key) +
        (useNewtonSoft ? cSharp.getSpace() : "") +
        cSharp.declareList(
          variableAccessModifier,
          dataType,
          variablePrefix + getVariableName(name)
        )
    );

  const method = cSharp.createMethod(
    getMethodType,
    getterAccessModifier,
    cSharp.getListReturnType(dataType),
    stringFormatter.formatPascalCase(name),
    variablePrefix + getVariableName(name)
  );
  methodsMap.get(classId).push(method);

  // If the list contains objects, then create classes for those objects.
  if (typeof obj[key][0] == "object") {
    const newClassId = getClassId(classId);
    classesMap.set(newClassId, []);
    methodsMap.set(newClassId, []);
    classesMap
      .get(newClassId)
      .push(
        cSharp.declareClass(
          cSharp.publicAccessModifier,
          stringFormatter.formatPascalCase(key)
        )
      );
    extractObjects(obj[key][0], newClassId);
  }
};

/**
 * Declares a primitive variable in C# and generates getter function/property for the same.
 *
 * @param {object} obj Main object being parsed.
 * @param {string} key Key of primitive variable.
 * @param {number} classId Current class id to save the code in the map.
 */
const declarePrimitives = (obj, key, classId) => {
  const varDeclaration =
    getJSONPropertyString(key) +
    (useNewtonSoft ? cSharp.getSpace() : "") +
    cSharp.declareVariable(
      variableAccessModifier,
      cSharp.getDataType(obj[key]),
      variablePrefix + getVariableName(key)
    );
  classesMap.get(classId).push(varDeclaration);

  const method = cSharp.createMethod(
    getMethodType,
    getterAccessModifier,
    cSharp.getDataType(obj[key]),
    stringFormatter.formatPascalCase(key),
    variablePrefix + getVariableName(key)
  );
  methodsMap.get(classId).push(method);
};

/**
 * Declares non-primitive variable in C# and generates getter function/property for the same.
 *
 * @param {string} key Key of non primitive variable.
 * @param {number} classId Current class id to save the code in the map.
 */
const declareNonPrimitives = (key, classId) => {
  const method = cSharp.createMethod(
    getMethodType,
    getterAccessModifier,
    stringFormatter.formatPascalCase(key),
    stringFormatter.formatPascalCase(key),
    variablePrefix + getVariableName(key)
  );
  methodsMap.get(classId).push(method);

  const variable =
    getJSONPropertyString(key) +
    (useNewtonSoft ? cSharp.getSpace() : "") +
    cSharp.declareVariable(
      variableAccessModifier,
      stringFormatter.formatPascalCase(key),
      variablePrefix + getVariableName(key)
    );
  classesMap.get(classId).push(variable);
};

/**
 *  Extracts variable and methods of the objects and saves it in class and method map.
 *  This function is called recursively.
 *
 *  @param {object} obj JavaScript object which can be number, string, array etc.
 *  @param {number} classId Unique class id for the object being parsed.
 */
const extractObjects = (obj, classId) => {
  for (key in obj) {
    if (typeof obj[key] == "object") {
      if (Array.isArray(obj[key])) {
        // Generate List code
        declareList(obj, key, classId);
      } else if (obj[key] === null || Object.keys(obj[key]).length <= 0) {
        // If the value is null or empty, consider its data type as object
        const varDeclaration =
          getJSONPropertyString(key) +
          (useNewtonSoft ? cSharp.getSpace() : "") +
          cSharp.declareVariable(
            variableAccessModifier,
            cSharp.getDataType({}),
            variablePrefix + getVariableName(key)
          );
        classesMap.get(classId).push(varDeclaration);
        const method = cSharp.createMethod(
          getMethodType,
          getterAccessModifier,
          cSharp.getDataType({}),
          stringFormatter.formatPascalCase(key),
          variablePrefix + getVariableName(key)
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
            cSharp.declareClass(
              cSharp.publicAccessModifier,
              stringFormatter.formatPascalCase(key)
            )
          );
        declareNonPrimitives(key, classId);
        extractObjects(obj[key], newClassId);
      }
    } else {
      // Generate variable code.
      declarePrimitives(obj, key, classId);
    }
  }
  // Class closing brace.
  classesMap.get(classId).push(cSharp.getClosingCurlyBrace());
};

/**
 * Returns variable name based on user input.
 *
 * @param {string} variable The variable name to be formatted.
 * @returns {string} Formatted variable name.
 */
const getVariableName = (variable) => {
  return useNewtonSoft ? stringFormatter.formatCamelCase(variable) : variable;
};

/**
 * Returns [JsonProperty()] string if required, based on user input.
 *
 * @param {string} key The JSON key to be parsed.
 * @returns {string} [JsonProperty(key)] string.
 */
const getJSONPropertyString = (key) => {
  return useNewtonSoft ? cSharp.getJsonPropertyString(key) : cSharp.getTab;
};

/**
 * Generates C# code from classesMap and methodMap.
 *
 * @returns {string} C# code to parse the JSON.
 */
const generateCSharpCode = () => {
  let csharpCode = "";
  classesMap.forEach((element, index) => {
    // element.length - 1 => To avoid appending of "}" before methods are appended
    for (let i = 0; i < element.length - 1; i++) {
      csharpCode += element[i];
    }

    csharpCode = csharpCode.trim();
    csharpCode += cSharp.getNewLine();

    if (generateGetters) {
      csharpCode += cSharp.getNewLine();
      const methods = methodsMap.get(index);
      methods.forEach((method) => {
        csharpCode += method;
      });
    }
    csharpCode = csharpCode.trim();
    csharpCode += cSharp.getNewLine();
    csharpCode += cSharp.getClosingCurlyBrace();
  });

  classesMap.clear();
  methodsMap.clear();
  cSharp.resetFormatting();
  return csharpCode;
};

/**
 * Entry point to the file, sets code preferences and generates C# code.
 *
 * @param {string} json Input from user.
 * @param {object} codeConfig Code preferences like variable name prefix, getter functions type etc.
 * @returns {string} C# code to parse the given JSON input.
 */
const parseJSON = (json, codeConfig) => {
  useNewtonSoft = codeConfig.useNewtonSoft;
  generateGetters = useNewtonSoft ? true : codeConfig.generateGetters;
  variableAccessModifier = codeConfig.useNewtonSoft
    ? cSharp.privateAccessModifier
    : cSharp.publicAccessModifier;

  getMethodType = codeConfig.methodType.get;
  getterAccessModifier = codeHighlighter.keywordColor(
    codeConfig.accessModifiers.get
  );
  variablePrefix = codeConfig.useNewtonSoft ? codeConfig.variablePrefix : "";

  cSharp.initialise(codeConfig);

  // If array is given as input
  if (json.trim().charAt(0) === "[") {
    json = `{ "data": ${json} }`;
  }

  classesMap.set(1, []);
  methodsMap.set(1, []);
  classesMap
    .get(1)
    .push(cSharp.declareClass(cSharp.publicAccessModifier, "Parent"));

  extractObjects(JSON.parse(json), 1);
  return generateCSharpCode().trim();
};

module.exports = parseJSON;
