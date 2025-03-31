import dbPool from "../config/db";

interface Appointment {
  doctor_id: number;
  patient_id: number;
  doctor_slot_id: number;
  appointment_date: string;
  type: "in_person" | "virtual";
}

const book = async (appointmentData: Appointment) => {
  const { doctor_id, patient_id, doctor_slot_id, appointment_date, type } = appointmentData;
  
  console.log(doctor_id, patient_id, doctor_slot_id, appointment_date, type)
  const slotCheck = await dbPool.query(
    "SELECT is_available FROM time_slots WHERE id = $1",
    [doctor_slot_id]
  );

  if (slotCheck.rows.length === 0 || !slotCheck.rows[0].is_available) {
    throw new Error("Selected time slot is not available");
  }

  const result = await dbPool.query(
    `INSERT INTO appointments (doctor_id, patient_id, doctor_slot_id, appointment_date, type, status)
     VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
    [doctor_id, patient_id, doctor_slot_id, appointment_date, type]
  );

  await dbPool.query("UPDATE time_slots SET is_available = false WHERE id = $1", [doctor_slot_id]);

  return result.rows[0];
};

export const getByPatientId = async (patientId: number) => {
  const result = await dbPool.query(
    "SELECT * from appointments INNER JOIN users on appointments.patient_id=users.id INNER JOIN doctor_slots on appointments.doctor_slot_id=doctor_slots.id where appointments.patient_id=$1",[patientId]
  );
  return result.rows;
};

export const getByDoctorId = async (doctorId: number) => {
  const result = await dbPool.query(
    "SELECT * from appointments INNER JOIN users on appointments.patient_id=users.id INNER JOIN doctor_slots on appointments.doctor_slot_id=doctor_slots.id where appointments.doctor_id=$1",[doctorId]
  );
  return result.rows;
};

export const getAllAppointments=async()=>{
  const result = await dbPool.query("SELECT ap.id as id,ap.status as status,us.name as Patient, doc.name as Doctor, ts.date as Date,ts.start_time as Time,ap.type as Type from appointments as ap JOIN users as us on ap.patient_id = us.id JOIN doctors as doc on ap.doctor_id=doc.id JOIN time_slots as ts on ap.doctor_slot_id=ts.id");
  return result.rows;
}

export const updateAppointmentStatus = async (appointmentId: number, status: string) => {
  if (!["approved", "declined"].includes(status.toLowerCase())) {
    throw new Error("Invalid status. Allowed values: 'approved' or 'declined'");
  }

  const result = await dbPool.query(
    "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
    [status.toLowerCase(), appointmentId]
  );

  if (result.rows.length === 0) {
    throw new Error("Appointment not found");
  }

  return result.rows[0];
};

export default { book, getByPatientId, getByDoctorId, updateAppointmentStatus,getAllAppointments };