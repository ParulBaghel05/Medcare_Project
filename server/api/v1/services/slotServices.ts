import dbPool from "../config/db";

interface Slot {
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const getSlotsByDoctor = async (doctor_id: number) => {
  const result = await dbPool.query(
    "SELECT * FROM time_slots WHERE doctor_id = $1 ORDER BY date, start_time",
    [doctor_id]
  );
  return result.rows[0];
};

const createSlot = async (slotData: Slot) => {
  const { doctor_id, date, start_time, end_time, is_available } = slotData;

  const result = await dbPool.query(
    `INSERT INTO time_slots (doctor_id, date, start_time, end_time, is_available)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [doctor_id, date, start_time, end_time, is_available]
  );

  return result.rows[0];
};

const updateSlotAvailability = async (slot_id: number, is_available: boolean) => {
  const result = await dbPool.query(
    "UPDATE time_slots SET is_available = $1 WHERE id = $2 RETURNING *",
    [is_available, slot_id]
  );

  if (result.rows.length === 0) {
    throw new Error("Slot not found");
  }

  return result.rows[0];
};

export default { getSlotsByDoctor, createSlot, updateSlotAvailability };
