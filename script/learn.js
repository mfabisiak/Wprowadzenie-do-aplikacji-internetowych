import Sets from './ClassSet.js'

let currentSet

function redirectToMySets() {
    window.location.href = './my-sets.html'
}

function flushDynamicContent() {
    const parent = document.querySelector('.set-management')
    const childToBeRemoved = parent.lastElementChild

    parent.removeChild(childToBeRemoved)
}

function updateStats() {
    const remaining = document.getElementById('remaining')
    const numberOfCorrectAnswers = document.getElementById('correct-answers')
    const numberOfWrongAnswers = document.getElementById('wrong-answers')

    remaining.textContent = currentSet.numberOfRemainingItems().toString()
    numberOfCorrectAnswers.textContent = currentSet.numberOfCorrectAnswers().toString()
    numberOfWrongAnswers.textContent = currentSet.numberOfWrongAnswers().toString()

}

function handleQuestion(currentQuestion) {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('question')
    const dynamicContent = template.content.cloneNode(true)

    const questionContent = dynamicContent.querySelector('.question-content')
    const skipButton = dynamicContent.querySelector('.skip-button')
    const form = dynamicContent.querySelector('.learn-form')

    questionContent.textContent = currentQuestion

    parent.appendChild(dynamicContent)

    document.getElementById('answer').focus()

    function checkAnswer(event) {
        event.preventDefault()

        return document.getElementById('answer').value
    }

    const submitPromise = new Promise((resolve) => {
        form.addEventListener('submit', (event) => {
            const ans = checkAnswer(event)
            resolve(ans)
        })
    })

    const skipPromise = new Promise((resolve) => {
        skipButton.addEventListener('click', () => {
            const ans = ''
            resolve(ans)
        })
    })

    return Promise.any([submitPromise, skipPromise])
}

async function showCorrectAnswer(question, answer) {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('correct-answer')
    const dynamicContent = template.content.cloneNode(true)

    const questionContent = dynamicContent.querySelector('.question-content')
    const correctAnswer = dynamicContent.querySelector('.correct-answer')
    const form = dynamicContent.querySelector('.learn-form')
    const button = dynamicContent.querySelector('.submit-button')

    questionContent.textContent = question
    correctAnswer.textContent = answer

    parent.appendChild(dynamicContent)

    button.focus()

    const submitPromise = new Promise((resolve) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            resolve()
        })
    })

    const keyDownPromise = new Promise((resolve) => {
        button.addEventListener('keydown', resolve)
    })

    return Promise.any([submitPromise, keyDownPromise])
}

async function showWrongAnswerWithRetyping(question, answer, userAnswer) {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('wrong-answer-with-retyping')
    const dynamicContent = template.content.cloneNode(true)

    const questionField = dynamicContent.querySelector('.question-content')
    const userAnswerField = dynamicContent.querySelector('.user-answer')
    const answerField = dynamicContent.querySelector('.correct-answer')

    questionField.textContent = question
    answerField.textContent = answer

    if (userAnswer) {
        userAnswerField.textContent = userAnswer
    }

    parent.appendChild(dynamicContent)

    const inputField = document.getElementById('retype-answer')
    const button = document.getElementById('I-was-right')

    document.addEventListener('submit', (e) => e.preventDefault())

    inputField.focus()

    const inputPromise = new Promise((resolve) => {
        inputField.addEventListener('input', (event) => {
            if (event.currentTarget.value === answer) {
                resolve(false)
            }
        })
    })

    const buttonPromise = new Promise((resolve) => {
        button.addEventListener('click', () => resolve(true))
    })

    return Promise.any([inputPromise, buttonPromise])


}

async function learn() {
    while (currentSet.numberOfRemainingItems() > 0) {
        let [question, answer] = currentSet.getNext()
        const userAnswer = await handleQuestion(question)

        flushDynamicContent()

        const isValid = currentSet.validateAnswer(userAnswer)

        if (isValid) {
            await showCorrectAnswer()
            flushDynamicContent()
        } else if (currentSet.retypeWrongAnswers) {
            const questionOutcome = await showWrongAnswerWithRetyping(question, answer, userAnswer)
            currentSet.submitAnswer(questionOutcome)
            document.removeEventListener('submit', (e) => e.preventDefault())
            flushDynamicContent()
        }

        updateStats()
    }
}

async function loadContent() {
    try {
        currentSet = Sets.getLearningSet()
    } catch {
        redirectToMySets()
    }

    const setName = document.getElementById('set-name')


    setName.textContent = currentSet.getName()

    updateStats()

    await learn()
}

document.addEventListener('DOMContentLoaded', loadContent)