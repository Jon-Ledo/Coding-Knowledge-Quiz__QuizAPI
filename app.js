// ***********************
// GLOBAL VARIABLES
// ***********************
let count = 0
const questionsArray = []
const main = document.querySelector('main')
const MY_API_KEY = 'uxxF74RXMUgiRSE4o3Njleo8ekoymf0aTh8L7MPU'
const startBtn = document.querySelector('#quizStartBtn')
const quizContainer = document.querySelector('.quiz__container')
const countdown = document.querySelector('#countdown')
let currentTime = 60
const notification = document.querySelector('.timer__notification-text')

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

// on load, fetch and store data
window.addEventListener('DOMContentLoaded', () => {
  getData(baseURL)
})

// START GAME
startBtn.addEventListener('click', () => {
  populateQuestionBox()
  const timerId = setInterval(() => {
    timerCountdown(timerId)
  }, 1000)
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

function timerCountdown(id) {
  countdown.textContent = currentTime
  currentTime--

  if (currentTime < 0) {
    clearInterval(id)
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
  const allBtns = document.querySelectorAll('button')

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
  } else {
    // display final score
    // final page state
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
  currentTime += 5
  countdown.textContent = currentTime

  setTimeout(() => {
    notification.style.visibility = 'hidden'
  }, 600)
}

function minusTime() {
  notification.textContent = '-4 seconds lost'
  notification.style.visibility = 'visible'
  notification.style.color = '#dc3434'
  currentTime -= 5
  countdown.textContent = currentTime

  setTimeout(() => {
    notification.style.visibility = 'hidden'
  }, 600)
}
