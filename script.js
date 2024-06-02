const fs = require('fs');
const readline = require('readline');

const AI = require("./Gemini_AI/AI");
const Youtube_API = require("./Youtube_API/main");
var User_Input = "Databases";
var AI_Request = "Give Me A Learning path to learn " + User_Input + " with numbered list, no bullet points, make the example below the heading and give one single example for what i should learn";
var filtered_AI_Response = [];
var Videos_Results = [];
var filtered_AI_Question = [];

function filter_AI() {

  console.log("started");

  for (let index = 1; index < 50; index++) {

    const fileContent = fs.readFileSync('./result.txt', 'utf8');
    const lines = fileContent.split('\n');
    const searchString = `${index}. `;
    const matchingLines = lines.filter(line => line.includes(searchString));

    matchingLines.forEach(matchingLine => {
      console.log(matchingLine);
      filtered_AI_Response[index] = matchingLine;
    });
  }
}

function Video_Find(index) {

    const fileContent = fs.readFileSync('./data.json', 'utf8');
    const lines = fileContent.split('\n');
    const searchString = 'videoId';
    const matchingLines = lines.filter(line => line.includes(searchString));

    matchingLines.forEach(matchingLine => {
      console.log(matchingLine);
      Videos_Results[index] = matchingLine.substring(18, 29);
      console.log(Videos_Results[index]);
    });
}

async function Finder() {


  for (let index = 1; index < filtered_AI_Response.length; index++) {

    await Youtube_API.main(filtered_AI_Response[index] + "full Course");
    Video_Find(index);

  }

}

async function Generate_Questions() {

  for (let index = 0; index < filtered_AI_Response.length; index++) {
    
      await AI.run("Give Me a Question about " + filtered_AI_Response[index] + "and make it an open-ended question and dont give the answer and make sure the question ends with a question mark");

      const fileContent = fs.readFileSync('./result.txt', 'utf8');
      const lines = fileContent.split('\n');
      const searchString = '?';
      const matchingLines = lines.filter(line => line.includes(searchString));
  
      matchingLines.forEach(matchingLine => {
        console.log(matchingLine);
        filtered_AI_Question[index] = matchingLine;
      });
  }
  
  
}


async function Generate() {

  console.log("Waiting For AI..");
  await AI.run(AI_Request);
  await filter_AI();
  await Finder();
  await Generate_Questions();
}

Generate();