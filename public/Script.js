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

const URLs = ['https://learnify-wmbb.onrender.com/info', 'https://learnify-wmbb.onrender.com/', 'https://learnify-wmbb.onrender.com/Question', 'https://learnify-wmbb.onrender.com/results', 'https://learnify-wmbb.onrender.com/answers']

GetBtn.addEventListener('click', GetInfo)
POSTBtn.addEventListener('click', SendInfo)

async function GetInfo(e) {
    e.preventDefault()
    const generating = document.createElement('h1')
    generating.innerHTML = 'Sit Back While We Generate Your Course...'
    div.appendChild(generating)

    const res = await fetch(URLs[0], {
        method: 'GET'
    })
    console.log(res);
    const data = await res.json()
    const videos = JSON.parse(data)
    console.log(videos[1])
    generating.remove()
    for (let index = 1; index < videos.length; index++) {
        fragmentText[index] = document.createElement('h1')
        fragmentText[index].innerHTML = 'Video No: ' + index
        div.appendChild(fragmentText[index])

        const br = document.createElement('br')
        div.appendChild(br)
        
        fragment[index] = document.createElement('iframe')
        fragment[index].src = 'https://www.youtube.com/embed/' + videos[index]
        fragment[index].width = 560
        fragment[index].height = 315
        fragment[index].title = 'YouTube video player'
        fragment[index].frameBorder = 0
        fragment[index].allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        fragment[index].referrerPolicy ='strict-origin-when-cross-origin'
        fragment[index].allowFullscreen = true
        div.appendChild(fragment[index])

        const br2 = document.createElement('br')
        div.appendChild(br2)

    }
    const QuizBTN = document.createElement('button')
    QuizBTN.innerHTML = 'Take Quiz'
    div.appendChild(QuizBTN)
    QuizBTN.addEventListener('click', GetQuestions)
}

async function GetQuestions(e) {
    e.preventDefault()
    const generating = document.createElement('h1')
    generating.innerHTML = 'Generating Your Quiz...'
    div.appendChild(generating)

    const res = await fetch(URLs[2], {
        method: 'GET'
    })

    const QuestionsJSON = await res.json()
    const Questions = JSON.parse(QuestionsJSON)
    console.log(Questions[1])

    const QuestionElement = []

    for (let index = 1; index < Questions.length; index++) {
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


    const submitBtn = document.createElement('button')
    submitBtn.innerHTML = 'Submit'
    div.appendChild(submitBtn)
    submitBtn.addEventListener('click', SubmitInfo)
}

async function SubmitInfo(e) {
    e.preventDefault()
    const values = []
    for (let index = 1; index < input2.length; index++) {
        values[index] = input2[index].value;        
    }
    const res = await fetch(URLs[3], {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        } ,
        body: JSON.stringify({
            parcel: values
        })

    })

    const GetAnswer = document.createElement('button')
    GetAnswer.innerHTML = 'Get Answers'
    div.appendChild(GetAnswer)
    GetAnswer.addEventListener('click', GetAnswers)
}

async function GetAnswers(e) {
    e.preventDefault()
    const generating = document.createElement('h1')
    generating.innerHTML = 'Getting Answers...'
    div.appendChild(generating)

    const res = await fetch(URLs[4], {
        method: 'GET'
    })
    console.log(res);
    const data = await res.json()
    const Answers = JSON.parse(data)
    generating.remove()
    for (let index = 1; index < Answers.length; index++) {
        fragmentText3[index] = document.createElement('h1')
        fragmentText3[index].innerHTML = 'Question No: ' + index
        div.appendChild(fragmentText3[index])

        const br = document.createElement('br')
        div.appendChild(br)
        
        fragment3[index] = document.createElement('h1')
        fragment3[index].innerHTML = Answers[index]
        fragment3[index].className = 'question'
        div.appendChild(fragment3[index])

        const br2 = document.createElement('br')
        div.appendChild(br2)
    }
}


async function SendInfo(e) {
    e.preventDefault()
    if(input.value == '') { return }
    const res = await fetch(URLs[1], {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        } ,
        body: JSON.stringify({
            parcel: input.value
        })

    })
    

}