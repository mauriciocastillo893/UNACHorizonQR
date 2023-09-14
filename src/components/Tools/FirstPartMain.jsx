import Fecha from "../Clock/Fecha";
import "../../style-sheets/Tools/FirstPartMain.css"

function FirstPartMain({ title, subtitle }) {
    const validationOfTitle = title || "No title yet";
    const validationOfSubtitle = subtitle || "No subtitle yet";

    return (
        <div className="first-part">
            <div className="titleS1">
                <p>{validationOfTitle.toUpperCase()}</p>
            </div>
            <div className="date">
                <Fecha />
            </div>
            <div className="subtitleS1">
                <p className="first-part-p">{validationOfSubtitle}</p>
            </div>
        </div>
    );
}

export default FirstPartMain;
