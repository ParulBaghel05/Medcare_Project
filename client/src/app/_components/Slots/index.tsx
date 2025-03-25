import Image from "next/image";
import styles from "./index.module.css";
export default function Slots(props:any){
    return(
        <div className={styles.container}> 
            <div className={styles.header}>
                <div className={styles.subheader}>
                    <Image src={props.isMorning?"/sun.svg":"/sunset.svg"} alt="" width={24} height={22}/>
                    {props.isMorning?<p>Morning</p>:<p>Evening</p>}
                </div>
                <p>3 slots</p>
            </div>
            <div className={styles.slotsection}>
               {props.data.map((slot:any,id:number)=>(
                 <button key={id}>
                    {slot.time}
                 </button>
               ))}
            </div>
        </div>
    )
}