import React, { useEffect, useState } from "react";
import axios from 'axios';
import '../style-sheets/BodyPRSeccion3.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import Fecha from './Clock/Fecha'
import Hora from './Clock/Hora'
import FirstPartMain from "./Tools/FirstPartMain";


function BodyPRSeccion3() {
    const location = useLocation();
    const usuariosEmergencia = location.state?.usuariosEmergencia || {};
    const usuariosEmergenciaVacios = Object.keys(usuariosEmergencia).length === 0;
    const totalUsuarios = location.state?.totalUsuarios || 0;

    const [reason, setReason] = useState("")
    const [usuarios, setUsuarios] = useState([])
    let lengthObject;

    const navigate = useNavigate();

    // const peticionGet=async()=>{
    //     await axios.get("http://localhost:5000/users")
    //         .then(response => {
    //             setUsuarios(response.data);
    //             // console.log(response.data);
    //         }).catch(error => {
    //             console.log(error);
    //         })
    // }

    const getLength=()=>{
        lengthObject = Object.keys(usuariosEmergencia).length
        return lengthObject
    }

    useEffect(() => {
        // peticionGet();
        getLength()
        window.scrollTo(0, 0);
    },[]);

    const panelRecepcion=()=>{
        navigate("/panelrecepcion");
    }

    const mostrarRedireccion = () => {
        Swal.fire({
            title: "NO HAY DATOS",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>¿ESTÁS INTENTANDO ENTRAR SIN UNA LLAVE?</div>",
            icon: "info",
            confirmButtonText: "<div class='bold-confirm'>ACEPTAR</div>",
            confirmButtonColor: '#262626',
            allowOutsideClick: false,
            footer: "<b>SERÁS REDIRECCIONADO AL MENÚ PRINCIPAL<b>"
            // timer: 1000,
        }).then((result) => {
            if (result.isConfirmed) {
                panelRecepcion(); // Llama a la función buscarUsuarioCAA si se hace clic en "ACEPTAR"
            }
        });
    }

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
                    <button value="TEMBLOR/TERREMOTO" onClick={() => setReason("TEMBLOR/TERREMOTO")} disabled={totalUsuarios!==0}>TEMBLOR/TERREMOTO</button>
                    <button value="EMERGENCIA MEDICA" onClick={() => setReason("EMERGENCIA MEDICA")}>EMERGENCIA MEDICA</button>
                    <button value="SIMULACROS" onClick={() => setReason("SIMULACROS")}>SIMULACROS</button>
                    <button value="RAZONES PERSONALES" onClick={() => setReason("RAZONES PERSONALES")}>RAZONES PERSONALES</button>
                </div>
                <div className="prs3-bottons">
                    <button className={(totalUsuarios!==0) ? "prs3-botton2 hoverable" : "prs3_b-disabled"} onClick={() => console.log(reason)} disabled={usuariosEmergenciaVacios}>SALIDA A TODOS</button>
                </div>      
            </div>
        </div>

    </div>
    );
}

export default BodyPRSeccion3;
