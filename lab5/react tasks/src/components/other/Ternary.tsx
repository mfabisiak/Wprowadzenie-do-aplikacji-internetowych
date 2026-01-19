function Ternary() {
    const a = true;
    const b = false;

    return (
        <>
            <div>Statement a is {a ? 'true' : 'false'}</div>
            <div>Statement b is {b ? 'true' : 'false'}</div>
        </>
    );
}

export default Ternary