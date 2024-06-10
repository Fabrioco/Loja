import React, { FormEvent, useContext, useState } from "react";
import { TheContext } from "../../context/auth";
import register from "../../assets/images/register.svg";
import { InputLabel } from "../../components/InputLabel/InputLabel";

import "./Register.css";
import { Link } from "react-router-dom";
export interface UserData {
  uid?: string;
  name?: string;
  date?: string;
  gender?: string;
  address?: string;
  email?: string;
  password?: string;
}
export function Register() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typePassword, setTypePassword] = useState("password");

  const { signUp, errorHTML } = useContext(TheContext);

  const submitRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(email, password, name, date, gender, address);
  };

  const showPassword = () => {
    if (typePassword == "password") {
      setTypePassword("text");
    } else {
      setTypePassword("password");
    }
  };

  return (
    <div className="container-register">
      <img src={register} alt="Register Logo" id="img-register" />
      <form onSubmit={submitRegister}>
        <h1>Cadatre-se</h1>
        <InputLabel
          nameId="inputName"
          label="Nome Completo:"
          placeholder="Lucas Da Silva"
          type="text"
          value={name}
          onchange={(e) => setName(e.target.value)}
        />
        <InputLabel
          nameId="inputDate"
          label="Data de nascimento:"
          placeholder="01/01/2001"
          type="date"
          value={date}
          onchange={(e) => setDate(e.target.value)}
        />
        <div>
          <label htmlFor="selectGender" id="labelGender">
            Gênero:
          </label>
          <select
            id="selectGender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Selecione o gênero</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <InputLabel
          nameId="inputAddress"
          label="Endereço residencial:"
          placeholder="Rua Avenida Brasil N° 302"
          type="text"
          value={address}
          onchange={(e) => setAddress(e.target.value)}
        />
        <InputLabel
          nameId="inputEmail"
          label="Email:"
          placeholder="lucassilva@yahoo.com"
          type="email"
          value={email}
          onchange={(e) => setEmail(e.target.value)}
        />
        <InputLabel
          nameId="inputPassword"
          label="Senha:"
          placeholder="********"
          type={typePassword}
          value={password}
          onchange={(e) => setPassword(e.target.value)}
        />
        <input
          type="button"
          onClick={showPassword}
          value={
            typePassword == "password" ? "Mostrar Senha" : "Esconder Senha"
          }
          className="btnShowPassword"
        />

        <input type="submit" value="Cadastrar" className="btn" />
        {errorHTML !== "" && <span className="errorHTML">{errorHTML}</span>}
        <span>
          Você já tem uma conta?
          <Link to="/login">Clique aqui</Link>
        </span>
      </form>
    </div>
  );
}
