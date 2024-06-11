import { useContext } from "react";
import { TheContext } from "../../context/auth";
import { ButtonShared } from "../../components/Button/Button";

export function Settings() {
  const { logout } = useContext(TheContext);
  return (
    <div>
      <h1>Settings</h1>
      <ButtonShared value="Sair da conta" onClick={() => logout()} />
    </div>
  );
}
