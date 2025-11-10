import Sets from './ClassSet.js'

let currentSet

function redirectToMySets() {
    window.location.href = './my-sets.html'
}

function loadContent() {
    try {
        currentSet = Sets.getCurrentSet()
    } catch {
        redirectToMySets()
    }

    document.getElementById('set-name').textContent = currentSet.getName()
    document.getElementById('set-name-header').textContent = currentSet.getName()

}

function saveLearningSettings(event) {
    event.preventDefault()

    const answerWith = document.getElementById('answer-with').value
    const caseSensitivity = document.getElementById('case-sensitivity').checked
    const retypeWrongAnswers = document.getElementById('retype-wrong-answers').checked
    const learnStarred = document.getElementById('learn-starred').checked

    Sets.instantiateLearningSet(currentSet.id, answerWith, caseSensitivity, retypeWrongAnswers, learnStarred)
}

document.addEventListener('DOMContentLoaded', loadContent)

document.addEventListener('submit', saveLearningSettings)