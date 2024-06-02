import React from "react";
import trucker from "../../assets/images/truck-welcome.svg";
import "./Home.css";
import { Footer } from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container-home">
      <nav className="navigation-home">
        <Link className="links" to="/mail">
          Loja
        </Link>
        <div>
          <Link className="links" to="/register">
            Registrar
          </Link>
          <Link className="links" to="/login">
            Entrar
          </Link>
        </div>
      </nav>
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
