
(function($) { 

    $(window).on('load', function () {
        setTimeout(removeLoader, 2000);
    }) 

    function removeLoader(){
        $( "#loading" ).fadeOut(1000, function() {
        $( "#loading" ).remove();
    });  
    }
    
}) (jQuery);

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".main-nav");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll("li");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

const GetBtn = document.getElementById("GET_Button")
const POSTBtn = document.getElementById("POST_Button")
const input = document.getElementById("User_Input")
const form = document.getElementById("generateForm")
const VideosLink = [];
const div = document.getElementById("results")
const fragmentText = []
const fragment = []
const fragmentText2 = []
const fragment2 = []
const input2 = []
const fragmentText3 = []
const fragment3 = []

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

const URLs = ['http://localhost:4000/info', 'http://localhost:4000/', 'http://localhost:4000/Question', 'http://localhost:4000/results', 'http://localhost:4000/answers', 'http://localhost:4000/Exp']

GetBtn.addEventListener('click', async function(event) {
    event.preventDefault();
    await SendInfo(event);
    await GetInfo(event);
});
async function GetInfo() {
    const generating = document.createElement('h1')
    generating.innerHTML = 'Generating Course'
    div.appendChild(generating)
    const loader = document.createElement('div')
    loader.className = 'loader'
    div.appendChild(loader)
    const res = await fetch(URLs[0], {
        method: 'GET'
    })
    console.log(res);
    const data = await res.json()
    const videos = JSON.parse(data)
    console.log(videos[1])
    generating.remove()
    loader.remove()

    const EXPBTN = document.createElement('button')
    EXPBTN.innerHTML = 'Genarate Detailed Text Explanation'
    div.appendChild(EXPBTN)

    EXPBTN.addEventListener('click', GetEXP)

    
    for (let index = 0; index < 13; index++) {
        if (videos[1] == "The Server Is Busy, Please Wait One Minute Then Try Again") {

            fragmentText[index] = document.createElement('h1')
            fragmentText[index].innerHTML = videos[index]
            div.appendChild(fragmentText[index])
        }
        else {

            fragmentText[index] = document.createElement('h1')
            fragmentText[index].innerHTML = 'Video No: ' + index
            div.appendChild(fragmentText[index])

            const br = document.createElement('br')
            div.appendChild(br)

            const container = []
            container[index] = document.createElement('div');
            container[index].className = 'video-container';
        
            fragment[index] = document.createElement('iframe')
            fragment[index].src = 'https://www.youtube.com/embed/' + videos[index]
            fragment[index].width = '560'
            fragment[index].height = '315'
            fragment[index].title = 'YouTube video player'
            fragment[index].frameBorder = 0
            fragment[index].allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            fragment[index].referrerPolicy ='strict-origin-when-cross-origin'
            fragment[index].allowFullscreen = true

            container[index].appendChild(fragment[index]);
            div.appendChild(container[index]);

            const br2 = document.createElement('br')
            div.appendChild(br2)
        }

    }
    const QuizBTN = document.createElement('button')
    QuizBTN.innerHTML = 'Take Quiz'
    div.appendChild(QuizBTN)
    QuizBTN.addEventListener('click', GetQuestions)
}

async function GetQuestions(e) {
    e.preventDefault()
    const generating = document.createElement('h1')
    generating.innerHTML = 'Generating Quiz'
    div.appendChild(generating)
    const loader = document.createElement('div')
    loader.className = 'loader'
    div.appendChild(loader)

    const res = await fetch(URLs[2], {
        method: 'GET'
    })

    const QuestionsJSON = await res.json()
    const Questions = JSON.parse(QuestionsJSON)
    generating.remove()
    loader.remove()
    console.log(Questions[1])

    const QuestionElement = []

    for (let index = 1; index < Questions.length; index++) {
        if (Questions[index] == "The Server Is Busy, Please Wait One Minute Then Try Again") {

            QuestionElement[index] = document.createElement('h1')
            QuestionElement[index].innerHTML = Questions[index]
            div.appendChild(QuestionElement[index])
        }
        else {

            QuestionElement[index] = document.createElement('h1')
            QuestionElement[index].innerHTML = 'Question No: ' + index + '\n' + Questions[index]
            div.appendChild(QuestionElement[index])

            const br = document.createElement('br')
            div.appendChild(br)

            input2[index] = document.createElement('input')
            input2[index].type = 'text'
            input2[index].placeholder = 'Enter Your Answer Here'
            div.appendChild(input2[index])
        }
    }


    const submitBtn = document.createElement('button')
    submitBtn.innerHTML = 'Submit'
    div.appendChild(submitBtn)
    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        await SubmitInfo(event);
        await GetAnswers(event);
    });
}

async function SubmitInfo() {
    const values = []
    for (let index = 1; index < input2.length; index++) {
        values[index] = input2[index].value;        
    }
    const res = fetch(URLs[3], {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        } ,
        body: JSON.stringify({
            parcel: values
        })

    })
}

async function GetAnswers() {
    const generating = document.createElement('h1')
    generating.innerHTML = 'Generating Results'
    div.appendChild(generating)
    const loader = document.createElement('div')
    loader.className = 'loader'
    div.appendChild(loader)

    const res = await fetch(URLs[4], {
        method: 'GET'
    })
    console.log(res);
    const data = await res.json()
    const Answers = JSON.parse(data)
    generating.remove()
    loader.remove()
    for (let index = 1; index < Answers.length; index++) {
        fragmentText3[index] = document.createElement('h1')
        fragmentText3[index].innerHTML = 'Question No: ' + index
        div.appendChild(fragmentText3[index])

        const br = document.createElement('br')
        div.appendChild(br)
        
        fragment3[index] = document.createElement('h1')
        fragment3[index].innerHTML = Answers[index].replace(/%/g, "<br>")
        fragment3[index].className = 'question'
        div.appendChild(fragment3[index])

        const br2 = document.createElement('br')
        div.appendChild(br2)
    }
}


async function SendInfo() {
    if(input.value == '') { return }
    const res = fetch(URLs[1], {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        } ,
        body: JSON.stringify({
            parcel: input.value
        })

    })

}

async function GetEXP(e) {
    e.preventDefault()
    const generating = document.createElement('h1')
    generating.innerHTML = 'Generating Explaination'
    div.appendChild(generating)
    const loader = document.createElement('div')
    loader.className = 'loader'
    div.appendChild(loader)


    const res = await fetch(URLs[5], {
        method: 'GET'
    })

    const EXPJSON = await res.json()
    const Exp = JSON.parse(EXPJSON)
    generating.remove()
    loader.remove()
    console.log(Exp[1])

    const ExpElement = []

    for (let index = 1; index < Exp.length; index++) {
        if (Exp[index] == "The Server Is Busy, Please Wait One Minute Then Try Again") {
            
            ExpElement[index] = document.createElement('h1')
            ExpElement[index].innerHTML = Exp[index];
            div.appendChild(ExpElement[index])
        }
        else {

            ExpElement[index] = document.createElement('center')
            ExpElement[index].innerHTML = 'Lesson No: ' + index + '\n' + Exp[index].replace(/%/g, "<br>")
            div.appendChild(ExpElement[index])

            const br = document.createElement('br')
            div.appendChild(br)
        }
    }
}

function closeWindow() {
    div.textContent = ""
    const clearbtn = document.createElement('button')
    clearbtn.innerHTML = 'Clear'
    div.appendChild(clearbtn)
    clearbtn.addEventListener('click', closeWindow)
}

