import { useNavigate, useParams } from "react-router-dom";
import { ButtonShared } from "../../components/Button/Button";
import { useContext, useEffect, useReducer, useState } from "react";
import { TheContext } from "../../context/auth";
import styles from "./Product.module.css";
import { AllItemsProps } from "../Mail/Mail";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConnection";
import { reducer } from "./reducer/reducer";

export function Product() {
  const navigate = useNavigate();
  const [item, setItem] = useState<AllItemsProps | null>(null);
  const [typeOfItem, setTypeOfItem] = useState("");
  const [itemsSameCategory, setItemsSameCategory] = useState<AllItemsProps[]>(
    []
  );
  const [state, dispatch] = useReducer(reducer, { counter: 0 });

  const { user } = useContext(TheContext);
  const { name } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "ItemsToSell", `${name}`);
      const docSnap = await getDoc(docRef);


      if (docSnap.exists()) {
        const itemData = docSnap.data() as AllItemsProps;
        setItem(itemData);
        showTypeOfItem(itemData.type);

        const querySnapshot = await getDocs(collection(db, "ItemsToSell"));
        const items = querySnapshot.docs.map((doc) =>
          doc.data()
        ) as AllItemsProps[];
        const itemsFiltered = items.filter(
          (doc) => doc.type === itemData.type && doc.name !== itemData.name
        );
        setItemsSameCategory(
          itemsFiltered.slice(state.counter, state.counter + 3)
        );
      }
    };

    fetchData();
  }, [name, state]);

  const showTypeOfItem = (type: string) => {
    if (type === "Qualquer Faixa Etária") {
      setTypeOfItem("todas as idades");
    } else if (type === "Infantil") {
      setTypeOfItem("Crianças");
    } else if (type === "Adulto") {
      setTypeOfItem("Adulto");
    }
  };

  const handleAddItemToCart = (itemName: string | undefined) => {
    if (user) {
      const listWish =
        JSON.parse(localStorage.getItem("listWish") as string) || [];
      listWish.push(itemName);
      localStorage.setItem("listWish", JSON.stringify(listWish));
    } else {
      navigate("/login");
    }
  };

  const handleSeeProduct = (nameItem: string) => {
    navigate(`/item/${nameItem}`);
  };

  const handleBackPage = () => {
    navigate("/mail");
  };

  return (
    <div className={styles.container}>
      <ButtonShared
        onClick={handleBackPage}
        value="Voltar"
        className={styles.btnBack}
      />
      <section className={styles.section}>
        {item && (
          <>
            <img
              src={item.imageUrl}
              alt={item.name}
              className={styles.imgItem}
            />
            <div className={styles.contentItem}>
              <h1 className={styles.nameItem}>{item.name}</h1>
              <span className={styles.typeItem}>Produto para {typeOfItem}</span>
              <p className={styles.description}>{item.description}</p>
              <span className={styles.valueItem}>Valor: R${item.valor}</span>
              <ButtonShared
                value="Adicionar ao carrinho"
                className="btn"
                onClick={() => handleAddItemToCart(item.name)}
              />
            </div>
          </>
        )}
      </section>

      <article className={styles.arcticle}>
        <h2 className={styles.titleArcticle}>
          Itens semelhantes à {item?.name}
        </h2>
        <div className={styles.carrossel}>
          {itemsSameCategory.map((similarItem) => (
            <div key={similarItem.name} className={styles.itemCarrosel}>
              <img
                src={similarItem.imageUrl}
                alt={similarItem.name}
                className={styles.imgItemCarrosel}
              />
              <span className={styles.nameItemCarrosel}>
                {similarItem.name}
              </span>
              <ButtonShared
                value="Ver produto"
                onClick={() => handleSeeProduct(similarItem.name)}
                className={styles.buttonSeeProduct}
              />
            </div>
          ))}
        </div>
        <div>
          <ButtonShared
            value="Voltar"
            onClick={() => dispatch({ type: "decrement" })}
            disabled={state.counter <= 0}
          />
          <ButtonShared
            value="Proximo"
            onClick={() => dispatch({ type: "increment" })}
            disabled={itemsSameCategory.length <= 2}
          />
        </div>
      </article>
    </div>
  );
}
