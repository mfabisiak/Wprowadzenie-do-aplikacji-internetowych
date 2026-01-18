import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Password from "./components/forms/Password.tsx";
import Login from "./components/forms/Login.tsx";
import Ternary from "./components/other/Ternary.tsx";
import Update from "./components/other/Update.tsx";
import Students from "./components/students/Students.tsx";
import StudentManager from "./components/students/StudentManager.tsx";
import Counter from "./components/effects/Counter.tsx";
import Title from "./components/effects/Title.tsx";
import Countdown from "./components/effects/Countdown.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/*<Cart>*/}
        {/*    <Product name='Jabłka'/>*/}
        {/*    <Product name='Gruszki'/>*/}
        {/*    <Product name='Marchewki'/>*/}
        {/*    <Product name='Serowy ser'/>*/}
        {/*    <Product name='Ziemniaki'/>*/}
        {/*</Cart>*/}
        {/*<NewCart products={['jajka', 'pomidory', 'ogórki', 'maliny', 'jagody']}/>*/}
        {/*<Counter/>*/}
        {/*<NewCounter/>*/}
        {/*<Form/>*/}
        <Password/>
        <Login/>
        <Ternary/>
        <Update/>
        <Students/>
        <StudentManager/>
        <Counter/>
        <Title/>
        <Countdown/>
    </StrictMode>,
);
