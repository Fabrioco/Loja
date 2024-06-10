import { useState, useContext } from "react";
import { TheContext } from "../../context/auth";
import { ButtonShared } from "../../components/Button/Button";
import { InputLabel } from "../../components/InputLabel/InputLabel";
import styles from "./Admin.module.css";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConnection";
import { IoClose } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IoLogOut } from "react-icons/io5";

export function Admin() {
  const { user, logout } = useContext(TheContext);

  const [inputItemAdd, setInputItemAdd] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [inputValueAdd, setInputValueAdd] = useState("");
  const [inputImgAdd, setInputImgAdd] = useState<File | null>(null);
  const [inputDescItem, setInputDescItem] = useState("");
  const [modalIsOpened, setModalIsOpened] = useState(false);

  const data = user?.date;
  const dataformated = data?.split("-").reverse().join("/");

  const handleRegisterItem = async () => {
    if (
      selectValue !== "" &&
      inputItemAdd !== "" &&
      inputValueAdd !== "" &&
      inputImgAdd !== null
    ) {
      const storageItemRef = ref(storage, `/ItemsToSell/${inputItemAdd}`);

      const firstLetterUpperCase = inputItemAdd[0].toUpperCase();
      const itemUpperCase = firstLetterUpperCase + inputItemAdd.substring(1);

      try {
        await uploadBytes(storageItemRef, inputImgAdd);

        const downloadURL = await getDownloadURL(storageItemRef);

        await setDoc(doc(db, "ItemsToSell", `${itemUpperCase}`), {
          name: itemUpperCase,
          description: inputDescItem,
          type: selectValue,
          valor: inputValueAdd,
          imageUrl: downloadURL,
        });

        setInputItemAdd("");
        setInputValueAdd("");
        setInputImgAdd(null);
        setInputDescItem("");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Preencha todos os campos");
    }
  };
  const handleModalIsOpened = () => {
    setModalIsOpened(!modalIsOpened);
  };

  const signOut = async () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <span className={styles.span}>Olá, {user?.name}</span>
        <span className={styles.span}>{user?.gender}</span>
        <span className={styles.span}>Data de nascimento: {dataformated}</span>
        <span className={styles.span}>Endereço: {user?.address}</span>
        <ButtonShared value="Sair" className="btn" onClick={signOut} />
      </section>
      <article>
        <div>
          <span>Itens da loja</span>
          <ButtonShared
            onClick={handleModalIsOpened}
            value="Adicionar itens à loja"
          />
        </div>
      </article>
      <div
        className={
          modalIsOpened ? styles.modalAddActive : styles.modalAddClosed
        }
      >
        <button
          onClick={handleModalIsOpened}
          className={styles.buttonCloseModal}
        >
          <IoClose size={40} color="#FF0000" />
        </button>
        <section className={styles.sectionModal}>
          <h2 className={styles.titleModal}>Adicionar item</h2>
          <div>
            <InputLabel
              type="text"
              placeholder="Ex: Caneta de 4 cores"
              label="Digite o item para ser adicionado: "
              nameId="inputAddItemAdmin"
              value={inputItemAdd}
              onchange={(e) => setInputItemAdd(e.target.value)}
            />
            <InputLabel
              type="text"
              placeholder="Ex: 2,50"
              label="Digite o valor do produto:"
              nameId="inputAddValueAdmin"
              value={inputValueAdd}
              onchange={(e) => setInputValueAdd(e.target.value)}
            />
            <InputLabel
              type="file"
              placeholder="Fazer upload da imagem"
              label="Escreva a Url da imagem:"
              nameId="inputImgAdd"
              onchange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  setInputImgAdd(files[0]);
                }
              }}
            />
            <div className={styles.selectCategory}>
              <label htmlFor="selectCategory">Selecione a categoria:</label>
              <select
                id="selectCategory"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Qualquer Faixa Etária">
                  Qualquer Faixa Etária
                </option>
                <option value="Infantil">Infantil</option>
                <option value="Adulto">Adulto</option>
              </select>
            </div>
            <InputLabel
              label="Digite a descrição do produto:"
              nameId="inputDescAdmin"
              placeholder="Caneta com 4 cores, azul, verde, vermelho, preto"
              type="text"
              value={inputDescItem}
              onchange={(e) => setInputDescItem(e.target.value)}
            />
            <ButtonShared
              className={styles.button}
              value="Adicionar"
              type="button"
              onClick={handleRegisterItem}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
