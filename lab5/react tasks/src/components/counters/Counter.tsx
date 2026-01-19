import {useState} from "react";

function Counter() {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <p>Counter: {counter}</p>
            <button onClick={() => setCounter(prevCounter => prevCounter + 1)}>Add</button>
        </div>
    );
}

export default Counter;