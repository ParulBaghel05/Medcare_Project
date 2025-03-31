import { Request, Response } from "express";
import DoctorService from "../services/doctorService";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await DoctorService.getAllDoctors();
    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      doctors: doctors
    });
  } catch (err) {
    console.error("Error in getDoctors controller:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch doctors", 
      error: (err as Error).message 
    });
  }
};

export const getDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid doctor ID",
        error: "Doctor ID must be a number"
      });
    }

    const doctor = await DoctorService.getDoctorById(doctorId);
    res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      doctor: doctor
    });
  } catch (err) {
    console.error("Error in getDoctor controller:", err);
    res.status(404).json({ 
      success: false, 
      message: "Doctor not found", 
      error: (err as Error).message 
    });
  }
};

export const createDoctor = async (req: Request, res: Response): Promise<any> => {
  try {
    const doctor_details = req.body?.doctor_details || req.body; 

    if (!doctor_details || Object.keys(doctor_details).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Doctor details are missing or empty in the request body"
      });
    }

    const doctor = await DoctorService.create(doctor_details);
    
    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      doctor
    });

  } catch (err: unknown) {
    console.error("Error in createDoctor controller:", err);

    return res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

export const uploadImage = async (req: Request, res: Response):Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }
    
    const url = await DoctorService.uploadImage(req.file);
    
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: url
    });
  } catch (err) {
    console.error("Error in uploadImage controller:", err);
    res.status(400).json({ 
      success: false, 
      message: "Error uploading image", 
      error: (err as Error).message 
    });
  }
};

export const updateDoctor = async (req: Request, res: Response):Promise<any> => {
  try {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid doctor ID",
        error: "Doctor ID must be a number"
      });
    }
    
    const doctorFields = req.body;
    
    const doctor = await DoctorService.updateDoctor(doctorId, doctorFields);
    
    res.status(200).json(doctor);
  } catch (err) {
    console.error("Error in updateDoctor controller:", err);
    res.status(404).json({ 
      success: false, 
      message: "Failed to update doctor", 
      error: (err as Error).message 
    });
  }
};

export const deleteDoctor = async (req: Request, res: Response):Promise<any> => {
  try {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid doctor ID",
        error: "Doctor ID must be a number"
      });
    }
    
    await DoctorService.deleteDoctor(doctorId);
    
    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (err) {
    console.error("Error in deleteDoctor controller:", err);
    res.status(404).json({ 
      success: false, 
      message: "Failed to delete doctor", 
      error: (err as Error).message 
    });
  }
};