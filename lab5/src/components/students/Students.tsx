import type StudentEntry from "./StudentEntry.ts";
import Student from "./Student.ts";

function Students() {
    const students: StudentEntry[] = [
        new Student('Józef', 'Stary', 1554),
        new Student('Ser', 'Serowy', 2020),
        new Student('Karol', 'Łysy', 1995)
    ];

    return (
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
    );


}

export default Students