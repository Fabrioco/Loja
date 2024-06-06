import { ButtonShared } from "../../components/Button/Button";
import { items } from "../../data/items";
import styles from "./Mail.module.css";

export function Mail() {
  const detailsProduct = (item: string) => {
    alert(item);
  };

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
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
