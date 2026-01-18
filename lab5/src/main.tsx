import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Cart from "./components/Cart.tsx";
import Product from "./components/Product.tsx";
import NewCart from "./components/NewCart.tsx";
import Counter from "./components/counters/Counter.tsx";
import NewCounter from "./components/counters/NewCounter.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Cart>
            <Product name='Jabłka'/>
            <Product name='Gruszki'/>
            <Product name='Marchewki'/>
            <Product name='Serowy ser'/>
            <Product name='Ziemniaki'/>
        </Cart>
        <NewCart products={['jajka', 'pomidory', 'ogórki', 'maliny', 'jagody']}/>
        <Counter/>
        <NewCounter/>
    </StrictMode>,
)
