import Sets from './ClassSet.js'

function loadSets() {
    for (let set of Sets) {
        const tileContainer = document.querySelector('.tile-container')

        const template = document.getElementById('set-tile-template')
        const newTile = template.content.cloneNode(true).firstElementChild

        newTile.querySelector('.set-name').textContent = set.getName()
        newTile.querySelector('.set-description').textContent = set.getDescription()
        newTile.querySelector('.number-of-terms').textContent = set.numberOfItems.toString()
        newTile.id = set.id.toString()

        tileContainer.appendChild(newTile)

        function openSet(event) {
            const clickedSetId = parseInt(event.currentTarget.id)
            Sets.setSessionId(clickedSetId)
            window.location.href = 'edit-set.html'
        }

        newTile.addEventListener('click', openSet)

    }
}

loadSets()