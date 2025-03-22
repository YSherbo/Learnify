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
            `generate a course that consists of youtube videos i could watch to learn ` + User_Input + `( like for example i want to learn mechanical engineering so you should return something like this:-

VideoTitle( Lets assume its a full course video(not a part 1 video or part 2 that fully explains Calculus, make sure that the video exists with the exact name On youtube you take it with the EXACT name from what you found on youtube and list it,  get the video using Google Search retrieval)
Channel Name(The Name Of The Channel, make sure that the channel exists with the exact name On youtube you take it with the EXACT name from what you found on youtube and list it,  get the channel using Google Search retrieval)

VideoTitle(Lets assume its a full course video(not a part 1 video or part 2 that fully explains Statics, make sure that the video exists with the exact name On youtube you take it with the EXACT name from what you found on youtube and list it,  get the video using Google Search retrieval)
Channel Name(The Name Of The Channel, make sure that the channel exists with the exact name On youtube you take it with the EXACT name from what you found on youtube and list it,  get the channel using Google Search retrieval)

VideoTitle( Lets assume its a full course video(not a part 1 video or part 2 that fully explains Dynamics,  make sure that the video exists with the exact name On youtube you take it with the EXACT name from what you found on youtube and list it,  get the video using Google Search retrieval)
Channel Name(The Name Of The Channel,  make sure that the channel exists with the exact name On youtube you take it with the EXACT name from what you found on youtube and list it,  get the channel using Google Search retrieval)

...etc

make sure you do it with the same layout(10 Videos Minimum - 15 Video Max) (No Context(no heres... or anything else) get straight to the videos and dont add it in a numbered list or bullet points and (dont do it like this(for example)VideoTitle: Penetration Testing Full Course 2025
Channel Name: Simplilearn

do it like this: 

Penetration Testing Full Course 2025
Simplilearn) also make sure its like a roadmap, (like for example when i want to learn penetration testing, dont give me multiple penetration testing full course videos, give me a python tutorial first, then networking seccond, then nmap, than the stages of hacking etc etc)`;

        const data = await AI.run3(AI_Request);
        const lines = data.split("\n");
        const cleanedLines = lines.filter(line => line.trim() !== "");
        Videos = cleanedLines.filter((_, index) => index % 2 === 0); // Video names
        console.log(Videos)
        Channels = cleanedLines.filter((_, index) => index % 2 !== 0); // Channel names
        console.log(Channels)
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