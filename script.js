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
var AI_Request = "Can you give me a step by step Roadmap for learning " + User_Input + " for beginners and with no Context At All (like instead of saying networking : Learn the basics of TCP/IP and network protocol just say networking for example )and no explanation and if steps have a tool, Programing language, software..etc (like exploitation need a tool like metasploit or ehtical hacking can use python), give one recommendation (like when giving step just say Django instead of NoSql : Django for example or Vulnerabilities and Exploits : metasploit just say metasploit or instead of saying programing languages(python) just say python) and the output must not have bold text or headers and make sure the steps doesn’t exceed 13 steps and with no certification or exam or competitions or programs ( no CEH Exem ...etc) and no sections (no FUNDAMENTALS : networking basics... just say networking)(and if theres something related to the specific topic say ... in *topic* (like if i said java programming, intead of sayng (programing fundementals) say (programing fundementals in java) but in networking since its its on topic and not related to something specific say networking)) and dont include Additional steps like ( Dont Include (Practice : tryhackme)) and make sure that the lines are under each other, no addditional empty lines( like since i asked for 13 steps only, do them in exactly 13 lines) and dont say the category then a special character (like : ) then the item, just say the item, then say the word (in) then say the category( like instead of saying (Mathematics : Calculus), Just Say (Calculus in mathematics) or when learning statics for mechanical engineering Say (Statics in Mechanical Engineering) All In All, even when your not going to say a category say in mechanical engineering when its necessary but if it doesnt have to be in a category dont do it (Like When Sayng Thermodynamics or fluid mechanics, You Dont Have To Say (in mechanical Engineering) just say it directly, but when saying statics of dynamics, statics is part of mechanical engineering So You Say (Statics In Mechanical Engineering)))) and make sure its on a numberd list (DO IT EXACTLY LIKR THAT 1. ) and say the best the name of the best youtube channel i can watch if i want to learn the step after saying the step (like when saying penetration testing methodologies, say (Penetration Testing Methodologies FreeCodeCamp) for Example and never include : or - at all";//Request Sent To The AI Model
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
var timeout = ["", "The Server Is Busy, Please Wait One Minute Then Try Again", "Info : We Add A One Minute Delay After Every Request To Prevent Surpassing The Request Limit"];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function AIDelay()
{
  Delayed = false;
  await delay(60000);
  fs.unlinkSync('./result.txt')
  fs.unlinkSync('./data.json')
  Delayed = true;
}

async function filter_AI() {

  console.log("started");
  
  filtered_AI_Response = []

  const fileContent = await fs.readFileSync('./result.txt', 'utf8');//reads the AI Defautlt response
  filtered_AI_Response = await fileContent.split('\n')
    
  for (let index = 0; index < 13; index++) {

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

    keywords[index] = filtered_AI_Response[index] + " course";

    await Youtube_API.main(keywords[index]);
    Video_Find(index);

  }

}

async function GenerateQuestion() {
  for (let index = 0; index < Videos_Results_Filter.length; index++) {
        await AI.run("can You Generate Me An Open Question about the topic " + keywords[index] + " but output only the question no context just the question (and when i say networks or networking Ask Something in networking like tcp and udp, ip adresses..etc and not just what is networking for example)")
        Questions[index] = await fs.readFileSync('./result.txt', 'utf8').toString()
        console.log(Questions[index])//puts the question in the variable
  }
}

async function GenerateExplanation() {
  for (let index = 0; index < keywords.length; index++) {
      await AI.run("can you give me a detailed explanation that teaches " + filtered_AI_Response[index] + " for beginners and teach everything about it (like when i say networks or networking teach everything like tcp and udp, ip adresses..etc and not just what is networking for example) and make sure that it is extremely detailed")
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
      
        await AI.run("Was " + answers[index] + " the Correct Answer for the question " + Questions[index] + "? and output only correct or incorrect and without any context and if the answer is wrong, say the correct answer then say why this is the correct answer")
        CheckAnswers[index] = fs.readFileSync('./result.txt', 'utf8').split('\n').join('\n').replace(/\n/g, "%")
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
  AI_Request = "Can you give me a step by step Roadmap for learning " + User_Input + " for beginners and with no Context At All (like instead of saying networking : Learn the basics of TCP/IP and network protocol just say networking for example )and no explanation and if steps have a tool, Programing language, software..etc (like exploitation need a tool like metasploit or ehtical hacking can use python), give one recommendation (like when giving step just say Django instead of NoSql : Django for example or Vulnerabilities and Exploits : metasploit just say metasploit or instead of saying programing languages(python) just say python) and the output must not have bold text or headers and make sure the steps doesn’t exceed 13 steps and with no certification or exam or competitions or programs ( no CEH Exem ...etc) and no sections (no FUNDAMENTALS : networking basics... just say networking)(and if theres something related to the specific topic say ... in *topic* (like if i said java programming, intead of sayng (programing fundementals) say (programing fundementals in java) but in networking since its its on topic and not related to something specific say networking)) and dont include Additional steps like ( Dont Include (Practice : tryhackme)) and make sure that the lines are under each other, no addditional empty lines( like since i asked for 13 steps only, do them in exactly 13 lines) and dont say the category then a special character (like : ) then the item, just say the item, then say the word (in) then say the category( like instead of saying (Mathematics : Calculus), Just Say (Calculus in mathematics) or when learning statics for mechanical engineering Say (Statics in Mechanical Engineering) All In All, even when your not going to say a category say in mechanical engineering when its necessary but if it doesnt have to be in a category dont do it (Like When Sayng Thermodynamics or fluid mechanics, You Dont Have To Say (in mechanical Engineering) just say it directly, but when saying statics of dynamics, statics is part of mechanical engineering So You Say (Statics In Mechanical Engineering)))) and make sure its on a numberd list (DO IT EXACTLY LIKR THAT 1. ) and say the best the name of the best youtube channel i can watch if i want to learn the step after saying the step (like when saying penetration testing methodologies, say (Penetration Testing Methodologies FreeCodeCamp) for Example and never include : or - at all";//Request Sent To The AI Model
  console.log(parcel)
  if(!parcel) {
    return res.status(400).send({ info: 'err' })
  }
  
})

app.listen(port, () => {
  console.log(`Learnify Is Listening On Port : ` + port)
})