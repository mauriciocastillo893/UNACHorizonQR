import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion6.css';
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";
import { RiUserUnfollowFill } from "react-icons/ri";
import { FaSync } from "react-icons/fa";


function BodyPRSeccion6() {
    const [usuarios, setUsuarios] = useState([]);
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [status, setStatus] = useState("online");
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState(new Set());
    const [usuariosFusionar, setUsuariosFusionar] = useState({}); // Estado para almacenar el diccionario de usuarios

    const totalUsuarios = usuarios.length;
    const navigate = useNavigate();

    const peticionGet = async () => {
        await axios.get("http://localhost:5000/allVisitors")
            .then(response => {
                console.log(response.data.users)
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
            }).catch(error => {
                console.log(error);
            })
    }

    const deletePetition=async(IDUserToDelete)=>{
        await axios.post("http://localhost:5000/eliminarVisitante", {matricula: IDUserToDelete})
        .then(response => {
            if(response.data.status==="1"){
                ShowAssistanceAlert("MATRICULA ELIMINADA", `${response.data.message}`, "success", "entrada")
                peticionGet()
            }else{
                ShowAssistanceAlert("ERROR INESPERADO", "UN ERROR CRÍTICO HA OCURRIDO, SI PERSISTE ESTE ERROR FAVOR DE REPORTARLO", "error", "entrada")
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const deleteByIDUser =(IDUserToDelete, name, firstLastName, secondLastName) => {
        Swal.fire({
            title: `¿DESEA ELIMINAR AL USUARIO ${IDUserToDelete}?`,
            html: `<div class='bold-text'>ESTAS POR ELIMINAR A: <br><strong> ${name + " " + firstLastName + " " + secondLastName}</strong><br><br><strong>ESTA ACCIÓN ES IRREVERSIBLE</strong> </div>`,
            icon: 'question',
            iconColor: "#D92D2D",
            showCancelButton: true,
            confirmButtonText: "<div class='bold-confirm-register'>ELIMINAR</div>",
            confirmButtonColor: "#4CAF50",
            cancelButtonText: "<div class='bold-confirm-exit'>CANCELAR</div>",
            cancelButtonColor: "#D92D2D",
        }).then((result) => {
            if (!result.isConfirmed) {
                ShowAssistanceAlert("OPERACIÓN CANCELADA", `<strong>DETALLES: </strong><br>OPERACIÓN PARA ELIMINAR A LA MATRICULA <strong>${IDUserToDelete}</strong> DESCARTADA`, "error", undefined)
            }else{
                deletePetition(IDUserToDelete)
            }
        })
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

    const addUserToEmergency = (matricula, usuario, apellido_materno, apellido_paterno) => {
        setUsuariosFusionar(prevUsuarios => ({ ...prevUsuarios, [matricula]: { matricula, usuario, apellido_materno, apellido_paterno } }));
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
        setUsuariosFusionar(prevUsuarios => {
            const nuevosUsuarios = { ...prevUsuarios };
            delete nuevosUsuarios[matricula]; // Eliminamos al usuario del diccionario
            return nuevosUsuarios;
        });
    };

    const enviarPersonas = () => {
        console.log("Usuarios Seleccionados:");
        [...usuariosSeleccionados].forEach(matricula => {
            const usuario = usuariosFusionar[matricula];
            console.log("Nombre:", usuario.usuario, usuario.apellido_materno, usuario.apellido_paterno);
            console.log("Matrícula:", usuario.matricula);
            console.log("---------------");
        });
        const matriculas = Object.keys(usuariosFusionar);
        console.log("Array", usuariosFusionar)
        console.log("Selected: " + JSON.stringify(matriculas));
        navigate("/unirUsuarios", { state: { usuariosFusionar } })
    };

    useEffect(() => {
        peticionGet();
        window.scrollTo(0, 0)
        if (busqueda === "") {
            setStatus("online");
        }
    }, []);

    const mostrarAlerta = () => {
        if (usuariosSeleccionados.size < 1) {
            ShowAssistanceAlert("BIFURCACIÓN NO ENVIADA", `<strong>DETALLES:</strong><br>Debes seleccionar al menos un usuario para continuar`, "error", undefined)
        } else {
            enviarPersonas();
        }
    }

    return (
        <div className="prs6-main">
            <FirstPartMain
                title="Corregir nombre del usuario"
                subtitle="Ingrese el nombre del usuario para buscarlo" />
            <div className="prs6-searcher">
                <div className="prs6-first-s">
                    <div className="prs6-title-first"><p>Nombre del usuario</p></div>
                    <input
                        className="prs6-searcher-input"
                        type="search"
                        value={busqueda}
                        placeholder='Búsqueda por nombre'
                        onChange={handleChange}>
                    </input>
                </div>
                <div className="prs6-second-s">
                    <div className="prs6-title-second"><p>Estatus</p></div>
                    <p className="prs6-subtitle-second">{status}</p>
                </div>
            </div>
            <div id="prs6-table-headboard">Todos los visitantes del autoacceso</div>
            {(totalUsuarios) ? <div id="prs6-tabla-all">
                <table id='prs6-table'>
                    <thead id='prs6-th'>
                        <tr id='prs6-tr'>
                            <th className='prs6-th-1'>NÚM</th>
                            <th className='prs6-th-2'>NOMBRE COMPLETO</th>
                            <th className='prs6-th-3'>GÉNERO</th>
                            <th className='prs6-th-4'>TIPO DE ESTUDIANTE</th>
                            <th className='prs6-th-5'>ASISTENCIAS TOTALES</th>
                            <th className='prs6-th-6'>ÚLTIMA VISITA</th>
                            <th className='prs6-th-7'>MARCAR PARA FUSIONAR</th>
                            <th className='prs6-th-8'>ELIMINAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios
                        .map((usuario, index) => (
                            <tr key={usuario.id} className="prs6-tr-body">
                                <td className='prs6-td'>{usuario.matricula}</td>
                                <td className='prs6-td'>{usuario.nombre.toUpperCase()+ " " + usuario.apellido_materno.toUpperCase() + " " + usuario.apellido_paterno.toUpperCase()}</td>
                                <td className='prs6-td'>{usuario.genero}</td>
                                <td className='prs6-td'>{((usuario.tipo_de_estudiante.toLowerCase() == 'visitante') ? 'NO INSCRITO [VISITANTE]' : usuario.tipo_de_estudiante.toUpperCase())}<strong>{(usuario.activo) ? <p className="verdeClaro2">{"( ACTIVO )"}</p> : <p className="rojoClaro2">{"( INACTIVO )"}</p>}</strong></td>
                                <td className='prs6-td'>{usuario.asistencias}</td>
                                <td className='prs6-td'>{usuario.ultima_salida_fecha}</td>
                                <td className='prs6-td' onClick={() => handleCheckboxChange(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno)}>{
                                    <input
                                        type="checkbox"
                                        className="prs6-cb"
                                        checked={usuariosSeleccionados.has(usuario.matricula)}
                                        onChange={() => handleCheckboxChange(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno)}
                                    ></input>
                                }</td>
                                <td className='prs6-td' onClick={() => deleteByIDUser(usuario.matricula, usuario.nombre, usuario.apellido_materno, usuario.apellido_paterno)}>{
                                    <div className="riuserunfollowfill">
                                        <RiUserUnfollowFill/>
                                    </div>
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                : <div className="prs6-no-datos"><p className="prs6-p">NO HAY DATOS PARA MOSTRAR</p></div>}
            <div className="prs6-bottons">
                <button className="prs6-botton hoverable" onClick={() => { mostrarAlerta(); }}>Bifurcar a: {usuariosSeleccionados.size}{(usuariosSeleccionados.size == 1) ? " persona" : " personas"}</button>
                <button className="prs6-botton delete hoverable bs-exit-s2" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
                <button className={(usuariosFusionar) ? "prs6-botton hoverable bs-exit-s2" : "prs2_b-disabled"} disabled={!usuariosFusionar} onClick={() => { setUsuariosSeleccionados(new Set()); setUsuariosFusionar({}); }}>ELIMINAR OPCIONES</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion6;