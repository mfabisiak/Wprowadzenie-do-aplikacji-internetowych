let currentSet
let termSnippet

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


}


async function getSnippet() {
    let snippet = await fetch('edit-set/term.html')
    return snippet.text()
}

document.addEventListener('DOMContentLoaded',
     function () {

        let setId = localStorage.getItem('currentSetId')
        // if (!setId) {
        //     redirectToMySets()
        // }
        let sets = JSON.parse(localStorage.getItem('my_sets'))
        currentSet = sets[setId]
        if (currentSet['terms']) {
            printTerms()
        }
    })

function addTerm() {
    event.preventDefault()

    let termInput = document.getElementById('term')
    let definitionInput = document.getElementById('definition')

    let term = termInput.value
    let definition = definitionInput.value
    if (term && definition) {
        printTerm(term, definition)
        termInput.value = ''
        definitionInput.value = ''
        termInput.focus()
    }

}

