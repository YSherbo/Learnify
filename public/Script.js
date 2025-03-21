(function ($) {
    $(window).on('load', function () {
        setTimeout(removeLoader, 2000);
    });

    function removeLoader() {
        $("#loading").fadeOut(1000, function () {
            $("#loading").remove();
        });
    }
})(jQuery);

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".main-nav");
const CourseList = document.querySelector(".sidenav");
const CoursesBTN = document.getElementById("CoursesBTN");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function auto_height(elem) {
    elem.style.height = '1px';
    elem.style.height = `${elem.scrollHeight}px`;
}

function sidenavopen() {
    try {
        const btn = document.getElementById('closebtn');
        btn.remove();
    } catch (error) {
        console.log("No close button found");
    }
    CourseList.style.display = 'block';
    const close = document.createElement('a');
    close.innerHTML = 'Close';
    close.id = "closebtn";
    close.addEventListener('click', sidenavclose);
    CourseList.appendChild(close);
}

function sidenavclose() {
    CourseList.style.display = 'none';
    const close = document.getElementById('closebtn');
    close.removeEventListener('click', sidenavclose);
    CourseList.removeChild(close);
}

CoursesBTN.addEventListener("click", sidenavopen);

const navLink = document.querySelectorAll("li");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

const URLs = [
    'http://localhost:4000/info',
    'http://localhost:4000/',
    'http://localhost:4000/Question',
    'http://localhost:4000/results',
    'http://localhost:4000/answers',
    'http://localhost:4000/Exp',
    'http://localhost:4000/GetNum',
    'http://localhost:4000/GetNumDiff'
];

const input = document.getElementById('User_Input');
const div = document.getElementById('results');
const Lessons = document.getElementById('Lessons');
const GenerateButton = document.getElementById('Generate');
const EXPList = [];
let Videos = [];
let pageno = 0;
let Diffiulty = 1;
const Questions = [];
const Choice1 = [];
const Choice2 = [];
const Choice3 = [];
const Choice4 = [];
const answers = [];
const QuestionType = [];
const User_Response = [];

GenerateButton.addEventListener('click', async function (event) {
    event.preventDefault();
    console.log("Generate button clicked");
    await sendInput();
    await getVideos();
});

async function sendInput() {
    if (!input.value.trim()) {
        console.log("Input is empty");
        return;
    }
    console.log("Sending input to server:", input.value);
    try {
        const response = await fetch(URLs[1], {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ parcel: input.value })
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        console.log("Input sent to server");
    } catch (error) {
        console.error("Error sending input to server:", error);
    }
}

async function sendNum() {
    try {
        const response = await fetch(URLs[6], {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ parcel: pageno })
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        console.log("Page number sent to server");
    } catch (error) {
        console.error("Error sending page number to server:", error);
    }
}

async function sendNumDiff() {
    try {
        const response = await fetch(URLs[7], {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ parcel: pageno, diff: Diffiulty })
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        console.log("Page number and difficulty sent to server");
    } catch (error) {
        console.error("Error sending page number and difficulty to server:", error);
    }
}

async function getVideos() {
    try {
        div.innerHTML = "";
        const generatingText = document.createElement('h1');
        generatingText.className = "bigText";
        generatingText.innerHTML = "Generating Your Course...";
        div.appendChild(generatingText);

        const res = await fetch(URLs[0], { method: "GET" });
        if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
        }
        const data = await res.json();
        Videos = data;

        Lessons.innerHTML = "";
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < Videos.length; i++) {
            const lesson = document.createElement('a');
            lesson.innerHTML = "Lesson " + (i + 1);
            lesson.href = "#";
            lesson.addEventListener('click', async function (event) {
                event.preventDefault();
                await switchPages(i);
            });
            fragment.appendChild(lesson);
        }
        Lessons.appendChild(fragment);
    } catch (error) {
        console.error("Error fetching videos:", error);
        div.innerHTML = "<h1>Error fetching videos. Please try again later.</h1>";
    }
}

async function getExplaination() {
    try {
        const res = await fetch(URLs[5], { method: 'GET' });
        const data = await res.json();
        return data.EXP;
    } catch (error) {
        console.error("Error fetching explanation:", error);
        return "Error fetching explanation. Please try again later.";
    }
}

async function switchPages(i) {
    div.innerHTML = "";
    pageno = i;

    const title = document.createElement('h1');
    title.className = "bigText";
    title.innerHTML = "Lesson " + (i + 1);
    div.appendChild(title);

    const br = document.createElement('br');
    div.appendChild(br);

    const container = document.createElement('div');
    container.className = 'video-container';

    const video = document.createElement('iframe');
    video.src = 'https://www.youtube.com/embed/' + Videos[i];
    video.width = '560';
    video.height = '315';
    video.title = 'YouTube video player';
    video.frameBorder = 0;
    video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    video.referrerPolicy = 'strict-origin-when-cross-origin';
    video.allowFullscreen = true;

    container.appendChild(video);
    div.appendChild(container);

    const br2 = document.createElement('br');
    div.appendChild(br2);

    const generatingText = document.createElement('h1');
    generatingText.innerHTML = "Generating AI Explanation...";
    div.appendChild(generatingText);

    if (EXPList[i] !== undefined) {
        const explaination = document.createElement('div');
        explaination.innerHTML = EXPList[i];
        div.appendChild(explaination);
        generatingText.remove();
    } else {
        await sendNum();
        const Explaination = await getExplaination();
        const explaination = document.createElement('div');
        explaination.innerHTML = Explaination;
        div.appendChild(explaination);
        EXPList[i] = Explaination;
        generatingText.remove();
    }

    const QuizBTN = document.createElement('div');
    QuizBTN.className = 'dropdown';
    const QuizButton = document.createElement('button');
    QuizButton.className = 'dropbtn';
    QuizButton.innerHTML = 'Take A Quiz';
    const QuizContent = document.createElement('div');
    QuizContent.className = 'dropdown-content';

    const difficulties = ["Easy", "Medium", "Hard"];
    difficulties.forEach((difficulty, index) => {
        const QuizButton = document.createElement('a');
        QuizButton.innerHTML = difficulty;
        QuizButton.href = '#';
        QuizButton.addEventListener('click', async function (event) {
            event.preventDefault();
            Diffiulty = index + 1;
            await sendNumDiff();
            await OpenQuiz();
        });
        QuizContent.appendChild(QuizButton);
    });

    QuizBTN.appendChild(QuizButton);
    QuizBTN.appendChild(QuizContent);
    div.appendChild(QuizBTN);
}

async function OpenQuiz() {
    console.log("Fetching quiz from server");
    try {
        const res = await fetch(URLs[2], { method: "GET" });
        if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Quiz data fetched from server:", data);

        // Validate the quiz data structure
        if (!data || !data.Questions || !Array.isArray(data.Questions)) {
            throw new Error("Invalid quiz data structure");
        }

        // Process the quiz data
        const QJSON = data;
        console.log(QJSON);
        console.log(QJSON.Questions[0].question);

        // Clear previous questions and answers
        Questions.length = 0;
        Choice1.length = 0;
        Choice2.length = 0;
        Choice3.length = 0;
        Choice4.length = 0;
        answers.length = 0;
        QuestionType.length = 0;

        // Populate the questions and answers arrays
        for (let index = 0; index < QJSON.Questions.length; index++) {
            Questions[index] = QJSON.Questions[index].question;
            QuestionType[index] = QJSON.Questions[index].type;

            if (QuestionType[index] === "MultipleChoice") {
                Choice1[index] = QJSON.Questions[index].choices[0];
                Choice2[index] = QJSON.Questions[index].choices[1];
                Choice3[index] = QJSON.Questions[index].choices[2];
                Choice4[index] = QJSON.Questions[index].choices[3];
            }
            answers[index] = QJSON.Questions[index].answer;
        }

        await SwitchQuestions(0);
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        div.innerHTML = "<h1>Error fetching quiz data. Please try again later.</h1>";
    }
}

async function SwitchQuestions(i) {
    div.innerHTML = "";

    const title = document.createElement('h1');
    title.innerHTML = "Question " + (i + 1);
    div.appendChild(title);

    const br2 = document.createElement('br');
    div.appendChild(br2);

    const QuestionHTML = document.createElement('h1');
    QuestionHTML.innerHTML = Questions[i];
    div.appendChild(QuestionHTML);

    if (QuestionType[i] === "MultipleChoice") {
        const choices = [Choice1[i], Choice2[i], Choice3[i], Choice4[i]];
        choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.innerHTML = choice;
            choiceButton.addEventListener('click', async function () {
                User_Response[i] = choice;
                await checkAnswer(choice, answers[i]);
                if (i === Questions.length - 1) {
                    await sendResults();
                    await getResults();
                } else {
                    await SwitchQuestions(i + 1);
                }
            });
            div.appendChild(choiceButton);
        });
    } else if (QuestionType[i] === "Code") {
        const CodeContainer = document.createElement('div');
        CodeContainer.className = 'code';

        const CodeInput = document.createElement('textarea');
        CodeInput.oninput = "auto_height(this)";
        CodeInput.placeholder = "Enter your code here";
        CodeInput.rows = 1;
        CodeInput.className = 'auto_height';

        CodeContainer.appendChild(CodeInput);
        div.appendChild(CodeContainer);

        const br = document.createElement('br');
        div.appendChild(br);

        if (i === Questions.length - 1) {
            const SubmitBTN = document.createElement('button');
            SubmitBTN.innerHTML = 'Submit';
            SubmitBTN.addEventListener('click', async function () {
                User_Response[i] = CodeInput.value;
                await sendResults();
                await getResults();
            });
            div.appendChild(SubmitBTN);
        } else {
            const NextBTN = document.createElement('button');
            NextBTN.innerHTML = 'Next';
            NextBTN.addEventListener('click', async function () {
                User_Response[i] = CodeInput.value;
                await SwitchQuestions(i + 1);
            });
            div.appendChild(NextBTN);
        }

        if (i > 0) {
            const PrevBTN = document.createElement('button');
            PrevBTN.innerHTML = 'Previous';
            PrevBTN.addEventListener('click', async function () {
                User_Response[i] = CodeInput.value;
                await SwitchQuestions(i - 1);
            });
            div.appendChild(PrevBTN);
        }
    } else {
        const AnswerHTML = document.createElement('textarea');
        AnswerHTML.placeholder = "Enter your answer here";
        AnswerHTML.rows = 1;
        AnswerHTML.className = 'auto_height';
        AnswerHTML.oninput = "auto_height(this)";
        div.appendChild(AnswerHTML);

        const br = document.createElement('br');
        div.appendChild(br);

        if (i === Questions.length - 1) {
            const SubmitBTN = document.createElement('button');
            SubmitBTN.innerHTML = 'Submit';
            SubmitBTN.addEventListener('click', async function () {
                User_Response[i] = AnswerHTML.value;
                await sendResults();
                await getResults();
            });
            div.appendChild(SubmitBTN);
        } else {
            const NextBTN = document.createElement('button');
            NextBTN.innerHTML = 'Next';
            NextBTN.addEventListener('click', async function () {
                User_Response[i] = AnswerHTML.value;
                await SwitchQuestions(i + 1);
            });
            div.appendChild(NextBTN);
        }

        if (i > 0) {
            const PrevBTN = document.createElement('button');
            PrevBTN.innerHTML = 'Previous';
            PrevBTN.addEventListener('click', async function () {
                User_Response[i] = AnswerHTML.value;
                await SwitchQuestions(i - 1);
            });
            div.appendChild(PrevBTN);
        }
    }
}

async function checkAnswer(Choice, Answer) {
    if (Choice === Answer) {
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }
}

async function sendResults() {
    try {
        const response = await fetch(URLs[3], {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ parcel: User_Response })
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        console.log("Results sent to server");
    } catch (error) {
        console.error("Error sending results to server:", error);
    }
}

async function getResults() {
    try {
        const res = await fetch(URLs[4], { method: "GET" });
        if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
        }
        const data2 = await res.json();
        const data = data2.results;
        console.log("Results fetched from server:", data);
        div.innerHTML = "";

        data.forEach((result, index) => {
            const resultElement = document.createElement('h1');
            resultElement.innerHTML = "Question " + (index + 1) + ": " + result;
            div.appendChild(resultElement);
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        div.innerHTML = "<h1>Error fetching results. Please try again later.</h1>";
    }
}