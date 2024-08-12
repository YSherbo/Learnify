//import all the neccessary packages
const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const AI = require("./Gemini_AI/AI");
const Youtube_API = require("./Youtube_API/main");
const { Console } = require('console');

//defining data
var User_Input = "";//What the user wants to learn
var AI_Request = "Can you give me a step by step Roadmap for learning " + User_Input + " for beginners and with no Context At All (like instead of saying networking : Learn the basics of TCP/IP and network protocol just say networking for example )and no explanation and if steps have a tool, Programing language, software..etc (like exploitation need a tool like metasploit), give one recommendation (like when giving step just say Django instead of NoSql : Django for example or Vulnerabilities and Exploits : metasploit just say metasploit ) and the output must not have bold text or headers and make sure the steps doesn’t exceed 13 steps and with no certification or exam or competitions or programs ( no CEH Exem ...etc) and no sections (no FUNDAMENTALS : networking basics... just say networking)";//Request Sent To The AI Model
var filtered_AI_Response = [];//AI Response
var Videos_Results = [];//Videos Generated
var Videos_Results_Filter = [];//Videos Generated
var Questions = [];//Questions Generated
var keywords = [];//Keywords Generated
var answers = [];//Answers Generated
var CheckAnswers = []; //answers checked
var explanation = [];//Explanaitions Generated
const port = process.env.PORT || 4000;
var Delayed = true;
var timeout = ["", "The Server Is Busy, Please Wait One Minute Then Try Again", "Error Code: AI_TIMEOUT"];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function AIDelay()
{
  Delayed = false;
  await delay(60000);
  Delayed = true;
}

async function filter_AI() {

  console.log("started");

  const fileContent = await fs.readFileSync('./result.txt', 'utf8');//reads the AI Defautlt response
  filtered_AI_Response = await fileContent.split('\n')
    
  for (let index = 0; index < 14; index++) {

    filtered_AI_Response[index] = filtered_AI_Response[index].substring(3)

    console.log(filtered_AI_Response[index])
  }
  
  filtered_AI_Response.unshift("")
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

    await AI.run("can you give me a perfect search keyword to search on youtube if i want to learn " + filtered_AI_Response[index] + " in " + User_Input + " and with no context and make it one keyword and allow spaces")
    keywords[index] = fs.readFileSync('./result.txt', 'utf8').toString()

    await Youtube_API.main(keywords[index]);
    Video_Find(index);

  }

}

async function GenerateQuestion() {
  for (let index = 0; index < Videos_Results_Filter.length; index++) {
        await AI.run("can You Generate Me An Open Question about the topic " + keywords[index] + " but output only the question no context just the question")
        Questions[index] = await fs.readFileSync('./result.txt', 'utf8').toString()
        console.log(Questions[index])//puts the question in the variable
  }
}

async function GenerateExplanation() {
  for (let index = 0; index < keywords.length; index++) {
      await AI.run("can you give me a detailed explanation that teaches " + filtered_AI_Response[index] + " for beginners and make sure that it is extremely detailed")
      explanation[index] = await fs.readFileSync('./result.txt', 'utf8').split('\n').join('\n').replace(/\n/g, "%");
      console.log(explanation[index])//puts the explanation in the variable
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
    if (Delayed) {

      await Generate()
      const VideosJSON = await JSON.stringify(Videos_Results_Filter)
      res.status(200).json(VideosJSON)
      AIDelay()
    }
    else {

      const timeoutJSON = await JSON.stringify(timeout)
      res.status(200).json(timeoutJSON)
    }
  }
  GenerateHTML()
})

app.get('/Question', (req, res) => {
  async function GenerateQuestionHTML() {

    if (Delayed) {

      await GenerateQuestion()
      const QuestionsJSON = JSON.stringify(Questions)
      res.status(200).json(QuestionsJSON)
      AIDelay()
    }
    else {

      const timeoutJSON = await JSON.stringify(timeout)
      res.status(200).json(timeoutJSON)
    }
    
  }
  GenerateQuestionHTML()
})

app.get('/Exp', (req, res) => {
  async function GenerateExpHTML() {

    if (Delayed) {
      await GenerateExplanation()
      const EXPJSON = JSON.stringify(explanation)
      res.status(200).json(EXPJSON)
      AIDelay()
    }
    else {

      const timeoutJSON = await JSON.stringify(timeout)
      res.status(200).json(timeoutJSON)
    }
  }
  GenerateExpHTML()
})


app.get('/answers', (req, res) => {
    res.status(200).json(JSON.stringify(CheckAnswers))
})



app.post('/results', (req, res) => {
  const { parcel } = req.body
  async function CheckAnswersF() {
    answers = parcel
    
    if (Delayed) {
      for (let index = 0; index < Questions.length; index++) {
      
        await AI.run("Was " + answers[index] + " the Correct Answer for the question " + Questions[index] + "? and output only true or false and without any context")
        CheckAnswers[index] = fs.readFileSync('./result.txt', 'utf8').toString()
      }
    }
  }

  if(!parcel) {
    return res.status(400).send({ info: 'err' })
  }

  CheckAnswersF()
})

app.post('/', (req, res) => {
  const { parcel } = req.body
  User_Input = parcel
  AI_Request = "Can you give me a step by step Roadmap for learning " + User_Input + " for beginners and with no Context At All (like instead of saying networking : Learn the basics of TCP/IP and network protocol just say networking for example )and no explanation and if steps have a tool, Programing language, software..etc (like exploitation need a tool like metasploit), give one recommendation (like when giving step just say Django instead of NoSql : Django for example or Vulnerabilities and Exploits : metasploit just say metasploit ) and the output must not have bold text or headers and make sure the steps doesn’t exceed 13 steps and with no certification or exam or competitions or programs ( no CEH Exem ...etc) and no sections (no FUNDAMENTALS : networking basics... just say networking)";
  console.log(parcel)
  if(!parcel) {
    return res.status(400).send({ info: 'err' })
  }
  
})

app.listen(port, () => {
  console.log(`Learnify Is Listening On Port : ` + port)
})