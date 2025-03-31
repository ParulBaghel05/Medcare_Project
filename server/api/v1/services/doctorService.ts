import dbPool from "../config/db";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import path from "path";
import fs from "fs";

interface Doctor {
  name: string;
  speciality: string;
  rating: number;
  experience: number;
  disease: Disease;
  photo_url: string;
  location: string;
  gender: string;
}

interface Disease {
  [key: string]: string; 
}

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

const create = async (doctorData: Doctor) => {
  const { 
    name, 
    speciality, 
    rating, 
    experience, 
    photo_url, 
    location, 
    gender, 
    disease 
  } = doctorData;

  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO doctors (
        name, 
        speciality, 
        rating, 
        experience, 
        photo_url, 
        location, 
        gender,
        disease
      )
      VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), $8) 
      RETURNING *`,
      [name, speciality, rating, experience, photo_url, location, gender.toUpperCase(), disease ? JSON.stringify(disease) : null]
    );

    await client.query("COMMIT");
    return result.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const uploadImage = async (file: Express.Multer.File) => {
  try {
    const tempPath = path.join(__dirname, '../uploads', file.filename || `${Date.now()}_${file.originalname}`);
    
    if (!fs.existsSync(path.dirname(tempPath))) {
      fs.mkdirSync(path.dirname(tempPath), { recursive: true });
    }
    
    fs.writeFileSync(tempPath, file.buffer);

    const result = await cloudinary.uploader.upload(tempPath, {
      folder: 'doctors',
      resource_type: 'image'
    });

    fs.unlinkSync(tempPath);
    
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

const updateDoctor = async (id: number, doctorData: Partial<Doctor>) => {
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (doctorData.name) {
      fields.push(`name = $${paramIndex}`);
      values.push(doctorData.name);
      paramIndex++;
    }

    if (doctorData.speciality) {
      fields.push(`speciality = $${paramIndex}`);
      values.push(doctorData.speciality);
      paramIndex++;
    }

    if (doctorData.rating !== undefined) {
      fields.push(`rating = $${paramIndex}`);
      values.push(doctorData.rating);
      paramIndex++;
    }

    if (doctorData.experience !== undefined) {
      fields.push(`experience = $${paramIndex}`);
      values.push(doctorData.experience);
      paramIndex++;
    }

    if (doctorData.photo_url) {
      fields.push(`photo_url = $${paramIndex}`);
      values.push(doctorData.photo_url);
      paramIndex++;
    }

    if (doctorData.location) {
      fields.push(`location = $${paramIndex}`);
      values.push(doctorData.location);
      paramIndex++;
    }

    if (doctorData.gender) {
      const genderUpper = doctorData.gender.toUpperCase();
      const validGenders = ["MALE", "FEMALE"];
      if (!validGenders.includes(genderUpper)) {
        throw new Error("Invalid gender value. Allowed values: MALE, FEMALE");
      }
      fields.push(`gender = $${paramIndex}`);
      values.push(genderUpper);
      paramIndex++;
    }

    if (doctorData.disease) {
      const diseaseObject = doctorData.disease;
      if (typeof diseaseObject === "object" && diseaseObject !== null) {
        fields.push(`disease = $${paramIndex}`);
        values.push(JSON.stringify(diseaseObject)); 
        paramIndex++;
      }
    }

    let updateResult
    if (fields.length > 0) {
      values.push(id);
      const updateQuery = `
        UPDATE doctors
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      updateResult = await client.query(updateQuery, values);

      if (updateResult.rows.length === 0) {
        throw new Error("Doctor not found");
      }      
    }
    
    await client.query("COMMIT");
    return { success: true, message: "Doctor updated successfully", doctors:updateResult?.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


const deleteDoctor = async (id: number) => {
  
  try {

    const deleteQuery = `
      DELETE FROM doctors
      WHERE id = $1
    `;
    const deleteResult = await dbPool.query(' DELETE FROM doctors WHERE id = $1', [id])
    if(!deleteResult.rowCount){
       throw new Error("Doctor not found")
    }
    return { success: true, message: "Doctor deleted successfully" };
  } catch (error) {
    return { success: false, message: "Unable to locate Doctor" };
    console.log()
  } 
};

export default { getAllDoctors, getDoctorById, create, uploadImage, updateDoctor, deleteDoctor};
