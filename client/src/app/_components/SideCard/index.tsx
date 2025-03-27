import styles from "./index.module.css";
import { SideCardProps } from "@/types/type";
import { forwardRef, useImperativeHandle, useRef } from "react";

const SideCard = forwardRef<{ reset: () => void }, SideCardProps>(({ title, data, handleFilter }, ref) => {
  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (formRef.current) {
        formRef.current.querySelectorAll('input[type="radio"]').forEach((input) => {
          (input as HTMLInputElement).checked = false;
        });
      }
    },
  }));

  return (
    <form className={styles.card} ref={formRef}>
      <p className={styles.cardTitle}>{title}</p>
      {data.map((item, index) => (
        <div className={styles.optionItem} key={`${title}-${index}`}>
          <input 
            type="radio" 
            id={`${title}-${item}`} 
            name={title} 
            value={item} 
            onChange={() => handleFilter(title.toLowerCase(), item)}
          />
          <label htmlFor={`${title}-${item}`}>{item}</label>
        </div>
      ))}
    </form>
  );
});

export default SideCard;
