import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion2_1.css';
import Swal from 'sweetalert2'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion2_1() {
    const location = useLocation();
    const { matricula } = location.state || {};

    const [dataAlumno, setDataAlumno] = useState({
        nombre: '',
        apellido_materno: '',
        apellido_paterno: '',
        asistencias: 0,
        mensaje: '',
    });
    const [id, setId] = useState(0);
    const [asistenciaAlumno, setAsistenciaAlumno] = useState(0);
    const [minutosAlumno, setMinutosAlumno] = useState(0);
    const [status, setStatus] = useState("1");
    const cargando = "Cargando...";

    const data = {
        id: id,
        asistencias: asistenciaAlumno,
        minutos_totales: minutosAlumno
    };

    useEffect(() =>{
        obtenerNombreAsistencia();
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();

    const buscarUsuarioCAA=()=>{
        navigate("/buscarUsuarioCAA");
        // return <BodyPRSeccion2_1 matricula={matricula}/>;
    }

    const obtenerNombreAsistencia = async () => {
        // Realizar la solicitud POST con la matrícula
        axios.post("http://localhost:5000/buscarMatricula", { matricula })
            .then(response => {
                // console.log(response.data)
                if(response.data.status == '0'){
                    mostrarAlerta();
                    setStatus("1");
                }if(response.data.status == '-1'){
                    mostrarAlerta2();
                    setStatus("1");
                }else{
                    console.log("Datos del alumno:", response.data);
                    setId(response.data.id);
                    setDataAlumno(response.data);
                    setStatus("2");
                }
                
            })
            .catch(error => {
                console.error(error);
                mostrarAlerta();
            });
    }

    const enviarAsistencia = async () => {
        if(asistenciaAlumno || minutosAlumno !== 0)
            axios.post('http://localhost:5000/addAsistencias', data)
            .then(response => {
                // console.log("Respuesta del servidor:", response.data);
                if(response.data.status == '0'){
                    mostrarAlerta();
                }else{
                    successAlert();
                    obtenerNombreAsistencia();
                    setAsistenciaAlumno(0);
                    setMinutosAlumno(0);
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
    

    const mostrarAlerta = () => {
            Swal.fire({
                title: "NO EXISTE LA MATRICULA",
                // text: "FALTA UN CAMPO POR LLENAR",
                html: "<div class='bold-text'>LA MATRICULA SELECCIONADA NO ESTÁ REGISTRADA</div>",
                icon: "info",
                confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
                confirmButtonColor: '#262626',
                footer: "<b>PRUEBE CON OTRO USUARIO, LO REGRESAREMOS A LA SECCION DE BUSQUEDA<b>",
                allowOutsideClick: false, // Evitar clic fuera del SweetAlert
                allowEscapeKey: false, // Evitar cerrar con la tecla Escape
            }).then((result) => {
                if (result.isConfirmed) {
                    buscarUsuarioCAA(); // Llama a la función buscarUsuarioCAA si se hace clic en "ACEPTAR"
                }
            });
    }

    const mostrarAlerta2 = () => {
        Swal.fire({
            title: "NO HAY DATOS",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>¿ESTAS INTENTANDO ENTRAR SIN UNA LLAVE?</div>",
            icon: "info",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            allowOutsideClick: false,
            footer: "<b>SERÁS REDIRECCIONADO PARA BUSCAR A QUIEN AÑADIR UNA ASISTENCIA<b>"
            // timer: 1000,
        }).then((result) => {
            if (result.isConfirmed) {
                buscarUsuarioCAA(); // Llama a la función buscarUsuarioCAA si se hace clic en "ACEPTAR"
            }
        });
    }

    const successAlert = () => {
        Swal.fire({
            title: "¡ASISTENCIA GUARDADA!",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>LA ASISTENCIA Y LOS MINUTOS FUERON AGREGADOS CORRECTAMENTE</div>",
            icon: "success",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            // footer: "<b>CENTRO DE AUTOACCESO<b>"
            // timer: 1000,
        })
    }

    const errorAlert = () => {
        Swal.fire({
            title: "ALGO SALIÓ MAL",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>PARECE QUE ALGO NO FUE COMO SE ESPERABA</div>",
            icon: "error",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            footer: "<b>LO SENTIMOS. SI ESTE ERROR PERSISTE, POR FAVOR REPORTE ESTE PROBLEMA LO MÁS PRONTO CON SOPORTE TECNICO<b>"
            // timer: 1000,
        })
    }

    const errorAlertNumVacio = () => {
        Swal.fire({
            title: "DATOS INCOMPLETOS",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>DEBES PONER AL MENOS UN DATO EN ALGUN CUADRO PARA ACTUALIZAR LA INFORMACIÓN</div>",
            icon: "error",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            // timer: 1000,
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
                        // value={matricula || ""}
                        // readOnly
                        value={
                            status
                                ? `${dataAlumno.nombre || ''} ${dataAlumno.apellido_materno || ''} ${dataAlumno.apellido_paterno || ''}`
                                : cargando
                        }
                        readOnly
            ></input>
            <div className="prs2_1-anadir-cosas-usu">
                <div className="prs2_1-asis-tot"><p className="prs2_1_p" >Asistencias Totales</p></div>
                <input 
                        className="prs_2_1_i notallowed"
                        type="number" 
                        min="0"
                        value={dataAlumno.asistencias}
                        readOnly
                        disabled={true}
                        placeholder='0'
                ></input>
                <div className="prs2_1-asis-anadir"><p className="prs2_1_p">Asistencias para añadir</p></div>
                <input 
                        className={(status=="2") ? "prs_2_1_i" : "prs_2_1_i notallowed"}
                        type="number" 
                        min="0"
                        value={asistenciaAlumno}
                        placeholder='0'
                        disabled={(status=="2") ? false : true}
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
                <div className="prs2_1-min-anadir"><p className="prs2_1_p">Minutos a añadir</p></div>
                <input 
                        className={(status=="2") ? "prs_2_1_i" : "prs_2_1_i notallowed"}
                        type="number" inputmode="none"y
                        min="0"
                        value={minutosAlumno}
                        disabled={(status=="2") ? false : true}
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
            </div>
            <div className="prs2_1-bottons">Cambiar a:
            <button className={(status=="2") ? "prs2_1-botton hoverable" : "prs2_1_b-disabled"} disabled={(status=="2") ? false : true} onClick={() => {enviarAsistencia();}}><p>RESTAR</p></button>
                    <button className={(status=="2") ? "prs2_1-botton hoverable" : "prs2_1_b-disabled"} disabled={(status=="2") ? false : true} onClick={() => {enviarAsistencia();}}>Enviar Modificacion</button>
                </div>
        </div>
    </div>
    );
}

export default BodyPRSeccion2_1;
