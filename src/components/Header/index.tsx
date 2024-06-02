import "./Header.css";
import { useAuth } from "../../context/auth";

export default function Header() {
  const { logout } = useAuth();
  const signOut = async () => {
    logout();
  };

  return (
    <header className="header">
      <h1>LOPES PAPELARIA</h1>
      <button onClick={signOut}>sair</button>
    </header>
  );
}
