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

    questionContent.textContent = currentQuestion.trim()

    parent.appendChild(dynamicContent)

    function skipQuestion() {
        skipButton.removeEventListener('click', skipButton)

        return ''
    }

    function checkAnswer(event) {
        event.preventDefault()

        const answer = document.getElementById('answer').value

        document.removeEventListener('submit', checkAnswer)

        return answer
    }

    const submitPromise = new Promise((resolve) => {
        document.addEventListener('submit', (event) => {
            const ans = checkAnswer(event)
            resolve(ans)
        })
    })

    const skipPromise = new Promise((resolve) => {
        skipButton.addEventListener('click', () => {
            const ans = skipQuestion()
            resolve(ans)
        })
    })

    return Promise.any([submitPromise, skipPromise])
}

async function learn() {
    while (currentSet.numberOfRemainingItems() > 0) {
        let [question, answer] = currentSet.getNext()
        const userAnswer = await handleQuestion(question)

        flushDynamicContent()

        const isValid = currentSet.validateAnswer(userAnswer)

        updateStats()

        console.log(isValid)
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