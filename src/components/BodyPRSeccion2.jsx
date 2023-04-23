import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion2.css';

function BodyPRSeccion1() {
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

    const peticionGet=async()=>{
        await axios.get("https://jsonplaceholder.typicode.com/users")
            .then(response => {
                setUsuarios(response.data);
                setTablaUsuarios(response.data);
                // console.log(response.data);
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
    
    const filtrar=(terminoBusqueda)=>{
        var resultadoBusqueda=tablaUsuarios.filter((elemento)=>{
            if(elemento.name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())){
                return elemento;
            }
        });
        setUsuarios(resultadoBusqueda);

        if (resultadoBusqueda.length) {
            setStatus(`${resultadoBusqueda.length} encontrados`)
            if(resultadoBusqueda.length===1)
                setStatus(`${resultadoBusqueda.length} encontrado`);
        } else {
            setStatus("no encontrado");
        }
    }

    useEffect(() => {
        peticionGet();   
    },[]);

    useEffect(() => {
        if(busqueda === ""){
            setStatus("online");
        }
    }, [busqueda])
    
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
                            <th className='prs2-th-6'>REGISTRAR ASISTENCIA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.map((usuario)=>(
                            <tr key={usuario.id} className="prs2-tr-body">
                                <td className='prs2-td'>{usuario.id}</td>
                                <td className='prs2-td'>{usuario.name}</td>
                                <td className='prs2-td'>{usuario.phone}</td>
                                <td className='prs2-td'>{usuario.username}</td>
                                <td className='prs2-td'>{
                                    <input type="checkbox" className="prs2-cb"></input>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma">Añadir</button>
                                }</td>
                                <td className='prs2-td'>{
                                    <button className="prs2-b-ma">Registrar</button>
                                }</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        <div className="prs2-bottons">
                <button className="prs2-botton hoverable">Salida para: {status} personas</button>  
                <button className="prs2-botton hoverable">Salida a todas las personas</button>
                <button className="prs2-botton hoverable" onClick={() => {peticionGet(); handleClearClick();}}>LIMPIAR</button>
        </div>
    </div>
    );
}

export default BodyPRSeccion1;
