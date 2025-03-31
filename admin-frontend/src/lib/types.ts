export type Appointment = {
    id: string;
    patient: string;
    doctor: string;
    date: string;
    time: string;
    status: "pending" | "approved" | "declined";
  };