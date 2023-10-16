import React, { useEffect, useState } from "react";
import '../style-sheets/BodyPRSeccion6_1.css';
import { useLocation, useNavigate } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";
import axios from 'axios';
import Swal from "sweetalert2";

function BodyPRSeccion6_1() {
    const location = useLocation();
    const postUsuariosFusionar = (location.state?.usuariosFusionar == null) ? [] : Object.keys(location.state?.usuariosFusionar).toString();
    const [usuariosFusionar, setUsuariosFusionar] = useState([])
    const [minutosTotales, setMinutosTotales] = useState(0)
    const [asistenciasTotales, setAsistenciasTotales] = useState(0)
    const [newIDUser, setNewIDUser] = useState("")
    const [inputValueName, setInputValueName] = useState("")
    const [inputFirstLastName, setInputFirstLastName] = useState("")
    const [inputSecondLastName, setInputSecondLastName] = useState("")
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [activePersonCheckbox, setActivePersonCheckbox] = useState(true);
    const navigate = useNavigate();

    const handleCheckboxChange = (checkboxIndex) => {
        if (selectedCheckbox === checkboxIndex) {
            setSelectedCheckbox(null);
        } else {
            setSelectedCheckbox(checkboxIndex);
        }
    };

    const handleCheckboxChangePersonActive = (checkboxIndex) => {
        if (activePersonCheckbox === checkboxIndex) {
            setActivePersonCheckbox(false);
        } else {
            setActivePersonCheckbox(checkboxIndex);
        }
    };

    const handleNewName =(e)=>{
        setInputValueName(e.target.value);
    }

    const handleNewFirstLastName =(e)=>{
        setInputFirstLastName(e.target.value);
    }

    const handleNewSecondLastName =(e)=>{
        setInputSecondLastName(e.target.value);
    }

    const alumnosBuscar = async () => {
        const data = {
            matriculas: postUsuariosFusionar
        }
        await axios.post("http://localhost:5000/usersToFork", data)
            .then(response => {
                if (response.data.status !== '0') {
                    setUsuariosFusionar(response.data.matriculas)
                    getTotalMinutes(response.data.matriculas)
                    getTotalAssistance(response.data.matriculas)
                } else {
                    ShowSweetAlert("NO HAY NADA QUE MOSTRAR", "OCURRIÓ UN ERROR AL MOMENTO DE CARGAR LOS DATOS", "error")
                    console.log(response.data);
                }
            }).catch(error => {
                console.log(error);
            })
    }
    
    const getNewIDUser = async () => {
        await axios.post("http://localhost:5000/generateNewIDUser", {matriculas: postUsuariosFusionar})
            .then(response => {
                if (response.data.status !== '0') {
                    console.log(postUsuariosFusionar.length)
                    console.log(response.data);
                    if(postUsuariosFusionar.length!==10){
                        setNewIDUser(response.data.IDUser)
                        ShowSweetAlert("MATRICULA ENCONTRADA", "NUEVA MATRICULA DISPONIBLE: <br><strong>" + response.data.IDUser, "success")
                    }else{
                        setNewIDUser(response.data.IDUser)
                        ShowSweetAlert("MATRICULA SIN MODIFICACIÓN", "LA MATRICULA SE MANTIENE IGUAL: <br><strong>NO HAY BIFURCACIÓN", "success")
                    }
                } else {
                    ShowSweetAlert("ERROR INESPERADO", "UN ERROR CRÍTICO HA OCURRIDO, FAVOR DE REPORTAR ESTE ERROR", "error")
                    console.log(response.data);
                }
            }).catch(error => {
                console.log(error);
            })
    }

    const sendFork = async () => {
        if(inputValueName==""){
            ShowSweetAlert("NOMBRE A CAMBIAR VACÍO", "DEBE ELEGIR EL <strong>NUEVO NOMBRE</strong> A CAMBIAR ANTES DE ENVIAR", "error")
        }else if(inputFirstLastName==""){
            ShowSweetAlert("NOMBRE A CAMBIAR VACÍO", "DEBE ELEGIR EL <strong>NUEVO APELLIDO MATERNO</strong> A CAMBIAR ANTES DE ENVIAR", "error")
        }else if(inputSecondLastName==""){
            ShowSweetAlert("NOMBRE A CAMBIAR VACÍO", "DEBE ELEGIR EL <strong>NUEVO APELLIDO PATERNO</strong> A CAMBIAR ANTES DE ENVIAR", "error")
        }else if(selectedCheckbox==null){
            ShowSweetAlert("NOMBRE A CAMBIAR VACÍO", "DEBE ELEGIR EL <strong>GENERO</strong> A CAMBIAR ANTES DE ENVIAR", "error")
        }else if(newIDUser!=""){
            const data = {
                matricula: newIDUser,
                matriculas: usuariosFusionar,
                newName: inputValueName,
                newFirstLastName: inputFirstLastName,
                newSecondLastName: inputSecondLastName,
                minutosTotales: minutosTotales,
                asistenciasTotales: asistenciasTotales,
                genero: selectedCheckbox,
                activo: activePersonCheckbox,
            }
            await axios.post("http://localhost:5000/sendFork", data)
                .then(response => {
                    if (response.data.status !== '0') {
                        if(usuariosFusionar.length == 1){
                            ShowSweetAlert("MATRICULA ACTUALIZADA", "DATOS DE MATRICULA ACTUALIZADOS CORRECTAMENTE", "success")
                        }else{
                            ShowSweetAlert(response.data.message.toUpperCase(), response.data.IDUser, "success")
                        }
                        console.log("Forked", response.data)
                        navigate("/acoplarUsuario")
                    } else {
                        ShowSweetAlert("OCURRIÓ UN ERROR", "ERROR INESPERADO, <br><br><strong>DETALLES:</strong><br>" + error, "error")
                        console.log("Occured an error: ",response.data);
                    }
                }).catch(error => {
                    console.log(error)
                    ShowSweetAlert("ERROR INESPERADO", "SI PERSIGUE ESTE ERROR, FAVOR DE REPORTARLO, <br><br><strong>DETALLES:</strong><br>" + error, "error")
                })
        }else{
            ShowSweetAlert("MATRICULA NO CARGADA", "NO SE HA ENVIADO NADA, POR FAVOR VUELVA A INTENTAR", "error")
        }
    }

    const ShowSweetAlert = (tittle, message, status) => {
        Swal.fire({
            title: `${tittle.toUpperCase()}`,
            html: `<div class='bold-text'>${message.toUpperCase()}</div>`,
            position: 'top-end',
            icon: `${status}`,
            iconColor: `${status=="success" ? "#4CAF50" : "#D92D2D"}`,
            background: "#262626",
            color: "#BAC2C9",
            toast: true,
            timerProgressBar: true,
            timer: 5000,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            confirmButtonText: `${status=="success" ? "<div class='bold-confirm-register'>ACEPTAR</div>" : "<div class='bold-confirm-exit'>ACEPTAR</div>" }`,
            confirmButtonColor: `${status=="success" ? "#4CAF50" : "#D92D2D"}`
        })
    }

    const getTotalMinutes = (minutes) => {
        let minutosMap = 0
        minutosMap = minutes.reduce((acumulador, entrada_actual) => {
            return acumulador + parseInt(minutosMap) + (parseInt(entrada_actual.minutos_totales) || 0)
        }, 0)
        setMinutosTotales(minutosMap)
        console.log(minutosMap)
    }

    const getTotalAssistance = (assistance) => {
        let assistanceMap = 0
        assistanceMap = assistance.reduce((acumulador, entrada_actual) => {
            return acumulador + parseInt(assistanceMap) + (parseInt(entrada_actual.asistencias) || 0)
        }, 0)
        setAsistenciasTotales(assistanceMap)
        console.log(assistanceMap)
    }

    useEffect(() => {
        alumnosBuscar()
        getNewIDUser()
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="prs6_1-main">
            <FirstPartMain
                title="Unir visitantes a uno"
                subtitle="Correción del nombre y fusión de horas y minutos" />
            <div className="prs6_1-second-part">
                <div className="prs6_1-left">
                    <div className="prs6_1-title2">
                        <p>Cantidad de visitantes a fusionar</p>
                    </div>
                    <div className="prs6_1-subtitle2">
                        <p className="prs6_1-p">
                            {usuariosFusionar.length.toString().padStart(2, '0')}{" "}{
                                usuariosFusionar.length === 1 ? "PERSONA" : "PERSONAS"} {"A FUSIONAR"}
                        </p>
                    </div>
                    <div className="prs6_1-title2">
                        <p>USUARIOS A FUSIONAR</p>
                    </div>
                    <div className="prs6_1-subtitle3">
                        {usuariosFusionar.length == 0 ? (
                            <p>NO HAY USUARIOS SELECCIONADOS.</p>
                        ) : (
                            <ul className="prs6_1-ul">
                                {Object.values(usuariosFusionar).map(user => (
                                    <li key={user.matricula}>
                                        {`[${"  " + user.matricula + "  "}]`} {(user.nombre + " " + user.apellido_materno + " " + user.apellido_paterno).toUpperCase()}
                                        <p>{("\u00A0".repeat(20)) + "REGISTRO: " + "[ " + user.minutos_totales + " min" + " ] " + " [" + user.asistencias + " asist." + "]"}</p>
                                        <p>{"\u00A0".repeat(1)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="prs6_1-title2">
                        <p>MATRICULA DESPUÉS DE FUSIÓN</p>
                    </div>
                    <div className="prs6_1-subtitle2">
                        <p className="prs6_1-p">
                            {newIDUser || "NO HAY INFORMACIÓN".toUpperCase()}
                        </p>
                    </div>
                    <div className="prs6_1-title2">
                        <p>MIN. Y ASIST. TOTALES A FUSIONAR</p>
                    </div>
                    <div className="prs6_1-subtitle2">
                        <p className="prs6_1-p">
                            {(usuariosFusionar != "") ? minutosTotales || asistenciasTotales : "NO HAY INFORMACIÓN"}{(usuariosFusionar != "") ? (minutosTotales == 1) ? " MINUTO" : " MINUTOS" : ""} {"Y " + asistenciasTotales} {(asistenciasTotales==1) ? "ASISTENCIA" : "ASISTENCIAS"}
                        </p>
                    </div>

                </div>
                <div className="prs6_1-right">
                    <div className="prs6_1-title2 name">
                        <p>NOMBRE CORRECTO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4_1 name-input" : "prs6_1-subtitle4_1-d name-input"}>
                        <input
                            className="prs6_1-searcher-input"
                            type="search"
                            placeholder='Rellene este campo'
                            value={inputValueName}
                            onChange={handleNewName}
                        >
                        </input>
                    </div>
                    <div className="prs6_1-title2 first-lastname">
                        <p>APELLIDO MATERNO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4_1 first-lastname-input" : "prs6_1-subtitle4_1-d first-lastname-input"}>
                        <input
                            className="prs6_1-searcher-input"
                            type="search"
                            placeholder='Rellene este campo'
                            value={inputFirstLastName}
                            onChange={handleNewFirstLastName}
                        >
                        </input>
                    </div>
                    <div className="prs6_1-title2 second-lastname">
                        <p>APELLIDO PATERNO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4_1 second-lastname-input" : "prs6_1-subtitle4_1-d second-lastname-input"}>
                        <input
                            className="prs6_1-searcher-input"
                            type="search"
                            placeholder='Rellene este campo'
                            value={inputSecondLastName}
                            onChange={handleNewSecondLastName}
                        >
                        </input>
                    </div>
                    <div className="prs6_1-title2 genero">
                        <p>GÉNERO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4_1 genero-input" : "prs6_1-subtitle4_1-d genero-input"}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === "M"}
                            onChange={() => handleCheckboxChange("M")}
                        />
                        M
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === "H"}
                            onChange={() => handleCheckboxChange("H")}
                        />
                        H
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCheckbox === "N-D"}
                            onChange={() => handleCheckboxChange("N-D")}
                        />
                        NO DEFINIDO
                    </label>
                    </div>
                    <div className="prs6_1-title2 persona-activa">
                        <p>USUARIO ACTIVO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4_1 persona-activa-input" : "prs6_1-subtitle4_1-d persona-activa-input"}>
                    <label>
                        <input
                            type="checkbox"
                            checked={activePersonCheckbox}
                            onChange={() => handleCheckboxChangePersonActive(true)}
                        />
                        ACTIVO
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            checked={!activePersonCheckbox}
                            onChange={() => handleCheckboxChangePersonActive(true)}
                        />
                        NO ACTIVO
                    </label>
                    </div>
                    
                    <div className="prs6_1-bottons">
                        <div className={(newIDUser.length > 0) ? "prs6_1-fondo-boton" : "prs6_1-fondo-boton-disabled"}>
                            <button className={(usuariosFusionar.length !== 0) ? "prs6_1-b-ma hoverable" : "prs6_1-b-ma-disabled"} onClick={() => { console.log(usuariosFusionar); sendFork(); }} disabled={usuariosFusionar.length == 0}>BIFURCAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyPRSeccion6_1;
