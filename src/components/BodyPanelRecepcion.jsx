import React from "react";
import '../style-sheets/BodyPanelRecepcion.css'

function BodyPanelRecepcion() {

    const fecha = new Date();

    const secciones = [
        { titulo: "ASISTENCIA VISITANTES", subtitulo: "BUSCAR A UN VISITANTE PARA SU ASISTENCIA", boton: "BUSCAR VISITANTE" },
        { titulo: "BUSCAR USUARIOS", subtitulo: "BUSCAR USUARIOS DENTRO DEL CENTRO DE AUTOACCESO", boton: "BUSCAR USUARIO CAA" },
        { titulo: "CORREGIR USUARIOS", subtitulo: "UNIR A USUARIOS IGUALES PERO MAL ESCRITOS", boton: "IR AL ACOPLADOR" },
        { titulo: "ASISTENCIA A USUARIOS", subtitulo: "DAR ASISTENCIA A USUARIOS DE AUTOACCESO", boton: "DAR ASISTENCIA" },
        { titulo: "SALIDA DE EMERGENCIA", subtitulo: "DAR SALIDA DE EMERGENCIA A TODOS", boton: "SALIDA DE EMERGENCIA" },
        ];
    
    return (
    <div className="main">
        <div className="first-part">
            <div className="titleS1">
                <p>PANEL DE RECEPCIÓN</p>
            </div>
            <div className="date">
                <p>{fecha.toDateString()}</p>
            </div>
            <div className="subtitleS1">
                <p>Seleccione una sección para navegar</p>
            </div>
        </div>
        <div className="second-part">
        {secciones.map((seccion, index) => (
            <div className="container-card" key={index}>
                <div className="item-title">
                    <p>{seccion.titulo}</p>
                </div>
                <div className={`subtitlePR ${index === 4 ? "subtitlePR-exit" : ""}`}>
                    <p>{seccion.subtitulo}</p>
                </div>
                <div className="botton-subtitle">
                <button className={`botton-sub hoverable ${index === 4 ? "bs-exit " : ""}${index === 4 ? "bse-hover" : ""}`}>{seccion.boton}</button>
                </div>
            </div>
        ))}
        </div>
    </div>
    );
}

export default BodyPanelRecepcion;