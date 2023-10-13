import moment from 'moment-timezone';

function Fecha() {
    const fechaObtener = () => {
        const fecha = moment.tz('America/Mexico_City'); // Obtén la fecha actual en la zona horaria de Ciudad de México
        const year = fecha.year(); // Obtener el año
        const month = fecha.month(); // Obtener el mes
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const monthName = monthNames[month];
        const day = fecha.date().toString().padStart(2, '0'); // Obtener el día del mes
        const fechaObtenida = `${day} de ${monthName} del ${year}`; // Formato de la fecha
        return fechaObtenida.toUpperCase();
    };

    return fechaObtener();
}

export default Fecha;
