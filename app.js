// key to access api data
const MY_API_KEY = 'uxxF74RXMUgiRSE4o3Njleo8ekoymf0aTh8L7MPU'

// build fetch request parameters
const baseURL = new URL('https://quizapi.io/api/v1/questions')
baseURL.search = new URLSearchParams({
  apiKey: MY_API_KEY,
  limit: 10,
  difficulty: 'Easy',
  tags: 'html',
})

// fetch(baseURL)
//   .then((response) => response.json())
//   .then((data) => {
//     const dataArray = data
//     console.log(dataArray)
//   })
//   .catch((error) => console.warn('Something went wrong', error))

const getData = async (url) => {
  const response = await fetch(url)
  const data = await response
    .json()
    .catch((error) => console.warn('Something went wrong', error))
  return data
}

const questionsArray = getData(baseURL)
console.log(questionsArray)
