import { Link, useLocation } from "react-router-dom";
import { TheContext } from "../../context/auth";
import { useContext } from "react";
import "./Header.css";
import { useEffect, useState } from "react";

interface NavLink {
  to: string;
  label: string;
}

export default function Header() {
  const { user } = useContext(TheContext);
  const location = useLocation();
  const [page, setPage] = useState<string>("home");

  useEffect(() => {
    const path = location.pathname.slice(1) || "home";
    setPage(path);
  }, [location]);

  const navLinks: { [key: string]: NavLink[] } = {
    home: [
      { to: "/mail", label: "Loja" },
      ...(user?.email === "admin@admin.com"
        ? [{ to: "/admin", label: "Administração" }]
        : []),
      { to: "/register", label: "Registrar" },
      { to: "/login", label: "Entrar" },
    ],
    admin: [
      { to: "/", label: "Início" },
      { to: "/mail", label: "Loja" },
    ],
    mail: [
      { to: "/", label: "Início" },
      ...(user?.email === "admin@admin.com"
        ? [{ to: "/admin", label: "Administração" }]
        : []),
      { to: "/cart", label: "Carrinho" },
      { to: "/settings", label: "Configurações" },
    ],
    register: [
      { to: "/", label: "Início" },
      { to: "/mail", label: "Loja" },
    ],
    login: [
      { to: "/", label: "Início" },
      { to: "/mail", label: "Loja" },
    ],
    settings: [
      { to: "/", label: "Início" },
      { to: "/mail", label: "Loja" },
      { to: "/cart", label: "Carrinho" },
    ],
    cart: [
      { to: "/", label: "Início" },
      { to: "/mail", label: "Loja" },
      { to: "/settings", label: "Configurações" },
    ],
  };

  return (
    <header className="header">
      <h1>LOPES PAPELARIA</h1>
      <nav className="navigation">
        {navLinks[page]?.map((link) => (
          <Link key={link.to} to={link.to} className="links">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
