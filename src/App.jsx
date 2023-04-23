import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entrada from './pages/entrada';
import Salida from './pages/Salida';
import PanelRecepcion from "./pages/PanelRecepcion";
import PRSeccion1 from './pages/PRSeccion1';
import PRSeccion2 from './pages/PRseccion2';
import PRSeccion3 from './pages/PRSeccion3';
import './style-sheets/App.css'

function App() {
    return (  
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>}/>
                <Route path="/entrada" element={<Entrada />}/>
                <Route path="/salida" element={<Salida />}/>
                <Route path="/panelrecepcion" element={<PanelRecepcion />}/>
                <Route path='/seccion1' element={<PRSeccion1 />}/>
                <Route path='/seccion2' element={<PRSeccion2 />}/>
                <Route path='/seccion3' element={<PRSeccion3 />}/>
            </Routes>

        </BrowserRouter>  
    );
}

export default App;