let data
let AIAnswer
let question
let questionJson
let categoryList
let questionData
let randomQuestionNumber
const valueArray = [100,200,300,400,500]
let questionArray = []
const API_TOKEN = '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'

function getAIResponse(){


    // AI IS SLOW TO RESPOND PLEASE WAIT FOR THE PAGE TO SHOW THE AI's REPONSE
    // AI IS SLOW TO RESPOND PLEASE WAIT FOR THE PAGE TO SHOW THE AI's REPONSE
    // AI IS SLOW TO RESPOND PLEASE WAIT FOR THE PAGE TO SHOW THE AI's REPONSE
    // AI IS SLOW TO RESPOND PLEASE WAIT FOR THE PAGE TO SHOW THE AI's REPONSE


    question = questionData[randomQuestionNumber].question

    let request = new XMLHttpRequest();
    request.open("POST",  "https://api-inference.huggingface.co/models/bigscience/bloom", true)
    request.setRequestHeader("Authorization", "Bearer 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")
    request.send(JSON.stringify({"inputs": `Question 1: Please answer the following Jeopardy question,\nHost: ${question}.\nAnswer: \"what is ____\"\na.`}))

    request.onload = function() {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`)
            return
        }
        let response = JSON.parse(this.response)
        const nonNouns = ["a ","the "]

        let responseWithoutQuestion = response[0].generated_text.replace(`Question 1: Please answer the following Jeopardy question,\nHost: ${question}.\nAnswer: \"what is ____\"\n`, "")
        singleAnswer = responseWithoutQuestion.split("\n")[0].replace("a.", "")

        nonNouns.forEach((word) => {
            if (singleAnswer.includes(word)){
                singleAnswer = singleAnswer.replace(word.replace(" ",""), "")
            }
        })

        AIAnswer = singleAnswer.trim()
        document.querySelector("#aiResponseField").innerHTML = AIAnswer;

        console.log(`the AI answer is ${AIAnswer}`)
        console.log(`the real Answer is ${questionData[randomQuestionNumber].answer}`)
        if (questionData[randomQuestionNumber].answer.toLowerCase() === AIAnswer.toLowerCase()){
            let text = document.querySelector("#responseField").innerHTML
            document.querySelector("#responseField").innerHTML = `${text} and the AI got it Correct`
            document.querySelector("#aiPoints").innerHTML = parseInt(questionData[randomQuestionNumber].value) + parseInt(document.querySelector("#aiPoints").innerHTML)
        } else {
            let text = document.querySelector("#responseField").innerHTML
            document.querySelector("#responseField").innerHTML = `${text} and the AI got it Incorrect`
        }
    }
}

function submitAnswer(){
    document.getElementById(`submit`).style.display = "none"

    userAnswer = document.querySelector("#responseBox").value
    console.log(userAnswer)
    if(questionData[randomQuestionNumber].answer.toLowerCase() === userAnswer.toLowerCase()){
        document.querySelector("#responseField").innerHTML = "You got it correct"
        document.querySelector("#playerPoints").innerHTML = parseInt(questionData[randomQuestionNumber].value) + parseInt(document.querySelector("#playerPoints").innerHTML)
    }
    else{
        document.querySelector("#responseField").innerHTML = "You got it incorrect"
    }

    getAIResponse()
}

function createQuestion(catNum, valueNum, buttonValue){
    let categoryName = document.querySelector(`#finalCat${catNum}`).innerHTML
    let categoryID = 56

    document.getElementById(`${buttonValue}`).style.display = "none"

    document.getElementById(`submit`).style.display = "block"

    categoryList.forEach(category => {
        if(categoryName == (categoryList.title)){
            categoryID = category.id
        }
    })
    console.log(categoryID)

    let request = new XMLHttpRequest();
    request.open("GET", `https://jservice.io/api/clues?category=${categoryID}&value=${valueNum}`, false)
    
    request.onload = function(){
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`)
            return "Error"
        
        }
        questionData = JSON.parse(request.response);

        randomQuestionNumber = Math.floor(Math.random() * questionData.length)
        console.log(randomQuestionNumber)

        
        document.querySelector("#questionField").innerHTML = questionData[randomQuestionNumber].question
        console.log(questionData[randomQuestionNumber].question)
    }
    request.send();
}

function setUpCategories(){
    let randomNum = Math.floor(Math.random() * 6703) //number of possible categories
    let amount = 10 //10 is hardcoded into index.html

    let request = new XMLHttpRequest()
    request.open("GET", `https://jservice.io/api/categories?count=10&offset=${randomNum}`, true)  //change to 10
    request.send()
    request.onload = function () {
        //if bad response
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`)
            return;
        }
        categoryList = JSON.parse(this.response)


        //put categories in catogory array
        categoryList.forEach((category,index) => {
            cat = document.querySelector("#cat"+(index+1))
            cat.innerHTML = category.title

        })
    }
}
function createGame(){
    // add the 5 categories selected to the game
    let tempArray = []
    categoryList.forEach((category, index) => {
        if(document.querySelector("#checkboxCat" + (index+1)).checked){
            tempArray.push(category)
        }
    })

    //force the user to select 5 categories
    if (tempArray.length < 5){
        alert("Please select at least 5 categories")
        return;
    }
    categoryList = tempArray

    // transitions to the main game board by hiding category selector
    let submitButton = document.querySelector("#submitCat").classList
    submitButton.remove("visibleSaveButton")
    submitButton.add("invisibleSaveButton")
    let catSelectorTable = document.querySelector("#catSelector").classList
    catSelectorTable.remove("visibleCatSelector")
    catSelectorTable.add("invisibleCatSelector")
    let jBoard = document.querySelector("#jeopardyBoard").classList
    jBoard.remove("invisibleJeopardy")
    jBoard.add("visibleJeopardy")

    //puts the categories on the game board header
    categoryList.forEach((category,index) => {
        cat = document.querySelector("#finalCat"+(index+1))
        cat.innerHTML = category.title

    })
    //createQuestion()

    console.log(questionArray)

}


setUpCategories()