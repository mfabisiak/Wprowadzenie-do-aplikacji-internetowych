import {useState} from "react";

function Password() {
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    function passwordMessage() {
        if (password === repeatedPassword && password == '') return 'Type password';
        if (password != repeatedPassword) return 'password != repeated password';
        return ''
    }

    return (
        <>
            <label>Password:
                <input type={"text"} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <label>Repeat password:
                <input type={"text"}
                       onChange={(e) => setRepeatedPassword(e.target.value)}/>
            </label>
            <p>{passwordMessage()}</p>

        </>
    );
}

export default Password