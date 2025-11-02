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
    let sets = JSON.parse(localStorage.getItem('mySets'))
    let currentID = sets.ids[sets.ids.length - 1] + 1
    sets.ids.push(currentID)
    sets[currentID] = {'terms': [], 'definitions': [], 'name': setName}
    localStorage.setItem('mySets', JSON.stringify(sets))
    localStorage.setItem('currentSetId', currentID.toString())
    sessionStorage.setItem('currentSetId', JSON.stringify(currentID))
    // console.log(JSON.stringify(sets))
    window.location.href = 'edit-set.html'
}