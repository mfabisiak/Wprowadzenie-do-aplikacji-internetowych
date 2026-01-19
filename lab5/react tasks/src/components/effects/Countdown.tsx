import {useEffect, useState} from "react";

function Countdown() {
    const [counter, setCounter] = useState(15);

    const [buttonText, setButtonText] = useState('START');

    useEffect(() => {
        let intervalId: number | null = null;

        function startCountdown() {
            intervalId = setInterval(() => {
                setCounter(prevCounter => prevCounter - 0.1)
            }, 100);
        }

        function stopCountdown() {
            clearInterval(intervalId!);
            intervalId = null;
        }


        if (buttonText === 'START') stopCountdown();
        else startCountdown();
        return () => stopCountdown()

    }, [buttonText]);

    return (
        <>
            <p>Time remaining: {counter.toFixed(1)}s</p>
            <button
                onClick={() => setButtonText(prevText =>
                    prevText === 'START' ? 'STOP' : 'START')}>{buttonText}
            </button>
        </>
    );
}

export default Countdown
