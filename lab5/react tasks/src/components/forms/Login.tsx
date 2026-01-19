import {useState} from "react";

function Login() {
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [username, setUsername] = useState('');

    function isDisabled() {
        return !(password && repeatedPassword && username)
    }

    function handleLogin() {
        const message = password === repeatedPassword
            ? `${username} logged in correctly.` : 'Passwords don\'t match.';

        alert(message);
    }


    return (
        <>
            <label>Username:
                <input type={"text"} onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <label>Password:
                <input type={"text"} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <label>Repeat password:
                <input type={"text"}
                       onChange={(e) => setRepeatedPassword(e.target.value)}/>
            </label>
            <button disabled={isDisabled()} onClick={() => handleLogin()}>Log in</button>

        </>
    );
}

export default Login;