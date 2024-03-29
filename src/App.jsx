import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entrada from './pages/entrada';
import Salida from './pages/Salida';
import PanelRecepcion from "./pages/PanelRecepcion";
import PRSeccion1 from './pages/PRSeccion1';
import PRSeccion2 from './pages/PRseccion2';
import PRSeccion3 from './pages/PRSeccion3';
import PRSeccion7 from './pages/PRSeccion7';
import PRSeccion1_1 from './pages/PRSeccion1_1';
import PRSeccion2_1 from './pages/PRSeccion2_1';
import MiComponenteFuncional from "./components/Tools/MiComponenteFuncional";
import './style-sheets/App.css'
import NotFound from "./pages/NotFound";
import PRSeccion6 from "./pages/PRSeccion6";
import PRSeccion6_1 from "./pages/PRSeccion6_1";

function App() {
    return (  
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>}/>
                {/* MANTENIMIENTO */}
                <Route path="/entrada" element={<Entrada />}/>
                <Route path="/salida" element={<Salida />}/>
                {/* MANTENIMIENTO */}
                <Route path="/panelrecepcion" element={<PanelRecepcion />}/>
                <Route path='/buscarVisitante' element={<PRSeccion1 />}/>
                <Route path='/agregarNuevoVisitante' element={<PRSeccion1_1 />}/>
                <Route path='/buscarUsuarioCAA' element={<PRSeccion2 />}/>
                <Route path='/seccion21' element={<PRSeccion2_1 />}/>
                <Route path='/salidaEmergencia' element={<PRSeccion3 />}/>
                <Route path='/acoplarUsuario' element={<PRSeccion6 />}/>
                <Route path='/unirUsuarios' element={<PRSeccion6_1 />}/>
                <Route path='/usuarioAsistencia' element={<PRSeccion7 />}/>
                <Route path='/prueba1' element={<MiComponenteFuncional />}/>
                <Route path='*' element={<NotFound/>}/>
            </Routes>

        </BrowserRouter>  
    );
}

export default App;