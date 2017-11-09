/* global $ */
'use strict';

/******************************************************** 
 Questions and answers data 
********************************************************/

const QUESTIONS = [
  {question: 'On which NBA team did Michael spend the majority of his career?', 
    answer1: 'Chicago Bulls', //map can loop through and randomize
    answer2: 'Washington Wizards', 
    answer3: 'Boston Celtics', 
    answer4: 'Phoenix Suns', 
    answer5: 'Los Angeles Lakers', 
    correct: 1, 
    userChoice: 0},
  {question: 'What position did he play?', 
    answer1: 'Point guard', 
    answer2: 'Center', 
    answer3: 'Power Forward', 
    answer4: 'Shooting guard', 
    answer5: 'Small Forward', 
    correct: 4 , 
    userChoice: 0},
  {question: 'Michael made a comeback in 2001. Which NBA team did he play for?', 
    answer1: 'Chicago Bulls', 
    answer2: 'Washington Wizards', 
    answer3: 'Boston Celtics', 
    answer4: 'Phoenix Suns', 
    answer5: 'Los Angeles Lakers', 
    correct: 2, 
    userChoice: 0},
  {question: 'Which college team did Michael play for?', 
    answer1: 'Duke', 
    answer2: 'USC', 
    answer3: 'University of North Carolina at Chapel Hill', 
    answer4: 'University of Maryland', 
    answer5: 'Memphis', 
    correct: 3 , 
    userChoice: 0},
  {question: 'How tall is Michael?', 
    answer1: '6’1’’', 
    answer2: '6’10’’', 
    answer3: '6’6’’', 
    answer4: '6’3’’', 
    answer5: '6’11’’', 
    correct: 3 , 
    userChoice: 0},
  {question: 'In the TV cartoon "ProStars", who co-starred with Michael?', 
    answer1: 'Ken Griffey Jr. & Barry Sanders', 
    answer2: 'Penny Hardaway & Shaquille O\'Neal', 
    answer3: 'Andre Agassi & Terrell Davis', 
    answer4: 'Bo Jackson & Wayne Gretzky', 
    answer5: 'Emmitt Smith & Hulk Hogan', 
    correct: 4, 
    userChoice: 0},  
  {question: 'In 2010, Michael became majority owner of which NBA team?', 
    answer1: 'Oklahoma City Thunder', 
    answer2: 'Houston Rockets', 
    answer3: 'Philadelphia 76ers', 
    answer4: 'Charlotte Bobcats', 
    answer5: 'Chicago Bulls', 
    correct: 4, 
    userChoice: 0},
  {question: 'Which of the following NBA players did NOT appear in the film Space Jam?', 
    answer1: 'Larry Bird', 
    answer2: 'Shawn Bradley', 
    answer3: 'Charles Barkley', 
    answer4: 'Muggsy Bogues', 
    answer5: 'Kobe Bryant', 
    correct: 5, 
    userChoice: 0},
  {question: 'What is Michael\'s career playoff scoring average?', 
    answer1: '30.12', 
    answer2: '29.57', 
    answer3: '33.45', 
    answer4: '35.05', 
    answer5: '29.93', 
    correct: 3, 
    userChoice: 0},
  {question: 'How many NBA Championships did Michael have?', 
    answer1: '6', 
    answer2: '10', 
    answer3: '4', 
    answer4: '8', 
    answer5: '3', 
    correct: 1, 
    userChoice: 0}];

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {
  currentQuestion: 0,
  currentView: 0,
  currentScore: 0,
  radioButtonClicked: false
};

/******************************************************** 
Step 1: Render the DOM. 
********************************************************/

function renderPage() {
  // console.log('In the renderPage() function.');
  // console.log(`106 Question is: ${STORE.currentQuestion}; View is: ${STORE.currentView}.`);
  if (STORE.currentQuestion===0) {
    $('#js-userButton').text('START');
    $('div.js-pageView0HTML').show();
    $('div.js-pageView1HTML').hide();
    $('div.js-pageView2HTML').hide();
    $('div.js-pageView3HTML').hide();
  }

  if (STORE.currentQuestion>=1 && STORE.currentQuestion<=QUESTIONS.length && STORE.currentView===1){  
    // console.log(`Current Question is: ${STORE.currentQuestion}; current View is: ${STORE.currentView}.`);
    $('#js-userButton').text('ENTER');
    $('.js-currentScore').text(STORE.currentScore);
    $('.js-currentQuestion').text(STORE.currentQuestion);
    renderQuestions();
    // console.log('Back in the renderPage() function.');  
    // console.log('Current Question in the STORE is: '+STORE.currentQuestion);
    $('div.js-pageView0HTML').hide();
    $('div.js-pageView1HTML').show();
    $('div.js-pageView2HTML').hide();
    $('div.js-pageView3HTML').hide();
  }

  if (STORE.currentQuestion>=1 && STORE.currentQuestion<=QUESTIONS.length && STORE.currentView===2){
    $('#js-userButton').text('CONTINUE');
    $('.js-correctAnswer').text(QUESTIONS[STORE.currentQuestion-1]['answer'+QUESTIONS[STORE.currentQuestion-1].correct]);
    $('.js-userAnswer').html('YOUR ANSWER:<br/>'+QUESTIONS[STORE.currentQuestion-1]['answer'+QUESTIONS[STORE.currentQuestion-1].userChoice]);
    if(QUESTIONS[STORE.currentQuestion-1].userChoice+'' === QUESTIONS[STORE.currentQuestion-1].correct+''){
      STORE.currentScore++;
      $('.js-feedBackImageRight').show();
      $('.js-feedBackImageWrong').hide();
      $('.js-userAnswer').hide();
    } else {
      $('.js-feedBackImageRight').hide();
      $('.js-feedBackImageWrong').show();
      $('.js-userAnswer').show();     
    }
    $('.js-currentScore').text(STORE.currentScore);
    $('.js-currentQuestion').text(STORE.currentQuestion);
    $('div.js-pageView0HTML').hide();
    $('div.js-pageView1HTML').hide();
    $('div.js-pageView2HTML').show();
    $('div.js-pageView3HTML').hide();
  }

  let listHTML='';
  for(let i=0; i<QUESTIONS.length; i++) {
    listHTML+=`<li>${QUESTIONS[i].question}<br/>Answer: ${QUESTIONS[i]['answer'+QUESTIONS[i].correct]}<br/><span class='js-yours'>Yours: ${QUESTIONS[i]['answer'+QUESTIONS[i].userChoice]}</span></li>`;
  }
  if(STORE.currentQuestion === QUESTIONS.length && STORE.currentView === 3) {
    $('#js-userButton').text('PLAY AGAIN?');
    $('.js-currentScore').text(STORE.currentScore);
    $('.js-currentQuestion').text(STORE.currentQuestion);
    $('.js-scorePercent').text((STORE.currentScore/STORE.currentQuestion)*100 + '%');
    $('.js-evalList').html(listHTML);
    $('div.js-pageView0HTML').hide();
    $('div.js-pageView1HTML').hide();
    $('div.js-pageView2HTML').hide();
    $('div.js-pageView3HTML').show();

  }
}

function renderQuestions() {
  // console.log('In the renderQuestions() function.');
  //only if the STORE is on pages that show questions
  $('.js-screenQuestion').text(QUESTIONS[STORE.currentQuestion-1].question);
  $('#js-choice1').text(QUESTIONS[STORE.currentQuestion-1].answer1);
  $('#js-choice2').text(QUESTIONS[STORE.currentQuestion-1].answer2);
  $('#js-choice3').text(QUESTIONS[STORE.currentQuestion-1].answer3);
  $('#js-choice4').text(QUESTIONS[STORE.currentQuestion-1].answer4);
  $('#js-choice5').text(QUESTIONS[STORE.currentQuestion-1].answer5);
  $('div.js-pageView1HTML').show();
}

function generateHTML() {
  console.log('In the generateHTML() function.');

  // Set up Page 0, then hide it.
  // <h1>Welcome to our Michael Jordan quiz!
  let quizHeader = `
  <img src="QuizTime.jpg" class="js-splash-page" alt="Time to get Thinkful because it's Quiz Time! Cartoon person in a thinking pose next to a huge question mark.">
  <br/>`;
  $('div.js-pageView0HTML').html(quizHeader);
  $('div.js-pageView0HTML').hide();

  // Set up Page 1, then hide it.

  let quizQuestionsHTML = `
    <div id='js-scoreBox'>Score: <span class='js-currentScore'></span> of ${QUESTIONS.length}</div>
    <h3>Question <span class='js-currentQuestion'></span> of ${QUESTIONS.length}:</h3>
      <div class='js-screenQuestion'></div>
      <div class='js-radioButton' name='js-radioButton'>
       <input type='radio' name='choices' value=1>
        <label for='choice1' id='js-choice1'></label><br/>
        
        <input type='radio' name='choices' value=2>
        <label for='choice1' id='js-choice2'></label><br/>
        
        <input type='radio' name='choices' value=3>
        <label for='choice1' id='js-choice3'></label><br/>
        
        <input type='radio' name='choices' value=4>
        <label for='choice1' id='js-choice4'></label><br/>
        
        <input type='radio' name='choices' value=5>
        <label for='choice1' id='js-choice5'></label><br/>
      </div>
    <br/>
    <br/>
    <br/>
  `;
  // NOTE: The question and the five choices will be inserted in the correct places above, in renderQuestions().
  $('div.js-pageView1HTML').html(quizQuestionsHTML);
  $('div.js-pageView1HTML').hide();

  // Set up Page 2, then hide it.

  let quizFeedbackHTML = `
    <div id='js-scoreBox'>Score: <span class='js-currentScore'></span> of ${QUESTIONS.length}</div>
    <h3>Question <span class='js-currentQuestion'></span> of ${QUESTIONS.length}:</h3>
    <img src="Right.jpg" class="js-feedBackImageRight" alt="Big green check mark"></div>
    <img src="Wrong.jpg" class="js-feedBackImageWrong" alt="Big red X"></div>
    <div class='js-screenQuestion'></div><br/>
    <div class='js-correctAnswer'></div><br/>
    <div class='js-userAnswer'><br/></div>
    <br/>
    <br/>
    <br/>
  `;
  $('div.js-pageView2HTML').html(quizFeedbackHTML);
  $('div.js-pageView2HTML').hide();

  // Set up Page 3, then hide it.

  let quizWrapup = `
    <div id='js-scoreBox'>Score: <span class='js-currentScore'></span> of ${QUESTIONS.length}</div>
    <h3>Question <span class='js-currentQuestion'></span> of ${QUESTIONS.length}:</h3>
    <h2>Here's how you did:</h2>
    <h3 class='js-scorePercent'></h3>
    <ol class='js-evalList'></ol>
    <br/>
  `;
  $('div.js-pageView3HTML').html(quizWrapup);
  $('div.js-pageView3HTML').hide();
}

/******************************************************** 
 * Step 2: Listen for user interactions.
 ********************************************************/

function handleUserButton() {
  // console.log('In the handleUserButton() function.');
  $('#js-userButton').on('click', function() {
    $('input[name=choices]').prop('checked', false);
    if(!(STORE.currentView===1 && STORE.radioButtonClicked===false)){
      nextView();
      renderPage();
    }
  });
  //updates the STORE 
  //call respondToUserButton(){}
}

function handleRadioButtonClicked() {
  // console.log('In the handleRadioButtonClicked() function.');
  $('.js-radioButton').on('change',  function() {
    let selectedOption = $('input[name=choices]:checked', '.js-radioButton').val();
    if(selectedOption>0) {STORE.radioButtonClicked=true;}
    QUESTIONS[STORE.currentQuestion-1].userChoice = selectedOption;
    console.log(`Selected option is ${selectedOption}, ${QUESTIONS[STORE.currentQuestion-1]['answer'+selectedOption]}`);  
    console.log(`Current Question is: ${STORE.currentQuestion}; current View is: ${STORE.currentView}.`);
    //STORE.currentRadioButtonChoice = selectedOption;
    //console.log(STORE);
  });
}

/******************************************************** 
 * Step 3: Change the state of the STORE. 
 ********************************************************/

function nextView() {
  if(STORE.currentView===0) {
    STORE.currentView=1;
    STORE.currentQuestion=1;
  } else if(STORE.currentView===1 && STORE.currentQuestion<=QUESTIONS.length) {
    STORE.currentView=2;
  } else if(STORE.currentView===2 && STORE.currentQuestion<QUESTIONS.length) {
    STORE.currentView=1;
    STORE.radioButtonClicked = false;
    STORE.currentQuestion++;
  } else if(STORE.currentView===2 && STORE.currentQuestion===QUESTIONS.length) {
    STORE.currentView=3;
  } else if(STORE.currentView===3 && STORE.currentQuestion===QUESTIONS.length) {
    STORE.currentQuestion = 0;
    STORE.currentView = 0;
    STORE.currentScore = 0;
    STORE.radioButtonClicked = false;
    for(let i=0; i<QUESTIONS.length; i++) {
      QUESTIONS.userChoice = 0;
    }
  }
  // console.log(`Current Question is: ${STORE.currentQuestion}; current View is: ${STORE.currentView}.`);
}


/******************************************************** 
 * Step 4: Re-render based on the new state of the STORE. 
 ********************************************************/

// No other functions needed to make this happen.

/******************************************************** 
 * Step 0: Wait for page to load, then begin. Once only.
 ********************************************************/

$(()=>{
  // console.log('Begin the Quiz program.');
  generateHTML();
  renderPage();
  handleUserButton();
  handleRadioButtonClicked();
});

// Render -> User Input (Event Listener) -> State Changes (Update the STORE) -> Re-Render