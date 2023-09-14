import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion1.css';
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPRSeccion1() {
    // Objeto de usuarios
    const [usuarios, setUsuarios] = useState([]);
    // Tabla de objeto de usuarios
    const [tablaUsuarios, setTablaUsuarios] = useState([]);
    // Busqueda de nombre de usuarios
    const [busqueda, setBusqueda] = useState("");
    // Estatus de si se encontro o no el usuario
    const [status, setStatus] = useState("online");
    // Total de usuarios
    const totalUsuarios = Object.keys(usuarios).length

    const peticionGet = async () => {
        await axios.get("http://localhost:5000/users")
            .then(response => {
                console.log(response.data.users);
                setUsuarios(response.data.users);
                setTablaUsuarios(response.data.users);
                // console.log(response.data);
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
            if ((
                elemento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                elemento.apellido_materno.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                elemento.apellido_paterno.toLowerCase().includes(terminoBusqueda.toLowerCase())) &&
                elemento.tipo_de_estudiante.toLowerCase().includes("visitante")
            ) {
                return true; // Devuelve true si el elemento coincide con la búsqueda
            }
            return false; // Si no coincide, devuelve false
        });
        console.log(resultadoBusqueda)
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
        peticionGet();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (busqueda === "") {
            setStatus("online");
        }
    }, [busqueda])

    return (
        <div className="prs1-main">
            <FirstPartMain
                title="Buscar visitante"
                subtitle="Ingrese el nombre del visitante para buscarlo" />
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
                <div id="prs1-table-headboard">RESULTADOS</div>
                {(totalUsuarios) ? <div id="prs1-tabla-all">
                    <table id='prs1-table'>
                        <thead id='prs1-th'>
                            <tr id='prs1-tr'>
                                <th className='prs1-th-1'>TIPO</th>
                                <th className='prs1-th-2'>NOMBRE COMPLETO</th>
                                <th className='prs1-th-3'>GÉNERO</th>
                                <th className='prs1-th-4'>ASISTENCIAS TOTALES</th>
                                <th className='prs1-th-5'>ÚLTIMA VISITA</th>
                                <th className='prs1-th-6'>REGISTRAR ENTRADA</th>
                                <th className='prs1-th-7'>REGISTRAR SALIDA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios && usuarios
                                .filter(usuario => usuario.tipo_de_estudiante.toLowerCase() === "visitante")
                                .map(usuario => (
                                    <tr key={usuario.id} className="prs1-tr-body">
                                        <td className='prs1-td'>{usuario.tipo_de_estudiante}</td>
                                        <td className='prs1-td'>{usuario.nombre + " " + usuario.apellido_materno + " " + usuario.apellido_paterno}</td>
                                        <td className='prs1-td'>{usuario.genero}</td>
                                        <td className='prs1-td'>{usuario.asistencias}</td>
                                        <td className='prs1-td'>{usuario.ultima_salida_fecha}</td>
                                        <td className='prs1-td'>
                                            <button className="prs1-b-ma">ENTRADA</button>
                                        </td>
                                        <td className='prs1-td'>
                                            <button className="prs1-b-ma">SALIDA</button>
                                        </td>
                                    </tr>
                                ))  
                            }
                        </tbody>

                    </table>
                </div> : <div className="prs2-no-datos"><p className="prs2-p">NO HAY DATOS PARA MOSTRAR</p></div>}

            <div className="prs1-bottons">
                <button className="prs1-botton hoverable">AÑADIR NUEVO VISITANTE</button>
                <button className="prs1-botton delete hoverable" onClick={() => { peticionGet(); handleClearClick(); }}>LIMPIAR BUSCADOR</button>
            </div>
        </div>
    );
}

export default BodyPRSeccion1;
