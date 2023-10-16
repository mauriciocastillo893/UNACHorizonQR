import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import Hora from './Clock/Hora'
import '../style-sheets/BodyPRSeccion1.css';
import Swal from 'sweetalert2'
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion1() {
    const [usuarios, setUsuarios] = useState([]);
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [statusFecha, setStatusFecha] = useState(false);
    const [statusAsistencias, setStatusAsistencias] = useState(false);
    const [status, setStatus] = useState("online");
    const totalUsuarios = Object.keys(usuarios).length
    const navigate = useNavigate();
    const [indexActualTabla, setIndexActualTabla] = useState(0);


    const peticionGet = async () => {
        await axios.get("http://localhost:5000/allVisitors")
            .then(response => {
                console.log(response.data.users);
                const activeUsers = response.data.users.filter(user => user.activo == 1)
                setUsuarios(activeUsers);
                setTablaUsuarios(activeUsers);
                // console.log(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    const handleChange = e => {
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const handleClearClick = e => {
        setBusqueda("");
    }

    const filtrar = (terminoBusqueda) => {
        var resultadoBusqueda = tablaUsuarios.filter((elemento) => {
            if ((
                elemento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                elemento.apellido_materno.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                elemento.apellido_paterno.toLowerCase().includes(terminoBusqueda.toLowerCase()))
            ) {
                return true; // Devuelve true si el elemento coincide con la búsqueda
            }
            return false; // Si no coincide, devuelve false
        });
        console.log(resultadoBusqueda)
        setUsuarios(resultadoBusqueda);

        if (resultadoBusqueda.length) {
            setStatus(`${resultadoBusqueda.length} encontrados`);
            if (resultadoBusqueda.length === 1) {
                setStatus(`${resultadoBusqueda.length} encontrado`);
            }
        } else {
            setStatus("no encontrado");
        }
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

    const registrarAsistEntrOrSal = async (matricula, tipoAsistencia, hora, index) => {
        const data = {
            matricula: matricula,
            hora: hora,
        };
        axios.post((tipoAsistencia.toLowerCase() === "entrada"
            ? 'http://localhost:5000/agregarEntrada'
            : 'http://localhost:5000/agregarSalida'
        ), data)
            .then(response => {
                if (response.data.status != '0') {
                    console.log(response.data)
                    peticionGet();
                    if(tipoAsistencia.toLowerCase()=="entrada")
                        ShowAssistanceAlert("ENTRADA GUARDADA", `<strong>Entrada guardada</strong> correctamente a la hora: <br><strong>${hora}</strong>`, "success", "entrada")
                    else if(tipoAsistencia.toLowerCase()=="salida")
                        ShowAssistanceAlert("SALIDA GUARDADA", `<strong>Salida guardada</strong> correctamente a la hora: <br><strong>${hora}</strong>`, "success", "salida")
                    if(tipoAsistencia.toLowerCase() === "salida"){
                        setStatusFecha(true)
                        setTimeout(() => { setStatusFecha(false) }, 4800)
                    }else{
                        setStatusAsistencias(true)
                        setTimeout(() => { setStatusAsistencias(false) }, 4800)
                    }
                    setIndexActualTabla(index)
                } else {
                    // console.log(response.data)
                    if(tipoAsistencia.toLowerCase()=="entrada")
                        ShowAssistanceAlert("ENTRADA NO GUARDADA", `<strong>DETALLES: </strong><br>${response.data.mensaje}`, "error", undefined)
                    else if(tipoAsistencia.toLowerCase()=="salida")
                        ShowAssistanceAlert("SALIDA NO GUARDADA", `<strong>DETALLES: </strong><br>${response.data.mensaje}`, "error", undefined)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const registrarAsistencia = (matricula, hora, tipoAsistencia, index) => {
        Swal.fire({
            title:
                `${(tipoAsistencia.toLowerCase() === "entrada") ? '¿REGISTRAR ENTRADA?'
                    : '¿REGISTRAR SALIDA?'}`
            ,
            html:
                `${(tipoAsistencia.toLowerCase() === "entrada") ? "<div class='bold-text'>ESTAR POR PONER LA <strong>ASISTENCIA DE ENTRADA.</strong></div>"
                    : "<div class='bold-text'>ESTAS POR PONER LA <strong>ASISTENCIA DE SALIDA.</strong></div>"}`
            ,
            icon: 'question',
            iconColor: (tipoAsistencia.toLowerCase()=="entrada" ? "#4CAF50" : "#149da7"),
            showCancelButton: true,
            confirmButtonText:
                `${(tipoAsistencia.toLowerCase() === "entrada") ? "<div class='bold-confirm-register'>DAR ENTRADA</div>"
                    : "<div class='bold-confirm-register-salida'>DAR SALIDA</div>"}`,
            confirmButtonColor:
                `${(tipoAsistencia.toLowerCase() === "entrada") ? "#4CAF50"
                    : "#149da7"}`,
            cancelButtonText: "<div class='bold-confirm-exit'>CANCELAR</div>",
            cancelButtonColor: "#D92D2D",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                registrarAsistEntrOrSal(matricula, tipoAsistencia, hora, index)
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
            if (tipoAsistencia.toLowerCase()=="entrada")
                ShowAssistanceAlert("OPERACIÓN CANCELADA", `<strong>DETALLES: </strong><br>La operación para guardar la <strong>asistencia de entrada</strong> ha sido cancelada`, "error", undefined)
            else if (tipoAsistencia.toLowerCase()=="salida")
                ShowAssistanceAlert("OPERACIÓN CANCELADA", `<strong>DETALLES: </strong><br>La operación para guardar la <strong>asistencia de salida</strong> ha sido cancelada`, "error", undefined)
            }
        })
    }

    const registerNewVisitor=()=>{
        navigate("/agregarNuevoVisitante")
    }

    useEffect(() => {
        peticionGet();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (busqueda === "") {
            setStatus("online");
        }
    }, [busqueda])

    return (
        <div className="prs1-main">
            <FirstPartMain
                title="Buscar visitante"
                subtitle="Ingrese el nombre del visitante para buscarlo" />
            <div className="prs1-searcher">
                <div className="prs1-first-s">
                    <div className="prs1-title-first"><p>NOMBRE DEL VISITANTE</p></div>
                    <input
                        className="prs1-searcher-input"
                        type="search"
                        value={busqueda}
                        placeholder='Búsqueda por nombre'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className="prs1-second-s">
                    <div className="prs1-title-second"><p>ESTATUS</p></div>
                    <p className="prs1-subtitle-second">{status}</p>
                </div>
            </div>
                <div id="prs1-table-headboard">RESULTADOS (VISITANTES ACTIVOS)</div>
                {(totalUsuarios) ? <div id="prs1-tabla-all">
                    <table id='prs1-table'>
                        <thead id='prs1-th'>
                            <tr id='prs1-tr'>
                                <th className='prs1-th-1'>MATRICULA</th>
                                <th className='prs1-th-2'>NOMBRE COMPLETO</th>
                                <th className='prs1-th-3'>GÉNERO</th>
                                <th className='prs1-th-4'>ASISTENCIAS TOTALES</th>
                                <th className='prs1-th-5'>ÚLTIMA VISITA</th>
                                <th className='prs1-th-6'>REGISTRAR ENTRADA</th>
                                <th className='prs1-th-7'>REGISTRAR SALIDA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios && usuarios
                                .map((visitor, index) => (
                                    <tr key={visitor.id} className="prs1-tr-body">
                                        <td className='prs1-td'>{visitor.matricula.toUpperCase()}</td>
                                        <td className='prs1-td'>{(visitor.nombre + " " + visitor.apellido_materno + " " + visitor.apellido_paterno).toUpperCase()}</td>
                                        <td className='prs1-td'>{visitor.genero}</td>
                                        <td className={(statusAsistencias && index === indexActualTabla) ? "prs1-td brillar" : "prs1-td"}>{visitor.asistencias}</td>
                                        <td className={(statusFecha && index === indexActualTabla) ? "prs1-td brillar" : "prs1-td"}>{visitor.ultima_salida_fecha} <br></br><strong>{visitor.ultima_salida_hora}</strong></td>
                                        <td className='prs1-td'>
                                            <div className={(visitor.se_encuentra_ahora == 0) ? "fondo-boton" : "fondo-boton-disabled"}>
                                                <button className={(visitor.se_encuentra_ahora == 0) ? "b-ma" : "b-ma-disabled not-allowed"} onClick={() => { registrarAsistencia(visitor.matricula, (<Hora />).type(), "entrada", index); }} disabled={visitor.se_encuentra_ahora == 1}>| Marcar</button>
                                            </div>
                                        </td>
                                        <td className='prs1-td'>
                                            <div className={(visitor.se_encuentra_ahora == 1) ? "fondo-boton" : "fondo-boton-disabled"}>
                                                <button className={(visitor.se_encuentra_ahora == 1) ? "b-ma" : "b-ma-disabled not-allowed"} onClick={() => { registrarAsistencia(visitor.matricula, (<Hora />).type(), "salida", index); }} disabled={visitor.se_encuentra_ahora == 0}>| Marcar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))  
                            }
                        </tbody>

                    </table>
                </div> : <div className="prs2-no-datos"><p className="prs2-p">NO HAY DATOS PARA MOSTRAR</p></div>}

            <div className="prs1-bottons">
                <button className="prs1-botton hoverable" onClick={ ()=> { registerNewVisitor() } }>AÑADIR NUEVO VISITANTE</button>
                <button className="prs1-botton delete hoverable" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion1;
