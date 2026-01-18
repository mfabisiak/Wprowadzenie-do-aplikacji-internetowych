import type {ReactNode} from "react";

function Cart({children}: { children: ReactNode }) {
    return (
        <>
            <h1>Cart</h1>
            <div>{children}</div>
        </>
    );
}

export default Cart