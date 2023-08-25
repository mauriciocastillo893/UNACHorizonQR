import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion2.css';
import Swal from 'sweetalert2'
import BodyPRSeccion2_1 from "./BodyPRSeccion2_1";
import { useNavigate } from "react-router-dom";

function BodyPRSeccion2() {
    // Fecha
    const fecha = new Date();
    // Objeto de usuarios
    const [usuarios, setUsuarios] = useState([]);
    // Tabla de objeto de usuarios
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    // Busqueda de nombre de usuarios
    const [busqueda, setBusqueda] = useState("");
    // Estatus de si se encontro o no el usuario
    const[status, setStatus] = useState("online");

    const[totalPersonas, setTotalPersonas] = useState("");

    const peticionGet=async()=>{
        await axios.get("http://localhost:5000/users")
            .then(response => {
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
            }).catch(error => {
                console.log(error);
            })
    }

    const handleChange=e=>{
        setBusqueda(e.target.value);
        filtrar(e.target.value);
    }

    const handleClearClick=e=>{
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
    
    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState(new Set());


    const handleCheckboxChange = (matricula) => {
        if (usuariosSeleccionados.has(matricula)) {
            const nuevosSeleccionados = new Set(usuariosSeleccionados);
            nuevosSeleccionados.delete(matricula);
            setUsuariosSeleccionados(nuevosSeleccionados);
            console.log('Usuario retirado');
        } else {
            setUsuariosSeleccionados(new Set(usuariosSeleccionados).add(matricula));
            console.log(matricula);
        }
    };
    

    const enviarPersonas=()=>{
        console.log("Usuarios Seleccionados:");
        [...usuariosSeleccionados].map(usuario => {
            console.log(usuario)
            console.log("---------------");
        });
        
    }

    const navigate = useNavigate();

    const addUser=(matricula)=>{
        const state = { matricula };
        navigate("/seccion21",  { state });
        // return <BodyPRSeccion2_1 matricula={matricula}/>;
    }

    useEffect(() => {
        peticionGet();   
    },[]);

    useEffect(() => {
        if(busqueda === ""){
            setStatus("online");
        }
    }, [busqueda])
    
    const mostrarAlerta = () => {
        if(usuariosSeleccionados.size<1){
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
        }else{
            return
        }
    }

    return (
    <div className="prs2-main">
        <div className="prs2-first-part">
            <div className="prs2-titleS1">
                <p>Buscar usuario en el CAA</p>
            </div>
            <div className="prs2-date">
                <p>{fecha.toDateString()}</p>
            </div>
            <div className="prs2-subtitle">
                <p>Ingrese el nombre del usuario para buscarlo</p>                
            </div>
        </div>
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
            <div id="prs2-tabla-all">
                <div id="prs2-table-headboard">Usuarios actuales dentro de autoacceso</div>
                <table id='prs2-table'>
                    <thead id='prs2-th'>
                        <tr id='prs2-tr'>
                            <th className='prs2-th-1'>NÚM</th>
                            <th className='prs2-th-2'>NOMBRE COMPLETO</th>
                            <th className='prs2-th-3'>GÉNERO</th>
                            <th className='prs2-th-4'>IDIOMA Y NIVEL</th>
                            <th className='prs2-th-5'>SALIDA DE EMERGENCIA</th>
                            <th className='prs2-th-7'>AÑADIR ASISTENCIAs</th>
                            <th className='prs2-th-6'>REGISTRAR ENTRADA</th>
                            <th className='prs2-th-6'>REGISTRAR SALIDA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.map((usuario)=>(
                            <tr key={usuario.id} className="prs2-tr-body">
                                <td className='prs2-td'>{usuario.matricula}</td>
                                <td className='prs2-td'>{usuario.nombre + " " + usuario.apellido_materno + " " + usuario.apellido_paterno}</td>
                                <td className='prs2-td'>{usuario.genero}</td>
                                <td className='prs2-td'>{usuario.idiomas}</td>
                                <td className='prs2-td'>{
                                    <input 
                                    type="checkbox" 
                                    className="prs2-cb"
                                    checked={usuariosSeleccionados.has(usuario.matricula)}
                                    onChange={() => handleCheckboxChange(usuario.matricula)}
                                    ></input>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma" onClick={() => addUser(usuario.matricula)}>Añadir</button>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma">Entrada</button>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma">Salida</button>
                                }</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        <div className="prs2-bottons">
                <button className="prs2-botton hoverable" onClick={() => {mostrarAlerta();}}>Salida para: {usuariosSeleccionados.size} personas</button>  
                <button className="prs2-botton hoverable" onClick={() => {enviarPersonas();}}>Salida a todas las personas</button>
                <button className="prs2-botton hoverable" onClick={() => {peticionGet(); handleClearClick();}}>LIMPIAR BUSCADOR</button>
                <button className="prs2-botton hoverable bs-exit" onClick={() => {setUsuariosSeleccionados(new Set());}}>ELIMINAR OPCIONES</button>
        </div>
    </div>
    );
}

export default BodyPRSeccion2;
