import React from "react";
import '../style-sheets/Header2.css'

function Header2() {
    return (  
        <header>
            <div className="container-header-2">
                <div className="first-partH-2">
                    <div className="itemH-2">
                        <p>C.A.A. RECEPCIÓN</p>
                    </div>
                    <div className="item2H-2">
                        
                    </div>
                    <div className="item3H-2">
                        
                    </div>
                    <div className="item4H-2">
                        
                    </div>
                    <div className="item5H-2">
                        <div className="item5H-21">
                            
                        </div>
                        <div className="item5H-22">
                            <div className="item5H-221">
                                <p>ROQUE MAURICIO MARTINEZ CASTILLO</p>
                            </div>
                            <div className="item5H-cerrarsesion">
                                <button className="botton-cs hoverable">CERRAR SESIÓN</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="second-partH-2">
                    <div className="itemsp-regresarmenu">
                        <button className="botton-rm hoverable">REGRESAR AL MENÚ</button>
                    </div>
                    <div className="barra">

                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header2;