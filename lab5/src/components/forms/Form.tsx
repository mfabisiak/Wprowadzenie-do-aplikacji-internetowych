import {useState} from "react";

function Form() {
    const [textInput, setTextInput] = useState('');

    return (
        <>
            <input onChange={(e) => setTextInput(e.target.value)} type={"text"}/>
            <div>{textInput}</div>
        </>
    );
}

export default Form;