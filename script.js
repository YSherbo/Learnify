const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
const AI = require("./Gemini_AI/AI");
const Youtube_API = require("./Youtube_API/main");

const port = process.env.PORT || 4000;
let User_Input = "";
let Videos = [];
let Channels = [];
let videoID = [];
let channelID = [];
let Explanation = "";
let QuizQuestions;
let Answers = [];
let results = [];
let isFunctionDone = false;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function AIDelay() {
    await delay(60000); // 1-minute delay
    isFunctionDone = true;
}

async function getData() {
    try {
        const AI_Request =
            `give me a list of the best YouTube videos i can watch so that i can watch to become from total beginner to advanced in ` +
            User_Input +
            `. make sure it consists of only one large part video (no playlist or videos that have a part 2 or 3..etc and no "learn ... in 5 minuites" type videos i need full explaination) and make sure the list that i have is a Road-map (like for example:if i wanted to learn mechanical engineering, first you would need to learn calculus then statics then dynamics etc etc so, give me a video that explains calculus, then you would give me another one explaining statics then dynamics etc etc(kind of like a roadmap)) and dont include any context of any kind, just give me a list with the video name and the channel name right under it  and no headers or context or bullet points at all nor any numbered list, just arange it without anything (no heres..... in the beginning and no bullet points) and make then directly under each other, no extra empty lines seperating the videoname and channelname of the same step (Add Empty Line between each step) and make each step right under each other, no empty lines seperating them (Like when doing 13 steps make sure its 26 lines) i want everything RIGHT UNDER EACH OTHER,
and make sure that the channel names are the EXACT NAME WRITTEN ON YOUTUBE, no abreviations(so i can find it as the first result to pop up in the youtube search results), and make sure the video still exists and the channel still exists and is a full explaination video(not introduction only) and make sure that both the videos and the channels are popular(one of the most popular videos and channels in the field i asked for videos on) and make sure the channel subscriber count exeeds 100k subscribers and the videos like count exeeds 10k likes and the video exeeds 50k views and make sure the video is not a playlist and that the channel name doesnt contain weird charactes maake sure it only contains latin letters and make sure the video with this EXACT name exists in the channel(make sure theres a video with that exact name in the channel) and make sure the channel has a popular, unique name (like freecodecamp.org, TheCyberMentor for example) and and never generic names (like CyberSecurity Tutorials, Programming Tutorials, CyberSecurity TV, Programming Courses etc etc) and the video name to be like this (learn networking full course, learn programming full course etc etc) and never like this (learn networking part 1, learn programming in 10 mins etc etc) and never like this (learn networking basics, learn programming basics etc etc) make sure you do all of that by Google Search retrieval
make sure to do the step in ONLY(DONT DO ANY OTHER LAYOUT) this layout make sure the list comes out looking like this below:
Videoname
Channelname
Videoname
Channelname
finally, make sure it consists of 13 steps max and 5 steps minimum and again NO EXTRA LINES MAKE SURE THE VIDEO NAME AND CHANNEL NAME OF THE SAME STEP ARE RIGHT UNDER EACH OTHER ONLY ADD EMPTY LINE BETWEEN EACH SEPERATE STEP`;

        const data = await AI.run3(AI_Request);
        const lines = data.split("\n");
        Videos = lines.filter((_, index) => index % 2 === 0); // Video names
        Channels = lines.filter((_, index) => index % 2 !== 0); // Channel names
    } catch (error) {
        console.error("Error fetching data from AI:", error);
        throw error;
    }
}

async function getVideos() {
    try {
        for (let i = 0; i < Channels.length; i++) {
            await Youtube_API.main2(Channels[i]); // Fetch channel ID
            const channelData = JSON.parse(fs.readFileSync("./channeldata.json"));
            channelID[i] = channelData[0].id.channelId;

            await Youtube_API.main(Videos[i], channelID[i]); // Fetch video ID
            let videoData = JSON.parse(fs.readFileSync("./data.json"));

            if (!videoData[0]) {
                await Youtube_API.main3(Videos[i]); // Fallback if video not found
                videoData = JSON.parse(fs.readFileSync("./data.json"));
            }
            videoID[i] = videoData[0].id.videoId;
        }
    } catch (error) {
        console.error("Error fetching data from YouTube API:", error);
        throw error;
    }
}

async function main() {
    try {
        await getData();
        await getVideos();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getExplanation() {
    try {
        const AI_Request2 =
            `give me a complete detailed text based course explanation on the topic:  ` +
            Videos[pageno] +
            `. make sure it is a full depth explanation Course(Like for example: if I want to learn Mechanical Engineering, First give me an explanation on Statics then dynamics etc etc) and not an introduction only and make sure it is a detailed and in-depth explanation course with everything in it and mark headers and sub-headers with <h1> instead of ** or ## or ### (Replace ## or ### with <h2> and add </h2> at the end to the Header/sub-header) and the text with <p> instead of no mark-up at all (and of course end it with </p>) with images that ease the understanding of the explanation and to make it easier to understand and make sure the images are ACTUAL SOURCED EMBEDDED IMAGES not indicate where an image would be helpful with [Image: Brief Description] and don't include any context AT ALL (don't include 'here's a ....' or this 'comprehensive guide ....') and make sure you add in helpful examples (like code examples and diagrams when i want to learn python or command examples and diagrams when i want to learn bash or diagrams or images to provide a deeper understanding when learning something not related to code) and finally don't add <DOCTYPE> or <html> or <body>, Just Get Straight to the code and when explaining what i something make sure you make it as detailed as possible  (like when explaining what is python for example make sure you explain it extremely detailed so that the ABSOLUTE BEGINNER understands) and when adding code examples make sure to place it in a div its class is called code instead of the code tag and never include markdown only html`;

        const data = await AI.run(AI_Request2);
        Explanation = data;
    } catch (error) {
        console.error("Error fetching explanation from AI:", error);
        throw error;
    }
}

async function getQuestions() {
    try {
        const AI_Request3 =
            `can you generate a JSON file for a ` +
            (Diffiulty === 1 ? "Easy" : Diffiulty === 2 ? "Intermediate" : "Hard") +
            ` quiz on the topic: ` +
            Videos[pageno] +
            ` (define the question as question in the pramaters)and mention the type of question(define it as type in the pramaters) and choices(if there's any, also define it as choices in the paramaters) and add no context (here's... or key improvements in ...) and make sure the questions are either code questions(ask to make a python code and use coding problem solving questions) and define it as Code in the type parameter Multiple Choice Questions (make sure the choices are always 4 choices) and define it as MultipleChoice in the type parameter or Correct The Problem Questions and define it as Problem in the type parameter Or Problem Solving Questions and define it as ProblemSolving in the type parameter and finally define Answers to questions as Answers (set as an array) and the questions as Questions (also set as an array) and dont add it to a code window put it on the chat directly(Make Sure It NEVER EVER INCLUDES THIS: ` +
            "```json" +
            ` on the raw text of the response/output in the beginning)`;

        await AI.run2(AI_Request3);
        QuizQuestions = JSON.parse(fs.readFileSync("./response.json"));
    } catch (error) {
        console.error("Error fetching quiz questions from AI:", error);
        throw error;
    }
}

async function getAnswers() {
    try {
        const AI_Request4 = `Was These Answers:

  ${Answers}
  
  The Correct Answers To These Quiz Questions: 
  
  ${QuizQuestions}
  
  If Not, Please Explain Why They Are Not The Correct Answers And What The Correct Answers Are and make sure to put them in an array JSON format (call the array Answers), No Contxt AT All (No "Here's... or Key Improvements In...") and make sure they are not children to someting make sure its in the root of the json (As An Array) and make sure to say it like this (use this below as an example): 
  
  {
    "Answers": [
      "The Answer Is Correct",
      "The Answer Is Incorrect, ....(say why)",
      "The Answer Is Correct",
      "The Answer Is Incorrect, ....(say why)"
    ]
  
  }`;

        await AI.run2(AI_Request4);
        results = JSON.parse(fs.readFileSync("./response.json"));
    } catch (error) {
        console.error("Error fetching answers from AI:", error);
        throw error;
    }
}

app.get("/info", async (req, res) => {
    try {
        await main();
        res.status(200).json(videoID);
        AIDelay();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/Question", async (req, res) => {
    try {
        await getQuestions();
        res.status(200).json(QuizQuestions);
        AIDelay();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/GetNumDiff", async (req, res) => {
    const { parcel, diff } = req.body;
    pageno = parcel;
    Diffiulty = diff;

    try {
        res.status(200).json({ num: pageno });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/GetNum", async (req, res) => {
    const { parcel } = req.body;
    pageno = parcel;

    try {
        res.status(200).json({ num: pageno });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/Exp", async (req, res) => {
    try {
        await getExplanation();
        res.status(200).json({ EXP: Explanation });
        AIDelay();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/answers", async (req, res) => {
    try {
        await getAnswers();
        res.status(200).json(answers);
        AIDelay();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/results", (req, res) => {
    const { parcel } = req.body;
    Answers = parcel;
    res.status(200).send({ info: "success" });
});

app.post("/", (req, res) => {
    const { parcel } = req.body;
    User_Input = parcel;

    if (!parcel) {
        return res.status(400).send({ info: "err" });
    } else {
        res.status(200).send({ info: "success" });
    }
});

app.listen(port, () => {
    console.log(`Learnify is listening on port: ${port}`);
});