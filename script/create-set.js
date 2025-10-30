function isFormValid() {
    const setName = document.getElementById('set-name').value.trim();
    return setName.length > 0;
}

function createSet() {
    if (!isFormValid()) {
        document.getElementById('set-name-not-specified').style.display = 'block';
    }
    window.location.href = 'edit-set.html'
}