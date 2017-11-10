/* global $ */
'use strict';

/******************************************************** 
 Questions and answers data 
********************************************************/

let QUESTIONS = [];
let jsonQuestions = [];

/******************************************************** 
 All global constants here. 
********************************************************/

const endpoint = 'https://opentdb.com/';

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {
  currentQuestion: 0,
  currentView: 0,
  currentScore: 0,
  radioButtonClicked: false,
  apiKey: '',
  jsonAmount: 5,
  jsonCategory: 10,
  jsonDifficulty: 'medium',
  jsonType: 'multiple'
};

/******************************************************** 
Step 1: Render the DOM. 
********************************************************/

function setup(){
  getKey();
  getJsonQuestions();
}

function getKey(){
  //console.log('In getKey() function');
  $.getJSON(`${endpoint}api_token.php?command=request`, function(json){
    //console.log(json.token);
    STORE.apiKey=json.token;
  });
}

function getJsonQuestions(){
  console.log('In getJsonQuestions() function');
  let rndAnsArr=[];
  let tempObj={
    amount: STORE.jsonAmount===0  ? 'amount=10' : `amount=${STORE.jsonAmount}`,
    category: STORE.jsonCategory===0  ? '' : `&category=${STORE.jsonCategory}`,
    difficulty: STORE.jsonDifficulty===0  ? '' : `&difficulty=${STORE.jsonDifficulty}`,
    type: STORE.jsonType===0  ? '' : `&type=${STORE.jsonType}`,
    token: STORE.apiKey==='' ? '' : `&token=${STORE.apiKey}`
  };
  $.getJSON(`${endpoint}api.php?${tempObj.amount}${tempObj.category}${tempObj.difficulty}${tempObj.type}${tempObj.token}`, function(json){
    let tempArr=[];
    for(let i=0; i<STORE.jsonAmount; i++){
      if(json.results[i].type==='multiple'){
        tempArr.push(json.results[i].question, json.results[i].correct_answer, json.results[i].incorrect_answers[0], json.results[i].incorrect_answers[1], json.results[i].incorrect_answers[2]);
        jsonQuestions.push([tempArr]);
        tempArr=[];
      } else {
        tempArr.push(json.results[i].question, json.results[i].correct_answer, json.results[i].incorrect_answers[0]);
        jsonQuestions.push([tempArr]);
        tempArr=[];
      }
      // End of loop through getting questions.
    }
    console.log(jsonQuestions);
    
    for (let i=0; i<STORE.jsonAmount; i++){
      QUESTIONS.push({
        question: jsonQuestions[i][0][0],
        answer1: '',
        answer2: '',
        answer3: '',
        answer4: '',
        correct: 0,
        userChoice: 0,
      });
      let jsonRight=jsonQuestions[i][0][1];
      let jsonOthers=[];
      jsonOthers.push('');
      jsonOthers.push(jsonQuestions[i][0][2]);
      jsonOthers.push(jsonQuestions[i][0][3]);
      jsonOthers.push(jsonQuestions[i][0][4]);
      let seqArr=[1,2,3,4];
      let rndPos=0;
      let rndArr=[];
      let tmpArr=[];
      for(let j=4; j>0; j--){
        rndPos=pickNum(1,j);
        tmpArr.push(seqArr.splice(rndPos-1,1)+'');
        rndArr.push(tmpArr[0]+'');
        // console.log(rndArr);
        tmpArr=[];
      }
      console.log(rndArr, jsonOthers);
      let newAnsers=[];
      let pos=0;
      for(let j=0; j<4; j++){
        pos = rndArr[j];
        newAnsers.push(jsonOthers[pos-1]);   
      }
      console.log(newAnsers);
      QUESTIONS[i].answer1=newAnsers[0];
      if(QUESTIONS[i].answer1===''){
        QUESTIONS[i].answer1=jsonRight;
        QUESTIONS[i].correct=1;
      }
      QUESTIONS[i].answer2=newAnsers[1];
      if(QUESTIONS[i].answer2===''){
        QUESTIONS[i].answer2=jsonRight;
        QUESTIONS[i].correct=2;
      }
      QUESTIONS[i].answer3=newAnsers[2];
      if(QUESTIONS[i].answer3===''){
        QUESTIONS[i].answer3=jsonRight;
        QUESTIONS[i].correct=3;
      }
      QUESTIONS[i].answer4=newAnsers[3];
      if(QUESTIONS[i].answer4===''){
        QUESTIONS[i].answer4=jsonRight;
        QUESTIONS[i].correct=4;
      }
      console.log(QUESTIONS[i]);
    }
  });
}

function pickNum(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function renderPage() {
  console.log('In the renderPage() function.');
  console.log(`145 Question is: ${STORE.currentQuestion}; View is: ${STORE.currentView}.`);

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
    $('.js-totalQuestions').text(STORE.jsonAmount);
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
    $('.js-totalQuestions').text(STORE.jsonAmount);
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
    $('.js-totalQuestions').text(STORE.jsonAmount);
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
  $('.js-screenQuestion').html(QUESTIONS[STORE.currentQuestion-1].question);
  $('#js-choice1').html(QUESTIONS[STORE.currentQuestion-1].answer1);
  $('#js-choice2').html(QUESTIONS[STORE.currentQuestion-1].answer2);
  $('#js-choice3').html(QUESTIONS[STORE.currentQuestion-1].answer3);
  $('#js-choice4').html(QUESTIONS[STORE.currentQuestion-1].answer4);
  $('div.js-pageView1HTML').show();
}

function generateHTML() {
  console.log('In the generateHTML() function.');

  // Set up Page 0, then hide it.
  // <h1>Welcome to our Michael Jordan quiz!
  let quizHeader = `
  <img src="QuizTime.jpg" class="js-splash-page" alt="Let's get Thinkful, because it's Quiz Time! Cartoon person in a thinking pose next to a huge red question mark.">
  <br/>`;
  $('div.js-pageView0HTML').html(quizHeader);
  $('div.js-pageView0HTML').hide();

  // Set up Page 1, then hide it.

  let quizQuestionsHTML = `
    <div id='js-scoreBox'>Score: <span class='js-currentScore'></span> of <span class='js-totalQuestions'></span></div>
    <h3>Question <span class='js-currentQuestion'></span> of <span class='js-totalQuestions'></span>:</h3>
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
    <div id='js-scoreBox'>Score: <span class='js-currentScore'></span> of <span class='js-totalQuestions'></span></div>
    <h3>Question <span class='js-currentQuestion'></span> of <span class='js-totalQuestions'></span>:</h3>
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
    <div id='js-scoreBox'>Score: <span class='js-currentScore'></span> of <span class='js-totalQuestions'></span></div>
    <h3>Question <span class='js-currentQuestion'></span> of <span class='js-totalQuestions'></span>:</h3>
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
    QUESTIONS = [];
    getJsonQuestions();
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
  console.log('Begin the Quiz program.');
  setup();
  generateHTML();
  renderPage();
  handleUserButton();
  handleRadioButtonClicked();
});

// Render -> User Input (Event Listener) -> State Changes (Update the STORE) -> Re-Render
