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
        this.sets[id] = {'items': [], 'name': name, 'description': description}
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

    static instantiateLearningSet(...params) {
        const learningSet = new LearningSet(...params)
        learningSet.saveToStorage()
        return learningSet
    }

    static getLearningSet() {
        const storageObject = JSON.parse(sessionStorage.getItem('learningSet'))
        return new LearningSet(
            storageObject.setId,
            storageObject.answerWith,
            storageObject.caseSensitivity,
            storageObject.retypeWrongAnswers,
            storageObject.learnStarred,
            storageObject.learningQueue,
            storageObject.correctAnswers,
            storageObject.wrongAnswers
        )
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
        this.numberOfItems = this.setContent.items.length
        this.id = setId
    }

    getItem(index) {
        return [this.setContent.items[index].term, this.setContent.items[index].definition, this.setContent.items[index].isStarred]
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
        const newItem = {'term': term, 'definition': definition, 'isStarred': false}
        this.setContent.items.push(newItem)
        this.numberOfItems += 1
        Sets.saveToStorage()
        return this.numberOfItems - 1
    }

    modifyItem(index, newTerm, newDefinition) {
        this.setContent.items[index].term = newTerm
        this.setContent.items[index].definition = newDefinition
        Sets.saveToStorage()
    }

    removeItem(index) {
        this.setContent.items.splice(index, 1)
        this.numberOfItems -= 1
        Sets.saveToStorage()
    }

    getName() {
        return this.setContent.name
    }

    getDescription() {
        return this.setContent.description
    }

    starItem(index) {
        this.setContent.items[index].isStarred = true
        Sets.saveToStorage()
    }

    unstarItem(index) {
        this.setContent.items[index].isStarred = false
        Sets.saveToStorage()
    }

    * [Symbol.iterator]() {
        for (let i = 0; i < this.numberOfItems; i++) {
            yield this.getItem(i)
        }
    }
}

class LearningSet extends SetInstance {
    constructor(setId, answerWith, caseSensitivity, retypeWrongAnswers, learnStarred, learningQueue = null, correctAnswers, wrongAnswers) {
        super(setId)
        this.answerWith = answerWith
        this.caseSensitivity = caseSensitivity
        this.retypeWrongAnswers = retypeWrongAnswers
        this.learnStarred = learnStarred

        if (!learningQueue) {
            this.learningQueue = this.itemsToLearn()
            this.shuffleLearningQueue()
            this.correctAnswers = []
            this.wrongAnswers = []
        } else {
            this.learningQueue = learningQueue
            this.correctAnswers = correctAnswers
            this.wrongAnswers = wrongAnswers
        }

        this.currentItem = {}
    }

    static getItem(item) {
        return [item.question, item.answer]
    }

    itemsToLearn() {
        let filteredItems = this.setContent.items
        if (this.learnStarred) {
            filteredItems = filteredItems.filter(x => x.isStarred)
        }

        switch (this.answerWith) {
            case 'term':
                return filteredItems.map(x => ({'question': x.definition, 'answer': x.term}))
            case 'definition':
                return filteredItems.map(x => ({'question': x.term, 'answer': x.definition}))
        }
    }

    shuffleLearningQueue() {
        this.learningQueue = this.learningQueue
            .map(x => ({'value': x, 'random': Math.random()}))
            .sort((a, b) => a.random - b.random)
            .map(x => x.value)
    }

    numberOfRemainingItems() {
        return this.learningQueue.length
    }

    numberOfCorrectAnswers() {
        return this.correctAnswers.length
    }

    numberOfWrongAnswers() {
        return this.wrongAnswers.length
    }

    getNext() {
        this.currentItem = this.learningQueue.shift()
        return LearningSet.getItem(this.currentItem)
    }

    appendCorrect() {
        this.correctAnswers.push(this.currentItem)
    }

    appendWrong() {
        this.wrongAnswers.push(this.currentItem)
    }

    validateAnswer(answer) {
        let expectedAnswer = this.currentItem.answer
        if (!this.caseSensitivity) {
            expectedAnswer.toLowerCase()
            answer = answer.toLowerCase()
        }
        const isValid = answer.trim() === expectedAnswer.trim()
        if (isValid) {
            this.appendCorrect()
        } else {
            this.appendWrong()
        }
        return isValid
    }

    saveToStorage() {
        const storageObject = {
            'setId': this.id,
            'answerWith': this.answerWith,
            'caseSensitivity': this.caseSensitivity,
            'retypeWrongAnswers': this.retypeWrongAnswers,
            'learnStarred': this.learnStarred,
            'learningQueue': this.learningQueue,
            'correctAnswers': this.correctAnswers,
            'wrongAnswers': this.wrongAnswers
        }
        sessionStorage.setItem('learningSet', JSON.stringify(storageObject))
    }
}