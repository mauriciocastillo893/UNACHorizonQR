import { useEffect } from "react";
import '../style-sheets/BodyPanelRecepcion.css'
import Swal from 'sweetalert2'
import { Link } from "react-router-dom";
import FirstPartMain from "./Tools/FirstPartMain";

function BodyPanelRecepcion() {

    const fecha = new Date();

    const secciones = [
        { titulo: "ASISTENCIA VISITANTES", subtitulo: "BUSCAR A UN VISITANTE PARA SU ASISTENCIA", boton: "BUSCAR VISITANTE", seccion: "buscarVisitante" },
        { titulo: "ASISTENCIA A USUARIOS", subtitulo: "DAR ASISTENCIA A USUARIOS DE AUTOACCESO", boton: "DAR ASISTENCIA", seccion: "usuarioAsistencia" },
        { titulo: "BUSCAR USUARIOS", subtitulo: "BUSCAR USUARIOS DENTRO DEL CENTRO DE AUTOACCESO", boton: "BUSCAR USUARIO CAA", seccion: "buscarUsuarioCAA" },
        { titulo: "CORREGIR USUARIOS", subtitulo: "UNIR A USUARIOS IGUALES PERO MAL ESCRITOS", boton: "IR AL ACOPLADOR", seccion: "acopladorUsuario" },
        { titulo: "SALIDA DE EMERGENCIA", subtitulo: "DAR SALIDA DE EMERGENCIA A TODOS", boton: "SALIDA DE EMERGENCIA", seccion: "buscarUsuarioCAA" },
    ];

    const cargando = () => {
        Swal.fire({
            title: "CARGANDO DATOS...",
            // text: "FALTA UN CAMPO POR LLENAR",
            html: "<div class='bold-text'>SE ESTÁ PROCESANDO LA INFORMACIÓN</div>",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
            confirmButtonColor: '#262626',
            footer: "<b>ESPERE MIENTRAS SE ESTÁ RECOPILANDO LA INFORMACIÓN NECESARIA<b>",
            timer: 2500,
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
                                <button className={`${index === 4 ? "bs-exit hoverable" : "botton-sub hoverable"}`} onClick={() => { (index === 4) ? cargando() : "" }}>{seccion.boton}</button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BodyPanelRecepcion;