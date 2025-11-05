import Sets from './ClassSet.js'

let currentSet

function redirectToMySets() {
    window.location.href = 'my-sets.html';
}

function removeTerm(event) {
    const itemIndex = parseInt(event.currentTarget.value)
    currentSet.removeItem(itemIndex)
    window.location.reload()
}

function reloadContent() {
    const termContainer = document.getElementById('existing-terms-body')
    while (termContainer.children.length > 1)
        termContainer.removeChild(termContainer.lastChild)

    loadContent()
}

function editTerm(event) {
    const itemIndex = parseInt(event.currentTarget.value)
    const editedRow = event.currentTarget.parentNode.parentNode
    const parent = editedRow.parentNode

    const template = document.getElementById('edit-term-template')
    let newRow = template.content.cloneNode(true).firstElementChild

    let [termValue, definitionValue] = currentSet.getItem(itemIndex)

    parent.replaceChild(newRow, editedRow)

    const editTermField = document.getElementById('edit-term')
    const editDefinitionField = document.getElementById('edit-definition')

    editTermField.value = termValue
    editDefinitionField.value = definitionValue

    const buttonContainers = document.getElementsByClassName('term-editing-buttons-container')

    for (let buttonContainer of buttonContainers) {
        buttonContainer.style.visibility = 'hidden'
    }

    const saveButton = newRow.querySelector('.save-changes')
    const discardButton = newRow.querySelector('.discard-changes')

    function saveChanges(event) {
        event.preventDefault()

        const termValue = editTermField.value.trim()
        const definitionValue = editDefinitionField.value.trim()

        if (termValue && definitionValue) {
            currentSet.modifyItem(itemIndex, termValue, definitionValue)
            reloadContent()
        }
    }

    saveButton.addEventListener('click', saveChanges)
    discardButton.addEventListener('click', () => reloadContent())


}

function printTerm(term, definition, index) {
    const template = document.getElementById('term-template');
    const newRow = template.content.cloneNode(true);

    newRow.querySelector('.existing-term').textContent = term;
    newRow.querySelector('.existing-definition').textContent = definition;


    let editButton = newRow.querySelector('.edit-term')
    let deleteButton = newRow.querySelector('.delete-term')

    editButton.value = index.toString()
    deleteButton.value = index.toString()

    editButton.addEventListener('click', editTerm)
    deleteButton.addEventListener('click', removeTerm)

    document.getElementById('existing-terms-body').appendChild(newRow);
}

function printTerms() {
    for (let i = 0; i < currentSet.numberOfItems; i++) {
        printTerm(...currentSet.getItem(i), i)
    }
}

function loadContent() {
    // Sets.retrieveFromStorage()

    try {
        currentSet = Sets.getCurrentSet()
    } catch {
        redirectToMySets()
    }
    printTerms()
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
        printTerm(term, definition, currentSet.appendItem(term, definition))
        termInput.value = ''
        definitionInput.value = ''
        termInput.focus()
    }
}

document.addEventListener('submit', addTerm)

function saveSet() {
    window.location.href = './my-sets.html'
}

document.getElementById('save-set').addEventListener('click', saveSet)