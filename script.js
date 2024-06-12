//import all the neccessary packages
const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const AI = require("./Gemini_AI/AI");
const Youtube_API = require("./Youtube_API/main");

//defining data
var User_Input = "";//What the user wants to learn
var AI_Request = "Give Me A Learning path to learn " + User_Input + " with numbered list, no bullet points and give no examples";//sends request to AI
var filtered_AI_Response = [];//AI Response
var Videos_Results = [];//Videos Generated
var Videos_Results_Filter = [];//Videos Generated
var filtered_AI_Question = [];//AI Questions
const port = process.env.PORT || 4000;

function filter_AI() {

  console.log("started");

  for (let index = 1; index < 50; index++) {

    const fileContent = fs.readFileSync('./result.txt', 'utf8');//reads the AI Defautlt response
    const lines = fileContent.split('\n');//strips down the result for the needs of the application
    const searchString = `${index}. `;
    const matchingLines = lines.filter(line => line.includes(searchString));

    matchingLines.forEach(matchingLine => {
      console.log(matchingLine);
      filtered_AI_Response[index] = matchingLine.substring(3);//puts the filtered result in the variable
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
      Videos_Results[index] = fileContent.toString();
      Videos_Results_Filter[index] = matchingLine.substring(18, 29);
      console.log(Videos_Results_Filter[index]);//putss the video id in the variable
    });
}

async function Finder() {


  for (let index = 1; index < filtered_AI_Response.length; index++) {

    await Youtube_API.main(filtered_AI_Response[index] + " in " + User_Input + "Course in english");
    Video_Find(index);

  }

}

async function Generate() {

  console.log("Waiting For AI..");
  await AI.run(AI_Request);
  await filter_AI();
  await Finder();
}

app.get('/info', (req, res) => {
  async function GenerateHTML() {
    await Generate()
    const VideosJSON = JSON.stringify(Videos_Results_Filter)
    res.status(200).json(VideosJSON)
  }
  GenerateHTML()
})

app.post('/', (req, res) => {
  const { parcel } = req.body
  User_Input = parcel
  AI_Request = "Give Me A Learning path to learn " + User_Input + " with numbered list, no bullet points, make the example below the heading and give one single example for what i should learn";
  console.log(parcel)
  if(!parcel) {
    return res.status(400).send({ info: 'err' })
  }
  
})

app.listen(port, () => {
  console.log(`App Is Listening On Port` + port)
})