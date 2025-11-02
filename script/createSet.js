import Sets from './ClassSet.js'

function isFormValid() {
    const setName = document.getElementById('set-name').value.trim();
    return setName.length > 0;
}


document.addEventListener('submit', createSet)

function createSet(event) {
    event.preventDefault()
    if (!isFormValid()) {
        return
    }
    const setName = document.getElementById('set-name').value.trim()
    const setDescription = document.getElementById('set-description').value.trim()

    Sets.retrieveFromStorage()
    Sets.addNewSet(setName, setDescription)

    window.location.href = 'edit-set.html'
}