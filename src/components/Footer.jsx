import React from "react";
import '../style-sheets/Footer.css';
import logo from '../images/logoAzulClaro.png';

function Footer() {
    return (  
        <footer className="footer">
            <div className="second-partF">
                
            </div>

            <div className="first-partF">
                <div className="item5F">
                    
                </div>
                <div className="item4F">
                    
                </div>
                <div className="item3F">
                    
                </div>
                <div className="item2F">
                    
                </div>
                <div className="itemF">
                    <div className="logoDivF">
                        <img src={logo} className="logoF"></img>
                    </div>
                    <div className="lyricsF">
                        <p>FACULTAD DE LENGUAS</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;