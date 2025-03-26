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

export default { book };
