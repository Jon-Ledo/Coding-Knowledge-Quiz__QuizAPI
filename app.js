// ***********************
// GLOBAL VARIABLES
// ***********************
let count = 0
let scoresArray
let isGameOver = false
let questionsArray = []
const main = document.querySelector('main')
const MY_API_KEY = 'uxxF74RXMUgiRSE4o3Njleo8ekoymf0aTh8L7MPU'
const startBtn = document.querySelector('#quizStartBtn')
const quizContainer = document.querySelector('.quiz__container')
const countdown = document.querySelector('#countdown')
let currentTime = 60
const notification = document.querySelector('.timer__notification-text')
const viewHighScoresBtn = document.querySelector('#viewHighScores')
const highScores = document.querySelector('#highScores')

// ***********************
// FETCH DATA
// ***********************

// build fetch request parameters
const baseURL = new URL('https://quizapi.io/api/v1/questions')
baseURL.search = new URLSearchParams({
  apiKey: MY_API_KEY,
  limit: 10,
  difficulty: 'Easy',
  tags: 'html',
})

// on load,
// fetch and store data (API and localstorage)
window.addEventListener('DOMContentLoaded', () => {
  getData(baseURL)
  getScoreData()
  sortHighScores()
})

// START GAME
startBtn.addEventListener('click', startGame)

// View High Scores
viewHighScoresBtn.addEventListener('click', () => {
  displayHighScores()
  highScores.classList.toggle('hidden')
})

// ***********************
// FUNCTIONS
// ***********************
const getData = async (url) => {
  const response = await fetch(url)
  const data = await response
    .json()
    .catch((error) => console.warn('Something went wrong', error))

  questionsArray.push(data)
}

function startGame() {
  startBtn.classList.add('hidden')
  populateQuestionBox()
  const timerId = setInterval(() => {
    timerCountdown(timerId)
  }, 1000)
}

function timerCountdown(id) {
  countdown.textContent = currentTime
  currentTime--

  //when time runs out
  if (currentTime < 0 || isGameOver) {
    clearInterval(id) //remove interval
    triggerEndgame() // gameover
  }
}

function createQuestionBox() {
  // box container
  const createdDiv = document.createElement('div')
  createdDiv.classList.add('quiz__container')

  // question
  const createdHeading = document.createElement('h2')
  createdHeading.classList.add('quiz__question')

  // answer container
  const createdAnswersDiv = document.createElement('div')
  createdAnswersDiv.classList.add('quiz__answers-container')

  // answer buttons
  const btnAnswerA = document.createElement('button')
  btnAnswerA.setAttribute('data-answer', 'answer_a')
  const btnAnswerB = document.createElement('button')
  btnAnswerB.setAttribute('data-answer', 'answer_b')
  const btnAnswerC = document.createElement('button')
  btnAnswerC.setAttribute('data-answer', 'answer_c')
  const btnAnswerD = document.createElement('button')
  btnAnswerD.setAttribute('data-answer', 'answer_d')
  createdAnswersDiv.append(btnAnswerA, btnAnswerB, btnAnswerC, btnAnswerD)

  // completed box
  main.appendChild(createdDiv)
  createdDiv.append(createdHeading, createdAnswersDiv)
}

function generateAnswersForBtns(correctAnswer) {
  // select by data-attr to avoid tampering with other btns
  const allBtns = document.querySelectorAll('[data-answer]')

  allBtns.forEach((btn) => {
    // store data to match against correct answer
    const attributeData = btn.dataset.answer

    // dynamically update answers displayed on buttons
    btn.textContent = questionsArray[0][count].answers[attributeData]

    // check user anwser
    btn.addEventListener('click', (e) => {
      if (attributeData === correctAnswer) {
        isCorrectAnswer(e)

        addTime()

        setTimeout(() => {
          populateQuestionBox()
        }, 800)
      } else {
        isWrongAnswer(e)

        minusTime()

        setTimeout(() => {
          populateQuestionBox()
        }, 800)
      }
    })
  })
}

function populateQuestionBox() {
  if (count < 10) {
    // clear any previous boxes
    main.innerHTML = ''
    // make new question box
    createQuestionBox()

    // populate fields of new question box
    const quizQuestion = document.querySelector('.quiz__question')
    quizQuestion.textContent = questionsArray[0][count].question

    const correctAnswer = questionsArray[0][count].correct_answer
    generateAnswersForBtns(correctAnswer)

    // increase count to control output
    count++
  } else if (count === 10) {
    triggerEndgame()
  }
}

function isCorrectAnswer(e) {
  e.target.style.backgroundColor = '#3ae33a'
}

function isWrongAnswer(e) {
  e.target.style.backgroundColor = '#dc3434'
}

function addTime() {
  notification.textContent = '+4 seconds gained'
  notification.style.visibility = 'visible'
  notification.style.color = '#3ae33a'
  currentTime += 4
  countdown.textContent = currentTime

  setTimeout(() => {
    notification.style.visibility = 'hidden'
  }, 600)
}

function minusTime() {
  notification.textContent = '-4 seconds lost'
  notification.style.visibility = 'visible'
  notification.style.color = '#dc3434'
  currentTime -= 4
  countdown.textContent = currentTime

  setTimeout(() => {
    notification.style.visibility = 'hidden'
  }, 600)

  if (currentTime < 0) {
    isGameOver = true
  }
}

function triggerEndgame() {
  isGameOver = true
  const gameOverText = document.querySelector('#gameOverText')

  // display gameover texts
  gameOverText.style.display = 'block'
  setTimeout(() => {
    gameOverText.textContent = `Your final time is ${currentTime}s`
  }, 2000)

  // remove alert
  setTimeout(() => {
    gameOverText.style.display = 'none'
    // replace the questions box container
    main.innerHTML = ''
    createUserInput()
  }, 4000)
}

function createUserInput() {
  const createdForm = document.createElement('form')
  const createdLabel = document.createElement('label')
  const createdInput = document.createElement('input')
  const createdBtn = document.createElement('button')

  createdLabel.textContent = 'Enter name'
  createdInput.setAttribute('type', 'text')
  createdInput.setAttribute('maxLength', '8')
  createdBtn.textContent = 'Submit'
  createdBtn.setAttribute('type', 'submit')
  createdBtn.classList.add('submit-btn')

  createdForm.append(createdLabel, createdInput, createdBtn)
  main.append(createdForm)

  // new event listener
  createdForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const userName = createdInput.value
    displayHighScores(userName)

    resetQuizData()
  })
}

function displayHighScores(name) {
  const nodesArray = Array.from(highScores.children)

  if (isGameOver) {
    main.innerHTML = ''
    nodesArray.forEach((child, index) => {
      if (index > 1) {
        child.remove()
      }
    })
    storeScoreData(name, currentTime)
    createHighScoreList()
    highScores.classList.remove('hidden')
    isGameOver = false
  } else {
    nodesArray.forEach((child, index) => {
      if (index > 1) {
        child.remove()
      }
    })
    createHighScoreList()
  }
}

function storeScoreData(name, score) {
  scoresArray.push([name, score])
  localStorage.setItem('scores', JSON.stringify(scoresArray))
}

function getScoreData() {
  if (localStorage.getItem('scores')) {
    scoresArray = JSON.parse(localStorage.getItem('scores'))
  } else {
    scoresArray = []
  }
}

function sortHighScores() {
  if (scoresArray.length > 1) {
    scoresArray.sort((a, b) => {
      return b[1] - a[1]
    })
  }
}

function createHighScoreList() {
  const scoreContainer = document.querySelector('.score__container')

  sortHighScores()

  scoresArray.forEach((highscore, index) => {
    // clone node of score__container
    const clone = scoreContainer.cloneNode(true)
    const userName = clone.querySelector('.score__user-name')
    const userScore = clone.querySelector('.score__user-score')

    if (index < 5) {
      userName.textContent = highscore[0]
      userScore.textContent = highscore[1]
      highScores.appendChild(clone)
    } else return
  })
}

const quizResetBtn = document.querySelector('#quizResetBtn')

function resetQuizData() {
  currentTime = 60
  count = 0
  isGameOver = false
  questionsArray = []
  getData(baseURL)

  quizResetBtn.classList.remove('hidden')

  // event to restart quiz
  quizResetBtn.addEventListener('click', restartQuiz)
}

function restartQuiz() {
  quizResetBtn.classList.add('hidden')
  highScores.classList.add('hidden')
  populateQuestionBox()
  const timerId = setInterval(() => {
    timerCountdown(timerId)
  }, 1000)
}
