import { useEffect } from "react";
import '../style-sheets/BodyPanelRecepcion.css'
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPanelRecepcion() {

    const secciones = [
        { titulo: "ASISTENCIA VISITANTES", subtitulo: "BUSCAR A UN VISITANTE PARA SU ASISTENCIA", boton: "BUSCAR VISITANTE", seccion: "buscarVisitante" },
        { titulo: "ASISTENCIA A USUARIOS", subtitulo: "DAR ASISTENCIA A USUARIOS DE AUTOACCESO", boton: "DAR ASISTENCIA", seccion: "usuarioAsistencia" },
        { titulo: "BUSCAR USUARIOS", subtitulo: "BUSCAR USUARIOS DENTRO DEL CENTRO DE AUTOACCESO", boton: "BUSCAR USUARIO CAA", seccion: "buscarUsuarioCAA" },
        { titulo: "CORREGIR USUARIOS", subtitulo: "UNIR A USUARIOS IGUALES PERO MAL ESCRITOS", boton: "IR AL ACOPLADOR", seccion: "acoplarUsuario" },
        { titulo: "SALIDA DE EMERGENCIA", subtitulo: "DAR SALIDA DE EMERGENCIA A TODOS", boton: "SALIDA DE EMERGENCIA", seccion: "buscarUsuarioCAA" },
    ];

    const ShowAssistanceAlert= (tittle, message, status, type) => {
        Swal.fire({
            title: `${tittle.toUpperCase()}`,
            html: `<div class='bold-text'>${message.toUpperCase()}</div>`,
            position: 'top-end',
            icon: `${(status)}`,
            iconColor: 
                `${(status=="success" || status=="info")
                ? (type=="entrada" ? "#4CAF50" : type=="info" ? "#FAA300" : "#149da7")
                : ("#D92D2D")}`,
            background: "#262626",
            color: "#BAC2C9",
            toast: true,
            timerProgressBar: true,
            timer: 3000,
            showConfirmButton: false,
            allowOutsideClick: false,
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div className="main">
            <FirstPartMain
                title="PANEL DE RECEPCIÓN"
                subtitle="seleccione una sección para navegar" />
            <div className="second-part">
                {secciones.map((seccion, index) => (
                    <div className={`container-card `} key={index}>
                        <div className="item-title">
                            <p>{seccion.titulo}</p>
                        </div>
                        <div className={`${index === 4 ? "subtitlePR-exit" : "subtitlePR "}`}>
                            <p>{seccion.subtitulo}</p>
                        </div>
                        <Link to={index !== 4 ? `/${seccion.seccion}` : `/${seccion.seccion}?emergencyDirect=true`}>
                            <div className={index === 4 ? "botton-subtitle-exit" : "botton-subtitle"}>
                                <button className={`${index === 4 ? "bs-exit hoverable" : "botton-sub hoverable"}`} onClick={() => { (index === 4) ? 
                                    ShowAssistanceAlert("OBTENIENDO DATOS", "SE ESTÁ PROCESANDO LA INFORMACIÓN PARA SER ENVIADA <br><br><strong>ESPERE POR FAVOR</strong>", "info", "info") : "" }}>{seccion.boton}</button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BodyPanelRecepcion;