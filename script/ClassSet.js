export default class Sets {
    static sets

    static {
        this.retrieveFromStorage()
    }

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

    static removeSet(set) {
        const idToBeRemoved = set.id
        delete this.sets[idToBeRemoved]
        this.sets.ids.splice(this.sets.ids.indexOf(idToBeRemoved), 1)
        sessionStorage.removeItem('currentSetId')
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
        return new SetInstance(this.getSessionSetId())
    }

    static* [Symbol.iterator]() {
        for (let id of this.sets.ids) {
            yield new SetInstance(id)
        }
    }
}

export class SetInstance {
    constructor(setId) {
        this.setContent = Sets.getSetContent(setId)
        this.numberOfItems = this.setContent.terms.length
        this.id = setId
    }

    getItem(index) {
        return [this.setContent.terms[index], this.setContent.definitions[index]]
    }

    changeName(newName) {
        this.setContent.name = newName
        Sets.saveToStorage()
    }

    changeDescription(newDescription) {
        this.setContent.description = newDescription
        Sets.saveToStorage()
    }

    appendItem(term, definition) {
        this.setContent.terms.push(term)
        this.setContent.definitions.push(definition)
        this.numberOfItems += 1
        Sets.saveToStorage()
        return this.numberOfItems - 1
    }

    modifyItem(index, newTerm, newDefinition) {
        this.setContent.terms[index] = newTerm
        this.setContent.definitions[index] = newDefinition
        Sets.saveToStorage()
    }

    removeItem(index) {
        this.setContent.terms.splice(index, 1)
        this.setContent.definitions.splice(index, 1)
        this.numberOfItems -= 1
        Sets.saveToStorage()
    }

    getName() {
        return this.setContent.name
    }

    getDescription() {
        return this.setContent.description
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.numberOfItems; i++) {
            yield this.getItem(i)
        }
    }
}