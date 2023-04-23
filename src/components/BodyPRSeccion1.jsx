import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion1.css';

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
        //await axios.get("https://jsonplaceholder.typicode.com/users")
        // await axios.get("http://localhost/unachorizonqr/usuarios.php?CONSULTAR='1'")
        await axios.get("http://localhost/unachorizonqr/usuarios.php?CONSULTAR")
            .then(response => {
                console.log(response.data);
                setUsuarios(response.data);
                setTablaUsuarios(response.data);
                console.log(response.data);
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
    <div className="prs1-main">
        <div className="prs1-first-part">
            <div className="prs1-titleS1">
                <p>Buscar visitante</p>
            </div>
            <div className="prs1-date">
                <p>{fecha.toDateString()}</p>
            </div>
            <div className="prs1-subtitle">
                <p>Ingrese el nombre del visitante para buscarlo</p>                
            </div>
        </div>
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
            <div id="prs1-tabla-all">
                <div id="prs1-table-headboard">RESULTADOS</div>
                <table id='prs1-table'>
                    <thead id='prs1-th'>
                        <tr id='prs1-tr'>
                            <th className='prs1-th-1'>NÚM</th>
                            <th className='prs1-th-2'>NOMBRE COMPLETO</th>
                            <th className='prs1-th-3'>GÉNERO</th>
                            <th className='prs1-th-4'>ASISTENCIAS TOTALES</th>
                            <th className='prs1-th-5'>ÚLTIMA VISITA</th>
                            <th className='prs1-th-6'>REGISTRAR ASISTENCIA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.map((usuario)=>(
                            <tr key={usuario.id} className="prs1-tr-body">
                                <td className='prs1-td'>{usuario.id}</td>
                                <td className='prs1-td'>{usuario.nombre}</td>
                                <td className='prs1-td'>{usuario.genero}</td>
                                <td className='prs1-td'>{usuario.asistencias}</td>
                                <td className='prs1-td'>{usuario.ultima_salida_fecha}</td>
                                <td className='prs1-td'>{
                                    <button className="prs1-b-ma">Marcar</button>
                                }</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        <div className="prs1-bottons">
                <button className="prs1-botton hoverable">AÑADIR NUEVO VISITANTE</button>
                <button className="prs1-botton hoverable" onClick={() => {peticionGet(); handleClearClick();}}>LIMPIAR</button>
        </div>
    </div>
    );
}

export default BodyPRSeccion1;
