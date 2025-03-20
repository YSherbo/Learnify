// Import all the necessary packages
const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const AI = require("./Gemini_AI/AI");
const Youtube_API = require("./Youtube_API/main");
const { Console } = require("console");
const e = require("express");
const { json } = require("body-parser");
const { name } = require("ejs");

// Defining data
var User_Input = ""; // What the user wants to learn
var AI_Request =
  `give me a list of the best YouTube videos i can watch so that i can watch to become from total beginner to advanced in ` +
  User_Input +
  `. make sure it consists of only one large part video (no playlist or videos that have a part 2 or 3..etc and no "learn ... in 5 minuites" type videos i need full explaination) and make sure the list that i have is a Road-map (like for example:if i wanted to learn mechanical engineering, first you would need to learn calculus then statics then dynamics etc etc so, give me a video that explains calculus, then you would give me another one explaining statics then dynamics etc etc(kind of like a roadmap)) and dont include any context of any kind, just give me a list with the video name and the channel name right under it  and no headers or context or bullet points at all nor any numbered list, just arange it without anything (no heres..... in the beginning and no bullet points) and make then directly under each other, no extra empty lines seperating the videoname and channelname of the same step (Add Empty Line between each step) and make each step right under each other, no empty lines seperating them (Like when doing 13 steps make sure its 26 lines) i want everything RIGHT UNDER EACH OTHER,
and make sure that the channel names are the EXACT NAME WRITTEN ON YOUTUBE, no abreviations(so i can find it as the first result to pop up in the youtube search results), and make sure the video still exists and the channel still exists and is a full explaination video(not introduction only) and make sure that both the videos and the channels are popular(one of the most popular videos and channels in the field i asked for videos on) and make sure the channel subscriber count exeeds 100k subscribers and the videos like count exeeds 10k likes and the video exeeds 50k views and make sure the video is not a playlist and that the channel name doesnt contain weird charactes maake sure it only contains latin letters and make sure the video with this EXACT name exists in the channel(make sure theres a video with that exact name in the channel) and make sure the channel has a popular, unique name (like freecodecamp.org, TheCyberMentor for example) and and never generic names (like CyberSecurity Tutorials, Programming Tutorials, CyberSecurity TV, Programming Courses etc etc) and the video name to be like this (learn networking full course, learn programming full course etc etc) and never like this (learn networking part 1, learn programming in 10 mins etc etc) and never like this (learn networking basics, learn programming basics etc etc)
make sure to do the step in ONLY(DONT DO ANY OTHER LAYOUT) this layout make sure the list comes out looking like this below:
Videoname
Channelname
Videoname
Channelname
finally, make sure it consists of 13 steps max and 5 steps minimum and again NO EXTRA LINES MAKE SURE THE VIDEO NAME AND CHANNEL NAME OF THE SAME STEP ARE RIGHT UNDER EACH OTHER ONLY ADD EMPTY LINE BETWEEN EACH SEPERATE STEP`;

var AI_Request2 = ``;
var AI_Request3 = ``;
var AI_Request4 = ``;

var Videos = [];
var Channels = [];
var videoID = [];
var channelID = [];
var Explanation = "";
const port = process.env.PORT || 4000;
var timeout = [
  "",
  "The Server Is Busy, Please Wait One Minute Then Try Again",
  "Info : We Add A One Minute Delay After Every Request To Prevent Surpassing The Request Limit",
];
var Delayed = true;
var QuizQuestions;
var Answers = [];
var results = [];
let isFunctionDone = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function AIDelay() {
  Delayed = false;
  await delay(60000);
  try {
    fs.unlinkSync("./data.json");
    fs.unlinkSync("./channeldata.json");
  } catch (error) {
    console.error("Error deleting files:", error);
  }
  Delayed = true;
  setTimeout(() => {
    console.log("Function finished!");
    isFunctionDone = true;
  }, 3000);
}

// Video Feature
async function getData() {
  // Runs The AI Request Through The Gemini API
  try {
    const data = await AI.run(AI_Request);
    const lines = data.split("\n");
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

async function getVideos() {
  // Searches For The Channel Then The Video
  try {
    for (let i = 0; i < Channels.length; i++) {
      await Youtube_API.main2(Channels[i]); // Searches For The Channel through the API
      const data = JSON.parse(await fs.readFileSync("./channeldata.json"));
      channelID[i] = data[0].id.channelId;
      console.log(channelID[i]);

      await Youtube_API.main(Videos[i], data[0].id.channelId); // Searches For The Video through the API
      let data2 = JSON.parse(await fs.readFileSync("./data.json"));

      if (data2[0] == undefined) {
        console.log("VIDEO NOT FOUND");
        await Youtube_API.main3(Videos[i]); // Searches For The Video through the API
        data2 = JSON.parse(await fs.readFileSync("./data.json"));
        videoID[i] = data2[0].id.videoId;
        console.log(videoID[i]);
      } else {
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

async function main() {
  // Runs The Functions of the Video Feature
  try {
    await getData();
    await getVideos();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Explanation Feature
async function getExplanation() {
  try {
    const data = await AI.run(AI_Request2);
    console.log(data);
    Explanation = `${data}`;
  } catch (error) {
    console.error("Error fetching data from AI:", error);
    throw error;
  }
}

async function getQuestions() {
  try {
    var data = await AI.run2(AI_Request3);
    console.log(data);
    QuizQuestions = data;
  } catch (error) {
    console.error("Error fetching data from AI:", error);
    throw error;
  }
}

async function getAnswers() {
  try {
    const data = await AI.run2(AI_Request4);
    console.log(data);
    results = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error fetching data from AI:", error);
    throw error;
  }
}

app.get("/info", async (req, res) => {
  console.log("Info Requested");
  if (Delayed) {
    console.log("Delayed");
    await main();
    res.status(200).json(videoID); // Send the JSON response
    AIDelay();
  } else {
    console.log("Timeout");
    while (!isFunctionDone) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
    }
    console.log("Delayed");
    await main();
    res.status(200).json(videoID); // Send the JSON response
    AIDelay();
  }
});

app.get("/Question", async (req, res) => {
  if (Delayed) {
    console.log("Delayed");
    await getQuestions();
    res.status(200).json(QuizQuestions);
    AIDelay();
  } else {
    console.log("Timeout");
    while (!isFunctionDone) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
    }
    console.log("Delayed");
    await getQuestions();
    res.status(200).json(QuizQuestions);
    AIDelay();
  }
});

app.post("/GetNumDiff", async (req, res) => {
  const { parcel } = req.body;
  const { diff } = req.body;
  const num = parcel;
  const Diffiulty = diff;
  console.log(num);
  console.log(Diffiulty);
  if (Diffiulty == 1) {
    AI_Request3 =
      `can you generate a JSON file for an Easy quiz on the topic: ` +
      Videos[num] +
      ` (define the question as question in the pramaters)and mention the type of question(define it as type in the pramaters) and choices(if there's any, also define it as choices in the paramaters) and add no context (here's... or key improvements in ...) and make sure the questions are either code questions(ask to make a python code and use coding problem solving questions) and define it as Code in the type parameter Multiple Choice Questions (make sure the choices are always 4 choices) and define it as MultipleChoice in the type parameter or Correct The Problem Questions and define it as Problem in the type parameter Or Problem Solving Questions and define it as ProblemSolving in the type parameter and finally define Answers to questions as Answers (set as an array) and the questions as Questions (also set as an array) and dont add it to a code window put it on the chat directly(Make Sure It NEVER EVER INCLUDES THIS: ` +
      "```json" +
      ` on the raw text of the response/output in the beginning)`;
  } else if (Diffiulty == 2) {
    AI_Request3 =
      `can you generate a JSON file for an Intermediate quiz on the topic: ` +
      Videos[num] +
      ` (define the question as question in the pramaters)and mention the type of question(define it as type in the pramaters) and choices(if there's any, also define it as choices in the paramaters) and add no context (here's... or key improvements in ...) and make sure the questions are either code questions(ask to make a python code and use coding problem solving questions) and define it as Code in the type parameter Multiple Choice Questions (make sure the choices are always 4 choices) and define it as MultipleChoice in the type parameter or Correct The Problem Questions and define it as Problem in the type parameter Or Problem Solving Questions and define it as ProblemSolving in the type parameter and finally define Answers to questions as Answers (set as an array) and the questions as Questions (also set as an array) and dont add it to a code window put it on the chat directly(Make Sure It NEVER EVER INCLUDES THIS: ` +
      "```json" +
      ` on the raw text of the response/output in the beginning)`;
  } else if (Diffiulty == 3) {
    AI_Request3 =
      `can you generate a JSON file for a Hard quiz on the topic: ` +
      Videos[num] +
      ` (define the question as question in the pramaters)and mention the type of question(define it as type in the pramaters) and choices(if there's any, also define it as choices in the paramaters) and add no context (here's... or key improvements in ...) and make sure the questions are either code questions(ask to make a python code and use coding problem solving questions) and define it as Code in the type parameter Multiple Choice Questions (make sure the choices are always 4 choices) and define it as MultipleChoice in the type parameter or Correct The Problem Questions and define it as Problem in the type parameter Or Problem Solving Questions and define it as ProblemSolving in the type parameter and finally define Answers to questions as Answers (set as an array) and the questions as Questions (also set as an array) and dont add it to a code window put it on the chat directly(Make Sure It NEVER EVER INCLUDES THIS: ` +
      "```json" +
      ` on the raw text of the response/output in the beginning)`;
  }
  res.status(200).json({ num: num });
});

app.post("/GetNum", async (req, res) => {
  const { parcel } = req.body;
  const num = parcel;
  console.log(num);
  AI_Request2 =
    `give me a complete detailed text based course explanation on the topic:  ` +
    Videos[num] +
    `. make sure it is a full depth explanation Course(Like for example: if I want to learn Mechanical Engineering, First give me an explanation on Statics then dynamics etc etc) and not an introduction only and make sure it is a detailed and in-depth explanation course with everything in it and mark headers and sub-headers with <h1> instead of ** or ## or ### (Replace ## or ### with <h2> and add </h2> at the end to the Header/sub-header) and the text with <p> instead of no mark-up at all (and of course end it with </p>) with images that ease the understanding of the explanation and to make it easier to understand and make sure the images are ACTUAL SOURCED EMBEDDED IMAGES not indicate where an image would be helpful with [Image: Brief Description] and don't include any context AT ALL (don't include 'here's a ....' or this 'comprehensive guide ....') and make sure you add in helpful examples (like code examples and diagrams when i want to learn python or command examples and diagrams when i want to learn bash or diagrams or images to provide a deeper understanding when learning something not related to code) and finally don't add <DOCTYPE> or <html> or <body>, Just Get Straight to the code and when explaining what i something make sure you make it as detailed as possible  (like when explaining what is python for example make sure you explain it extremely detailed so that the ABSOLUTE BEGINNER understands) and when adding code examples make sure to place it in a div its class is called code instead of the code tag and never include markdown only html`;
  res.status(200).json({ num: num });
});

app.get("/Exp", async (req, res) => {
  if (Delayed) {
    console.log("Delayed");
    await getExplanation();
    res.status(200).json({ EXP: Explanation });
    AIDelay();
  } else {
    console.log("Timeout");
    while (!isFunctionDone) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
    }
    console.log("Delayed");
    await getExplanation();
    res.status(200).json({ EXP: Explanation });
    AIDelay();
  }
});

app.get("/answers", async (req, res) => {
  AI_Request4 = `Was These Answers:

  ${Answers}
  
  The Correct Answers To These Quiz Questions: 
  
  ${QuizQuestions}
  
  If Not, Please Explain Why They Are Not The Correct Answers And What The Correct Answers Are and make sure to put them in an array JSON format, No Contxt AT All (No "Here's... or Key Improvements In...") and make sure they are not children to someting make sure its in the root of the json (As An Array)`;

  if (Delayed) {
    console.log("Delayed");
    await getAnswers();
    res.status(200).json({ Answers: results });
    AIDelay();
  } else {
    console.log("Timeout");
    while (!isFunctionDone) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Check every 100ms
    }
    console.log("Delayed");
    await getAnswers();
    res.status(200).json({ Answers: results });
    AIDelay();
  }
});

app.post("/results", (req, res) => {
  const { parcel } = req.body;
  Answers = parcel;
  console.log(Answers[1]);
  res.status(200).send({ info: "success" });
});

app.post("/", (req, res) => {
  const { parcel } = req.body;
  User_Input = parcel;
  console.log(parcel);
  AI_Request =
    `give me a list of the best YouTube videos i can watch so that i can watch to become from total beginner to advanced in ` +
    User_Input +
    ` make sure it consists of only one large part video (no playlist or videos that have a part 2 or 3..etc and no "learn ... in 5 minuites" type videos i need full explaination) and make sure the list that i have is a Road-map (like for example:if i wanted to learn mechanical engineering, first you would need to learn calculus then statics then dynamics etc etc so, give me a video that explains calculus, then you would give me another one explaining statics then dynamics etc etc(kind of like a roadmap)) and dont include any context of any kind, just give me a list with the video name and the channel name right under it  and no headers or context or bullet points at all nor any numbered list, just arange it without anything (no heres..... in the beginning and no bullet points) and make then directly under each other, no extra empty lines seperating the videoname and channelname of the same step (Add Empty Line between each step) and make each step right under each other, no empty lines separating them (Like when doing 13 steps make sure its 26 lines) i want everything RIGHT UNDER EACH OTHER,
  and make sure that the channel names are the EXACT NAME WRITTEN ON YOUTUBE, no abbreviations(so i can find it as the first result to pop up in the youtube search results), and make sure the video still exists and the channel still exists and is a full explanation video(not introduction only) and make sure that both the videos and the channels are popular(one of the most popular videos and channels in the field i asked for videos on) and make sure the channel subscriber count exceeds 100k subscribers and the videos like count exceeds 10k likes and the video exceeds 50k views and make sure the video is not a playlist and that the channel name doesn't contain weird characters make sure it only contains Latin letters and make sure the video with this EXACT name exists in the channel(make sure there's a video with that exact name in the channel) and make sure the channel has a popular, unique name (like freecodecamp.org, TheCyberMentor for example) and and never generic names (like CyberSecurity Tutorials, Programming Tutorials, CyberSecurity TV, Programming Courses etc etc) and the video name to be like this (learn networking full course, learn programming full course etc etc) and never like this (learn networking part 1, learn programming in 10 mins etc etc) and never like this (learn networking basics, learn programming basics etc etc) and i want it a video road map not some full learn ... full course (like when learning penetration Testing don't give me 10 videos of learn penetration testing, give me a networking full course then  a Linux full course etc etc and NEVER INCLUDE A "Learn Ethical Hacking From Scratch
" TYPE VIDEO AT ALL)
  make sure to do the step in ONLY(DON'T DO ANY OTHER LAYOUT) this layout make sure the list comes out looking like this below:
  Videoname
  Channelname
  Videoname
  Channelname
  finally, make sure it consists of 13 steps max and 10 steps minimum and again NO EXTRA LINES MAKE SURE THE VIDEO NAME AND CHANNEL NAME OF THE SAME STEP ARE RIGHT UNDER EACH OTHER ONLY ADD EMPTY LINE BETWEEN EACH SEPARATE STEP`;

  console.log(User_Input);
  if (!parcel) {
    return res.status(400).send({ info: "err" });
  } else {
    res.status(200).send({ info: "success" });
  }
});

app.listen(port, () => {
  console.log(`Learnify Is Listening On Port : ` + port);
});
