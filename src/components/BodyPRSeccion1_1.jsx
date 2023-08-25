import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style-sheets/BodyPRSeccion1_1.css';
import Swal from 'sweetalert2'

function BodyPRSeccion1_1() {
    // Fecha
    const fecha = new Date();

    const [nombre, setNombre] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendSelectedValue()
        } else if (event.ctrlKey && event.key === 'l') {
            event.preventDefault(); // Evita que se abra la ventana de búsqueda del navegador
            handleClearClick()
        }
    };

    const handleClearClick=e=>{
        setNombre("");
        setApellidoMaterno("");
        setApellidoPaterno("");
        setSelectedCheckbox("");
    }

    useEffect(() => {
        mostrarAlerta();
    }, [])

    const mostrarAlerta = () => {
        Swal.fire({
            title: "HA OCURRIDO UN PROBLEMA",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>NO HAN SIDO LLENADO TODOS LOS CAMPOS</div>",
            icon: "info",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            // footer: "<b>CENTRO DE AUTOACCESO<b>"
            // timer: 1000,
        })
    }

    const handleCheckboxChange = (checkboxIndex) => {
        if (selectedCheckbox === checkboxIndex) {
        setSelectedCheckbox(null);
        } else {
        setSelectedCheckbox(checkboxIndex);
        }
    };

    const sendSelectedValue = () => {
        // Enviar el valor del checkbox seleccionado a otro lugar de tu aplicación
        if (selectedCheckbox !== null) {
          const selectedValue = selectedCheckbox + 1; // Sumamos 1 al índice para obtener el valor deseado
          // Lógica para enviar selectedValue a donde lo necesitas
            console.log("Selected value:", selectedValue);
            handleClearClick()
        }
        };

    return (
    <div className="prs1_1-main">
        <div className="prs1_1-first-part">
            <div className="prs1_1-titleS1">
                <p>Añadiendo a un visitante</p>
            </div>
            <div className="prs1_1-date">
                <p>{fecha.toDateString()}</p>
            </div>
            <div className="prs1_1-subtitle">
                <p>Llene los datos siguientes del visitante</p>                
            </div>
        </div>
        <div className="prs1_1-square">
            <div className="prs1_1-square-title uno1_1"><p className="centered-text">Nombre(s)</p></div>
            <input 
                        className="prs1_1-comment-input iuno1_1"
                        type="text" 
                        value={nombre}
                        placeholder='NOMBRE(S) DE LA PERSONA'
                        onChange={(e) => setNombre(e.target.value)}
            ></input>
            <div className="prs1_1-square-title dos1_1"><p className="centered-text">Apellido Materno</p></div>
            <input 
                        className="prs1_1-comment-input idos1_1"
                        type="text" 
                        value={apellidoMaterno}
                        placeholder='APELLIDO MATERNO DE LA PERSONA'
                        onChange={(e) => setApellidoMaterno(e.target.value)}
            ></input>
            <div className="prs1_1-square-title tres1_1"><p className="centered-text">Apellido Paterno</p></div>
            <input 
                        className="prs1_1-comment-input itres1_1"
                        type="text" 
                        value={apellidoPaterno}
                        placeholder="APELLIDO PATERNO DE LA PERSONA"
                        onChange={(e) => setApellidoPaterno(e.target.value)}
            ></input>
            <div className="prs1_1-square-title cuatro1_1"><p className="centered-text">Género</p></div>
            <div className="prs1_1-comment-input icuatro1_1">
                <label>
                    <input
                    type="checkbox"
                    className="prs1_1-cb"
                    checked={selectedCheckbox === 0}
                    onChange={() => handleCheckboxChange(0)}
                    />
                    Mujer
                </label>

                <label>
                    <input
                    type="checkbox"
                    className="prs1_1-cb"
                    checked={selectedCheckbox === 1}
                    onChange={() => handleCheckboxChange(1)}
                    />
                    Hombre
                </label>

                <label>
                    <input
                    type="checkbox"
                    className="prs1_1-cb"
                    checked={selectedCheckbox === 2}
                    onChange={() => handleCheckboxChange(2)}
                    />
                    Prefiero no decirlo
                </label>
            </div>
            <div className="prs1_1-bottons">
                    <button className="prs1_1-botton hoverable" onClick={() => {sendSelectedValue();}}>AÑADIR NUEVO VISITANTE</button>
                    <button className="prs1_1-botton hoverable" onClick={() => {handleClearClick();}}>LIMPIAR</button>
            </div>
        </div>
    </div>
    );
}

export default BodyPRSeccion1_1;
