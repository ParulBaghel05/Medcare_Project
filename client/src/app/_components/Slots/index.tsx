import Image from "next/image";
import styles from "./index.module.css";
import { SlotData } from "@/types/type";

interface SlotsProps {
  isMorning: boolean;
  data: SlotData[];
  onSelectSlot?: (slot: SlotData) => void;
  selectedSlotId?: string;
}

export default function Slots(props: SlotsProps) {
  // Format time function (optional - implement if you want to display time in a different format)
  const formatTime = (timeString: string) => {
    // You can customize this based on your time format requirements
    return timeString;
  };

  // Handle slot selection
  const handleSlotSelect = (slot: SlotData) => {
    if (props.onSelectSlot && (!slot.is_available || slot.is_available === true)) {
      console.log("selected slot",slot)
      props.onSelectSlot(slot);
    }
  };
  console.log("propsdata",props.data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.subheader}>
          <Image 
            src={props.isMorning ? "/sun.svg" : "/sunset.svg"} 
            alt={props.isMorning ? "Morning" : "Evening"} 
            width={24} 
            height={22}
          />
          {props.isMorning ? <p>Morning</p> : <p>Evening</p>}
        </div>
        <p>{props.data.length} slots</p>
      </div>
      <div className={styles.slotsection}>
        {props.data.map((slot: SlotData, id: number) => (
          <button 
            key={id}
            className={`
              ${styles.slotButton}
              ${props.selectedSlotId === slot.id ? styles.selectedSlot : ""}
              ${slot.is_available === false ? styles.unavailableSlot : ""}
            `}
            onClick={() => handleSlotSelect(slot)}
            disabled={slot.is_available === false}
          >
            {formatTime(slot.start_time)}
          </button>
        ))}
        {props.data.length === 0 && (
          <p className={styles.noSlots}>No {props.isMorning ? 'morning' : 'evening'} slots available</p>
        )}
      </div>
    </div>
  );
}