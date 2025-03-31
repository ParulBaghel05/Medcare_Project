"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./page.module.css";
import Slots from "@/app/_components/Slots";
import DateSelector from "@/app/_components/DateSelector";
import { useParams, useRouter } from "next/navigation";
import { SlotData } from "@/types/type";
import { toast } from "react-toastify";

interface SlotsState {
  morning: SlotData[];
  evening: SlotData[];
}

type AppointmentType = "virtual" | "in_person" | null;

export default function Schedule() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params?.id as string;
  
  const [slots, setSlots] = useState<SlotsState>({ morning: [], evening: [] });
  const [location, setLocation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("virtual");
  const [selectedSlot, setSelectedSlot] = useState<SlotData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId) {
      fetchSlots(doctorId, selectedDate);
    }
  }, [doctorId, selectedDate]);

  const fetchSlots = (doctorId: string, date: Date): void => {
    setLoading(true);
    setError(null);
    setSelectedSlot(null);
    
    const formattedDate = date.toISOString().split('T')[0];
    
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/slot/${doctorId}`, {
        params: { date: formattedDate }
      })
      .then((res) => {
        if(!res.data.slots || !res.data.slots.length) {
          setSlots({morning: [], evening: []});
          return;
        }
        
        console.log("slots in axios req",res.data.slots)
        const morningSlots = res.data.slots.filter((slot: SlotData) => 
          parseInt(slot.start_time.slice(0,2)) <= 12
        );
        
        const eveningSlots = res.data.slots.filter((slot: SlotData) => 
          parseInt(slot.start_time.slice(0,2)) > 12
        );
        
        setSlots({morning: morningSlots, evening: eveningSlots});
        
        if(res.data.slots.length > 0) {
          setLocation(res.data.slots[0].location);
        }
      })
      .catch((error) => {
        console.error("Error fetching slots:", error);
        setError("Failed to load available slots. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
  };

  const handleAppointmentTypeSelect = (type: AppointmentType): void => {
    setAppointmentType(type);
  };

  const handleSlotSelect = (slot: SlotData): void => {
    console.log("selected slot",slot);
    setSelectedSlot(slot);
  };

  const handleBookAppointment = (): void => {
    // Validate all required selections are made
    if (!appointmentType) {
      setError("Please select appointment type (Video Consult or Hospital Visit)");
      return;
    }

    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError(null);

    const appointmentData = {
      patient_id:1,
      doctor_id: doctorId,
      doctor_slot_id: selectedSlot.time_slot_id,
      appointment_date: selectedDate.toISOString().split('T')[0],
      type: appointmentType,
    };



    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/appointment/book`, appointmentData)
      .then((res) => {
        toast.success("Appointment booked");
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        setError(
          error.response?.data?.message || 
          "Failed to book appointment. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.main}>
      <div className={styles.main1}>
        <div className={styles.fText}>Book Your Next Doctor Visit in Seconds.</div>
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
          
          {/* Date Selector */}
          <DateSelector onDateSelect={handleDateSelect} />
          
          {/* Appointment Type Selector */}
          <div className={styles.bookBtn}>
            <button 
              onClick={() => handleAppointmentTypeSelect("virtual")}
              className={appointmentType === "virtual" ? styles.activeBtn : ""}
            >
              Book Video Consult
            </button>
            <button 
              onClick={() => handleAppointmentTypeSelect("in_person")}
              className={appointmentType === "in_person" ? styles.activeBtn : ""}
            >
              Book Hospital Visit
            </button>
          </div>
          
          {/* Location */}
          <p>{location}</p>
          
          {/* Loading State */}
          {loading && <p className={styles.loadingText}>Loading available slots...</p>}
          
          {/* Error Message */}
          {error && <p className={styles.errorText}>{error}</p>}
          
          {/* Slots */}
          <Slots 
            isMorning={true} 
            data={slots.morning} 
            onSelectSlot={handleSlotSelect} 
            selectedSlotId={selectedSlot?.id}
          />
          <Slots 
            isMorning={false} 
            data={slots.evening} 
            onSelectSlot={handleSlotSelect}
            selectedSlotId={selectedSlot?.id}
          />
          
          {/* Next Button */}
          <button 
            className={`${styles.nextBtn} ${(!appointmentType || !selectedSlot) ? styles.disabledBtn : ""}`}
            onClick={handleBookAppointment}
            disabled={loading || !appointmentType || !selectedSlot}
          >
            {loading ? "Processing..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}