import Sets from './ClassSet.js'

let currentSet

function redirectToMySets() {
    window.location.href = './my-sets.html'
}

function flushDynamicContent() {
    const parent = document.querySelector('.set-management')
    const childToBeRemoved = parent.lastElementChild
    console.log(childToBeRemoved)

    parent.removeChild(childToBeRemoved)
}

function handleQuestion(currentQuestion, currentAnswer) {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('question')
    const dynamicContent = template.content.cloneNode(true)

    const questionContent = dynamicContent.querySelector('.question-content')
    const skipButton = dynamicContent.querySelector('.skip-button')

    questionContent.textContent = currentQuestion.trim()

    parent.appendChild(dynamicContent)

    function checkAnswer(event) {
        event.preventDefault()

        const answer = document.getElementById('answer').value
        const isValid = currentSet.validateAnswer(answer)
        console.log(isValid)

        flushDynamicContent()

        document.removeEventListener('submit', checkAnswer)
    }

    document.addEventListener('submit', checkAnswer)
}

function loadContent() {
    try {
        currentSet = Sets.getLearningSet()
    } catch {
        redirectToMySets()
    }

    const setName = document.getElementById('set-name')
    const remaining = document.getElementById('remaining')
    const numberOfCorrectAnswers = document.getElementById('correct-answers')
    const numberOfWrongAnswers = document.getElementById('wrong-answers')

    setName.textContent = currentSet.getName()
    remaining.textContent = currentSet.numberOfRemainingItems().toString()
    numberOfCorrectAnswers.textContent = '0'
    numberOfWrongAnswers.textContent = '0'

    handleQuestion(...currentSet.getNext())
}

document.addEventListener('DOMContentLoaded', loadContent)