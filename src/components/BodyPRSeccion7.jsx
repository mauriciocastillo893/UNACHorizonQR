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

    const peticionGet = async () => {
        //await axios.get("https://jsonplaceholder.typicode.com/users")
        // await axios.get("http://localhost/unachorizonqr/usuarios.php?CONSULTAR='1'")
        await axios.get("http://localhost:5000/users")
            .then(response => {
                console.log(response.data.users);
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
                console.log(response.data);
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

    const mantenimiento = () => {
        Swal.fire({
            title: "ESTAMOS EN MANTENIMIENTO",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>Esta sección podría no funcionar correctamente</div>",
            icon: "warning",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            // footer: "<b>CENTRO DE AUTOACCESO<b>"
            // timer: 1000,
        })
    }

    useEffect(() => {
        peticionGet();
        window.scrollTo(0, 0);
        // mantenimiento();
    }, []);

    useEffect(() => {
        if (busqueda === "") {
            setStatus("online");
        }
    }, [busqueda])

    const registrarAsistEntrOrSal = async (matricula, tipoAsistencia, hora) => {
        const data = {
            matricula: matricula,
            hora: hora,
        };

        axios.post((tipoAsistencia.toLowerCase()==="entrada"
            ? 'http://localhost:5000/addEntrada'
            : 'http://localhost:5000/addSalida'
        ), data)
            .then(response => {
                // console.log("Respuesta del servidor:", response.data);
                if (response.data.status != '0') {
                    console.log(response.data)
                    peticionGet();
                    Swal.fire({
                        title: 
                            `${(tipoAsistencia.toLowerCase()==="entrada") ? `ENTRADA GUARDADA`
                            : `SALIDA GUARDADA`}`,
                        html: 
                            `${(tipoAsistencia.toLowerCase()==="entrada") ? `<div class='bold-text'>Entrada guardada correctamente a la hora: <br><strong>${hora}</strong></div>`
                            : `<div class='bold-text'>Salida guardada correctamente a la hora: <br><strong>${hora}</strong></div>`}`,
                        icon: "success",
                        confirmButtonText: "<div class='bold-confirm-register'>ACEPTAR</div>",
                        confirmButtonColor:
                        `${(tipoAsistencia.toLowerCase()==="entrada") ? "#4CAF50"
                        : "#149da7"}`,
                    })
                } else {
                    console.log(response.data.status)
                }
            })
            .catch(error => {
                console.error('Error en la solicitud POST:', error);
                // errorAlert();
            });
    }

    const registrarAsistencia = (matricula, hora, tipoAsistencia) => {
        Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
        Swal.fire({
            title: 
                `${(tipoAsistencia.toLowerCase()==="entrada") ? '¿REGISTRAR ENTRADA?'
                : '¿REGISTRAR SALIDA?'}`
            ,
            html: 
                `${(tipoAsistencia.toLowerCase()==="entrada") ? "<div class='bold-text'>Estas por poner la <strong>asistencia de entrada.</strong></div>"
                : "<div class='bold-text'>Estas por poner la <strong>asistencia de salida.</strong></div>"}`
            ,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 
                `${(tipoAsistencia.toLowerCase()==="entrada") ? "<div class='bold-confirm-register'>DAR ENTRADA</div>"
                : "<div class='bold-confirm-register-salida'>DAR SALIDA</div>"}`,
            confirmButtonColor:
                `${(tipoAsistencia.toLowerCase()==="entrada") ? "#4CAF50"
                : "#149da7"}`,
            cancelButtonText: "<div class='bold-confirm-exit'>CANCELAR</div>",
            cancelButtonColor: "#D92D2D",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                registrarAsistEntrOrSal(matricula, tipoAsistencia, (<Hora />).type())
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Swal.fire({
                    title: "OPERACIÓN CANCELADA",
                    html: 
                        `${(tipoAsistencia.toLowerCase()==="entrada") ? "<div class='bold-text'>La operación para guardar la <strong>asistencia de entrada</strong>, <br>ha sido cancelada.</div>"
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
                            <th className='prs2-th-6'>REGISTRAR ENTRADA</th>
                            <th className='prs2-th-7'>REGISTRAR SALIDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios
                            // .filter(usuario => usuario.tipo_de_estudiante.toLowerCase() === "visitante")
                            .map((usuario) => (
                                <tr key={usuario.id} className="prs7-tr-body">
                                    <td className='prs7-td'>{usuario.matricula}</td>
                                    <td className='prs7-td'>{usuario.nombre}</td>
                                    <td className='prs7-td'>{usuario.genero}</td>
                                    <td className='prs7-td'>{usuario.asistencias}</td>
                                    {/* <td className='prs7-td'>{usuario.ultima_salida_fecha}</td> */}
                                    <td className='prs7-td'>{usuario.ultima_entrada_hora}</td>
                                    <td className='prs7-td'>{
                                        <button className="prs7-b-ma" onClick={() => registrarAsistencia(usuario.matricula, (<Hora />).type(), "entrada")}>Marcar</button>
                                    }</td>
                                    <td className='prs7-td'>{
                                        <button className="prs7-b-ma"  onClick={() => registrarAsistencia(usuario.matricula, (<Hora />).type(), "salida")}>Marcar</button>
                                    }</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
                : <div className="prs7-no-datos"><p className="prs2-p">NO HAY DATOS PARA MOSTRAR</p></div>}
            <div className="prs7-bottons">
                <button className="prs7-botton hoverable">AÑADIR NUEVO USUARIO</button>
                <button className="prs7-botton delete hoverable" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion7;
