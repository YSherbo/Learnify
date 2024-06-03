//import all the neccessary packages
const fs = require('fs');
const express = require('express');
const app = express();
const AI = require("./Gemini_AI/AI");
const Youtube_API = require("./Youtube_API/main");
const path = require('path');

//defining data
var User_Input = "Databases";//What the user wants to learn
var AI_Request = "Give Me A Learning path to learn " + User_Input + " with numbered list, no bullet points, make the example below the heading and give one single example for what i should learn";//sends request to AI
var filtered_AI_Response = [];//AI Response
var Videos_Results = [];//Videos Generated
var filtered_AI_Question = [];//AI Questions
const publicPath = path.join(__dirname, 'public');

function filter_AI() {

  console.log("started");

  for (let index = 1; index < 50; index++) {

    const fileContent = fs.readFileSync('./result.txt', 'utf8');//reads the AI Defautlt response
    const lines = fileContent.split('\n');//strips down the result for the needs of the application
    const searchString = `${index}. `;
    const matchingLines = lines.filter(line => line.includes(searchString));

    matchingLines.forEach(matchingLine => {
      console.log(matchingLine);
      filtered_AI_Response[index] = matchingLine;//puts the filtered result in the variable
    });
  }
}

function Video_Find(index) {

    const fileContent = fs.readFileSync('./data.json', 'utf8');//gets the video id
    const lines = fileContent.split('\n');//strips down the result for the needs of the application
    const searchString = 'videoId';
    const matchingLines = lines.filter(line => line.includes(searchString));

    matchingLines.forEach(matchingLine => {
      console.log(matchingLine);
      Videos_Results[index] = matchingLine.substring(18, 29);
      console.log(Videos_Results[index]);//putss the video id in the variable
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

app.use(express.static(publicPath));

app.listen(8080);