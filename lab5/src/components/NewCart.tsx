import Product from "./Product.tsx";

function NewCart({products}: { products: string[] }) {
    return (
        <>
            <h1>Better cart</h1>
            <div>
                {products.map((product) => <Product name={product}/>)}
            </div>
        </>
    );
}

export default NewCart;