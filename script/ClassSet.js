export default class Set {
    static sets = JSON.parse(localStorage.getItem('mySets'))

    constructor(setId = null) {
        if (setId == null)
            setId = Set.getSessionSetId()
        this.setContent = Set.getSetContent(setId)
        this.numberOfItems = this.setContent.terms.length
    }

    static getSessionSetId() {
        return parseInt(sessionStorage.getItem('currentSetId'))
    }

    static getSetContent(setId) {
        return this.sets[setId]
    }

    static saveToStorage() {
        localStorage.setItem('mySets', JSON.stringify(Set.sets))
    }

    isValid() {
        return this.setContent != null && this.setContent.terms != null && this.setContent.definitions != null
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
    }

}