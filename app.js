/**
 * Example store structure
 */
const STORE = {
  // 5 or more questions are required
  questions: [
    {
      question: "Who's the creator of the Simpsons?",
      answers: [
        "Dan Schneider",
        "Carlton Cruse",
        "David Benioff",
        "Matt Groening"
      ],
      correctAnswer: "Matt Groening"
    },

    {
      question: "Who's is the voice of Bart?",
      answers: [
        "Tom Kenny",
        "Nancy Cartwright",
        "Clancy Brown",
        "Debi Derryberry"
      ],
      correctAnswer: "Nancy Cartwright"
    },

    {
      question: "What is Homer's favorite beer?",
      answers: [
        "Miller Lite",
        "Bud Light",
        "Duff",
        "Druff"
      ],
      correctAnswer: "Duff"
    },

    {
      question: "What's Lisa's cat's name?",
      answers: [
        "Snowball",
        "Snowball 2",
        "Buster",
        "Monkey"
      ],
      correctAnswer: "Snowball"
    },

    {
      question: "What city do the Simpsons live in?",
      answers: [
        "Westfield",
        "Springfield",
        "Greenfield",
        "Sacramento"
      ],
      correctAnswer: "Springfield"
    }
  ],
  quizStarted: false,
  questionNumber: 0,
  submittingAnswer: false,
  score: 0,
};

/**
 * 
 * Technical requirements:
 * 
 * Your app should include a render() function, that regenerates the view each time the store is updated. 
 * See your course material and access support for more details.
 *
 * NO additional HTML elements should be added to the index.html file.
 *
 * You may add attributes (classes, ids, etc) to the existing HTML elements, or link stylesheets or additional scripts if necessary
 *
 * SEE BELOW FOR THE CATEGORIES OF THE TYPES OF FUNCTIONS YOU WILL BE CREATING 👇
 * 
 */

/********** TEMPLATE GENERATION FUNCTIONS **********/

// These functions return HTML templates



function generateStartScreenHtml() {
  return `
  <div class="start-screen">
  <p>Welcome Quiz Taker please press Start Quiz</p>
     <div class="img-container">
        <img src="images/simpsons-family-couch.png" class="w3-round" alt:"Simpsons">
      </div>
    <button type="submit" id="start">Start Quiz</button>
  </div>
  `;
}



function generateQuestionHtml() {
  let currentQuestion = STORE.questions[STORE.currentQuestion];
  return `
    <form id="question-form">
        <div class="question">
          <label>${currentQuestion.question}</label>
        </div>
        <div class="options">
          <div class="answers">
            ${generateAnswersHtml()}
          </div>
        </div>
        <button type="submit" id="submit-answer-btn">Submit</button>
        <button type="button" id="next-question-btn">Next</button>
    </form>
  `;
}

function generateAnswersHtml() {
  const answersArray = STORE.questions[STORE.currentQuestion].answers
  let answersHtml = '';
  let i = 0;

  answersArray.forEach(answer => {
    answersHtml += `
      <div id="option-container-${i}">
        <input type="radio" name="options" id="option${i + 1}" value= "${answer}" tabindex ="${i + 1}" required> 
        <label for="option${i + 1}"> ${answer}</label>
      </div>
    `;
    i++;
  });
  return answersHtml;
}



function generateQuestionNumberAndScoreHtml() {
  return `
    
        Question: ${STORE.currentQuestion + 1}/${STORE.questions.length}

        Score: ${STORE.score}/${STORE.questions.length}

  `;
}



function generateResultsScreen() {
  return `
    <div class="results">
      <form id="js-restart-quiz">
        <label>Your Score is: ${STORE.score}/${STORE.questions.length}</label>
        <button type="button" id="restart"> Restart Quiz </button>
      </form>
    </div>
  `;
}


function generateFeedbackHTML(answerStatus) {
  let correctAnswer = STORE.questions[STORE.currentQuestion].correctAnswer;
  let html = '';
  if (answerStatus === 'correct') {
    html = `
    <div class="right-answer">Yes! That's correct!</div>
    `;
  }
  else if (answerStatus === 'incorrect') {
    html = `
      <div class="wrong-answer">D'OH! The correct answer is ${correctAnswer}.</div>
    `;
  }
  return html;
}

/********** RENDER FUNCTION **********/

function render() {
  let html = '';

  if (STORE.quizStarted === false) {
    $('main').html(generateStartScreenHtml());
    return;
  }
  else if (STORE.currentQuestion >= 0 && STORE.currentQuestion < STORE.questions.length) {
    html = generateQuestionNumberAndScoreHtml();
    html += generateQuestionHtml();
    $('main').html(html);
  }
  else {
    $('main').html(generateResultsScreen());
  }
}

/********** EVENT HANDLER FUNCTIONS **********/


function handleStartClick() {
  $('main').on('click', '#start', function (event) {
    STORE.quizStarted = true;
    render();
  });
}



function handleNextQuestionClick() {
  $('body').on('click', '#next-question-btn', (event) => {
    render();
  });
}


function handleQuestionFormSubmission() {
  $('body').on('submit', '#question-form', function (event) {
    event.preventDefault();
    const currentQuestion = STORE.questions[STORE.currentQuestion];

   
    let selectedOption = $('input[name=options]:checked').val();
    
    let optionContainerId = `#option-container-${currentQuestion.answers.findIndex(i => i === selectedOption)}`;

    if (selectedOption === currentQuestion.correctAnswer) {
      STORE.score++;
      $(optionContainerId).append(generateFeedbackHTML('correct'));
    }
    else {
      $(optionContainerId).append(generateFeedbackHTML('incorrect'));
    }
    STORE.currentQuestion++;
   
    $('#submit-answer-btn').hide();
    $('input[type=radio]').each(() => {
      $('input[type=radio]').attr('disabled', true);
    });
    $('#next-question-btn').show();

  });
}

 
function restartQuiz() {
  STORE.quizStarted = false;
  STORE.currentQuestion = 0;
  STORE.score = 0;
}

function handleRestartButtonClick() {
  $('body').on('click', '#restart', () => {
    restartQuiz();
    render();
  });
}

function handleQuizApp() {
  render();
  handleStartClick();
  handleNextQuestionClick();
  handleQuestionFormSubmission();
  handleRestartButtonClick();
}

$(handleQuizApp);