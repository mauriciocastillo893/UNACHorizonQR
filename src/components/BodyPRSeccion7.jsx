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
    const [indexActualTabla, setIndexActualTabla] = useState(0);

    const peticionGet = async () => {
        await axios.get("http://localhost:5000/todosLosUsuariosDelCAA")
            .then(response => {
                console.log(response.data.users);
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
            }).catch(error => {
                console.log(error);
                setTimeout(() => {
                    mostrarAlertaDeConexion()
                }, 2000)
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

    const mostrarAlertaDeConexion = () => {
        Swal.fire({
            title: "<div class='rojoClaro'>HA OCURRIDO UN ERROR DE CONEXIÓN</div>",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text rojoClaro'><b>VOLVIENDO A ESTABLECER CONEXIÓN...</div>",
            icon: "info",
            iconColor: "#7a0808",
            confirmButtonText: "<div class='bold-confirm-exit'>ACEPTAR</div>",
            confirmButtonColor: '#D92D2D',
            footer: "<div class='rojoClaro'><b>LO SENTIMOS. SI ESTE ERROR PERSISTE, POR FAVOR REPORTE ESTE PROBLEMA<b></div>"
            // timer: 1000,
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
                    Swal.fire({
                        title:
                            `${(tipoAsistencia.toLowerCase() === "entrada") ? `ENTRADA GUARDADA`
                                : `SALIDA GUARDADA`}`,
                        html:
                            `${(tipoAsistencia.toLowerCase() === "entrada") ? `<div class='bold-text'>Entrada guardada correctamente a la hora: <br><strong>${hora}</strong></div>`
                                : `<div class='bold-text'>Salida guardada correctamente a la hora: <br><strong>${hora}</strong></div>`}`,
                        position: 'top-end',
                        icon: "success",
                        iconColor:
                            `${(tipoAsistencia.toLowerCase() === "entrada") ? "#4CAF50"
                                : "#149da7"}`,
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
                        confirmButtonColor:
                            `${(tipoAsistencia.toLowerCase() === "entrada") ? "#4CAF50"
                                : "#149da7"}`,
                    })
                    setStatusFecha(true)
                    setTimeout(() => {
                        setStatusFecha(false)
                    }, 4800)
                    setIndexActualTabla(index)
                } else {
                    console.log(response.data)
                    Swal.fire({
                        title:
                            `${(tipoAsistencia.toLowerCase() === "entrada") ? `ENTRADA NO GUARDADA`
                                : `SALIDA NO GUARDADA`}`,
                        html: `<div class='bold-text'><strong>${response.data.mensaje}</div>
                            ${(response.data.mensaje2) ? `${" " + response.data.mensaje2}</strong></div>` : ""}`,
                        icon: "error",
                        confirmButtonText: "<div class='bold-confirm-register'>ACEPTAR</div>",
                        confirmButtonColor:
                            `${(tipoAsistencia.toLowerCase() === "entrada") ? "#4CAF50"
                                : "#149da7"}`,
                    })
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
                `${(tipoAsistencia.toLowerCase() === "entrada") ? "<div class='bold-text'>Estas por poner la <strong>asistencia de entrada.</strong></div>"
                    : "<div class='bold-text'>Estas por poner la <strong>asistencia de salida.</strong></div>"}`
            ,
            icon: 'question',
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
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "OPERACIÓN CANCELADA",
                    html:
                        `${(tipoAsistencia.toLowerCase() === "entrada") ? "<div class='bold-text'>La operación para guardar la <strong>asistencia de entrada</strong><br>ha sido cancelada.</div>"
                            : "<div class='bold-text'>La operación para guardar la <strong>asistencia de salida</strong>, <br>ha sido cancelada.</div>"}`,
                    icon: "warning",
                    confirmButtonText: "<div class='bold-confirm-exit'>ACEPTAR</div>",
                    confirmButtonColor: "#D92D2D",
                })
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
                                    <td className='prs7-td'>{usuario.nombre + " " + usuario.apellido_materno + " " + usuario.apellido_paterno}</td>
                                    <td className='prs7-td'>{usuario.genero}</td>
                                    <td className='prs7-td'>{usuario.asistencias}</td>
                                    <td className={(statusFecha && index === indexActualTabla) ? "prs7-td brillar" : "prs7-td"}>{usuario.ultima_salida_fecha} <br></br><strong>{usuario.ultima_salida_hora}</strong></td>
                                    <td className='prs7-td'>{
                                        <div className="prs7-fondo-boton">
                                            <button className="prs7-b-ma" onClick={() => { registrarAsistencia(usuario.matricula, (<Hora />).type(), "entrada", index); }}>| Marcar</button>
                                        </div>
                                    }</td>
                                    <td className='prs7-td'>{
                                        <div className="prs7-fondo-boton">
                                            <button className="prs7-b-ma" onClick={() => { registrarAsistencia(usuario.matricula, (<Hora />).type(), "salida", index); }}>| Marcar</button>
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
