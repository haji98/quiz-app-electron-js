const mysql = require('mysql');
const $ = require('jquery');
const { remote, electron } = require('electron');
const path = require('path');
const url = require('url');
const ipcRenderer = require('electron').ipcRenderer;
const BrowserWindow = remote.BrowserWindow;
let mainWindow = remote.getCurrentWindow();
let model = remote.require('./model/model.js');



const quizContainer = document.getElementById("quiz");
const submitButton = document.getElementById("submit");

async function getQuestionByCourseId(courseId) {
    return await model.getQuestionByCourseId(courseId);

}

async function buildQuiz(courseId) {

    var output = [];

    var questionResults = await getQuestionByCourseId(courseId);
    var letter = 65;
    for (var i = 0; i < questionResults.length; i++) {

        var answer = [];
        let answerResult = await model.getAnswers(i + 1);

        if (questionResults[i].type === "single") {

            for (var j = 0; j < answerResult.length; j++) {
                answer.push(
                    `<label>
                        <input type="radio" name="question${questionResults[i].id}" value = "${answerResult[j].id}">
                        ${String.fromCharCode(letter)}  : ${answerResult[j].answer}
                    </label>`
                );
                letter++;
            }


        } else if (questionResults[i].type === "multi") {
            for (var j = 0; j < answerResult.length; j++) {
                answer.push(
                    `<label>
                        <input type="checkbox" name="question${questionResults[i].id}" value = "${answerResult[j].id}">
                        ${String.fromCharCode(letter)} : ${answerResult[j].answer}
                        </label>`
                );
                letter++;
            }

        }

        output.push(
            `<div class="question-container" id="${questionResults[i].id}">
        <p class="question"> ${questionResults[i].content} </p>
        <div class="answers"> ${answer.join("")} </div>
        </div>
        `
        );
        letter = 65;
    }


    quizContainer.innerHTML = output.join("");
}

buildQuiz(1);



async function showResult() {

    var answerContainers = quizContainer.querySelectorAll(".answers");
    // find selected answer    
    var questionResults = await getQuestionByCourseId(1);
    let numCorrect = 0;
    var correctAnswer = "";
    var selecetedAnswer = "";
    var correct = [];

    for (var i = 0; i < questionResults.length; i++) {

        correct = questionResults[i].correctId;


        var optionContainer = answerContainers[i];
        var option = optionContainer.getElementsByTagName("input");

        for (var j = 0; j < option.length; j++) {
            if (option[j].checked) {
                selecetedAnswer += option[j].value + ",";

            }
            option[j].disabled = true;
        }

        selecetedAnswer = selecetedAnswer.slice(0, selecetedAnswer.length - 1);
        if (selecetedAnswer === correct) {
            numCorrect++;
            answerContainers[i].style.color = "darkgreen";

        } else {
            answerContainers[i].style.color = "red";

        }
        selecetedAnswer = "";


    }
    console.log(numCorrect);

}


submitButton.addEventListener("click", showResult);

async function getCourseTime(courseId) {
    var courseResult = await model.getCourseTimebyID(courseId);
    if (courseResult.length > 0) {
        for (var i = 0; i < courseResult.length; i++) {
            timer = courseResult[i].total_time * 60;
        }
        return timer;
    }
}
    
var timer = getCourseTime(1);
var min = 0;
var sec = 0; 

async function startTimer(courseId) {
    min = parseInt(timer / 60);
    sec = parseInt(timer % 60);

    if (timer < 1) {
        showResult();
    }
    document.getElementById("timer").innerHTML = min.toString() + ":" + sec.toString();
    timer--;

    setTimeout(function () {
        startTimer(courseId);
    }, 1000);
    

}

startTimer(1);
