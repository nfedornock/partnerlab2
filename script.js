let data;

function accessData(){
    const request = new XMLHttpRequest();
    request.open("GET","https://jservice.io/api/category?id=56", true);

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
            let newElt1 = document.createElement("th")
            let textNode1 = document.createTextNode(`${data.category_id}`);
            newElt1.appendChild(textNode1);
            document.querySelector("#headerRow").appendChild(newElt1);

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
    console.log("Hello There!")
}
