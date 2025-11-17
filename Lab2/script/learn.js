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

    questionContent.textContent = question
    correctAnswer.textContent = answer

    parent.appendChild(dynamicContent)


    const submitPromise = new Promise((resolve) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            resolve()
        })
    })

    const keyDownPromise = new Promise((resolve) => {
        function handler(event) {
            event.preventDefault()
            document.removeEventListener('keydown', handler)
            resolve()
        }

        document.addEventListener('keydown', handler)
    })

    return Promise.any([submitPromise, keyDownPromise])
}

function loadWrongAnswerContent(template, parent, question, answer, userAnswer) {
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
}

async function showWrongAnswerWithRetyping(question, answer, userAnswer) {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('wrong-answer-with-retyping')

    loadWrongAnswerContent(template, parent, question, answer, userAnswer)

    const inputField = document.getElementById('retype-answer')
    const IWasRightButton = parent.querySelector('.I-was-right')
    const form = parent.querySelector('.learn-form')

    form.addEventListener('submit', (e) => e.preventDefault())

    inputField.focus()

    const inputPromise = new Promise((resolve) => {
        inputField.addEventListener('input', (event) => {
            if (event.currentTarget.value === answer) {
                resolve(false)
            }
        })
    })

    const buttonPromise = new Promise((resolve) => {
        IWasRightButton.addEventListener('click', () => resolve(true))
    })

    return Promise.any([inputPromise, buttonPromise])


}

async function showWrongAnswer(question, answer, userAnswer) {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('wrong-answer')

    loadWrongAnswerContent(template, parent, question, answer, userAnswer)

    const IWasRightButton = parent.querySelector('.I-was-right')
    const form = parent.querySelector('.learn-form')


    const buttonPromise = new Promise((resolve) => {
        IWasRightButton.addEventListener('click', () => resolve(true))
    })

    const submitPromise = new Promise((resolve) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            resolve(false)
        })
    })

    const keyDownPromise = new Promise((resolve) => {
        function handler(event) {
            event.preventDefault()
            document.removeEventListener('keydown', handler)
            resolve()
        }

        document.addEventListener('keydown', handler)
    })

    return Promise.any([buttonPromise, submitPromise, keyDownPromise])
}

function showCongratulations() {
    const parent = document.querySelector('.set-management')
    const template = document.getElementById('all-questions-passed')

    const dynamicContent = template.content.cloneNode(true)

    parent.appendChild(dynamicContent)

    const button = parent.querySelector('.submit-button')

    button.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = './learning-setup.html'
    })
}

function showWrongAnswers() {
    let parent = document.querySelector('.set-management')
    let template = document.getElementById('wrong-answers-summary')

    const dynamicContent = template.content.cloneNode(true)

    const numberOfCorrectAnswers = dynamicContent.querySelector('.correct-answers')
    const numberOfItems = dynamicContent.querySelector('.number-of-items')
    const button = dynamicContent.querySelector('.submit-button')

    numberOfCorrectAnswers.textContent = currentSet.numberOfCorrectAnswers().toString()
    numberOfItems.textContent = (currentSet.numberOfCorrectAnswers() + currentSet.numberOfWrongAnswers()).toString()

    parent.appendChild(dynamicContent)

    parent = document.querySelector('.wrong-answers-container')
    template = document.getElementById('wrong-answer-row')

    for (let [question, answer] of currentSet.wrongAnswers.map(x => [x.question, x.answer])) {
        const newRow = template.content.cloneNode(true)

        const questionContent = newRow.querySelector('.question')
        const answerContent = newRow.querySelector('.answer')

        questionContent.textContent = question
        answerContent.textContent = answer

        parent.appendChild(newRow)
    }

    button.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = './learning-setup.html'
    })
}

async function learn() {
    while (currentSet.numberOfRemainingItems() > 0) {
        let [question, answer] = currentSet.getNext()
        const userAnswer = await handleQuestion(question)

        flushDynamicContent()

        const isValid = currentSet.validateAnswer(userAnswer)

        if (isValid) {
            await showCorrectAnswer(question, answer)
        } else if (currentSet.retypeWrongAnswers) {
            const questionOutcome = await showWrongAnswerWithRetyping(question, answer, userAnswer)
            currentSet.submitAnswer(questionOutcome)
        } else {
            const questionOutcome = await showWrongAnswer(question, answer, userAnswer)
            currentSet.submitAnswer(questionOutcome)
        }

        flushDynamicContent()

        updateStats()
    }

    if (currentSet.numberOfWrongAnswers() === 0) {
        showCongratulations()
    } else {
        showWrongAnswers()
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