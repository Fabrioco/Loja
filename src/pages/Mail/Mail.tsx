import { useNavigate } from "react-router-dom";
import styles from "./Mail.module.css";
import { ButtonShared } from "../../components/Button/Button";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConnection";

export interface AllItemsProps {
  name: string;
  description: string;
  valor: string;
  type: string;
  imageUrl: string;
}

export function Mail() {
  const navigate = useNavigate();

  const [allItems, setAllItems] = useState<AllItemsProps[]>([]);

  const detailsProduct = (name: string) => {
    navigate(`/item/${name}`);
  };

  useEffect(() => {
    renderItem();
  }, []);

  const renderItem = async () => {
    const querySnapshot = await getDocs(collection(db, "ItemsToSell"));
    const items = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as AllItemsProps[];
    setAllItems(items);
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        {allItems &&
          allItems.map((item, index) => (
            <div key={index} className={styles.item}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.imgItem}
              />
              <h2 className={styles.nameItem}>{item.name}</h2>
              
              <p className={styles.descItem}>{item.description}</p>
              <ButtonShared
                className={styles.buttonProduct}
                value="ACESSAR"
                onClick={() => detailsProduct(item.name)}
              />
            </div>
          ))}
      </section>
    </div>
  );
}
