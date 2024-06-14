import { useState, useContext, useEffect } from "react";
import { TheContext } from "../../context/auth";
import { ButtonShared } from "../../components/Button/Button";
import { InputLabel } from "../../components/InputLabel/InputLabel";
import styles from "./Admin.module.css";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConnection";
import { IoClose } from "react-icons/io5";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AllItemsProps } from "../Mail/Mail";

export function Admin() {
  const { user, logout } = useContext(TheContext);

  const [inputItemAdd, setInputItemAdd] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [inputValueAdd, setInputValueAdd] = useState("");
  const [inputImgAdd, setInputImgAdd] = useState<File | null>(null);
  const [inputDescItem, setInputDescItem] = useState("");

  const [modalIsOpenedAddItem, setModalIsOpenedAddItem] = useState(false);
  const [isModalItemEdit, setIsModalItemEdit] = useState(false);

  const [allItems, setAllItems] = useState<AllItemsProps[]>([]);
  const [showItem, setShowItem] = useState<AllItemsProps[]>([]);
  const [inputSearchModalEdit, setInputSearchModalEdit] = useState("");

  const [inputNameEdit, setInputNameEdit] = useState('')
  const [inputDescEdit, setInputDescEdit] = useState('')
  const [inputCategoryEdit, setInputCategoryEdit] = useState('')
  const [inputImgEdit, setInputImgEdit] = useState<File | null>(null)
  const [inputValueEdit, setInputValueEdit] = useState('')

  const data = user?.date;
  const dataformated = data?.split("-").reverse().join("/");

  useEffect(() => {
    const renderAllItems = async () => {
      const querySnapshot = await getDocs(collection(db, "ItemsToSell"));
      const items = querySnapshot.docs.map((doc) =>
        doc.data()
      ) as AllItemsProps[];
      setAllItems(items);
    };

    renderAllItems();
  }, []);

  useEffect(() => {
    if (showItem?.length > 0) {
      const item = showItem[0]
      setInputNameEdit(item.name)
      setInputDescEdit(item.description)
      setInputCategoryEdit(item.type)
      setInputValueEdit(item.valor)
    }
  }, [showItem, allItems])


  const handleRegisterItem = async () => {
    if (
      selectValue !== "" &&
      inputItemAdd !== "" &&
      inputValueAdd !== "" &&
      inputImgAdd !== null
    ) {
      const firstLetterUpperCase = inputItemAdd[0].toUpperCase();
      const itemUpperCase = firstLetterUpperCase + inputItemAdd.substring(1);
      const storageItemRef = ref(storage, `/ItemsToSell/${itemUpperCase}`);

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
    setModalIsOpenedAddItem(!modalIsOpenedAddItem);
  };

  const signOut = async () => {
    logout();
  };

  const editOrRemoveItem = () => {
    setIsModalItemEdit(!isModalItemEdit);
  };

  const handleSearchItem = async () => {
    const docRef = doc(db, "ItemsToSell", `${inputSearchModalEdit}`)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const itemData = docSnap.data() as AllItemsProps
      setShowItem([itemData])
    }
  };

  const handleEditItem = async () => {
    if (inputImgEdit) {
      const storageRef = ref(storage, `ItemsToSell/${inputSearchModalEdit}`);
      await deleteObject(storageRef);

      const storageItemRef = ref(storage, `/ItemsToSell/${inputNameEdit}`);
      await uploadBytes(storageItemRef, inputImgEdit);

      const downloadURL = await getDownloadURL(storageItemRef);

      const docRef = doc(db, "ItemsToSell", `${inputSearchModalEdit}`);

      await updateDoc(docRef, {
        description: inputDescEdit,
        imageUrl: downloadURL,
        type: inputCategoryEdit,
        valor: inputValueEdit,
      });
      alert('Item atualizado com sucesso')

    } else {
      const docRef = doc(db, "ItemsToSell", `${inputSearchModalEdit}`);

      await updateDoc(docRef, {
        description: inputDescEdit,
        type: inputCategoryEdit,
        valor: inputValueEdit,
      });
      alert('Item atualizado com sucesso')

    }
    setInputNameEdit('')
    setInputDescEdit('')
    setInputValueEdit('')
    setInputCategoryEdit('')
    setInputImgEdit(null)
    setInputSearchModalEdit('')

  }

  const handleDeleteItem = async () => {
    await deleteDoc(doc(db, "ItemsToSell", `${inputSearchModalEdit}`))
    const storageRef = ref(storage, `ItemsToSell/${inputSearchModalEdit}`)

    deleteObject(storageRef).then(() => {
      alert("Produto Deletado")
      setInputNameEdit('')
      setInputDescEdit('')
      setInputValueEdit('')
      setInputCategoryEdit('')
      setInputImgEdit(null)
      setInputSearchModalEdit('')
    })
  }

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
          <span>Adicionar produtos á loja</span>
          <ButtonShared
            onClick={handleModalIsOpened}
            value="Adicionar"
            className="btn"
          />
        </div>
        <div>
          <span>Pesquisar produtos</span>
          <ButtonShared
            value="Pesquisar"
            className="btn"
            onClick={editOrRemoveItem}
          />
        </div>
      </article>

      <div
        className={
          modalIsOpenedAddItem ? styles.modalAddActive : styles.modalAddClosed
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

      <div
        className={
          isModalItemEdit ? styles.modalAddActive : styles.modalAddClosed
        }
      >
        <button onClick={editOrRemoveItem} className={styles.buttonCloseModal}>
          <IoClose size={40} color="#FF0000" />
        </button>
        <section className={styles.sectionModal}>
          <h2 className={styles.titleModal}>Pesquisar Produtos</h2>
          <div>
            <label htmlFor="list-products">Pesquise o produto:</label>
            <select name="" id="" value={inputSearchModalEdit} onChange={(e) => setInputSearchModalEdit(e.target.value)}>
              <option value="">{allItems.length > 0 ? 'Selecione' : "Ainda não há produtos"}</option>
              {allItems.map((item, index) => (
                <option value={item.name} key={index}>{item.name}</option>
              ))}
            </select>
            <ButtonShared
              className={styles.button}
              value="Buscar"
              type="button"
              onClick={handleSearchItem}
            />

            {allItems.length != 0 && (
              <>
                <InputLabel
                  value={inputDescEdit}
                  placeholder=""
                  nameId="input-description-modal-edit"
                  label="Descrição do produto: "
                  type="text"
                  onchange={(e) => setInputDescEdit(e.target.value)}
                />
                <div className={styles.selectCategory}>
                  <label htmlFor="selectCategory">Selecione a categoria:</label>
                  <select
                    id="selectCategory"
                    value={inputCategoryEdit}
                    onChange={(e) => setInputCategoryEdit(e.target.value)}
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
                  type="file"
                  placeholder="Fazer upload da imagem"
                  label="Escreva a Url da imagem:"
                  nameId="inputImgAdd"
                  onchange={(e) => {
                    const files = e.target.files;
                    if (files && files[0]) {
                      setInputImgEdit(files[0]);
                    }
                  }}
                />
                <InputLabel
                  value={inputValueEdit}
                  placeholder=''
                  nameId="input-value-modal-edit"
                  label="Valor do produto: "
                  type="text"
                  onchange={(e) => setInputValueEdit(e.target.value)}
                />

                <ButtonShared value="Editar Produto" onClick={handleEditItem} className="btn" />
                <ButtonShared value="Excluir Produto" onClick={handleDeleteItem} className="btn" />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
