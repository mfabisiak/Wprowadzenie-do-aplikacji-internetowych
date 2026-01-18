import Student from "./Student.ts";
import {useState} from "react";
import type StudentEntry from "./StudentEntry.ts";
import AddStudent from "./AddStudent.tsx";

function StudentManager() {
    const [students, setStudents] = useState([
        new Student('Józef', 'Stary', 1554),
        new Student('Ser', 'Serowy', 2020),
        new Student('Karol', 'Łysy', 1995)
    ] as StudentEntry[])

    function addStudent(student: StudentEntry) {
        setStudents([...students, student])
    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>Year</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student) =>
                    <tr>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.year}</td>
                    </tr>
                )}
                </tbody>
            </table>
            <AddStudent action={addStudent}/>
        </>
    );
}

export default StudentManager

