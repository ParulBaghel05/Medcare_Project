export interface SideCardProps {
    title: string;
    data: string[];
    handleFilter: (type: string, value: string) => void;
  }
  
  export interface Doctor {
    id: number;
    name: string;
    speciality: string;
    experience: number;
    photo_url?: string;
    rating?: number;
    location: string;
    gender: string;
    disease?: string[];
  }
  
  export interface Slot {
    id: number;
    doctor_id: number;
    date: Date;
    start_time: string;
    end_time: string;
    is_available: boolean;
    doctor_name: string;
    location: string;
  }

  export interface SlotData {
    id: string;
    start_time: string;
    end_time: string;
    is_available?: boolean;
    time_slot_id:string
    // Add other properties as needed
  }
