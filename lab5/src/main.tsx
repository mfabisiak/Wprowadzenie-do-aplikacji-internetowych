import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Koszyk from "./components/Koszyk.tsx";
import Produkt from "./components/Produkt.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Koszyk>
        <Produkt nazwa='Jabłka'/>
    </Koszyk>
  </StrictMode>,
)
