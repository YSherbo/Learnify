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
var AI_Request = `give me a list of the best YouTube videos i can watch so that i can watch to become from total beginner to advanced in ` + User_Input + `. make sure it consists of only one large part video (no playlist or videos that have a part 2 or 3..etc and no "learn ... in 5 minuites" type videos i need full explaination) and make sure the list that i have is a Road-map (like for example:if i wanted to learn mechanical engineering, first you would need to learn calculus then statics then dynamics etc etc so, give me a video that explains calculus, then you would give me another one explaining statics then dynamics etc etc(kind of like a roadmap)) and dont include any context of any kind, just give me a list with the video name and the channel name right under it  and no headers or context or bullet points at all nor any numbered list, just arange it without anything (no heres..... in the beginning and no bullet points) and make then directly under each other, no extra empty lines seperating the videoname and channelname of the same step (Add Empty Line between each step) and make each step right under each other, no empty lines seperating them (Like when doing 13 steps make sure its 26 lines) i want everything RIGHT UNDER EACH OTHER,
and make sure that the channel names are the EXACT NAME WRITTEN ON YOUTUBE, no abreviations(so i can find it as the first result to pop up in the youtube search results), and make sure the video still exists and the channel still exists and is a full explaination video(not introduction only) and make sure that both the videos and the channels are popular(one of the most popular videos and channels in the feild i asked for videos on)
make sure to do the step in ONLY(DONT DO ANY OTHER LAYOUT) this layout make sure the list comes out looking like this below:
Videoname
Channelname
Videoname
Channelname
finally, make sure it consists of 13 steps max and 5 steps minimum and again NO EXTRA LINES MAKE SURE THE VIDEO NAME AND CHANNEL NAME OF THE SAME STEP ARE RIGHT UNDER EACH OTHER ONLY ADD EMPTY LINE BETWEEN EACH SEPERATE STEP`;

var AI_Request2 = `give me a detailed text explaination of ` + User_Input + ` make sure it is a full explaination(Like for example: if I want to learn Mechanical Engineering, First give me an explaination on Statics then dynamics etc etc) and not an introduction only and make sure it is a detailed
and in-depth explaination with everything in it and mark headers and subheaders with <h2> instead of ** and the text with <p> instead of no mark-up at all`;

var AI_Request3 = `Can You Give Me a Multiple Choice ` + User_Input + ` Quiz and and dont say any context at all (no heres.... etc etc just give me the questions and make sure there are 3 choices, a, b, c and finally make sure everything is directly under each other no spacing at all, everything is right under each other

do it like this: 

Question
A- Choice1
B- Choice2
C- Choice3
Question2
A- Choice1
B- Choice2
C- Choice3

And With No Numbered list no bullet points nothing at all for the questions and again NO EXTRA LINES MAKE SURE THEYRE UNDER EACH OTHER
`;

var Videos = [];
var Channels = [];
var videoID = [];
var channelID = [];
var Explanation = "";
const port = process.env.PORT || 4000;
var timeout = ["", "The Server Is Busy, Please Wait One Minute Then Try Again", "Info : We Add A One Minute Delay After Every Request To Prevent Surpassing The Request Limit"];
var Delayed = true;
var questions = [];
var Answers = [];
var results = [];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function AIDelay()
{
  Delayed = false;
  await delay(60000);
  Channels = []
  Videos = []
  videoID = []
  channelID = []
  Explanation = ""
  questions = []
  Answers = []
  results = []
  fs.unlinkSync('./data.json')
  fs.unlinkSync('./channeldata.json')
  Delayed = true;
}

//Video Feature
async function getData() {// Runs The AI Request Through The Gemini API
  try {
    const data = await AI.run(AI_Request);
    const lines = data.split('\n');
    const videos = [];
    const channels = [];

    for (let i = 0; i < lines.length; i += 3) {
      videos.push(lines[i]);
      if (i + 1 < lines.length) {
        channels.push(lines[i + 1]);
      }
    }

    console.log(videos);
    console.log(channels);

    Videos = videos;
    Channels = channels;

  } catch (error) {

    console.error("Error fetching data from AI:", error);
    throw error;
  }
}

async function getVideos() {//Searches For The Channel Then The Video
  try {
    for (let i = 0; i < Channels.length; i++) {
      await Youtube_API.main2(Channels[i]);//Searches For The Channel through the API
      const data = JSON.parse(await fs.readFileSync("./channeldata.json"));
      channelID[i] = data[0].id.channelId;
      console.log(channelID[i]);

      await Youtube_API.main(Videos[i], data[0].id.channelId);//Searches For The Video through the API
      const data2 = JSON.parse(await fs.readFileSync("./data.json"));

      if (data2[0] == undefined) {
        console.log("VIDEO NOT FOUND");
        
        await Youtube_API.main3(Videos[i]);//Searches For The Video through the API
        data2 = JSON.parse(await fs.readFileSync("./data.json"));
        videoID[i] = data2[0].id.videoId;
        console.log(videoID[i]);
      }
      else {
        console.log("VIDEO FOUND");

        videoID[i] = data2[0].id.videoId;
        console.log(videoID[i]);
      }

    }

  } catch (error) {

    console.error("Error fetching data from Youtube API:", error);
    throw error;
  }
}

async function main() {//Runs The Functions of the Video Feature
  try {
    await getData();
    await getVideos();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//Explanation Feature
async function getExplanation() {
  try {
    const data = await AI.run(AI_Request2);
    console.log(data);
    data.split('\n').join('\n').replace(/\n/g, "%");
    Explanation = data;
  } catch (error) {
    console.error("Error fetching data from AI:", error);
    throw error;
  }

}

async function getQuestions() {// Runs The AI Request Through The Gemini API
  try {
    const data = await AI.run(AI_Request3);
    const lines = data.split('\n');
    const Questions1 = [];

    for (let i = 0; i < lines.length; i += 4) {
      Questions1[i].push
      (`${lines[i]}
        ${lines[i+1]}
        ${lines[i+2]}
        ${lines[i+3]}`);
      }

      console.log(Questions1[i]);
      questions[i] = Questions1[i];
    }

    
   catch (error) {

    console.error("Error fetching data from AI:", error);
    throw error;
  }
}


app.get('/info', (req, res) => {
  async function GenerateHTML() {
    if (Delayed) {

      await main()
      const VideosJSON = await JSON.stringify(videoID)
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
  async function GenerateQHTML() {
    if (Delayed) {
      AI_Request3 = `Can You Give Me a Multiple Choice ` + User_Input + ` Quiz and and dont say any context at all (no heres.... etc etc just give me the questions and make sure there are 3 choices, a, b, c and finally make sure everything is directly under each other no spacing at all, everything is right under each other

      do it like this: 
      
      Question
      A- Choice1
      B- Choice2
      C- Choice3
      Question2
      A- Choice1
      B- Choice2
      C- Choice3
      
      And With No Numbered list no bullet points nothing at all for the questions and again NO EXTRA LINES MAKE SURE THEYRE UNDER EACH OTHER
      `;

      await getQuestions();
      const QJSON = await JSON.stringify(questions)
      res.status(200).json(QJSON)
      AIDelay()
    }
    else {

      const timeoutJSON = await JSON.stringify(timeout)
      res.status(200).json(timeoutJSON)
    }
  }
  GenerateQHTML()
})

app.get('/Exp', (req, res) => {
  async function GenerateExpHTML() {

    if (Delayed) {
      AI_Request2 = `give me a detailed text explaination of ` + User_Input + ` make sure it is a full explaination(Like for example: if I want to learn Mechanical Engineering, First give me an explaination on Statics then dynamics etc etc) and not an introduction only and make sure it is a detailed
and in-depth explaination with everything in it and mark headers and subheaders with <h2> instead of ** and the text with <p> instead of no mark-up at all`;
      await getExplanation()
      const EXPJSON = JSON.stringify(Explanation)
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
  res.status(200).json(JSON.stringify(results))
})



app.post('/results', (req, res) => {
  const { parcel } = req.body
  var CheckAnswers = [];

  async function CheckAnswersF() {
    Answers = parcel
    
    if (Delayed) {
      for (let index = 0; index < questions.length; index++) {
      
        CheckAnswers[index] = await AI.run("Was " + Answers[index] + " the Correct Answer for the question " + questions[index] + "? and output only correct or incorrect and without any context and if the answer is wrong, say the correct answer then say why this is the correct answer")
        CheckAnswers[index].split('\n').join('\n').replace(/\n/g, "%")
        results[index] = CheckAnswers[index];
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
  console.log(parcel)
  AI_Request = `give me a list of the best YouTube videos i can watch so that i can watch to become from total beginner to advanced in ` + User_Input + `. make sure it consists of only one large part video (no playlist or videos that have a part 2 or 3..etc and no "learn ... in 5 minuites" type videos i need full explaination) and make sure the list that i have is a Road-map (like for example:if i wanted to learn mechanical engineering, first you would need to learn calculus then statics then dynamics etc etc so, give me a video that explains calculus, then you would give me another one explaining statics then dynamics etc etc(kind of like a roadmap)) and dont include any context of any kind, just give me a list with the video name and the channel name right under it  and no headers or context or bullet points at all nor any numbered list, just arange it without anything (no heres..... in the beginning and no bullet points) and make then directly under each other, no extra empty lines seperating the videoname and channelname of the same step (Add Empty Line between each step) and make each step right under each other, no empty lines seperating them (Like when doing 13 steps make sure its 26 lines) i want everything RIGHT UNDER EACH OTHER,
and make sure that the channel names are the EXACT NAME WRITTEN ON YOUTUBE, no abreviations(so i can find it as the first result to pop up in the youtube search results), and make sure the video still exists and the channel still exists and is a full explaination video(not introduction only) and make sure that both the videos and the channels are popular(one of the most popular videos and channels in the feild i asked for videos on)
make sure to do the step in ONLY(DONT DO ANY OTHER LAYOUT) this layout make sure the list comes out looking like this below:
Videoname
Channelname
Videoname
Channelname
finally, make sure it consists of 13 steps max and 5 steps minimum and again NO EXTRA LINES MAKE SURE THE VIDEO NAME AND CHANNEL NAME OF THE SAME STEP ARE RIGHT UNDER EACH OTHER ONLY ADD EMPTY LINE BETWEEN EACH SEPERATE STEP`;

  console.log(User_Input)
  if(!parcel) {
    return res.status(400).send({ info: 'err' })
  }
})

app.listen(port, () => {
  console.log(`Learnify Is Listening On Port : ` + port)
})