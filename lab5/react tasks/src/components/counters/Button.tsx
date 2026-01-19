function Button({action}: { action: () => void }) {
    return (
        <button onClick={action}>Add</button>
    );
}

export default Button;