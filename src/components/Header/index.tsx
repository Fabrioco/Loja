import { Link, useLocation } from "react-router-dom";
import { TheContext } from "../../context/auth";
import { useContext, useEffect, useState } from "react";
import "./Header.css";

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
    setPage(path.split("/")[0]);
  }, [location]);

  const navLinks: { [key: string]: NavLink[] } = {
    home: [
      { to: "/mail", label: "Loja" },
      ...(user?.email === "admin@admin.com"
        ? [{ to: "/admin", label: "Administração" }]
        : []),
      ...(user === null
        ? [
          { to: "/register", label: "Registrar" },
          { to: "/login", label: "Entrar" },
        ]
        : []),
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
      ...(user !== null && user?.email !== "admin@admin.com"
        ? [{ to: "/settings", label: "Configurações" }]
        : []),
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
      ...(user !== null && user?.email !== "admin@admin.com"
        ? [{ to: "/settings", label: "Configurações" }]
        : []),
    ],
    resetpassword: [
      { to: "/", label: "Início" },
      { to: "/mail", label: "Loja" },
    ]
  };

  return (
    <header className="header">
      <h1>Lopes Papelaria</h1>
      <nav className="navigation">
        {navLinks[page]?.map((link) => (
          <Link key={link.to} to={link.to} className="links">
            {link.label}
          </Link>
        ))}
        {location.pathname.includes("item") && (
          <Link to="/mail" className="links">
            Loja
          </Link>
        )}
      </nav>
    </header>
  );
}
