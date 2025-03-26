import { Request, Response } from "express";
import DoctorService from "../services/doctorService";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await DoctorService.getAllDoctors();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getDoctor = async (req: Request, res: Response):Promise<any> => {
    try {
      const doctorId = parseInt(req.params.id);
      if (isNaN(doctorId)) {
        return res.status(400).json({ error: "Invalid doctor ID" });
      }
  
      const doctor = await DoctorService.getDoctorById(doctorId);
      res.status(200).json(doctor);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
};