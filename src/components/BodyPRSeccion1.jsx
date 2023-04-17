import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion1.css';
import search from '../images/barra-de-busqueda.png';

function BodyPRSeccion1() {
    // Fecha
    const fecha = new Date();
    // Objeto de usuarios
    const [usuarios, setUsuarios] = useState([]);
    // Tabla de objeto de usuarios
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    // Busqueda de nombre de usuarios
    const [busqueda, setBusqueda] = useState("");

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

    const filtrar=(terminoBusqueda)=>{
        var resultadoBusqueda=tablaUsuarios.filter((elemento)=>{
            if(elemento.name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())){
                return elemento;
            }
        });
        setUsuarios(resultadoBusqueda);
    }

    useEffect(() => {
        peticionGet();   
    },[]);

    return (
    <div className="prs1-main">
        <div className="prs1-first-part">
            <div className="prs1-titleS1">
                <p>PANEL DE RECEPCIÓN</p>
            </div>
            <div className="prs1-date">
                <p>{fecha.toDateString()}</p>
            </div>
            <div className="prs1-subtitle">
                <p>Seleccione una sección para navegar</p>                
            </div>
        </div>
        {/* <div className="prs1-second-part"> */}
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
                        <img src={search} className='prs1-searcher-img'></img>
                </div>
                <div className="prs1-second-s">
                    <div className="prs1-title-second"><p>ESTATUS</p></div>
                        <p className="prs1-subtitle-second">CARGANDO...</p>
                </div>
            </div>
                <table className='prs1-table'>
                    <thead className='prs1-th'>
                        <tr className='prs1-th'>
                            <th className='prs1-th'>NÚM</th>
                            <th className='prs1-th'>NOMBRE COMPLETO</th>
                            <th className='prs1-th'>GÉNERO</th>
                            <th className='prs1-th'>ASISTENCIAS TOTALES</th>
                            <th className='prs1-th'>ÚLTIMA VISITA</th>
                            <th className='prs1-th'>REGISTRAR ASISTENCIA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios && usuarios.map((usuario)=>(
                            <tr key={usuario.id}>
                                <td className='prs1-td'>{usuario.id}</td>
                                <td className='prs1-td'>{usuario.name}</td>
                                <td className='prs1-td'>{usuario.phone}</td>
                                <td className='prs1-td'>{usuario.username}</td>
                                <td className='prs1-td'>{usuario.company.name}</td>
                                <td className='prs1-td'>{usuario.website}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
        {/* </div> */}
        <div className="prs1-bottons">
                <button className="prs1-botton hoverable">AÑADIR NUEVO VISITANTE</button>
                <button className="prs1-botton hoverable" onClick={peticionGet}>LIMPIAR</button>
        </div>
    </div>
    );
}

export default BodyPRSeccion1;
