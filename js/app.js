console.clear();
let voices = [];
let synth = window.speechSynthesis; //Initialise SpeechSythesis API

window.speechSynthesis.addEventListener("voiceschanged", function () {
  voices = window.speechSynthesis.getVoices();
});

const cancelSpeech = () => {
  if (synth.speaking) {
    synth.cancel();
    console.log("speech cancelled");
  }
};

const englishMaleVoice = voices.find(
  (voice) => voice.name === "Google UK English Male"
);
const readBtn = document.querySelector("#read-btn");
const body = document.querySelector("body");
const questionNumber = document.querySelector(".question-number"); //question number appears here
const questionText = document.querySelector(".question-text"); //question text appears here
const definitionText = document.querySelector(".answer-text"); //answer text appears here
const optionContainer = document.querySelector(".option-container"); //option container
const answersIndicatorContainer = document.querySelector(".answers-indicator"); //answer indicator container
const homeBox = document.querySelector(".home-box"); //home box (initial screen)
const quizBox = document.querySelector(".quiz-box"); // quiz box
const resultBox = document.querySelector(".result-box"); // result box
const nextButton = document.querySelector(".next-btn"); // next button
// const button = document.querySelector(".btn"); //button
const showDefinitionButton = document.getElementById("show-definition"); // show definition button
// const totalAvailableQuestions= document.querySelector(".total-available-questions"); // total available questions
// const questionLimit = 5;
const didYouKnowContainer = document.querySelector(".did-you-know-container");
const answerMessage = document.querySelector(".answer-message");
const questionLimit = questions.length;
const questionsAskedContainer = document.querySelector(
  ".questions-asked-container"
); // questions asked container (results screen)
let yes;

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;
let questionsAskedList = [];
let yourAnswersList = [];

// add the questions to the availQuestions array
function setAvailableQuestions() {
  let questionIndices = [...Array(questions.length).keys()];
  questionIndices = questionIndices.sort((a, b) => 0.5 - Math.random());

  for (let item of questionIndices) {
    availableQuestions.push(questions[item]);
  }
}

function resetDefinitionButton() {
  showDefinitionButton.classList.remove("active");
  showDefinitionButton.innerText = "Show definition";
}
let read;
//set question number, question text and answer options - line 35 to 83
function getNewQuestion() {
  didYouKnowContainer.classList.remove("keep-hidden");
  didYouKnowContainer.classList.add("hide");
  answerMessage.classList.add("hide");
  definitionText.classList.add("hide");
  nextButton.classList.add("hide");
  resetDefinitionButton();
  //set question number
  questionNumber.innerHTML = `Question ${
    questionCounter + 1
  } of ${questionLimit}`;

  //get question
  read = (text) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.voice = englishMaleVoice;
    utterThis.pitch = 0.7;
    utterThis.volume = 0.9;
    utterThis.rate = 0.9;  
    
    const reading = window.speechSynthesis.speak(utterThis);
      };

  const questionIndex = availableQuestions[questionCounter];
  currentQuestion = questionIndex;
  //set question text
  questionText.innerHTML = currentQuestion.q;
  setTimeout(()=>{ read(currentQuestion.q)}, 400);

  definitionText.innerHTML = currentQuestion.definition;
  questionsAskedList.push(currentQuestion);

  readBtn.addEventListener("click", () => {
    // synth.cancel();
    cancelSpeech();
    read(currentQuestion.q);
  });

  // show question image if "img" property exists

  // if (currentQuestion.hasOwnProperty("img")) {
  //   console.log(currentQuestion.img);
  //   const img = document.createElement("img");
  //   img.src = currentQuestion.img;
  //   questionText.appendChild(img);
  // }
  // set options
  // get the length of the list of options
  const optionsLength = currentQuestion.options.length;

  optionContainer.innerHTML = "";

  // push options into availableOptions array
  for (let i = 0; i < optionsLength; i++) {
    availableOptions.push(i);
  }

  let animationDelay = 0.1;

  //create options in html
  for (let i = 0; i < optionsLength; i++) {
    const optionIndex = availableOptions[0];
    //   availableOptions[Math.floor(Math.random() * availableOptions.length)];

    //get the position of optionIndex from availableOptions
    const index2 = availableOptions.indexOf(optionIndex);

    //remove the “optionIndex” from the availableOptions so that the option does not repeat
    availableOptions.splice(index2, 1);

    const option = document.createElement("button");

    option.innerHTML = currentQuestion.options[optionIndex];
    option.id = optionIndex;
    // option.classList.add("

    option.style.animationDelay = animationDelay + "s";
    option.className = "option";
    if (option.id === "0") {
      option.className += " yes";
    } else {
      option.className += " no";
    }

    animationDelay = animationDelay + 0.1;

    optionContainer.appendChild(option);
    option.setAttribute("onclick", "getResult(this)");
  }
  showDefinitionButton.focus();
  questionCounter++;
}

function toggleDefinitionButtonText() {
  showDefinitionButton.classList.toggle("active");
  
  if (!showDefinitionButton.classList.contains("active")) {
    // console.log("showDefinitionButton does not contain the class 'active'")
    showDefinitionButton.innerText = "Show definition";
    cancelSpeech();
  } else if (showDefinitionButton.classList.contains("active")) {
    showDefinitionButton.innerText = "Hide definition";
    setTimeout(()=>{
      const utterThis = new SpeechSynthesisUtterance(currentQuestion.definition);
      utterThis.voice = englishMaleVoice;
      utterThis.pitch = 0.7;
      utterThis.volume = 0.9;
      utterThis.rate = 0.9;
           
      utterThis.addEventListener("end", (e) => {
        console.log(`Utterance has finished being spoken after ${e.elapsedTime} seconds`);
      }
      
    );
    const words = currentQuestion.definition.length;
        const timeToWait = words*50;
        console.log({timeToWait});
        console.log(`currentQuestion.definition.length is ${currentQuestion.definition.length}`);
        //         if (!didYouKnowContainer.classList.contains("keep-hidden")){ 
        //   didYouKnowContainer.classList.remove("hide");
        // }
        setTimeout(() => {if (!didYouKnowContainer.classList.contains("keep-hidden")){ 
          didYouKnowContainer.classList.remove("hide");
          }}, timeToWait );
        yes.focus();
     const reading = window.speechSynthesis.speak(utterThis);
  },200)
        }
}

function showHideDefinition() {
  yes = document.querySelector(".yes");
  const no = document.querySelector(".no");
    definitionText.classList.toggle("hide");
    
  toggleDefinitionButtonText();
  
  yes.addEventListener("keydown", (e) => {
    if (e.keyCode == "39") {
      no.focus();
    } else if (e.keyCode == "38") {
      showDefinitionButton.focus();
    }
  });
  no.addEventListener("keydown", (e) => {
    if (e.keyCode == "37") {
      yes.focus();
    } else if (e.keyCode == "38") {
      showDefinitionButton.focus();
    }
  });
  showDefinitionButton.addEventListener("keydown", (e) => {
    if (e.keyCode == "40") {
      yes.focus();
    }
  });
}

function getResult(element) {
  didYouKnowContainer.classList.add("hide");
  didYouKnowContainer.classList.add("keep-hidden");
  const id = parseInt(element.id);
  ;

  //get the answer by comparing the id of the clicked option
  if (id === currentQuestion.a) {
    yourAnswersList.push("yes")
    answerMessage.innerHTML = `<p>You selected that you <em>know</em> the definition for ${currentQuestion.q}. Click the "Next" button below to go to the next question.</p>`;
    //     // add green colour if user selects correct option
    element.classList.add("correct");
    //     //add a tick mark to the answer indicator
    updateAnswerIndicator("correct");
    correctAnswers++;
  } else {
    yourAnswersList.push("no");
    answerMessage.innerHTML = `<p>You selected that you <em>do not know</em> the definition for ${currentQuestion.q}. Click the "Next" button below to go to the next question.</p>`;
    // add red colour if user selects incorrect option
    element.classList.add("incorrect");
    //add a cross mark to the answer indicator
    updateAnswerIndicator("incorrect");
  }
  answerMessage.classList.remove("hide");
  attempt++;
  nextButton.classList.remove("hide");
  // definitionText.classList.remove("hide");
  nextButton.focus();
}

//creating answersIndicator box, and answer indicator circles for each question
function answersIndicator() {
  answersIndicatorContainer.innerHTML = "";
  const totalQuestion = questionLimit;
  for (let i = 0; i < totalQuestion; i++) {
    const indicator = document.createElement("div");
    answersIndicatorContainer.appendChild(indicator);
  }
}

function updateAnswerIndicator(markType) {
  answersIndicatorContainer.children[questionCounter - 1].classList.add(
    markType
  );
}

function next() {
  
  cancelSpeech();
  if (questionCounter >= questionLimit) {
    quizOver();
  } else {
    getNewQuestion();
    resetDefinitionButton();
  }
}

function quizOver() {
  //hide quizBox
  quizBox.classList.add("hide");
  //show resultBox
  resultBox.classList.remove("hide");
  quizResult();
}

//get the quiz result
function quizResult() {
  resultBox.querySelector(".total-score").innerHTML =
    correctAnswers + "/" + questionLimit;
  displayQuestions();
}

function displayQuestions() {
  for (let i = 0; i < questionsAskedList.length; i++) {
    //create table row for each question
    const questionRow = document.createElement("tr");

    // Column 1 - create a cell to show the question number
    const questionNoCell = document.createElement("td");
    questionNoCell.textContent = i + 1;
    questionNoCell.setAttribute("data-cell", "Question no: ");

    // Column 2 - create a cell to show the question text
    const questionAskedCell = document.createElement("td");
    questionAskedCell.innerHTML = questionsAskedList[i].q;
    questionAskedCell.setAttribute("data-cell", "Question: ");

    // Column 3 - create a table cell to show the definition
    const translationCell = document.createElement("td");
    translationCell.innerHTML = questionsAskedList[i].definition;
    translationCell.setAttribute("data-cell", "Translation: ");

      // Column 4 - create a table cell to show if the given answer was right or wrong
    const resultCell = document.createElement("td");

    if (yourAnswersList[i] === "yes"){
        resultCell.innerHTML =
        "<img src='./images/correct.png' alt = 'correct' width='30'/>";
      resultCell.classList.add("correct");
    } else {
      resultCell.innerHTML =
        "<img src='./images/incorrect.png' alt = 'incorrect' width='20'/>";
      resultCell.classList.add("incorrect");
    }
    //append the created cells to the question row
    questionRow.appendChild(questionNoCell);
    questionRow.appendChild(questionAskedCell);
    questionRow.appendChild(translationCell);
    questionRow.appendChild(resultCell);
    //Add the new row to questionsAskedContainer
    questionsAskedContainer.appendChild(questionRow);
  }
}

function removeQuestions() {
  questionsAskedContainer.textContent = "";
}

function resetQuiz() {
  questionCounter = 0;
  correctAnswers = 0;
  attempt = 0;
  availableQuestions = [];
  questionsAskedList = [];
  yourAnswersList = [];
  removeQuestions();
}

function tryAgainQuiz() {
  //hide the result box
  resultBox.classList.add("hide");

  //show the quiz box
  quizBox.classList.remove("hide");

  resetQuiz();
  startQuiz();
}

function goToHome() {
  //hide result box
  resultBox.classList.add("hide");
  // show home box
  homeBox.classList.remove("hide");
  resetQuiz();
}

function startQuiz() {
  // hide home box
  homeBox.classList.add("hide");
  //hide result box
  resultBox.classList.add("hide");
  // show quiz box
  quizBox.classList.remove("hide");

  setAvailableQuestions();
  getNewQuestion();
  // to create indicator of answers
  answersIndicator();
}

window.onload = function () {
  homeBox.querySelector(".total-questions").innerHTML = questionLimit;
};
