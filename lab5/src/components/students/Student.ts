import type StudentEntry from "./StudentEntry.ts";

export default class Student implements StudentEntry {
    readonly year: number;
    readonly lastName: string;
    readonly firstName: string;

    constructor(firstName: string, lastName: string, year: number) {
        this.firstName = firstName
        this.lastName = lastName
        this.year = year
    }

}