import styles from "./page.module.css";
import Slots from "@/app/_components/Slots";
import data from "@/data/data.json";

export default function Schedule() {
  return (
    <div className={styles.main}>
      <div className={styles.main1}>
        <div className={styles.fText}>
          Book Your Next Doctor Visit in Seconds.
        </div>
        <div className={styles.sText}>
          CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need.
        </div>
      </div>
      <div className={styles.main2}>
                <div className={styles.cont1}>
                    <div className={styles.schBtn}>
                        <p>Schedule Appointment</p>
                        <button>Book Appointment</button>
                    </div>
                    <div className={styles.bookBtn}>
                        <button>Book Video Consult</button>
                        <button>Book Hospital Visit</button>
                    </div>
                    <p>{data[0].location}</p>
                    <Slots isMorning={true} data={data[0].slots_available.morning}/>
                    <Slots isMorning={false} data={data[0].slots_available.evening}/>
                    <button>Next</button>
                </div>
            </div>
    </div>
  );
}
