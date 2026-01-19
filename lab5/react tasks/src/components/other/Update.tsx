import {useState} from "react";

function Update({name = 'pomidor', price = 50}: { name?: string, price?: number }) {
    const [product, setProduct] = useState({name: name, price: price});


    return (
        <>
            <p>Currently {product.name} costs {product.price}.</p>
            <button onClick={() => setProduct({...product, price: 100})}>Change price</button>
        </>
    );

}

export default Update;