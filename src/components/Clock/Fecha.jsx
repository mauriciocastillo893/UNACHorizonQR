function Fecha() {

    const fechaObtener=()=>{
        const fecha = new Date();   
        const fechaFormateada = fecha.toISOString().slice(0, 10) /* Formato: YYYY-MM-DD*/
        const fechaSeparada = new Date(fechaFormateada); // Convertir la cadena formateada en un objeto Date
        const year = fechaSeparada.getFullYear(); // Obtener el año (YYYY)
        const month = fechaSeparada.getMonth(); // Obtener el mes (0-11), agregar 1 para que esté en el rango 1-12
            const monthNames = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            const monthName = monthNames[month];
        const day = fechaSeparada.getDate().toString().padStart(2, '0'); // Obtener el día del mes (1-31)
        const fechaObtenida = `${day} de ${monthName} del ${year}`
        return fechaObtenida.toUpperCase()
    }

    return ( fechaObtener() );
}

export default Fecha;