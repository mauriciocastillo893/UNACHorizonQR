import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../style-sheets/BodyPRSeccion1_1.css';
import Swal from 'sweetalert2'
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion1_1() {

    const [nombre, setNombre] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [newIDUser, setNewIDUser] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0);
        document.addEventListener('keydown', handleKeyDown);
        getNewIDUser()
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const sendNewVisitant =async()=>{
        const data = {
            nombre: nombre,
            apellidoMaterno: apellidoMaterno,
            apellidoPaterno: apellidoPaterno,
            genero: selectedCheckbox,
            matriculaNueva: newIDUser
        }
        console.log("New IDUser", newIDUser)
        if(newIDUser){
            await axios.post('http://localhost:5000/agregarNuevoVisitante', data)
                .then(response=>{
                    if(response.data.status==="1"){
                        console.log("response", response)
                        console.log("response.data", response.data)
                        ShowAssistanceAlert("REGISTRO EXITOSO", `${response.data.message}`, "success", "entrada")
                        setTimeout(()=>{
                            navigate("/buscarVisitante")
                        }, 1000)
                    }else{
                        ShowAssistanceAlert("REGISTRO INCONCLUSO", `<strong>DETALLES:</strong><br>${response.data.message}`, "error", "entrada")
                    }
                }).catch(error=>{
                    ShowAssistanceAlert("ERROR INESPERADO", `NO SE PUDO AGREGAR AL VISITANTE <br><br><strong>DETALLES</strong><br>${error}`, "error", "entrada")
                    console.log("Error when we were trying to send a new visitant", error)
                })
        }else{
            ShowAssistanceAlert("MATRICULA NO CARGADA", `NO SE PUDO AGREGAR AL VISITANTE <br><br><strong>DETALLES</strong><br>MATRICULA VACIA, VUELVA A INTENTAR`, "error", "entrada")
        }
    }
    
    const getNewIDUser = async () => {
        await axios.post("http://localhost:5000/generateNewIDUser", {matriculas: ""})
            .then(response => {
                if (response.data.status !== '0') {
                    console.log(response.data);
                    setNewIDUser(response.data.IDUser)
                    ShowAssistanceAlert("MATRICULA ENCONTRADA", "NUEVA MATRICULA DISPONIBLE: <br><strong>" + response.data.IDUser, "success", "entrada")
                } else {
                    ShowAssistanceAlert("ERROR INESPERADO", "UN ERROR CRÍTICO HA OCURRIDO, FAVOR DE REPORTAR ESTE ERROR", "error", "entrada")
                    console.log(response.data);
                }
            }).catch(error => {
                ShowAssistanceAlert("ERROR INESPERADO", `UN ERROR CRÍTICO HA OCURRIDO, FAVOR DE REPORTAR ESTE ERROR <br><br><strong>DETALLES</strong><br>${error}`, "error", "entrada")
                console.log(error);
            })
    }

    const ShowAssistanceAlert= (tittle, message, status, type) => {
        Swal.fire({
            title: `${tittle.toUpperCase()}`,
            html: `<div class='bold-text'>${message.toUpperCase()}</div>`,
            position: 'top-end',
            icon: `${(status)}`,
            iconColor: 
                `${(status=="success")
                ? (type=="entrada" ? "#4CAF50" : "#149da7")
                : ("#D92D2D")}`,
            background: "#262626",
            color: "#BAC2C9",
            toast: true,
            timerProgressBar: true,
            timer: 5000,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            confirmButtonText: 
                `${(status=="success") 
                ? (type=="entrada" ? "<div class='bold-confirm-register'>ACEPTAR</div>" : "<div class='bold-confirm-register-salida'>ACEPTAR</div>")
                : ("<div class='bold-confirm-exit'>ACEPTAR</div>")}`,
            confirmButtonColor: 
                `${(status=="success") 
                ? (type=="entrada" ? "#4CAF50" : "#149da7")
                : ("#D92D2D")}`
        })
    }

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
        setSelectedCheckbox(null);
    }

    const handleCheckboxChange = (checkboxIndex) => {
        if (selectedCheckbox === checkboxIndex) {
            setSelectedCheckbox(null);
        } else {
            setSelectedCheckbox(checkboxIndex);
        }
    };

    const sendSelectedValue = () => {
        console.log("nombre", nombre.length)
        console.log("apellido materno", apellidoMaterno.length)
        console.log("apellido paterno", apellidoPaterno.length)
        console.log("checkbox", selectedCheckbox==null ? 0 : selectedCheckbox.length)
        if(!nombre.length){
            ShowAssistanceAlert("NOMBRE VACÍO", "DEBES ESCRIBIR UN <strong>NOMBRE</strong> ANTES DE ENVIAR LOS DATOS", "error", "entrada")
        }else if(!apellidoMaterno.length){
            ShowAssistanceAlert("APELLIDO MATERNO VACÍO", "DEBES ESCRIBIR UN <strong>APELLIDO MATERNO</strong> ANTES DE ENVIAR LOS DATOS", "error", "entrada")
        }else if(!apellidoPaterno.length){
            ShowAssistanceAlert("APELLIDO PATERNO VACÍO", "DEBES ELEGIR UN <strong>APELLIDO PATERNO</strong> ANTES DE ENVIAR LOS DATOS", "error", "entrada")
        }else if(selectedCheckbox==null ? true : false){
            ShowAssistanceAlert("GÉNERO VACÍO", "DEBES ELEGIR UN <strong>GÉNERO</strong> ANTES DE ENVIAR LOS DATOS", "error", "entrada")
        }else{
            if (selectedCheckbox !== null) {
                const selectedValue = selectedCheckbox;
                console.log("Selected value:", selectedValue);
                handleClearClick()
                sendNewVisitant()
            }else{
                console.log("No value selected")
            }
        }
    };

    return (
        <div className="prs1_1-main">
            <FirstPartMain
                title="Añadiendo a un visitante"
                subtitle="Llene los datos siguientes del visitante" />
            <div className="prs1_1-square">
                <div className="prs1_1-square-title t1">Nombre(s)</div>
                <input
                    className="prs1_1-comment-input s1"
                    type="text"
                    value={nombre}
                    placeholder='NOMBRE(S) DE LA PERSONA'
                    onChange={(e) => setNombre(e.target.value)}
                ></input>

                <div className="prs1_1-square-title t2">Apellido Materno</div>
                <input
                    className="prs1_1-comment-input s2"
                    type="text"
                    value={apellidoMaterno}
                    placeholder='APELLIDO MATERNO DE LA PERSONA'
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                ></input>

                <div className="prs1_1-square-title t3">Apellido Paterno</div>
                <input
                    className="prs1_1-comment-input s3"
                    type="text"
                    value={apellidoPaterno}
                    placeholder="APELLIDO PATERNO DE LA PERSONA"
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                ></input>

                <div className="prs1_1-square-title t5">Matricula nueva</div>
                <input
                    className="prs1_1-comment-input s5 not-allowed"
                    type="text"
                    value={newIDUser}
                    placeholder="NO HAY INFORMACIÓN"
                    readOnly
                ></input>

                <div className="prs1_1-square-title t4">Género</div>
                <div className="prs1_1-comment-input s4">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === "M"}
                            onChange={() => handleCheckboxChange("M")}
                        />
                        Mujer
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === "H"}
                            onChange={() => handleCheckboxChange("H")}
                        />
                        Hombre
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === "N-D"}
                            onChange={() => handleCheckboxChange("N-D")}
                        />
                        Prefiero no decirlo
                    </label>
                    
                </div>
                <div className="prs1_1-bottons">
                    <div className={(newIDUser.length > 0) ? "prs1_1-fondo-boton" : "prs1_1-fondo-boton-disabled"}>
                        <button className={(newIDUser.length > 0) ? "prs1_1-b-ma  hoverable" : "prs1_1-b-ma -disabled not-allowed"} disabled={(!newIDUser.length > 0)} onClick={() => {sendSelectedValue()}}>Agregar</button>
                    </div>
                    <div className={(newIDUser.length > 0) ? "prs1_1-fondo-boton" : "prs1_1-fondo-boton-disabled"}>
                        <button className={(newIDUser.length > 0) ? "prs1_1-b-ma  hoverable" : "prs1_1-b-ma -disabled not-allowed"} disabled={(!newIDUser.length > 0)} onClick={() => {handleClearClick()}}>Limpiar Opciones</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyPRSeccion1_1;
