let data;
let AIAnswer;
let questionJson;
let categoryList;
let categoryIDList = [];
const API_TOKEN = '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'

function getAIResponse(question){
    let request = new XMLHttpRequest();
    request.open("POST",  "https://api-inference.huggingface.co/models/bigscience/bloom", true);
    request.setRequestHeader("Authorization", "Bearer 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");
    request.send(JSON.stringify({"inputs": `Question 1: Please answer the following Jeopardy question,\nHost: ${question}.\nAnswer: \"what is ____\"\na.`}));

    request.onload = function() {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }
        let response = JSON.parse(this.response);
        const nonNouns = ["a ","the "]

        let responseWithoutQuestion = response[0].generated_text.replace(`Question 1: Please answer the following Jeopardy question,\nHost: ${question}.\nAnswer: \"what is ____\"\n`, "")
        singleAnswer = responseWithoutQuestion.split("\n")[0].replace("a.", "")

        nonNouns.forEach((word) => {
            if (singleAnswer.includes(word)){
                singleAnswer = singleAnswer.replace(word.replace(" ",""), "")
            }
        })

        AIAnswer = singleAnswer.trim()
        console.log(`the AI answer is ${AIAnswer}`)
        console.log(`the real Answer is ${questionJson.answer}`)
        if (questionJson.answer.toLowerCase() === AIAnswer.toLowerCase()){
            console.log("Correct")
        } else {
            console.log("Incorrect")
        }
    }
}

function populateTable(){
    const request = new XMLHttpRequest();
    for(let p = 0; p < 5; p++){
        request.open("GET",`https://jservice.io/api/category?id=${categoryIDList[p]}`, true);

        //request.setRequestHeader("AccountType","FREE");
        //request.setRequestHeader("REALLY_COOL_KEY","12345678");

        request.onload = function(){
            data = JSON.parse(this.response);
            //console.log(data.clues);
            if(request.status == 200){
                console.log(`Response OK`);
                //data.forEach( question => {;
                //    console.log(`Question ID: ${question.category_id}, ID: ${question.id}`);
                //});
                let j = 1;
                for(let i = 1; i<6; i++){
                    console.log(data.clues[i]);
                    let newElt2 = document.createElement("td")
                    let textNode2 = document.createTextNode(`${data.clues[i].question}`);
                    newElt2.appendChild(textNode2);
                    document.querySelector("#row"+j).appendChild(newElt2);
                    j++
                }
                console.log(data);
            }
            else{
                console.log(`Error occured: Status: ${request.status}`);
            }
        };

        request.send();
    }
}

function setUpCategories(){
    let randomNum = 1
    let request = new XMLHttpRequest();
    request.open("GET", `https://jservice.io/api/categories?count=5&offset=${randomNum}`, true);
    request.send()
    request.onload = function () {
        if (request.status < 200 && request.status >= 400) {
            console.log(`Error ${request.status}: ${request.statusText}`);
            return;
        }
        categoryList = JSON.parse(this.response);
        console.log(categoryList)
        categoryList.forEach((category,index) => {
            cat = document.querySelector("#cat"+(index+1))
            console.log(category)
            categoryIDList.push(`${category.id}`);
            cat.innerHTML = category.title

        })
        console.log(categoryIDList);
    }
}
