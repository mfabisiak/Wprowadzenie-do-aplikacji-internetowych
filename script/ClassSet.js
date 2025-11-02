export default class Sets {
    static sets

    static initialize() {
        this.sets = {'ids': [], 'currentId': 0}
        this.saveToStorage()
    }

    static retrieveFromStorage() {
        this.sets = JSON.parse(localStorage.getItem('mySets'))
        if (!this.sets)
            this.initialize()
    }

    static setSessionId(id) {
        sessionStorage.setItem('currentSetId', id.toString())
    }

    static addNewSet(name, description) {
        const id = this.sets.currentId
        this.sets.currentId += 1
        this.sets.ids.push(id)
        this.sets[id] = {'terms': [], 'definitions': [], 'name': name, 'description': description}
        this.setSessionId(id)
        this.saveToStorage()
    }

    static getSessionSetId() {
        return parseInt(sessionStorage.getItem('currentSetId'))
    }

    static getSetContent(setId) {
        return this.sets[setId]
    }

    static saveToStorage() {
        localStorage.setItem('mySets', JSON.stringify(Sets.sets))
    }

    static getCurrentSet() {
        return new Set(this.getSessionSetId())
    }
}

export class Set {
    constructor(setId = null) {
        this.setContent = Sets.getSetContent(setId)
        this.numberOfItems = this.setContent.terms.length
    }

    getItem(index) {
        return [this.setContent.terms[index], this.setContent.definitions[index]]
    }

    appendItem(term, definition) {
        this.setContent.terms.push(term)
        this.setContent.definitions.push(definition)
        this.numberOfItems += 1
        return this.numberOfItems
    }

    modifyItem(index, term, definition) {
        this.setContent.terms[index] = term
        this.setContent.definitions[index] = definition
    }

    removeItem(index) {
        this.setContent.terms.splice(index, 1)
        this.setContent.definitions.splice(index, 1)
        this.numberOfItems -= 1
        return this.numberOfItems
    }

}