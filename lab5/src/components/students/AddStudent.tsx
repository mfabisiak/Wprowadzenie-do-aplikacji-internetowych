import type StudentEntry from "./StudentEntry.ts";
import {useState} from "react";
import Student from "./Student.ts";

function AddStudent({action}: { action: (student: StudentEntry) => void }) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [year, setYear] = useState('')


    function isDisabled() {
        return !(firstName && lastName && year)
    }

    function addStudent() {
        action(new Student(firstName, lastName, parseInt(year)));
        setFirstName('');
        setLastName('');
        setYear('');
    }

    return (
        <>
            <label>First name:
                <input
                    type={"text"}
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                />
            </label>

            <label>Last name:
                <input
                    type={"text"}
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                />
            </label>

            <label>Year:
                <input
                    type={"number"}
                    onChange={(e) => setYear(e.target.value)}
                    value={year}
                />
            </label>

            <button disabled={isDisabled()} onClick={addStudent}>Add
                student
            </button>
        </>
    );
}

export default AddStudent