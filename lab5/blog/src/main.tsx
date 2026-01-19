import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Welcome from './components/Welcome.tsx';
import AddArticle from './components/AddArticle.tsx';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<Welcome/>}/>
                <Route path={'add'} element={<AddArticle/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
