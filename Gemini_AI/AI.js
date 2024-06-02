const AI = require("@google/generative-ai");
const fs = require("fs");
 
const API_KEY = "AIzaSyArMJ0RswN9FPMWwUYCEC9Ia5FhBXWAsKY"
const genAI = new AI.GoogleGenerativeAI(API_KEY);
var AI_Response = "";

function nothing() {
  //do nothing
}

async function run(question) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const result = await model.generateContent(question);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  AI_Response = text;  
  fs.writeFileSync("./result.txt", text);


}


module.exports.AI_Response = AI_Response;

module.exports.run = run;