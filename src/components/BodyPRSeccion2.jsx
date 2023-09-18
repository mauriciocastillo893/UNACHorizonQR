import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion2.css';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion2() {
    // Objeto de usuarios
    const [usuarios, setUsuarios] = useState([]);
    // Tabla de objeto de usuarios
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    // Busqueda de nombre de usuarios
    const [busqueda, setBusqueda] = useState("");
    // Estatus de si se encontro o no el usuario
    const [status, setStatus] = useState("online");
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState(new Set());

    const [usuariosEmergencia, setUsuariosEmergencia] = useState({}); // Estado para almacenar el diccionario de usuarios
    // const [usuariosTotales, setUsuariosTotales] = useState({});
    // Función para agregar un usuario al diccionario
    const addUserToEmergency = (matricula, usuario, apellido_materno, apellido_paterno) => {
        setUsuariosEmergencia(prevUsuarios => ({ ...prevUsuarios, [matricula]: { matricula, usuario, apellido_materno, apellido_paterno, totalUsuarios } }));
    };

    const totalUsuarios = usuarios ? Object.keys(usuarios).length : 0;

    const [statusBoton, setStatusBoton] = useState(false)

    const queryParams = new URLSearchParams(location.search);
    const emergencyDirect = Boolean(queryParams.get("emergencyDirect"));

    const navigate = useNavigate();

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
        navigate("/salidaEmergencia", { state: { usuariosEmergencia, totalUsuarios } })
    };

    const marcarTodosLosCheckboxes = () => {
        const todasLasMatriculas = usuarios.map(usuario => usuario.matricula);
        setUsuariosSeleccionados(new Set(todasLasMatriculas));
    };

    const cargarTodasLasPersonas = () => {
        usuarios.forEach(usuario => {
            usuariosEmergencia[usuario.matricula] = {
                matricula: usuario.matricula,
                usuario: usuario.nombre,
                apellido_materno: usuario.apellido_materno,
                apellido_paterno: usuario.apellido_paterno
            };
            addUserToEmergency(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno);
        });
        // setUsuariosTotales(usuariosEmergencia);
    };

    const enviarTodasLasPersonas = () => {
        marcarTodosLosCheckboxes(); // Marcar todos los checkboxes primero
        setStatusBoton(true);
        setTimeout(() => {
            cargarTodasLasPersonas(); // Cargar los datos antes de enviarlos
            // console.log(totalUsuarios)
            navigate("/salidaEmergencia", { state: { usuariosEmergencia, totalUsuarios } });
            // mostrarAlerta2();
        }, 1000); // Esperar 2 segundos antes de navegar
    };

    const addUser = (matricula) => {
        const state = { matricula };
        navigate("/seccion21", { state });
    }

    setTimeout(() => {
        if (emergencyDirect) {
            console.log("entre")
            enviarTodasLasPersonas();
            console.log(usuarios)
        }
    }, 1000)

    useEffect(() => {
        peticionGet();
        window.scrollTo(0, 0)
        console.log(emergencyDirect)
    }, []);

    useEffect(() => {
        if (busqueda === "") {
            setStatus("online");
        }
    }, [busqueda])

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
            Swal.fire({
                title: "HA OCURRIDO UN PROBLEMA",
                // text: "FALTA UN CAMPO POR LLENAR",
                html: "<div class='bold-text'>DEBE SELECCIONAR AL MENOS UNA PERSONA PARA CONTINUAR</div>",
                icon: "info",
                confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
                confirmButtonColor: '#262626',
                // footer: "<b>CENTRO DE AUTOACCESO<b>"
                // timer: 1000,
            })
        } else {
            enviarPersonas();
        }
    }

    const mostrarAlertaCritica = () => {
        if (usuariosSeleccionados.size < 1) {
            Swal.fire({
                title: "HA OCURRIDO UN ERROR CRÍTICO",
                // text: "FALTA UN CAMPO POR LLENAR",
                html: "<div class='bold-text'>UN ERROR INESPERADO OCURRIÓ</div>",
                icon: "info",
                confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
                confirmButtonColor: '#262626',
                footer: "<b>LO SENTIMOS. SI ESTE ERROR PERSISTE, POR FAVOR REPORTE ESTE PROBLEMA LO MÁS PRONTO CON SOPORTE TECNICO<b>"
                // timer: 1000,
            })
        } else {
            enviarPersonas();
        }
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
                            <th className='prs2-th-1'>NÚM</th>
                            <th className='prs2-th-2'>NOMBRE COMPLETO</th>
                            <th className='prs2-th-3'>GÉNERO</th>
                            <th className='prs2-th-4'>IDIOMA Y NIVEL</th>
                            <th className='prs2-th-5'>SALIDA DE EMERGENCIA</th>
                            <th className='prs2-th-6'>AÑADIR ASISTENCIAs</th>
                            <th className='prs2-th-8'>REGISTRAR SALIDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios
                        .map((usuario) => (
                            <tr key={usuario.id} className="prs2-tr-body">
                                <td className='prs2-td'>{usuario.id}</td>
                                <td className='prs2-td'>{usuario.nombre.toUpperCase() + " " + usuario.apellido_materno.toUpperCase() + " " + usuario.apellido_paterno.toUpperCase()}</td>
                                <td className='prs2-td'>{usuario.genero}</td>
                                <td className='prs2-td'>{formatearDatos(usuario.idiomas)}</td>
                                <td className='prs2-td'>{
                                    <input
                                        type="checkbox"
                                        className="prs2-cb"
                                        checked={usuariosSeleccionados.has(usuario.matricula)}
                                        onChange={() => handleCheckboxChange(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno)}
                                    ></input>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma" onClick={() => addUser(usuario.matricula)}>Añadir</button>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma">Salida</button>
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                : <div className="prs2-no-datos"><p className="prs2-p">NO HAY DATOS PARA MOSTRAR</p></div>}


            <div className="prs2-bottons">
                <button className="prs2-botton hoverable" onClick={() => { mostrarAlerta(); }}>Salida para: {usuariosSeleccionados.size} personas</button>
                {/* <button className={(busqueda === "" ? "prs2-botton hoverable" : "prs2_b-disabled")} onClick={() => {enviarTodasLasPersonas();}} disabled={busqueda !== ""}>Salida a todas las personas</button> */}
                <button className="prs2-botton delete hoverable" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
                <button className={(!statusBoton) ? "prs2-botton hoverable bs-exit-s2" : "prs2_b-disabled"} disabled={statusBoton} onClick={() => { setUsuariosSeleccionados(new Set()); setUsuariosEmergencia({}); }}>ELIMINAR OPCIONES</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion2;
