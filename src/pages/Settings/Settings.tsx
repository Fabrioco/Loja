import { useContext, useEffect, useState } from "react";
import { TheContext } from "../../context/auth";
import { ButtonShared } from "../../components/Button/Button";
import styles from "./Settings.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { InputLabel } from "../../components/InputLabel/InputLabel";
import { db } from "../../firebase/firebaseConnection";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { IoClose } from "react-icons/io5";
import { UserData } from "../Register/Register";

export interface DataStorageProps {
  inputAddressEditor: string;
  inputDateEditor: string;
  inputEmailEditor: string;
  inputGenderEditor: string;
  inputNameEditor: string;
  inputPasswordEditor: string;
}

export function Settings() {
  const { logout, user, storageUser } = useContext(TheContext);
  const [typeModal, setTypeModal] = useState<string>();
  const [typePassword, setTypePassword] = useState("password");

  const [inputNameEditor, setInputNameEditor] = useState<string>(
    user?.name || ""
  );
  const [inputEmailEditor, setInputEmailEditor] = useState<string>(
    user?.email || ""
  );
  const [inputPasswordEditor, setInputPasswordEditor] = useState<string>(
    user?.password || ""
  );
  const [inputGenderEditor, setInputGenderEditor] = useState<string>(
    user?.gender || ""
  );
  const [inputDateEditor, setInputDateEditor] = useState<string>(
    user?.date || ""
  );
  const [inputAddressEditor, setInputAddressEditor] = useState<string>(
    user?.address || ""
  );

  const [isOpenedModalEdit, setIsOpenedModalEdit] = useState(false);
  const [isOpenedModalAddress, setIsOpenedModalAddress] = useState(false);

  const data = user?.date;
  const dataformated = data?.split("-").reverse().join("/");

  const handleShowOption = (option: string) => {
    if (option === "Endereço") {
      setTypeModal(option);
    } else if (option === "Dados") {
      setTypeModal(option);
    }
  };

  const showPassword = (type: string) => {
    if (type === "hidden") {
      setTypePassword("hidden");
    } else {
      setTypePassword("show");
    }
  };

  const shoModalToEdit = () => {
    setIsOpenedModalEdit(!isOpenedModalEdit);
    setInputNameEditor(user?.name || "");
    setInputDateEditor(user?.date || "");
    setInputEmailEditor(user?.email || "");
    setInputGenderEditor(user?.gender || "");
    setInputPasswordEditor(user?.password || "");
  };

  console.log(inputNameEditor);

  const handleEditDataUser = async () => {
    const data = {
      ...user,
      date: inputDateEditor,
      email: inputEmailEditor,
      gender: inputGenderEditor,
      name: inputNameEditor,
      password: inputPasswordEditor,
      uid: user?.uid,
    };
    storageUser(data as UserData);
    const docRef = doc(db, "Users", `${user?.uid}`);
    await updateDoc(docRef, data)
      .then(() => {
        alert("Dados atualizados com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao atualizar verifique os campos!");
      });
  };

  const showModalToAddAddress = () => {
    setIsOpenedModalAddress(!isOpenedModalAddress);
    setInputAddressEditor(user?.address || "");
  };

  const changeAddressFirebase = async () => {
    const updatedData = {
      ...user,
      address: inputAddressEditor
    };

    if (user?.uid) {
      const docRef = doc(db, "Users", user.uid);
      try {
        await updateDoc(docRef, { address: inputAddressEditor });
        storageUser(updatedData as UserData);
        localStorage.setItem("@User", JSON.stringify(updatedData));
        alert("Endereço atualizado com sucesso!");
      } catch (error) {
        alert("Erro ao atualizar o endereço.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configurações</h1>

      <div className={styles.optionsContainer}>
        <div className={styles.options}>
          <span
            className={styles.btnSpan}
            onClick={() => handleShowOption("Dados")}
          >
            Dados Pessoais
          </span>
          <span
            className={styles.btnSpan}
            onClick={() => handleShowOption("Endereço")}
          >
            Endereço
          </span>
        </div>
        <ButtonShared
          value="Sair da conta"
          onClick={() => logout()}
          className={styles.btnLogout}
        />
        {typeModal === "Endereço" && (
          <div className={styles.modalAddress}>
            <h3 className={styles.subtitleAddress}>
              Seu Endereço: {user?.address}
            </h3>
            <ButtonShared
              value="EDITAR ENDEREÇO"
              className="btn"
              onClick={showModalToAddAddress}
            />
          </div>
        )}
        {typeModal === "Dados" && (
          <div className={styles.modalUser}>
            <span className={styles.spanInfoUser}>Nome: {user?.name}</span>
            <span className={styles.spanInfoUser}>Sexo: {user?.gender}</span>
            <span className={styles.spanInfoUser}>
              Nasido em: {dataformated}
            </span>
            <span className={styles.spanInfoUser}>
              Sua Senha:{" "}
              {typePassword === "hidden" ? "********" : `${user?.password}`}
              {typePassword === "hidden" ? (
                <FaEye onClick={() => showPassword("show")} />
              ) : (
                <FaEyeSlash onClick={() => showPassword("hidden")} />
              )}
            </span>
            <span className={styles.spanInfoUser}>
              Email Cadastrado: {user?.email}
            </span>
            <ButtonShared
              value="EDITAR"
              onClick={shoModalToEdit}
              className={styles.btnEditDataUser}
            />
          </div>
        )}
      </div>

      <div
        className={
          isOpenedModalEdit ? styles.modalEditOpened : styles.modalEditClosed
        }
      >
        <div>
          <button
            onClick={() => setIsOpenedModalEdit(false)}
            className={styles.buttonCloseModal}
          >
            <IoClose size={40} color="#FF0000" />
          </button>

          <InputLabel
            label="Editar Nome:"
            nameId="InputEditName"
            placeholder="Escreva aqui..."
            type="text"
            value={inputNameEditor}
            onchange={(e) => setInputNameEditor(e.target.value)}
          />
          <InputLabel
            label="Editar Email:"
            nameId="InputEditEmail"
            placeholder="Escreva aqui..."
            type="text"
            value={inputEmailEditor}
            onchange={(e) => setInputEmailEditor(e.target.value)}
          />
          <InputLabel
            label="Editar data de nascimento:"
            nameId="InputEditDate"
            placeholder="Escreva aqui..."
            type="date"
            value={inputDateEditor}
            onchange={(e) => setInputDateEditor(e.target.value)}
          />
          <div>
            <label htmlFor="selectGender" id="labelGender">
              Gênero:
            </label>
            <select
              id="selectGender"
              value={inputGenderEditor}
              onChange={(e) => setInputGenderEditor(e.target.value)}
            >
              <option value="">Selecione o gênero</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <InputLabel
            label="Editar Senha:"
            nameId="InputEditPassword"
            placeholder="Escreva aqui..."
            type="text"
            value={inputPasswordEditor}
            onchange={(e) => setInputPasswordEditor(e.target.value)}
          />
          <ButtonShared
            type="button"
            onClick={handleEditDataUser}
            value="Salvar"
            className="btn"
          />
        </div>
      </div>

      {isOpenedModalAddress && (
        <div
          className={
            isOpenedModalAddress
              ? styles.modalAddressOpened
              : styles.modalAddressClosed
          }
        >
          <div>
            <button
              onClick={() => setIsOpenedModalAddress(false)}
              className={styles.buttonCloseModal}
            >
              <IoClose size={40} color="#FF0000" />
            </button>

            <InputLabel
              label="Edite o Endereço: "
              nameId="InputAddressModal"
              placeholder="Digite aqui"
              type="text"
              value={inputAddressEditor}
              onchange={(e) => setInputAddressEditor(e.target.value)}
            />
            <ButtonShared value="EDITAR" className="btn" onClick={changeAddressFirebase} />
          </div>
        </div>
      )}
    </div>
  );
}
