import React from "react";
import '../../style-sheets/Footer/FooterSalida.css';
import logo from '../../images/logoAzulClaro.png';

function Footer() {
    return (  
        <footer className="footer-fs">
            <div className="second-partF-fs">
                
            </div>

            <div className="first-partF-fs">
                <div className="item5F-fs">
                    
                </div>
                <div className="item4F-fs">
                    
                </div>
                <div className="item3F-fs">
                    
                </div>
                <div className="item2F-fs">
                    
                </div>
                <div className="itemF-fs">
                    <div className="logoDivF-fs">
                        <img src={logo} className="logoF-fs"></img>
                    </div>
                    <div className="lyricsF-fs">
                        <p>FACULTAD DE LENGUAS</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;