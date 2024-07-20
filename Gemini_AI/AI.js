const AI = require("@google/generative-ai");
const fs = require("fs");
 
const API_KEY = process.env.AIAPI;
const genAI = new AI.GoogleGenerativeAI(API_KEY);
var AI_Response = "";

const safetySetting = [
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
  {
    category: AI.HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    threshold: AI.HarmBlockThreshold.BLOCK_NONE,
  },
];

async function run(question) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySetting });

  const result = await model.generateContent(question);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  AI_Response = text;  
  fs.writeFileSync("./result.txt", text);


}


module.exports.AI_Response = AI_Response;

module.exports.run = run;