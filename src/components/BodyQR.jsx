import React from "react";
import '../style-sheets/BodyQR.css'
import qr from '../images/CAA.png'

function BodyQR() {
    return (  
        <main className="main">
            <div className='leftDiv'>
                <div className="type-student">
                    <p>PARTICULAR</p>
                </div>
                <div className="image-qr">
                    <img src={qr} className="qr"></img>
                </div>
                <div className="student-id">
                    <p>LN12345</p>
                </div>
                <div className="status-student">
                    <div className="color-status">
                        <p>ACTIVO</p>
                    </div>
                </div>
            </div>
            <div className='rightDiv'>
                <div className="student">
                    <p>ROQUE MAURICIO MARTÍNEZ CASTILLO</p>
                </div>
                <div className="language">
                    <p>INGLÉS, FRANCÉS</p>
                </div>
                <div className="level">
                    <p>8VO, 2DO NIVEL</p>
                </div>
                <div className="period">
                    <p>ENE 23 - AGO 23, ABR 23 - OCT 23</p>
                </div>
                <div className="spaceqr">

                </div>
                <div className="spaceqr2">

                </div>
                <div className="status-qr">
                    <p>ENTRADA REGISTRADA</p>
                </div>
                <div className="status-msg">
                    <p>LA ENTRADA A SIDO REGISTRADA CORRECTAMENTE</p>
                </div>
            </div>
        </main>
    );
}

export default BodyQR;