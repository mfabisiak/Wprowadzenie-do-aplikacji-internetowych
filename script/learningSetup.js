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

function saveLearningSettings() {
    const answerWith = document.getElementById('answer-with').value
    const caseSensitivity = document.getElementById('case-sensitivity').checked
    const rewriteWrongAnswers = document.getElementById('rewrite-wrong-answers').checked
    const learnStarred = document.getElementById('learn-starred').checked

    const learningSet = Sets.instantiateLearningSet(currentSet.id, answerWith, caseSensitivity, rewriteWrongAnswers, learnStarred)

    console.log(learningSet)
}