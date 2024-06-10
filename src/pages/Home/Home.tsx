import trucker from "../../assets/images/truck-welcome.svg";
import "./Home.css";
import { Footer } from "../../components/Footer/Footer";

export default function Home() {
  return (
    <div className="container-home">
      <main className="main-content">
        <p id="main-p">
          SOMOS UMA EMPRESA ALTAMENTE QUALIFICADA PARA ENTREGAS, ENTREGAMOS NO
          PRAZO, PRODUTOS INTACTOS E COM UM ANO COMPLETO DE GARANTIA GRATUITA.
        </p>
        <img src={trucker} alt="Logo da empresa" />
      </main>
      <Footer />
    </div>
  );
}
