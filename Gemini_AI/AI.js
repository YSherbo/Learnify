const AI = require("@google/generative-ai");
const fs = require("fs");

const API_KEY = process.env.AIAPI;
const genAI = new AI.GoogleGenerativeAI(API_KEY);
var AI_Response = "";


async function run(question) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    safetySettings: [
      {
        category: AI.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: AI.HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: AI.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: AI.HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: AI.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: AI.HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const result = await model.generateContent(question);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  AI_Response = text;
  return text;  
}


module.exports.AI_Response = AI_Response;

module.exports.run = run;