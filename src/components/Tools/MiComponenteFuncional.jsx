import React, { useEffect, useState } from 'react';

function MiComponenteFuncional() {
    const [estadoDeArranque, setEstadoDeArranque] = useState(false)

    const cambiarEstadoDeArranque=()=>{
        if(estadoDeArranque){
            setEstadoDeArranque(false)
            console.log("Apagando estado de arranque")
        }else{
            setEstadoDeArranque(true)
            console.log("Encendiendo estado de arranque")
        }
    }

    useEffect(() => {
        if(estadoDeArranque){
            // Función para verificar la hora actual
            const verificarHora = () => {
                const horaActual = new Date();
                const hora = horaActual.getHours();
                const minutos = horaActual.getMinutes();
                console.log(horaActual, hora, minutos)
                // Verificar si la hora y los minutos coinciden con tu condición
                if (hora === 2 && minutos === 0) {
                    // Realizar la acción que deseas ejecutar automáticamente
                    ejecutarAlgo();
                }
            };

            // Función para ejecutar algo
            const ejecutarAlgo = () => {
                console.log('La hora es 8:30 PM. Ejecutando algo...');
                // Coloca aquí la acción que deseas ejecutar automáticamente
            };

            // Configurar un intervalo para verificar la hora cada minuto
            const intervalId = setInterval(verificarHora, 1000);

            // Limpieza del intervalo cuando el componente se desmonta
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [estadoDeArranque]); // El segundo argumento del useEffect es un arreglo de dependencias vacío

    return <div>Contenido de tu componente funcional
        <button onClick={cambiarEstadoDeArranque}>Boton de arranque</button>
    </div>;
}

export default MiComponenteFuncional;
