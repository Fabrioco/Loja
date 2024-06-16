import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import { ButtonShared } from "../../components/Button/Button";
import styles from "./Cart.module.css";
import { useNavigate } from "react-router-dom";
import { TheContext } from "../../context/auth";

interface ItemsProps {
  type: string;
  description: string;
  name: string;
  imageUrl: string;
  valor: string;
}

export function Cart() {
  const { user } = useContext(TheContext);
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemsProps[]>([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("listWish") || "[]");
    if (local.length === 0) {
      localStorage.removeItem("listWish");
    } else {
      renderListWish(local);
    }
  }, [localStorage]);

  const renderListWish = async (localList: string[]) => {
    const itemsMap = await Promise.all(
      localList.map(async (name) => {
        const docRef = doc(db, "ItemsToSell", name);
        const docSnap = await getDoc(docRef);
        return docSnap.data() as ItemsProps;
      })
    );
    setItem(itemsMap);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...item];
    updatedItems.splice(index, 1);
    setItem(updatedItems);

    const localList = JSON.parse(localStorage.getItem("listWish") || "[]");
    localList.splice(index, 1);
    if (localList.length === 0) {
      localStorage.removeItem("listWish");
    } else {
      localStorage.setItem("listWish", JSON.stringify(localList));
    }
  };

  const handleFinishCart = () => {
    localStorage.removeItem("listWish")
    alert(
      `Compra realizada com sucesso. Agradecemos por ter comprado conosco, ${user?.gender === "Masculino" ? "Senhor" : "Senhora"
      } ${user?.name}!`
    );
  };

  return (
    <div className={styles.container}>
      <h1>Carrinho</h1>
      <section className={styles.itemsContainer}>
        {item.length === 0 ? (
          <span className={styles.msgNoItem}>Adicione algo ao seu carrinho</span>
        ) : (
          item.map((item, index) => (
            <div key={index} className={styles.item}>
              <h2>{item.name}</h2>
              <span>Valor: {item.valor}</span>
              <img src={item.imageUrl} alt={item.name} />
              <ButtonShared
                value="Remover"
                onClick={() => handleRemoveItem(index)}
                className="btn"
              />
            </div>
          ))
        )}
      </section>
      {item.length === 0 ? (
        <ButtonShared
          value="Voltar para o loja"
          onClick={() => navigate("/mail")}
          className="btn"
        />
      ) : (
        <ButtonShared
          value="Finalizar compra"
          onClick={handleFinishCart}
          className="btn"
        />
      )}
    </div>
  );
}
