function Hora() {

    const horaObtener=()=>{
        const fecha = new Date();

        const hora = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        const segundos = fecha.getSeconds().toString().padStart(2, '0');
        const time = `${hora}:${minutos}:${segundos}`;
        return time
    }

    return ( 
            horaObtener()
        );
}

export default Hora;