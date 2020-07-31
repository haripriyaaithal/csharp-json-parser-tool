const functions = require("firebase-functions");
const express = require("express");

const app = express();
const parseJSON = require("./jsonParser");

app.post("/api", (request, response) => {
  let json = decodeURIComponent(request.body.data);
  let regex = /\,(?!\s*?[\{\[\"\'\w])/g;
  let updatedJson = json.replace(regex, "");
  console.log(request.body.codeConfig);
  response.send({
    data: parseJSON(updatedJson, request.body.codeConfig),
  });
});

exports.app = functions.https.onRequest(app);
