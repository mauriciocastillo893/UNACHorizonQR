import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion2_1.css';
import Swal from 'sweetalert2'
import { matchRoutes, useLocation, useNavigate } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion2_1() {
    const queryParams = new URLSearchParams(location.search);
    const matricula = queryParams.get("matricula") || "";
    const [dataUser, setDataUser] = useState([])
    const [asistenciaAlumno, setAsistenciaAlumno] = useState(0);
    const [minutosAlumno, setMinutosAlumno] = useState(0);
    const [chooseSelect, setChooseSelect] = useState(true);
    const cargando = "Cargando...";

    useEffect(() =>{
        window.scrollTo(0, 0);
        // console.log(matricula)
        peticionGet()
    }, []);

    const navigate = useNavigate();
    const buscarUsuarioCAA=()=>{
        navigate("/buscarUsuarioCAA");
    }

    const peticionGet=async()=>{
        const data = {
            matricula: matricula
        }
        if(matricula!=""){
            await axios.post('http://localhost:5000/findStudentByIDUser', data)
            .then(response => {
                if(response.data.status !== 0){
                    setDataUser(response.data.datos)
                }else{
                    console.log("Something was wrong", response.data)
                }
            })
            .catch(error => {
                console.error('Error en la solicitud POST:', error);
                errorAlert();
            });
        }else{
            mostrarAlerta()
        }
    }

    const enviarAsistencia = async () => {
        const data = {
            matricula: matricula,
            asistencias_a_agregar: asistenciaAlumno,
            minutos_a_agregar: minutosAlumno,
            simbolo: chooseSelect
        }
        if(asistenciaAlumno !==0 || minutosAlumno !== 0)
            await axios.post('http://localhost:5000/agregarAsistencias', data)
            .then(response => {
                if(response.data.status == '0'){
                    mostrarAlerta();
                } else if(response.data.status > '1'){
                    somethingWentWrong(response.data.mensaje)
                }else{
                    successAlert();
                    setAsistenciaAlumno(0);
                    setMinutosAlumno(0);
                    peticionGet()
                }
            })
            .catch(error => {
                console.error('Error en la solicitud POST:', error);
                errorAlert();
            });
        else{
            errorAlertNumVacio();
        }
    };

    const switchData=()=>{
        if(chooseSelect)
            setChooseSelect(false)
        else
            setChooseSelect(true)
    }
    
    const somethingWentWrong = (type) => {
        Swal.fire({
            title: "ALGO NO FUE COMO SE ESPERABA",
            html: `<div class='bold-text600'>${(type).toUpperCase()}</div>`,
            icon: "error",
            position: 'top-end',
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

    const mostrarAlerta = () => {
            Swal.fire({
                title: "NO EXISTE LA MATRICULA",
                html: `<div class='bold-text600'>${(matricula!="") ? "LA MATRICULA SELECCIONADA NO ESTÁ REGISTRADA." :
                    "NO PODEMOS BUSCAR UNA MATRICULA VACÍA, DATOS INCOMPLETOS."} VAMOS A REGRESARTE A UNA PÁGINA ATRÁS.</div>`,
                position: 'top-end',
                icon: "error",
                iconColor:" #D92D2D",
                background: "#262626",
                color: "#BAC2C9",
                toast: true,
                timerProgressBar: true,
                timer: 10000,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
                confirmButtonText: "<div class='bold-confirm-exit'>ACEPTAR</div>",
                confirmButtonColor: "#BAC2C9",
            }).then(() => {
                    buscarUsuarioCAA(); // Llama a la función buscarUsuarioCAA si se hace clic en "ACEPTAR"
            });
    }

    const successAlert = () => {
        Swal.fire({
            title: "CAMBIOS GUARDADOS",
            html: "<div class='bold-text600'>LA(S) ASISTENCIA(S) O EL/LOS MINUTO(S) FUERON AGREGADOS CORRECTAMENTE</div>",
            icon: "success",
            position: 'top-end',
            iconColor:" #4CAF50",
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
            confirmButtonColor: "#4CAF50",
        })
    }

    const errorAlert = () => {
        Swal.fire({
            title: "ALGO SALIÓ MAL",
            html: "<div class='bold-text600'>PARECE QUE ALGO NO FUE COMO SE ESPERABA. SI PERSISTE ESTE ERROR, REPORTELO EN SU PRONTITUD.</div>",
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

    const errorAlertNumVacio = () => {
        Swal.fire({
            title: "DATOS INCOMPLETOS",
            html: "<div class='bold-text600'>DEBES PONER AL MENOS <strong>UN DATO</strong> EN ALGÚN CUADRO PARA ACTUALIZAR LA INFORMACIÓN</div>",
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

    return (
    <div className="prs2_1-main">
        <FirstPartMain 
            title="Añadir asistencias a usuarios"
            subtitle="Añadir manualmente a usuarios la asistencia"/>
        <div className="prs2_1-second-part">
            <div className="prs2_1-nombre-usu"><p className="prs2_1_p">Nombre del usuario</p></div>
            <input 
                        className="prs2_1-mostrar-nombre notallowed"
                        type="text" 
                        value={(dataUser.length > 0) ?
                            `${dataUser[0].nombre || 'NO SE ENCONTRÓ'} ${dataUser[0].apellido_materno || ''} ${dataUser[0].apellido_paterno || ''}` : cargando}
                        readOnly
            ></input>
                <div className="prs2_1-asis-tot"><p className="prs2_1_p" >Asistencias Totales</p></div>
                <input 
                        className="prs_2_1_i i1 notallowed"
                        type="number" 
                        min="0"
                        value={(dataUser.length > 0) ? dataUser[0].asistencias : 0}
                        disabled={true}
                        placeholder='0'
                ></input>
                <div className="prs2_1-min-tot"><p className="prs2_1_p" >Minutos Totales</p></div>
                <input 
                        className="prs_2_1_i i4 notallowed"
                        type="number" 
                        min="0"
                        value={(dataUser.length > 0) ? dataUser[0].minutos_totales : 0}
                        disabled={true}
                        placeholder='0'
                ></input>
                <div className="prs2_1-asis-anadir">{(chooseSelect) 
                    ? <p className="prs2_1_p">Asistencias a añadir (+)</p> 
                    : <p className="prs2_1_p">Asistencias a restar (-)</p>}</div>
                <input 
                        className={(dataUser.length > 0) ? "prs_2_1_i i2" : "prs_2_1_i i2 notallowed"}
                        type="number" 
                        min="0"
                        value={asistenciaAlumno}
                        placeholder='0'
                        disabled={(!dataUser.length > 0)}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (inputValue === "") {
                                setAsistenciaAlumno(""); // Deja el campo vacío
                            } else {
                                const parsedValue = parseFloat(inputValue);
                                if (!isNaN(parsedValue) && parsedValue >= 0) {
                                    setAsistenciaAlumno(Math.round(parsedValue));
                                }
                            }
                        }}
                ></input>
                <div className="prs2_1-min-anadir">{(chooseSelect) 
                    ? <p className="prs2_1_p">Min. a añadir (+)</p>
                    : <p className="prs2_1_p">Min. a restar (-)</p>}</div>
                <input 
                        className={(dataUser.length > 0) ? "prs_2_1_i i3" : "prs_2_1_i i3 notallowed"}
                        type="number"
                        min="0"
                        value={minutosAlumno}
                        disabled={(!dataUser.length > 0)}
                        placeholder='0'
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (inputValue === "") {
                                setMinutosAlumno(""); // Deja el campo vacío
                            } else {
                                const parsedValue = parseFloat(inputValue);
                                if (!isNaN(parsedValue) && parsedValue >= 0) {
                                    setMinutosAlumno(Math.round(parsedValue));
                                }
                            }
                        }}
                ></input>
            <div className="prs2_1-bottons">
                <div className={(dataUser.length > 0) ? "prs2_1-fondo-boton" : "prs2_1-fondo-boton-disabled"}>
                    <button className={(dataUser.length > 0) ? "prs2_1-botton hoverable" : "prs2_1-botton-disabled not-allowed"} disabled={(!dataUser.length > 0)} onClick={() => {enviarAsistencia();}}>Enviar Modificacion</button>
                </div>
                <div className={(dataUser.length > 0) ? "prs2_1-fondo-boton" : "prs2_1-fondo-boton-disabled"}>
                    <button className={(dataUser.length > 0) ? "prs2_1-botton hoverable" : "prs2_1-botton-disabled not-allowed"} disabled={(!dataUser.length > 0)} onClick={() => {switchData();}}>
                        {(chooseSelect) 
                        ? <p>Cambiar a RESTAR</p>
                        : <p>Cambiar a SUMAR</p>}
                        </button>
                </div>
                <div className={(dataUser.length > 0) ? "prs2_1-fondo-boton" : "prs2_1-fondo-boton-disabled"}>
                    <button className={(dataUser.length > 0) ? "prs2_1-botton hoverable" : "prs2_1-botton-disabled not-allowed"} disabled={(!dataUser.length > 0)} onClick={() => {setAsistenciaAlumno(0); setMinutosAlumno(0);}}>Borrar</button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default BodyPRSeccion2_1;
