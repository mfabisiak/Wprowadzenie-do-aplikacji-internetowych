import {useState} from "react";
import Button from "./Button.tsx";

function NewCounter() {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <p>Counter: {counter}</p>
            <Button action={() => setCounter(counter + 1)}/>
        </div>
    );
}

export default NewCounter;