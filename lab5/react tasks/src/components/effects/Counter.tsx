import {useEffect, useState} from "react";

function Counter() {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        console.log('Hello World!');
    }, []);

    useEffect(() => {
        console.log(`Counter updated to ${counter}`);
    }, [counter]);

    return (
        <div>
            <p>Counter: {counter}</p>
            <button onClick={() => setCounter(counter + 1)}>Add</button>
        </div>
    );
}

export default Counter;