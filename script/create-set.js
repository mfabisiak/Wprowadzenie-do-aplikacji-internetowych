function isFormValid() {
    const setName = document.getElementById('set-name').value.trim();
    return setName.length > 0;
}

function createSet() {
    if (!isFormValid()) {
        return
    }
    window.location.href = 'edit-set.html'
}