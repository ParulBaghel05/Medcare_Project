import dbPool from "../config/db";

const getAllDoctors = async () => {
  const result = await dbPool.query("SELECT * FROM doctors");
  return result.rows;
};

const getDoctorById = async (id: number) => {
  const result = await dbPool.query("SELECT * FROM doctors WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    throw new Error("Doctor not found");
  }
  
  return result.rows[0];
};

export default { getAllDoctors, getDoctorById };