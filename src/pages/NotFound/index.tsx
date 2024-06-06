import { useNavigate } from "react-router-dom";
import { ButtonShared } from "../../components/Button/Button";
import styles from "./Notfound.module.css";

export function NotFound() {
  const navigate = useNavigate();

  function handleBackHome() {
    navigate("/");
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        404 <br /> Error Page not Found
      </h1>
      <ButtonShared
        value="Voltar para Início"
        onClick={handleBackHome}
      />
    </div>
  );
}
