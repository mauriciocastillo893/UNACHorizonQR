import React, { useEffect, useState } from "react";
import '../style-sheets/BodyPRSeccion3.css';
import { useLocation } from "react-router-dom";
import Fecha from './Clock/Fecha'
import Hora from './Clock/Hora'
import FirstPartMain from "./Tools/FirstPartMain";
import axios from 'axios';
import Swal from "sweetalert2";

function BodyPRSeccion3() {
    const location = useLocation();
    const [usuariosEmergencia, setUsuariosEmergencia] = useState([])
    const postUsuariosEmergencia = (location.state?.usuariosEmergencia == null) ? [] : Object.keys(location.state?.usuariosEmergencia).toString();
    const todosLosUsuariosEmergencia = location.state?.statusTodosLosUsuarios;
    const [totalUsuarios, setTotalUsuarios] = useState([])
    const [matriculasSeleccionadas, setMatriculasSeleccionadas] = useState("")
    const [reason, setReason] = useState("")

    const peticionGet = async () => {
        await axios.get("http://localhost:5000/estanEnAutoAccesoAhora")
            .then(response => {
                if (response.data.status !== '0') {
                    setTotalUsuarios(response.data.matriculas)
                } else {
                    console.log(response.data);
                    setTotalUsuarios([])
                }
            }).catch(error => {
                console.log(error);
            })
    }

    const enviarTodosLosUsuariosSalida = async () => {
        // print(todosLosUsuariosEmergencia)
        console.log(todosLosUsuariosEmergencia)
        if(todosLosUsuariosEmergencia){
            await axios.get("http://localhost:5000/allUsers")
                .then(response => {
                    if (response.data.status !== '0') {
                        // console.log(response.data.users)
                        const usuariosEmergenciaFilter = response.data.users
                            .filter(usuario => usuario.se_encuentra_ahora===1)
                        setUsuariosEmergencia(usuariosEmergenciaFilter)
                        // console.log(usuariosEmergenciaFilter)
                        const matriculas = response.data.users
                            .filter(usuario => usuario.se_encuentra_ahora===1)
                            .map(matriculaObj => matriculaObj.matricula);
                        setMatriculasSeleccionadas(matriculas);
                        // console.log(matriculas)
                    } else {
                        console.log(response.data.matriculas);
                    }
                }).catch(error => {
                    console.log(error);
            })
        }
    }

    const alumnosBuscar = async () => {
        const data = {
            matriculas: postUsuariosEmergencia
        }
        await axios.post("http://localhost:5000/currentStudentsSelected", data)
            .then(response => {
                if (response.data.status !== '0') {
                    setUsuariosEmergencia(response.data.matriculas)
                    const matriculas = response.data.matriculas.map(matriculaObj => matriculaObj.matricula);
                    setMatriculasSeleccionadas(matriculas);
                } else {
                    console.log(response.data.matriculas);
                }
            }).catch(error => {
                console.log(error);
            })
    }

    const registrarAsistenciaMultiples = async(tipo_de_salida, hora) => {
        if(reason==""){
            Swal.fire({
                title: "DEBES ELEGIR UNA RAZÓN",
                html: "<div class='bold-text600'>DEBES ELEGIR EL MOTIVO DE LA SALIDA DE EMERGENCIA</div>",
                position: 'top-end',
                icon: "error",
                iconColor:" #D92D2D",
                background: "#262626",
                color: "#BAC2C9",
                toast: true,
                timerProgressBar: true,
                timer: 5000,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
                confirmButtonText: "<div class='bold-confirm-exit'>ACEPTAR</div>",
                confirmButtonColor: "#D92D2D",
            })
        }
        
        if(usuariosEmergencia.length>0 && reason!=""){
            const data = {
                matriculas: matriculasSeleccionadas,
                tipo_de_salida: tipo_de_salida,
                hora: hora
            };
            await axios.post('http://localhost:5000/agregarMultiplesSalidas', data)
                .then(response => {
                    if (response.data.status !== '0') {
                        setUsuariosEmergencia([])
                        setReason("OPCIÓN NO SELECCIONADA")
                        Swal.fire({
                            title: "SALIDA GUARDADA",
                            html: `<div class='bold-text600'>SE GUARDÓ LA SALIDA A LOS USUARIOS A LAS<br><strong>${(<Hora />).type()}</strong><br><br>RAZÓN:<br><strong>${reason}</strong></div>`,
                            position: 'top-end',
                            icon: "success",
                            iconColor:" #149da7",
                            background: "#262626",
                            color: "#BAC2C9",
                            toast: true,
                            timerProgressBar: true,
                            timer: 5000,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            },
                            confirmButtonText: "<div class='bold-confirm-register'>ACEPTAR</div>",
                            confirmButtonColor: "#149da7",
                        })
                        peticionGet()
                    } else {
                        Swal.fire({
                            title: "ALGUNAS SALIDAS NO FUERON GUARDADAS",
                            html: "HUBO ALGÚN MOMENTO DE GUARDAR LA SALIDA PARA ALGUNOS ALUMNOS, VUELVE A INTENTAR",
                            position: 'top-end',
                            icon: "warning",
                            iconColor:" #D92D2D",
                            background: "#262626",
                            color: "#BAC2C9",
                            toast: true,
                            timerProgressBar: true,
                            timer: 5000,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            },
                            confirmButtonText: "<div class='bold-confirm-exit'>ACEPTAR</div>",
                            confirmButtonColor: "#D92D2D",
                        })
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    useEffect(() => {
        peticionGet()
            .then(() => {
                console.log(usuariosEmergencia)
            })
        if(todosLosUsuariosEmergencia){
            enviarTodosLosUsuariosSalida()
        }else{
            alumnosBuscar()
        }
        window.scrollTo(0, 0);
    },[]);

    return (
    <div className="prs3-main">
        <FirstPartMain 
            title="Marcar salida de emergencia"
            subtitle="Salida de emergencia"/>
        <div className="prs3-second-part">
            <div className="prs3-right">
                <div className="prs3-title2">
                    <p>Cantidad de usuarios a salir</p>
                </div>
                <div className="prs3-subtitle2">
                <p className="prs3-p">
                    {usuariosEmergencia.length.toString().padStart(2, '0')}{" "}{
                    usuariosEmergencia.length === 1 ? "PERSONA" : "PERSONAS"} DE{" "}
                    {totalUsuarios.length.toString().padStart(2, '0')} DEL TOTAL
                    </p>
                </div>
                <div className="prs3-title2">
                    <p>Usuarios con pase de salida</p>
                </div>
                <div className="prs3-subtitle3">
                {usuariosEmergencia.length == 0 ? (
                    <p>NO HAY USUARIOS SELECCIONADOS.</p>
                ) : (
                    <ul className="prs3-ul">
                        {Object.values(usuariosEmergencia).map(student => (
                            <li key={student.matricula}>
                                [{student.matricula}] {(student.nombre + " " + student.apellido_materno + " " + student.apellido_paterno).toUpperCase()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
                <div className="prs3-title2">
                    <p>Hora de salida</p>
                </div>
                <div className="prs3-subtitle2">
                    <p className="prs3-p">
                        <Fecha /> <Hora />
                    </p>
                </div>
            </div>
            <div className="prs3-left">
                <div className="prs3-title2">
                    <p>Razón</p>
                </div>
                <div className={(usuariosEmergencia.length!==0) ? "prs3-subtitle4" : "prs3-subtitle4-d"}>
                    <button value="TEMBLOR/TERREMOTO" onClick={() => setReason("TEMBLOR/TERREMOTO")} disabled={usuariosEmergencia.length == 0}>TEMBLOR/TERREMOTO</button>
                    <button value="EMERGENCIA MEDICA" onClick={() => setReason("EMERGENCIA MEDICA")} disabled={usuariosEmergencia.length == 0}>EMERGENCIA MEDICA</button>
                    <button value="SIMULACROS" onClick={() => setReason("SIMULACROS")} disabled={usuariosEmergencia.length == 0}>SIMULACROS</button>
                    <button value="RAZONES PERSONALES" onClick={() => setReason("RAZONES PERSONALES")} disabled={usuariosEmergencia.length == 0}>RAZONES PERSONALES</button>
                </div>
                <div className="prs3-title2">
                    <p>RAZÓN SELECCIONADA</p>
                </div>
                <div className="prs3-subtitle2 font-size2em">
                    <p className="prs3-p">
                        {(reason!="") ? reason : "OPCIÓN NO SELECCIONADA"}
                    </p>
                </div>
                <div className="prs3-bottons">
                    <button className={(usuariosEmergencia.length!==0) ? "prs3-botton2 hoverable" : "prs3_b-disabled"} onClick={() => {console.log(usuariosEmergencia); console.log(reason); registrarAsistenciaMultiples(reason, (<Hora />).type());}} disabled={usuariosEmergencia.length == 0}>SALIDA A TODOS</button>
                </div>      
            </div>
        </div>

    </div>
    );
}

export default BodyPRSeccion3;
