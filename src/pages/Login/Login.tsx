import { FormEvent, useState } from "react";
import truck from "../../assets/images/truck-login.svg";
import { InputLabel } from "../../components/InputLabel/InputLabel";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/auth";

interface UserData {
  uid?: string;
  name: string;
  date: string;
  gender: string;
  address: string;
  email: string;
  password: string;
}

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorHTML, setErrorHTML] = useState("");
  const [typePassword, setTypePassword] = useState("password");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const showPassword = () => {
    setTypePassword(typePassword === "password" ? "text" : "password");
  };

  const submitLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/mail");
    } catch (error) {
      setErrorHTML("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="container-login">
      <img src={truck} alt="Truck Logo" id="img-login" />
      <form onSubmit={submitLogin}>
        <h1>Entrar</h1>
        <InputLabel
          label="Email:"
          placeholder="Lucasilva@gmail.com"
          type="email"
          value={email}
          onchange={(e) => setEmail(e.target.value)}
          nameId="inputEmailLogin"
        />
        <InputLabel
          label="Senha:"
          placeholder="********"
          type={typePassword}
          value={password}
          onchange={(e) => setPassword(e.target.value)}
          nameId="inputPasswordLogin"
        />
        <input
          type="button"
          onClick={showPassword}
          value={
            typePassword === "password" ? "Mostrar Senha" : "Esconder Senha"
          }
          className="btnShowPassword"
        />
        <input type="submit" value="Entrar" className="btn" />
        {errorHTML && <span>{errorHTML}</span>}

        <Link to="/resetpassword" id="resetpassword">
          Esqueceu a senha?
        </Link>
        <span>
          Não tem cadastro? <Link to="/register">Clique aqui</Link>
        </span>
      </form>
    </div>
  );
}
