import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion3.css';

function BodyPRSeccion3() {
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
    <div className="prs3-main">
        <div className="prs3-first-part">
            <div className="prs3-title">
                <p>Marcar salida de emergencia</p>
            </div>
            <div className="prs3-date">
                <p>{fecha.toDateString()}</p>
            </div>
            <div className="prs3-subtitle">
                <p>Salida de emergencia</p>                
            </div>
        </div>
        <div className="prs3-second-part">
            <div className="prs3-right">
                <div className="prs3-title2">
                    <p>Cantidad de usuarios a salir</p>
                </div>
                <div className="prs3-subtitle2">
                    <p>15 personas de 15 del total</p>
                </div>
                <div className="prs3-title2">
                    <p>Usuarios con pase de salida</p>
                </div>
                <div className="prs3-subtitle3">
                <ul className="prs3-ul">
                    {usuarios.map((usuario, index) => (
                        // <li key={usuario.id}> {index+1}.- {usuario.name}</li>
                        <li key={usuario.id} className="prs3-li"> {usuario.name} </li>
                    ))}
                </ul>

                </div>
                <div className="prs3-title2">
                    <p>Hora de salida</p>
                </div>
                <div className="prs3-subtitle2">
                    <p>{fecha.toDateString()}</p>
                </div>
            </div>
            <div className="prs3-left">
                <div className="prs3-title2">
                    <p>Razón</p>
                </div>
                <div className="prs3-subtitle4">
                <button className="prs3-botton hoverable" value="TEMBLOR/TERREMOTO" onClick={() => {peticionGet(); handleClearClick();}}>TEMBLOR/TERREMOTO</button>
                <button className="prs3-botton hoverable" value="EMERGENCIA MEDICA" onClick={() => {peticionGet(); handleClearClick();}}>EMERGENCIA MEDICA</button>
                <button className="prs3-botton hoverable" value="SIMULACROS" onClick={() => {peticionGet(); handleClearClick();}}>SIMULACROS</button>
                <button className="prs3-botton hoverable" value="OTRA RAZON" onClick={() => {peticionGet(); handleClearClick();}}>OTRA RAZÓN</button>
                </div>
                <div className="prs3-title2">
                    <p>Comentarios adicionales</p>
                </div>
                <input 
                        className="prs3-comment-input"
                        type="text" 
                        // value="reemplazar valor aqui"
                        placeholder='Añadir comentarios'
                        // onChange="reemplazar datos aqui"
                        ></input>
                <div className="prs3-bottons">
                    <button className="prs3-botton hoverable" onClick={() => {peticionGet(); handleClearClick();}}>LIMPIAR</button>
                </div>      
            </div>
        </div>

    </div>
    );
}

export default BodyPRSeccion3;
