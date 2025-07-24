import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from "react-router-dom";
 
// import './index.css'
import App from './App.jsx'
import { DarkModeProvider } from './DarkModeProvider/DarkModeContext.jsx'

createRoot(document.getElementById('root')).render(

 
<>
<DarkModeProvider>
    <App />

    </DarkModeProvider>
</>

)
