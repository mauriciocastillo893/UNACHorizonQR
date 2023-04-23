import React from "react";
import '../style-sheets/HeaderSalida.css'

function Header2() {
    return (  
        <header>
            <div className="container-header-hs">
                <div className="first-partH-hs">
                    <div className="itemH-hs">
                        <p>C.A.A. RECEPCIÓN</p>
                    </div>
                    <div className="item2H-hs">
                        
                    </div>
                    <div className="item3H-hs">
                        
                    </div>
                    <div className="item4H-hs">
                        
                    </div>
                    <div className="item5H-hs">
                        <div className="item5H-21-hs">
                            
                        </div>
                        <div className="item5H-22-hs">
                            <div className="item5H-221-hs">
                                <p>ROQUE MAURICIO MARTINEZ CASTILLO</p>
                            </div>
                            <div className="item5H-cerrarsesion-hs">
                                <button className="botton-cs-hs hoverable">CERRAR SESIÓN</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="second-partH-hs">
                    <div className="itemsp-regresarmenu-hs">
                        <button className="botton-rm-hs hoverable">REGRESAR AL MENÚ</button>
                    </div>
                    <div className="barra-hs">

                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header2;