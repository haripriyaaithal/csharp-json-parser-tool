const keywordList = [
  "abstract",
  "as",
  "base",
  "bool",
  "break",
  "byte",
  "case",
  "catc",
  "char",
  "checked",
  "class",
  "cons",
  "continue",
  "decimal",
  "default",
  "delegate",
  "do",
  "double",
  "else",
  "enum",
  "event",
  "explicit",
  "extern",
  "false",
  "finally",
  "fixed",
  "float",
  "for",
  "foreach",
  "goto",
  "if",
  "implicit",
  "in",
  "int",
  "interface",
  "internal",
  "is",
  "lock",
  "long",
  "namespace",
  "new",
  "null",
  "object",
  "operator",
  "out",
  "override",
  "params",
  "private",
  "protected",
  "public",
  "readonly",
  "ref",
  "return",
  "sbyte",
  "sealed",
  "short",
  "sizeof",
  "stackalloc",
  "static",
  "string",
  "struct",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "uint",
  "ulong",
  "unchecked",
  "unsafe",
  "ushort",
  "using",
  "virtual",
  "void",
  "volatile",
  "while",
];

const classColor = (className) =>
  `<span style="color: #229595">${className}</span>`;

const keywordColor = (keyword) =>
  `<span style="color: #2979CD">${keyword}</span>`;

const stringColor = (string) => `<span style="color: #CD8365">${string}</span>`;

const arrowColor = (arrow) => `<span style="color: #A9A9A9">${arrow}</span>`;

const dataTypeColor = (returnType) => {
  return keywordList.includes(returnType)
    ? keywordColor(returnType)
    : classColor(returnType);
};

module.exports = {
  classColor: classColor,
  keywordColor: keywordColor,
  stringColor: stringColor,
  arrowColor: arrowColor,
  dataTypeColor: dataTypeColor,
};
