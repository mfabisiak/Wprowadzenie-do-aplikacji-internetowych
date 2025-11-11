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
        const buttons = buttonContainer.querySelectorAll('button')
        for (let button of buttons) {
            button.style.visibility = 'hidden'
        }
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

function printTerm(term, definition, isStarred, index) {
    const template = document.getElementById('term-template');
    const newRow = template.content.cloneNode(true);

    newRow.querySelector('.existing-term').textContent = term;
    newRow.querySelector('.existing-definition').textContent = definition;


    const editButton = newRow.querySelector('.edit-term')
    const deleteButton = newRow.querySelector('.delete-term')
    const starCheckbox = newRow.querySelector('.is-starred-checkbox')

    editButton.value = index.toString()
    deleteButton.value = index.toString()
    starCheckbox.value = index.toString()

    starCheckbox.checked = isStarred

    function changeStarredStatus(event) {
        const status = event.currentTarget.checked
        const index = parseInt(event.currentTarget.value)

        if (status) {
            currentSet.starItem(index)
        } else {
                currentSet.unstarItem(index)
        }
    }

    editButton.addEventListener('click', editTerm)
    deleteButton.addEventListener('click', removeTerm)

    starCheckbox.addEventListener('input', changeStarredStatus)

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
    document.getElementById('set-name-header').textContent = currentSet.getName()
    document.getElementById('set-name').value = currentSet.getName()
    document.getElementById('set-description').value = currentSet.getDescription()
    printTerms()
}

function addTerm(event) {
    event.preventDefault()

    let termInput = document.getElementById('term')
    let definitionInput = document.getElementById('definition')

    let term = termInput.value.trim()
    let definition = definitionInput.value.trim()

    termInput.value = term
    definitionInput.value = definition

    if (term && definition) {
        printTerm(term, definition, false, currentSet.appendItem(term, definition))
        termInput.value = ''
        definitionInput.value = ''
        termInput.focus()
    }
}

function saveSet() {
    window.location.href = './my-sets.html'
}

function removeSet() {
    Sets.removeSet(currentSet)
    window.location.href = './my-sets.html'
}

function updateSetName(event) {
    if (!event.currentTarget.checkValidity())
        return
    const newName = event.currentTarget.value.trim()
    document.getElementById('set-name-header').textContent = newName
    currentSet.changeName(newName)
}

function updateSetDescription(event) {
    const newDescription = event.currentTarget.value.trim()
    currentSet.changeDescription(newDescription)
}

document.addEventListener('DOMContentLoaded', loadContent)

document.addEventListener('submit', addTerm)

document.getElementById('save-set').addEventListener('click', saveSet)

document.getElementById('remove-set').addEventListener('click', removeSet)

document.getElementById('set-name').addEventListener('input', updateSetName)

document.getElementById('set-description').addEventListener('input', updateSetDescription)
