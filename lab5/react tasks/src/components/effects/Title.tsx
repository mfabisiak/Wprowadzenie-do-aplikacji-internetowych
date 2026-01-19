import {useEffect, useState} from "react";

function Title() {
    const [title, setTitle] = useState('');

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <label>Title:
            <input
                type={"text"}
                onChange={(e) => setTitle(e.target.value)}
            />
        </label>
    );
}

export default Title