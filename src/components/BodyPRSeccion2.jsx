import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion2.css';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";
import Hora from "./Clock/Hora"

function BodyPRSeccion2() {
    const [usuarios, setUsuarios] = useState([]);
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [status, setStatus] = useState("online");
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState(new Set());
    const [usuariosEmergencia, setUsuariosEmergencia] = useState({}); // Estado para almacenar el diccionario de usuarios
    const totalUsuarios = usuarios.length;
    const [statusBoton, setStatusBoton] = useState(false)
    const queryParams = new URLSearchParams(location.search);
    var emergencyDirect = Boolean(queryParams.get("emergencyDirect"));

    const navigate = useNavigate();

    useEffect(() => {
        peticionGet();
        window.scrollTo(0, 0)
        if (busqueda === "") {
            setStatus("online");
        }
    }, []);

    const peticionGet = async () => {
        await axios.get("http://localhost:5000/usuariosEnElCCA")
            .then(response => {
                console.log(response.data.users)
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
            }).catch(error => {
                console.log(error);
            })
    }

    const addUserToEmergency = (matricula, usuario, apellido_materno, apellido_paterno) => {
        setUsuariosEmergencia(prevUsuarios => ({ ...prevUsuarios, [matricula]: { matricula, usuario, apellido_materno, apellido_paterno } }));
    };

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

    const handleCheckboxChange = (matricula, usuario, apellido_materno, apellido_paterno) => {
        if (usuariosSeleccionados.has(matricula)) {
            const nuevosSeleccionados = new Set(usuariosSeleccionados);
            nuevosSeleccionados.delete(matricula);
            setUsuariosSeleccionados(nuevosSeleccionados);
            console.log('Usuario retirado');
            removeUserFromEmergency(matricula);
        } else {
            setUsuariosSeleccionados(new Set(usuariosSeleccionados).add(matricula));
            console.log(matricula);
            addUserToEmergency(matricula, usuario, apellido_materno, apellido_paterno);
        }
    };

    const removeUserFromEmergency = (matricula) => {
        setUsuariosEmergencia(prevUsuarios => {
            const nuevosUsuarios = { ...prevUsuarios };
            delete nuevosUsuarios[matricula]; // Eliminamos al usuario del diccionario
            return nuevosUsuarios;
        });
    };

    const enviarPersonas = () => {
        console.log("Usuarios Seleccionados:");
        [...usuariosSeleccionados].forEach(matricula => {
            const usuario = usuariosEmergencia[matricula];
            console.log("Nombre:", usuario.usuario, usuario.apellido_materno, usuario.apellido_paterno);
            console.log("Matrícula:", usuario.matricula);
            console.log("---------------");
        });
        const matriculas = Object.keys(usuariosEmergencia);
        console.log("Array", usuariosEmergencia)
        console.log("Selected: " + JSON.stringify(matriculas));
        navigate("/salidaEmergencia", { state: { usuariosEmergencia } })
    };

    const marcarTodosLosCheckboxes = () => {
        const todasLasMatriculas = usuarios.map(usuario => usuario.matricula);
        setUsuariosSeleccionados(new Set(todasLasMatriculas));
    };

    const enviarTodasLasPersonas = () => {
            marcarTodosLosCheckboxes(); // Marcar todos los checkboxes primero
            setStatusBoton(true);
            setTimeout(() => {
                    const statusTodosLosUsuarios = true // Cargar los datos antes de enviarlos
                    navigate("/salidaEmergencia", { state: { statusTodosLosUsuarios } });
            }, 1000); // Esperar 2 segundos antes de navegar
    };


    const addUser = (matricula) => {
        navigate(`/seccion21?matricula=${matricula}`);
    }

    setTimeout(() => {
        if (emergencyDirect) {
            enviarTodasLasPersonas();
        }
    }, 1000)

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

    function formatearDatos(datosOriginales) {
        const pares = datosOriginales.split(',');
        const paresFormateados = [];

        for (let i = 0; i < pares.length; i += 2) {
            const prePalabra = pares[i];
            const palabra = prePalabra.toUpperCase()
            const numero = parseInt(pares[i + 1]);

            let numeroFormateado;

            if (numero === 1) {
                numeroFormateado = `${numero}RO`;
            } else if (numero % 10 === 2) {
                numeroFormateado = `${numero}DO`;
            } else if (numero % 10 === 3) {
                numeroFormateado = `${numero}RO`;
            } else if (numero % 10 === 7 || numero % 10 === 10) {
                numeroFormateado = `${numero}MO`;
            } else if (numero % 10 === 8 || numero % 10 === 11 || numero % 10 === 12) {
                numeroFormateado = `${numero}VO`;
            } else if (numero % 10 === 9) {
                numeroFormateado = `${numero}NO`;
            } else {
                numeroFormateado = `${numero}TO`;
            }
            const parFormateado = `${palabra} ${numeroFormateado}`;
            paresFormateados.push(parFormateado);
        }
        return paresFormateados.join(', ');
    }

    const mostrarAlerta = () => {
        if (usuariosSeleccionados.size < 1) {
            ShowAssistanceAlert("SALIDAS NO ENVIADAS", `<strong>DETALLES:</strong><br>Debes seleccionar al menos un usuario para continuar`, "error", undefined)
        } else {
            enviarPersonas();
        }
    }

    const registrarAsistEntrOrSal = async (matricula, hora) => {
        const data = {
            matricula: matricula,
            hora: hora,
        };
        axios.post('http://localhost:5000/agregarSalida', data)
            .then(response => {
                if (response.data.status != '0') {
                    console.log(response.data)
                    peticionGet();
                    ShowAssistanceAlert("SALIDA GUARDADA", `<strong>Salida guardada</strong> correctamente a la hora: <br><strong>${hora}</strong>`, "success", "salida")
                } else {
                    ShowAssistanceAlert("SALIDA NO GUARDADA", `<strong>DETALLES: </strong><br>${response.data.mensaje}`, "error", undefined)
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const registrarAsistencia = (matricula, hora) => {
        Swal.fire({
            title: '¿REGISTRAR SALIDA?',
            html: "<div class='bold-text'>ESTAS POR PONER LA <strong>ASISTENCIA DE SALIDA.</strong></div>",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "<div class='bold-confirm-register-salida'>DAR SALIDA</div>",
            confirmButtonColor: "#149da7",
            cancelButtonText: "<div class='bold-confirm-exit'>CANCELAR</div>",
            cancelButtonColor: "#D92D2D",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                registrarAsistEntrOrSal(matricula, hora)
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                ShowAssistanceAlert("OPERACIÓN CANCELADA", `<strong>DETALLES: </strong><br>LA OPERACIÓN PARA GUARDAR LA SALIDA DE ASISTENCIA FUE CANCELADA`, "error", undefined)
            }
        })
    }

    return (
        <div className="prs2-main">
            <FirstPartMain
                title="Buscar usuario en el CAA"
                subtitle="Ingrese el nombre del usuario para buscarlo" />
            <div className="prs2-searcher">
                <div className="prs2-first-s">
                    <div className="prs2-title-first"><p>Nombre del usuario</p></div>
                    <input
                        className="prs2-searcher-input"
                        type="search"
                        value={busqueda}
                        placeholder='Búsqueda por nombre'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className="prs2-second-s">
                    <div className="prs2-title-second"><p>Estatus</p></div>
                    <p className="prs2-subtitle-second">{status}</p>
                </div>
            </div>
            <div id="prs2-table-headboard">Usuarios actuales dentro de autoacceso</div>
            {(totalUsuarios) ? <div id="prs2-tabla-all">
                <table id='prs2-table'>
                    <thead id='prs2-th'>
                        <tr id='prs2-tr'>
                            <th className='prs2-th-1'>MATRICULA</th>
                            <th className='prs2-th-2'>NOMBRE COMPLETO</th>
                            <th className='prs2-th-3'>GÉNERO</th>
                            <th className='prs2-th-4'>IDIOMA Y NIVEL</th>
                            <th className='prs2-th-5'>SALIDA DE EMERGENCIA</th>
                            <th className='prs2-th-6'>AÑADIR ASISTENCIAs</th>
                            <th className='prs2-th-7'>REGISTRAR SALIDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios
                        .map((usuario) => (
                            <tr key={usuario.id} className="prs2-tr-body">
                                <td className='prs2-td'>{usuario.matricula}</td>
                                <td className='prs2-td'>{usuario.nombre.toUpperCase() + " " + usuario.apellido_materno.toUpperCase() + " " + usuario.apellido_paterno.toUpperCase()}</td>
                                <td className='prs2-td'>{usuario.genero}</td>
                                <td className='prs2-td'>{(usuario.tipo_de_estudiante.toLowerCase() == 'visitante') ? 'NO INSCRITO [VISITANTE]' : formatearDatos(usuario.idiomas)}</td>
                                <td className='prs2-td'  onClick={() => handleCheckboxChange(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno)}>{
                                    <input
                                        type="checkbox"
                                        className="prs2-cb"
                                        checked={usuariosSeleccionados.has(usuario.matricula)}
                                        onChange={() => handleCheckboxChange(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno)}
                                    ></input>
                                }</td>
                                <td className='prs2-td'>{
                                    <div className={(usuario.se_encuentra_ahora == 1) ? "fondo-boton" : "fondo-boton-disabled"}>
                                        <button className={(usuario.se_encuentra_ahora == 1) ? "b-ma" : "b-ma-disabled not-allowed"} onClick={() => addUser(usuario.matricula)}>| Añadir</button>
                                    </div>
                                }</td>
                                    <td className='prs7-td'>{
                                        <div className={(usuario.se_encuentra_ahora == 1) ? "fondo-boton" : "fondo-boton-disabled"}>
                                            <button className={(usuario.se_encuentra_ahora == 1) ? "b-ma" : "b-ma-disabled not-allowed"} onClick={() => { registrarAsistencia(usuario.matricula, (<Hora />).type()); }} disabled={usuario.se_encuentra_ahora == 0}>| Marcar</button>
                                        </div>
                                    }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                : <div className="prs2-no-datos"><p className="prs2-p">NO HAY DATOS PARA MOSTRAR</p></div>}
            <div className="prs2-bottons">
                <button className="prs2-botton hoverable" onClick={() => { mostrarAlerta(); }}>Salida para: {usuariosSeleccionados.size}{(usuariosSeleccionados.size == 1) ? " persona" : " personas"}</button>
                {/* <button className={(busqueda === "" ? "prs2-botton hoverable" : "prs2_b-disabled")} onClick={() => {enviarTodasLasPersonas();}} disabled={busqueda !== ""}>Salida a todas las personas</button> */}
                <button className="prs2-botton delete hoverable" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
                <button className={(!statusBoton) ? "prs2-botton hoverable bs-exit-s2" : "prs2_b-disabled"} disabled={statusBoton} onClick={() => { setUsuariosSeleccionados(new Set()); setUsuariosEmergencia({}); }}>ELIMINAR OPCIONES</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion2;
