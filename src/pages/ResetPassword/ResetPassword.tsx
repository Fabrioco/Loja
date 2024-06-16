import { useState } from "react";
import password from "../../assets/images/resetpassword.svg";
import { ButtonShared } from "../../components/Button/Button";
import { InputLabel } from "../../components/InputLabel/InputLabel";
import styles from './ResetPassword.module.css'

export function ResetPassword() {
    const [email, setEmail] = useState('')

    const handleResetPassword = () => {
        if (email === '') {
            alert("O campo não pode ser vazio!")
            return
        }
        alert('Email enviado com sucesso! (Brincadeira)')
    }

    return (
        <div className={styles.container}>
            <img src={password} alt="Esqueci_a_senha.svg" />
            <div>
                <InputLabel
                    label="Digite um email para enviarmos a confirmação"
                    nameId="inputResetPassword"
                    placeholder="Digite aqui..."
                    type="email"
                    value={email}
                    onchange={(e) => setEmail(e.target.value)}
                />
                <ButtonShared value='Enviar' className="btn" onClick={handleResetPassword} />
            </div>
        </div>
    );
}
