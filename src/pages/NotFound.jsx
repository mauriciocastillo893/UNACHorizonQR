import Footer from "../components/Footer/Footer";
import Header2 from "../components/Header/Header2";
import "../style-sheets/Tools/NotFound.css"

function NotFound() {
    return (
        <>
            <Header2 />
            <div className="notFound-component">
                <p>Página no encontrada</p>
            </div>
            <Footer />
        </>

    );
}

export default NotFound;