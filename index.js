/* global $ */
'use strict';

/******************************************************** 
 Main arrays
********************************************************/

let questions = [];  // Nothing to see here until the data is fetched from the Open Trivia Database (https://opentdb.com/)

/******************************************************** 
 json data packet variables 
********************************************************/

const json = {  // All the variables connected to the json packet go here.
  endpoint: 'https://opentdb.com/',
  apiKey: '',
  amount: 4,
  category: 9,
  type: '',
  questionsArray: []
};

/******************************************************** 
 All global variables here. 
********************************************************/

const STORE = {  // All the variables connected with the state of the DOM go here.
  currentQuestion: 0,
  currentView: 'splash',
  currentScore: 0,
  radioButtonClicked: false
};

/******************************************************** 
Step 1: Render the DOM. 
********************************************************/

const GetAPIPacket = {  // Gets questions data from the Open Trivia Database (https://opentdb.com/).
  getJsonKey: function(){
    console.log('In the getKey method');
    $.getJSON(`${json.endpoint}api_token.php?command=request`, function(jsonTemp){
      //console.log(jsonTemp.token);
      if(jsonTemp.token!==''){
        json.apiKey=jsonTemp.token;
      }
    });
    this.getJsonQuestions();
  },

  getJsonQuestions: function(){
    console.log('In the getJsonQuestions method');
    let tempObj={
      category: json.category===0  ? '' : `&category=${json.category}`,
      type: json.type===''  ? '' : `&type=${json.type}`,
      token: json.apiKey==='' ? '' : `&token=${json.apiKey}`
    };
    if(json.amount===0){
      json.amount=5;
    }
    $.getJSON(`${json.endpoint}api.php?amount=${json.amount}${tempObj.category}${tempObj.type}${tempObj.token}`, function(jsonTemp){
      console.log('In the json callback function');
      console.log(`${json.endpoint}api.php?amount=${json.amount}${tempObj.category}${tempObj.type}${tempObj.token}`);
      json.questionsArray=[];
      questions=[];
      console.log(json.questionsArray);    
      json.questionsArray=jsonTemp.results;
      GetAPIPacket.pushToQuestions();
    }).fail(function() {
      console.log( 'error' );
    });
  },

  pushToQuestions: function(){
    let newQuestion='';
    let newChoice1='';
    let newChoice2='';
    let newChoice3='';
    let newChoice4='';
    let newChoiceCount=0;
    for(let i=0; i<json.amount; i++){
      newQuestion=json.questionsArray[i].question;
      newChoice1=json.questionsArray[i].correct_answer;
      newChoice2=json.questionsArray[i].incorrect_answers[0];
      if(json.questionsArray[i].type==='multiple'){
        console.log('Adding a multiple question');
        newChoiceCount=4;
        newChoice3=json.questionsArray[i].incorrect_answers[1];
        newChoice4=json.questionsArray[i].incorrect_answers[2];        
      } else {
        console.log('Adding a boolean question');
        newChoiceCount=2;
        newChoice3='';
        newChoice4='';
      }
      questions.push({
        question: newQuestion,
        answer1: newChoice1,
        answer2: newChoice2,
        answer3: newChoice3,
        answer4: newChoice4,
        correct: 0,
        userChoice: 0,
        choiceCount: newChoiceCount,
      });
    }
    scrambleChoices.doScrambling();
  }  
};

const scrambleChoices = {  // First answer is always right. Scramble the choices so that's not so.
  doScrambling: function(){
    console.log('In the doScrambling method');
    for(let i=0; i<questions.length; i++){
      let rightChoice=questions[i].answer1;
      let wrongChoices=[];
      wrongChoices.push('');
      wrongChoices.push(questions[i].answer2);
      if(questions[i].choiceCount===4){
        wrongChoices.push(questions[i].answer3);
        wrongChoices.push(questions[i].answer4);      
      }
      let seqArr=[];
      if(questions[i].choiceCount===4){
        seqArr=[1,2,3,4];     
      } else {
        seqArr=[1,2];
      }
      let rndPos=0;
      let rndArr=[];
      for(let j=questions[i].choiceCount; j>1; j--){
        rndPos=this.pickNum(1,j);
        rndArr.push(seqArr.splice(rndPos-1,1));
      }
      rndArr.push(seqArr.splice(0,1));
      // rndArr.push(seqArr[0]);
      let newAnswers=[];
      let pos=0;
      for(let j=0; j<questions[i].choiceCount; j++){
        pos = rndArr[j];
        newAnswers.push(wrongChoices[pos-1]);   
      }
      for(let j=1; j<=questions[i].choiceCount; j++){
        questions[i]['answer'+j]=newAnswers[j-1];
        if(questions[i]['answer'+j]===''){
          questions[i]['answer'+j]=rightChoice;
          questions[i].correct=j;
        }
      }
    }
    if(STORE.currentView==='settings'){
      STORE.currentScore = 0;
      STORE.radioButtonClicked = false;
      FlipPages.nextView();
      RenderPage.doShowPages();
    }
  },

  pickNum: function(min, max){
    console.log('In the pickNum method');
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

const RenderPage = {  // Determines what HTML to display based on the current state.
  doShowPages: function(){
    console.log('In the doShowPages method.');
    if (STORE.currentQuestion===0 && STORE.currentView==='splash'){
      this.splashPage();
    }
    if (STORE.currentQuestion===0 && STORE.currentView==='settings'){
      this.settingsPage();
    }
    if (STORE.currentQuestion>=1 && STORE.currentQuestion<=questions.length && STORE.currentView==='question'){
      this.questionsPage();
    }
    if (STORE.currentQuestion>=1 && STORE.currentQuestion<=questions.length && STORE.currentView==='feedback'){
      this.feedBackPage();
    }
    if(STORE.currentQuestion === questions.length && STORE.currentView === 'wrap'){
      this.wrapPage();
    }
  },

  showCurrentPage: function(pageToShow, userButtonText){
    $('#js-userButton').text(userButtonText);
    $('div.js-pageViewSplashHtml').hide();
    $('div.js-pageViewSettingsHtml').hide();
    $('div.js-pageViewQuestionHtml').hide();
    $('div.js-pageViewFeedBackHtml').hide();
    $('div.js-pageViewWrapHtml').hide();
    $(pageToShow).show();
  },

  splashPage: function(){
    console.log('In the splashPage method.');
    $('#js-settingsButton').show();
    this.showCurrentPage('div.js-pageViewSplashHtml', 'START');
  },

  settingsPage: function(){
    console.log('In the settingsPage method.');
    $('#js-settingsButton').hide();
    this.showCurrentPage('div.js-pageViewSettingsHtml', 'ONWARD!');
  },

  questionsPage: function(){
    console.log('In the questionsPage method.');
    $('#js-settingsButton').hide();
    $('.js-scoreBox').html(`Score: ${STORE.currentScore} correct, ${(STORE.currentQuestion - STORE.currentScore)-1} incorrect`);
    $('.js-questionCounter').html(`Question: ${STORE.currentQuestion} of ${questions.length}`);
    this.renderQuestions();
    if(questions[STORE.currentQuestion-1].answer3===''){  // true-false question
      $('.js-twoMore').hide();
      document.getElementById('js-radioButtonBox').setAttribute('class','js-radioButtonBox');
    } else {
      $('.js-twoMore').show();
      document.getElementById('js-radioButtonBox').setAttribute('class','js-radioButtonBox');
    }
    this.showCurrentPage('div.js-pageViewQuestionHtml', 'ENTER');
    document.getElementById('js-userButton').setAttribute('class','js-button js-userbutton disabled');
    document.getElementById('js-userButton').setAttribute('tabindex','-1');
  },

  feedBackPage: function(){
    console.log('In the feedbackPage method.');
    $('.js-feedbackQuestion').html(questions[STORE.currentQuestion-1].question);
    $('.js-correctAnswer').html('THE ANSWER IS: '+questions[STORE.currentQuestion-1]['answer'+questions[STORE.currentQuestion-1].correct]);
    $('.js-userAnswer').html('YOUR ANSWER: '+questions[STORE.currentQuestion-1]['answer'+questions[STORE.currentQuestion-1].userChoice]);
    if(questions[STORE.currentQuestion-1].userChoice+'' === questions[STORE.currentQuestion-1].correct+''){
      STORE.currentScore++;
      $('.js-feedBackImageRight').show();
      $('.js-feedBackImageWrong').hide();
      $('.js-userAnswer').hide();
    } else {
      $('.js-feedBackImageRight').hide();
      $('.js-feedBackImageWrong').show();
      $('.js-userAnswer').show();     
    }
    $('.js-scoreBox').html(`Score: ${STORE.currentScore} correct, ${STORE.currentQuestion - STORE.currentScore} incorrect`);
    $('.js-questionCounter').html(`Question: ${STORE.currentQuestion} of ${questions.length}`);
    this.showCurrentPage('div.js-pageViewFeedBackHtml', 'CONTINUE');
  },

  wrapPage: function(){
    console.log('In the wrapPage method.');
    let listHTML='';
    for(let i=0; i<questions.length; i++) {
      if((questions[i].correct+''!==questions[i].userChoice+'') && questions[i].choiceCount+''==='4'){
        listHTML+=`<li>${questions[i].question}<br/>Answer: <span class='js-correct'>${questions[i]['answer'+questions[i].correct]}</span><br/>Yours: <span class='js-incorrectWrap'>${questions[i]['answer'+questions[i].userChoice]}<br/><br/></span></li>`;
      } else if((questions[i].correct+''!==questions[i].userChoice+'') && questions[i].choiceCount+''==='2'){
        listHTML+=`<li>${questions[i].question}<br/>Yours: <span class='js-incorrectWrap'>${questions[i]['answer'+questions[i].userChoice]}<br/><br/></span></li>`;
      } else {
        listHTML+=`<li>${questions[i].question}<br/>Yours: <span class='js-correct'>${questions[i]['answer'+questions[i].userChoice]} ✔<br/><br/></span></li>`;
      }
    }
    $('.js-scoreBox').html(`Score: ${STORE.currentScore} correct, ${STORE.currentQuestion - STORE.currentScore} incorrect`);
    let newPercent=(STORE.currentScore/STORE.currentQuestion)*100;
    $('.js-scorePercent').html(Math.round((newPercent + 0.00001) * 100) / 100 + '%');
    $('.js-evalList').html(listHTML);
    this.showCurrentPage('div.js-pageViewWrapHtml', 'New game?');
  },

  renderQuestions: function(){
    console.log('In the renderQuestions method.');
    //only if the STORE is on pages that show questions
    $('.js-screenQuestion').html(questions[STORE.currentQuestion-1].question);
    $('#answerText1').html(` ${questions[STORE.currentQuestion-1].answer1}`);
    $('input[name="choices"]').focus();
    $('#answerText2').html(` ${questions[STORE.currentQuestion-1].answer2}`);
    $('#answerText3').html(` ${questions[STORE.currentQuestion-1].answer3}`);
    $('#answerText4').html(` ${questions[STORE.currentQuestion-1].answer4}`);
  }
};

const GenerateHTML = {  // Here's where the extra HTML comes from.
  doHtmlPages: function(){
    console.log('In the doHtmlPages method.');
    this.splashHtml();
    this.settingsHtml();
    this.questionHtml();
    this.feedBackHtml();
    this.wrapHtml();
  },

  splashHtml: function(){
    console.log('In the splashHtml method.');
    // Set up splash page, then hide it.

    let quizSplashHTML = `
      <div class='js-splashPage'>
        <p class='title smallTitle'>Let's get Thinkful, because it's</p>
        <p class='title bigTitle'>Quiz Time!</p>
      </div>
      <div class='js-credit'>Photo by <a href='https://unsplash.com/@montylov' target='_blank' tabindex="-1">MontyLov</a> / <a href='https://unsplash.com' target='_blank' tabindex="-1">Unsplash</a></div>`;

    $('div.js-pageViewSplashHtml').html(quizSplashHTML);
    $('div.js-pageViewSplashHtml').hide();
  },

  settingsHtml: function(){
    console.log('In the settingsHtml method.');
    // Set up settings page, then hide it.

    let quizSettingsHTML = `
      <img src='settings.png' class='js-settings-image' alt='settings' tabindex='-1' />
      <form action='/userSettings' method='post' class='js-settingsForm'>
        <div class='js-Widget'>
          <label for='js-questionsToDo' class='js-label'>How many?</label>
            <select name='how many questions' aria-label='how many questions' id='js-questionsToDo' class='js-dropDown' onchange='Listeners.handleQuestionsToDo()' tabindex='0'>
              <option value='4'>4</option>
              <option value='8'>8</option>
              <option value='12'>12</option>
              <option value='16'>16</option>
              <option value='20'>20</option>
            </select>
        </div>

        <div class='js-Widget'>
          <label for='js-category' class='js-label'>Category?</label>
            <select name='which category' aria-label='which category' id='js-category' class='js-dropDown' onchange='Listeners.handleCategory()' tabindex='0'>
              <option value='9'>General</option>
              <option value='21'>Sports</option>
              <option value='20'>Mythology</option>
              <option value='23'>History</option>
              <option value='12'>Music</option>
              <option value='24'>Politics</option>
              <option value='10'>Books</option>
              <option value='17'>Science</option>
              <option value='29'>Comics</option>
              <option value='25'>Art</option>
            </select>
        </div>
      </form>`;

    $('div.js-pageViewSettingsHtml').html(quizSettingsHTML);
    $('div.js-pageViewSettingsHtml').hide();
  },

  questionHtml: function(){
    console.log('In the questionHtml method.');
    // Set up question page, then hide it.

    let quizQuestionsHTML = `
      <span class='js-topInfo js-scoreBox'></span>
      <span class='js-topInfo js-questionCounter'></span>
        <form class='js-screenQuestionForm'>
          <span id='js-radioButtonBox' class='none'>
          <fieldset class='js-radioButton' name='js-radioButton' id='choices' aria-label='choices'>
            <legend class='js-screenQuestion'></legend>
            <label for='js-choice1'>
              <input type='radio' value=1 name='choices' aria-labelledby='choices' id='js-choice1' aria-checked="false" tabindex="0"><span id='answerText1'></span>
            </label>
            <label for='js-choice2'>
              <input type='radio' value=2 name='choices' aria-labelledby='choices' id='js-choice2' aria-checked="false"><span id='answerText2'></span>
            </label>
              <span class='js-twoMore'>
                <label for='js-choice3'>
                  <input type='radio' value=3 name='choices' aria-labelledby='choices' id='js-choice3' aria-checked="false"><span id='answerText3'></span>
                </label>
                <label for='js-choice4'>
                  <input type='radio' value=4 name='choices' aria-labelledby='choices' id='js-choice4' aria-checked="false"><span id='answerText4'></span>
                </label>
              </span>
            </span><br/>
          </fieldset>
        </form>
        <div class='js-credit'>Photo by <a href='https://unsplash.com/@lin_alessio' target='_blank' tabindex="-1">Alessio Lin</a> / <a href='https://unsplash.com' target='_blank' tabindex="-1">Unsplash</a></div>
    `;
    // NOTE: The question and the five choices will be inserted in the correct places above, in renderQuestions().
    $('div.js-pageViewQuestionHtml').html(quizQuestionsHTML);
    $('div.js-pageViewQuestionHtml').hide();
  },

  feedBackHtml: function(){
    console.log('In the feedBackHtml method.');
    // Set up feedback page, then hide it.

    let quizFeedbackHTML = `
      <span class='js-topInfo js-scoreBox'></span>
      <span class='js-topInfo js-questionCounter'></span>
      <div class='js-feedBackImageBox'>
        <img src='yes.png' class='js-feedBackImageRight' alt='Yes'/>
        <img src='no.png' class='js-feedBackImageWrong' alt='No'/>
      </div>
      <div class='js-feedbackText'>
        <span class='js-feedbackQuestion'></span><br/>
        <span class='js-correctAnswer js-correct'></span><br/>
        <span class='js-userAnswer js-incorrect'></span>
      </div>
      <br/>
      <br/>
      <br/>
      <div class='js-credit'>Photo by <a href='https://unsplash.com/@asoggetti' target='_blank' tabindex="-1">asoggetti</a> / <a href='https://unsplash.com' target='_blank' tabindex="-1">Unsplash</a></div>
    `;
    $('div.js-pageViewFeedBackHtml').html(quizFeedbackHTML);
    $('div.js-pageViewFeedBackHtml').hide();
  },

  wrapHtml: function(){
    console.log('In the wrapHtml method.');
    // Set up wrap page, then hide it.

    let quizWrapHTML = `
      <div class='js-topInfo js-scoreBox'></div>
      <div class='js-topInfo js-wrapScore'>Here's how you did:<br/>
        <span class='js-scorePercent'></span>
      </div>
      <ol class='js-evalList' tabindex='0'></ol>
      <br/>
      <div class='js-credit'>Photo by <a href='https://unsplash.com/@adelgordon' target='_blank' tabindex="-1">Adel Gordon</a> / <a href='https://unsplash.com' target='_blank' tabindex="-1">Unsplash</a></div>
    `;
    $('div.js-pageViewWrapHtml').html(quizWrapHTML);
    $('div.js-pageViewWrapHtml').hide();
  }
};

/******************************************************** 
 * Step 2: Listen for user interactions.
 ********************************************************/

const Listeners = {  // All listener methods. More to come here.
  listen: function(){
    console.log('In the listen method');
    this.handleUserButton();
    this.handleRadioButtonClicked();
    this.handleSettingsButton();
  },

  handleUserButton: function(){
    console.log('In the handleUserButton method');
    $('#js-userButton').on('click', function() {
      $('input[name=choices]').prop('checked', false);
      console.log('Main button clicked.');
      if(STORE.currentView==='settings'){
        GetAPIPacket.getJsonKey();
      } else if(!(STORE.currentView==='question' && STORE.radioButtonClicked===false)){
        FlipPages.nextView();
        RenderPage.doShowPages();
      }
    });
  },

  handleRadioButtonClicked: function(){
    console.log('In the handleRadioButtonClicked method');
    $('.js-radioButton').on('change',  function() {
      let selectedOption = $('input[name=choices]:checked', '.js-radioButton').val();
      if(selectedOption>0) {
        STORE.radioButtonClicked=true;
        document.getElementById('js-userButton').setAttribute('class','js-button js-userbutton');
        document.getElementById('js-userButton').setAttribute('tabindex','0');
      }
      questions[STORE.currentQuestion-1].userChoice = selectedOption;
    });
  },

  handleSettingsButton: function(){
    console.log('In the handleSettingsButton method');
    $('.js-settingsButton').on('click', function() {
      STORE.currentView='settings';
      RenderPage.doShowPages();
    });
  },

  handleQuestionsToDo: function(){
    console.log('In the handleQuestionsToDo method');
    let myDropdown = document.getElementById('js-questionsToDo');
    json.amount=myDropdown.value;
  },

  handleCategory: function(){    
    console.log('In the handleCategory method');
    let myDropdown = document.getElementById('js-category');
    json.category=myDropdown.value;
  }
};

/******************************************************** 
 * Step 3: Change the state of the STORE. 
 ********************************************************/

const FlipPages = {  // Update the DOM by changing the STORE variables on clicking the user button.
  nextView: function(){
    console.log('In the FlipPages method.');
    if(STORE.currentView==='splash' && STORE.currentQuestion===0){
      STORE.currentView='question';
      STORE.currentQuestion=1;
    } else if(STORE.currentView==='settings'){
      STORE.currentView='question';
      STORE.currentQuestion=1;
    } else if(STORE.currentView==='question' && STORE.currentQuestion<=questions.length){
      STORE.currentView='feedback';
    } else if(STORE.currentView==='feedback' && STORE.currentQuestion<questions.length){
      STORE.currentView='question';
      STORE.radioButtonClicked = false;
      STORE.currentQuestion++;
    } else if(STORE.currentView==='feedback' && STORE.currentQuestion===questions.length){
      STORE.currentView='wrap';
    } else if(STORE.currentView==='wrap' && STORE.currentQuestion===questions.length){
      STORE.currentQuestion = 0;
      STORE.currentView = 'splash';
      STORE.currentScore = 0;
      STORE.radioButtonClicked = false;
      questions = [];
      GetAPIPacket.getJsonQuestions();
    }
  }
};

/******************************************************** 
 * Step 0: Wait for page to load, then begin. Once only.
 ********************************************************/

$(()=>{  // Get the API data, add HTML, render pages, attach listeners.
  console.log('Begin the Quiz program.');
  GetAPIPacket.getJsonKey();
  GenerateHTML.doHtmlPages();
  RenderPage.doShowPages();
  Listeners.listen();
});


// Render -> User Input (Event Listener) -> State Changes (Update the STORE) -> Re-Render