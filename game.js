
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion;
let acceptingAnswers = true ;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("questions.json")
  .then( res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions);
    questions = loadedQuestions;
    startGame();
  });
// EL NAVEGADOR NO PERMITE HACER PETICIONES SIN EL ESQUEMA HTTPS. ABRIR INDEX.HTML CON LIVE SERVER.

//constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

function startGame() {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  
};

function getNewQuestion() {

  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
    localStorage.setItem('mostRecentScore', score);
    //ir al final de la pagina
    return window.location.assign("end.html");
    //
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //actualizar la progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  //
  const questionIndex = Math.floor(Math.random()*availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach( choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice"+ number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if(!acceptingAnswers) return;
  //añadimos un eventListener a choice tal que al clickear, si 

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    // si (selectedAnswer == currentQuestion.answer) es true
    // asigna 'correct' sino asigna 'incorrect'.

    if(classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);
    //añade el valor asignado a classToApply como una clase HTML al elemento padre de choice-text(choice-container) y usamos esa clase para asigarle un color en game.css.
    //nota: añadir las clases .correct y .incorrect
    setTimeout( () => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
    //quitamos esa clase para eliminar el color y pasar a la siguiente pregunta en 1000ms
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

//startGame();

