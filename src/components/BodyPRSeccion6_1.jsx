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
    const [whatIReading, setWhatIReading] = useState(""); // Cambiado para usar estado
    const navigate = useNavigate();

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
                    // getNewIDUser(response.data.more_data[1])
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
        }else if(newIDUser!=""){
            const data = {
                matricula: newIDUser,
                matriculas: usuariosFusionar,
                newName: inputValueName,
                newFirstLastName: inputFirstLastName,
                newSecondLastName: inputSecondLastName,
                minutosTotales: minutosTotales,
                asistenciasTotales: asistenciasTotales,
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
                <div className="prs6_1-right">
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
                                        [{"  " + user.matricula + "  "}] {(user.nombre + " " + user.apellido_materno + " " + user.apellido_paterno).toUpperCase()} [{"  " + user.minutos_totales + "min" + "  "}]
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
                        <p>MINUTOS TOTALES A FUSIONAR</p>
                    </div>
                    <div className="prs6_1-subtitle2">
                        <p className="prs6_1-p">
                            {(usuariosFusionar != "") ? minutosTotales : "NO HAY INFORMACIÓN"}{(usuariosFusionar != "") ? (minutosTotales == 1) ? " MINUTO" : " MINUTOS" : ""} {(usuariosFusionar != "") ? "TOTALES" : ""}
                        </p>
                    </div>

                </div>
                <div className="prs6_1-left">
                    <div className="prs6_1-title2">
                        <p>NOMBRE CORRECTO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4" : "prs6_1-subtitle4-d"}>
                        <input
                            className="prs6_1-searcher-input"
                            type="search"
                            placeholder='Escriba el nombre correcto'
                            value={inputValueName}
                            onChange={handleNewName}
                            onFocus={()=>{setWhatIReading("Leyendo nombre")}}
                            onBlur={()=>{setWhatIReading("")}}
                        >
                        </input>
                    </div>
                    <div className="prs6_1-title2">
                        <p>APELLIDO MATERNO CORRECTO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4" : "prs6_1-subtitle4-d"}>
                        <input
                            className="prs6_1-searcher-input"
                            type="search"
                            placeholder='Escriba el apellido materno correcto'
                            value={inputFirstLastName}
                            onChange={handleNewFirstLastName}
                            onFocus={()=>{setWhatIReading("Leyendo apellido materno")}}
                            onBlur={()=>{setWhatIReading("")}}
                        >
                        </input>
                    </div>
                    <div className="prs6_1-title2">
                        <p>APELLIDO PARTERNO CORRECTO</p>
                    </div>
                    <div className={(usuariosFusionar.length !== 0) ? "prs6_1-subtitle4" : "prs6_1-subtitle4-d"}>
                        <input
                            className="prs6_1-searcher-input"
                            type="search"
                            placeholder='Escriba el apellido paterno correcto'
                            value={inputSecondLastName}
                            onChange={handleNewSecondLastName}
                            onFocus={()=>{setWhatIReading("Leyendo apellido paterno")}}
                            onBlur={()=>{setWhatIReading("")}}
                        >
                        </input>
                    </div>
                    <div className={whatIReading!="" ? `waiting_info` : `waiting_info wi-none`}>{whatIReading!="" ? whatIReading : ''}</div>
                    <div className="prs6_1-bottons">
                        <button className={(usuariosFusionar.length !== 0) ? "prs6_1-botton2 hoverable" : "prs3_b-disabled"} onClick={() => { console.log(usuariosFusionar); sendFork(); }} disabled={usuariosFusionar.length == 0}>BIFURCAR</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BodyPRSeccion6_1;
