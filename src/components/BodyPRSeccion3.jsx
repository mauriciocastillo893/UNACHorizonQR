import React, { useEffect, useState } from "react";
import '../style-sheets/BodyPRSeccion3.css';
import { useLocation } from "react-router-dom";
import Fecha from './Clock/Fecha'
import Hora from './Clock/Hora'
import FirstPartMain from "./Tools/FirstPartMain";
import axios from 'axios';

function BodyPRSeccion3() {
    const location = useLocation();
    const [usuariosEmergencia, setUsuariosEmergencia] = useState([])
    var preUsuariosEmergencia = location.state?.usuariosEmergencia || {};
    const usuariosEmergenciaVacios = Object.keys(usuariosEmergencia).length === 0;
    const totalUsuarios = location.state?.totalUsuarios || 0;
    const [totalMatriculas, setTotalMatriculas] = useState("")
    const [reason, setReason] = useState("")
    const [statePost, setStatePost] = useState(false)
    let lengthObject;

    const peticionGet = async () => {
        const data = {
            matriculas: totalMatriculas
        }
        await axios.get("http://localhost:5000/estanEnAutoAccesoAhora", data)
            .then(response => {
                console.log(response.data)
            }).catch(error => {
                console.log(error);
            })
    }

    const registrarAsistenciaMultiples = (tipo_de_salida, hora) => {
        const data = {
            matriculas: totalMatriculas,
            tipo_de_salida: tipo_de_salida,
            hora: hora
        };
        axios.post('http://localhost:5000/agregarMultiplesSalidas', data)
            .then(response => {
                if (response.data.status !== '0') {
                    console.log(response.data);
                } else {
                    console.log(response.data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    const getMatriculas=()=>{
        const matriculas = Object.values(usuariosEmergencia).map(matriculaObj => matriculaObj.matricula);
        setTotalMatriculas(matriculas);
        // console.log(totalMatriculas)
    }

    const getLength=()=>{
        lengthObject = Object.keys(usuariosEmergencia).length
        return lengthObject
    }

    useEffect(() => {
        setUsuariosEmergencia(preUsuariosEmergencia)
        getLength()
        getMatriculas()
        console.log(usuariosEmergencia)
        window.scrollTo(0, 0);
    },[]);

    return (
    <div className="prs3-main">
        <FirstPartMain 
            title="Marcar salida de emergencia"
            subtitle="Salida de emergencia"/>
        <div className="prs3-second-part">
            <div className="prs3-right">
                <div className="prs3-title2">
                    <p>Cantidad de usuarios a salir</p>
                </div>
                <div className="prs3-subtitle2">
                <p className="prs3-p">
                    {getLength()}{" "}{
                    getLength() === 1 ? "PERSONA" : "PERSONAS"} DE{" "}
                    {totalUsuarios} DEL TOTAL
                    </p>
                </div>
                <div className="prs3-title2">
                    <p>Usuarios con pase de salida</p>
                </div>
                <div className="prs3-subtitle3">
                {usuariosEmergenciaVacios ? (
                    <p>NO HAY USUARIOS SELECCIONADOS.</p>
                ) : (
                    <ul className="prs3-ul">
                        {Object.values(usuariosEmergencia).map(student => (
                            <li key={student.matricula}>
                                [{student.matricula}] {student.usuario} {student.apellido_materno} {student.apellido_paterno}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
                <div className="prs3-title2">
                    <p>Hora de salida</p>
                </div>
                <div className="prs3-subtitle2">
                    <p className="prs3-p">
                        <Fecha /> <Hora />
                    </p>
                </div>
            </div>
            <div className="prs3-left">
                <div className="prs3-title2">
                    <p>Razón</p>
                </div>
                <div className={(totalUsuarios!==0) ? "prs3-subtitle4" : "prs3-subtitle4-d"}>
                    <button value="TEMBLOR/TERREMOTO" onClick={() => setReason("TEMBLOR/TERREMOTO")}>TEMBLOR/TERREMOTO</button>
                    <button value="EMERGENCIA MEDICA" onClick={() => setReason("EMERGENCIA MEDICA")}>EMERGENCIA MEDICA</button>
                    <button value="SIMULACROS" onClick={() => setReason("SIMULACROS")}>SIMULACROS</button>
                    <button value="RAZONES PERSONALES" onClick={() => setReason("RAZONES PERSONALES")}>RAZONES PERSONALES</button>
                </div>
                <div className="prs3-bottons">
                    <button className={(totalUsuarios!==0) ? "prs3-botton2 hoverable" : "prs3_b-disabled"} onClick={() => {console.log(reason); registrarAsistenciaMultiples(reason, (<Hora />).type());}} disabled={usuariosEmergenciaVacios}>SALIDA A TODOS</button>
                </div>      
            </div>
        </div>

    </div>
    );
}

export default BodyPRSeccion3;
