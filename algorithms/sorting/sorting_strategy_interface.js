export class SortingStrategy {
    #LESSER_FLAG = -1;
    #EQUAL_FLAG = 0;
    #HIGHER_FLAG = 1;

    #compare_fun;

    constructor(compare_fun) {
        this.#compare_fun = compare_fun;
    }

    get LESSER_FLAG() {
        return this.#LESSER_FLAG;
    }

    get EQUAL_FLAG() {
        return this.#EQUAL_FLAG;
    }

    get HIGHER_FLAG() {
        return this.#HIGHER_FLAG;
    }

    get compare_fun() {
        return this.#compare_fun;
    }

    sort() { throw new Error("Not implemented"); };
}