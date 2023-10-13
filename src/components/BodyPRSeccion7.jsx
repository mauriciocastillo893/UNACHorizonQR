import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion7.css';
import Swal from 'sweetalert2'
import Hora from './Clock/Hora'
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion7() {
    // Objeto de usuarios
    const [usuarios, setUsuarios] = useState([]);
    // Tabla de objeto de usuarios
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    // Busqueda de nombre de usuarios
    const [busqueda, setBusqueda] = useState("");
    // Estatus de si se encontro o no el usuario
    const [status, setStatus] = useState("online");
    const totalUsuarios = Object.keys(usuarios).length
    const [statusFecha, setStatusFecha] = useState(false);
    const [statusAsistencias, setStatusAsistencias] = useState(false);
    const [indexActualTabla, setIndexActualTabla] = useState(0);


    const peticionGet = async () => {
        await axios.get("http://localhost:5000/todosLosUsuariosDelCAA")
            .then(response => {
                console.log(response.data.users);
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
            }).catch(error => {
                console.log(error);
                ShowAssistanceAlert("ERROR INESPERADO", "SI PERSIGUE ESTE ERROR, FAVOR DE REPORTARLO, <br><br><strong>DETALLES:</strong><br>" + error, "error", undefined)
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
            if (
                elemento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                elemento.apellido_materno.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                elemento.apellido_paterno.toLowerCase().includes(terminoBusqueda.toLowerCase())
            ) {
                return true; // Devuelve true si el elemento coincide con la búsqueda
            }
            return false; // Si no coincide, devuelve false
        });
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

    useEffect(() => {
        peticionGet()
        window.scrollTo(0, 0);
        if (busqueda === "") {
            setStatus("online");
        }
    }, []);

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

    return (
        <div className="prs7-main">
            <FirstPartMain
                title="BUSCAR USUARIO PARA ASISTENCIA"
                subtitle="Busque al usuario para darle una asistencia"
            />
            <div className="prs7-searcher">
                <div className="prs7-first-s">
                    <div className="prs7-title-first"><p>NOMBRE DEL USUARIO</p></div>
                    <input
                        className="prs7-searcher-input"
                        type="search"
                        value={busqueda}
                        placeholder='Búsqueda por nombre'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className="prs7-second-s">
                    <div className="prs7-title-second"><p>ESTATUS</p></div>
                    <p className="prs7-subtitle-second">{status}</p>
                </div>
            </div>
            <div id="prs7-table-headboard">RESULTADOS</div>
            {(totalUsuarios) ? <div id="prs7-tabla-all">
                <table id='prs7-table'>
                    <thead id='prs7-th'>
                        <tr id='prs7-tr'>
                            <th className='prs7-th-1'>NÚM</th>
                            <th className='prs7-th-2'>NOMBRE COMPLETO</th>
                            <th className='prs7-th-3'>GÉNERO</th>
                            <th className='prs7-th-4'>ASISTENCIAS TOTALES</th>
                            <th className='prs7-th-5'>ÚLTIMA VISITA</th>
                            <th className='prs7-th-6'>REGISTRAR ENTRADA</th>
                            <th className='prs7-th-7'>REGISTRAR SALIDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios
                            .filter(usuario => usuario.tipo_de_estudiante.toLowerCase() !== "visitante" && usuario.activo !== 0)
                            .map((usuario, index) => (
                                <tr key={usuario.id} className="prs7-tr-body">
                                    <td className='prs7-td'>{usuario.tipo_de_estudiante}</td>
                                    <td className='prs7-td'>{(usuario.nombre + " " + usuario.apellido_materno + " " + usuario.apellido_paterno).toUpperCase()}</td>
                                    <td className='prs7-td'>{usuario.genero}</td>
                                    <td className={(statusAsistencias && index === indexActualTabla) ? "prs7-td brillar" : "prs7-td"}>{usuario.asistencias}</td>
                                    <td className={(statusFecha && index === indexActualTabla) ? "prs7-td brillar" : "prs7-td"}>{usuario.ultima_salida_fecha} <br></br><strong>{usuario.ultima_salida_hora}</strong></td>
                                    <td className='prs7-td'>{
                                        <div className={(usuario.se_encuentra_ahora == 0) ? "fondo-boton" : "fondo-boton-disabled"}>
                                            <button className={(usuario.se_encuentra_ahora == 0) ? "b-ma" : "b-ma-disabled not-allowed"} onClick={() => { registrarAsistencia(usuario.matricula, (<Hora />).type(), "entrada", index); }} disabled={usuario.se_encuentra_ahora == 1}>| Marcar</button>
                                        </div>
                                    }</td>
                                    <td className='prs7-td'>{
                                        <div className={(usuario.se_encuentra_ahora == 1) ? "fondo-boton" : "fondo-boton-disabled"}>
                                            <button className={(usuario.se_encuentra_ahora == 1) ? "b-ma" : "b-ma-disabled not-allowed"} onClick={() => { registrarAsistencia(usuario.matricula, (<Hora />).type(), "salida", index); }} disabled={usuario.se_encuentra_ahora == 0}>| Marcar</button>
                                        </div>
                                    }</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
                : <div className="prs7-no-datos"><p className="prs2-p">NO HAY DATOS PARA MOSTRAR</p></div>}
            <div className="prs7-bottons">
                <button className="prs7-botton delete hoverable" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion7;
