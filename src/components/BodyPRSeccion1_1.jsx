import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style-sheets/BodyPRSeccion1_1.css';
import Swal from 'sweetalert2'
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion1_1() {

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

    const handleClearClick = e => {
        setNombre("");
        setApellidoMaterno("");
        setApellidoPaterno("");
        setSelectedCheckbox("");
    }

    useEffect(() => {
        mostrarAlerta();
        window.scrollTo(0, 0);
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
            <FirstPartMain
                title="Añadiendo a un visitante"
                subtitle="Llene los datos siguientes del visitante" />
            <div className="prs1_1-square">
                <div className="prs1_1-square-title">Nombre(s)</div>
                <input
                    className="prs1_1-comment-input"
                    type="text"
                    value={nombre}
                    placeholder='NOMBRE(S) DE LA PERSONA'
                    onChange={(e) => setNombre(e.target.value)}
                ></input>

                <div className="prs1_1-square-title">Apellido Materno</div>
                <input
                    className="prs1_1-comment-input"
                    type="text"
                    value={apellidoMaterno}
                    placeholder='APELLIDO MATERNO DE LA PERSONA'
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                ></input>

                <div className="prs1_1-square-title">Apellido Paterno</div>
                <input
                    className="prs1_1-comment-input"
                    type="text"
                    value={apellidoPaterno}
                    placeholder="APELLIDO PATERNO DE LA PERSONA"
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                ></input>

                <div className="prs1_1-square-title">Género</div>
                <div className="prs1_1-comment-input">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === 0}
                            onChange={() => handleCheckboxChange(0)}
                        />
                        Mujer
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === 1}
                            onChange={() => handleCheckboxChange(1)}
                        />
                        Hombre
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === 2}
                            onChange={() => handleCheckboxChange(2)}
                        />
                        Prefiero no decirlo
                    </label>
                    
                </div>
                <div className="prs1_1-bottons">
                    <button className="prs1_1-botton hoverable" onClick={() => { sendSelectedValue(); }}>AÑADIR NUEVO VISITANTE</button>
                    <button className="prs1_1-botton delete hoverable" onClick={() => { handleClearClick(); }}>LIMPIAR TABLA</button>
                </div>
            </div>
        </div>
    );
}

export default BodyPRSeccion1_1;
