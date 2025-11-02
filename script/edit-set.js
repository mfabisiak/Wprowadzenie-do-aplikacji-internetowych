let currentSet

function getSetId() {
    return parseInt(sessionStorage.getItem('currentSetId'))
}

function getCurrentSet() {
    const currentId = getSetId()
    const sets = JSON.parse(localStorage.getItem('mySets'))
    return sets[currentId]
}


function redirectToMySets() {
    window.location.href = 'my-sets.html';
}

function printTerm(term, definition) {
    const template = document.getElementById('term-template');
    const newRow = template.content.cloneNode(true);

    newRow.querySelector('.existing-term').textContent = term;
    newRow.querySelector('.existing-definition').textContent = definition;

    document.getElementById('existing-terms-body').appendChild(newRow);
}

function printTerms() {
    for (let i in currentSet.terms) {
        printTerm(currentSet.terms[i], currentSet.definitions[i])
    }


}

function loadContent() {
    if (getSetId()) {
        redirectToMySets()
    }
    currentSet = getCurrentSet()
    if (currentSet['terms']) {
        printTerms()
    }
}

document.addEventListener('DOMContentLoaded', loadContent)


function addTerm(event) {
    event.preventDefault()

    let termInput = document.getElementById('term')
    let definitionInput = document.getElementById('definition')

    let term = termInput.value.trim()
    let definition = definitionInput.value.trim()

    termInput.value = term
    definitionInput.value = definition

    if (term && definition) {
        printTerm(term, definition)
        currentSet.terms.push(term)
        currentSet.definitions.push(definition)
        termInput.value = ''
        definitionInput.value = ''
        termInput.focus()
    }
}

document.addEventListener('submit', addTerm)

function saveSet() {

}