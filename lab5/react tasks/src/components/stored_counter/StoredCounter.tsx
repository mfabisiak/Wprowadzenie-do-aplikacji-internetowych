import {useEffect, useState} from "react";

function StoredCounter() {
    const [counter, setCounter] = useState(parseInt(localStorage.getItem('StoredCounter') ?? '0'));

    useEffect(() => {
        localStorage.setItem('StoredCounter', counter.toString());
    }, [counter]);


    return (
        <div>
            <p>Counter: {counter}</p>
            <button onClick={() => setCounter(prevCounter => prevCounter + 1)}>Add</button>
        </div>
    );
}

export default StoredCounter;