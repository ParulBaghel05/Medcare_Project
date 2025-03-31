import { Request, Response } from "express";
import AppointmentService from "../services/appointmentServices";

export const bookAppointment = async (req: Request, res: Response):Promise<any> => {
  try {
    const appointment = await AppointmentService.book(req.body);
    return res.status(201).json({success: true, message: "Appointment booked successfully",appointment: appointment});
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllAppointments=async(req:Request,res:Response):Promise<any>=>{
  try {
    const appointments=await AppointmentService.getAllAppointments();
    if(!appointments){
      return res.status(404).json({success:false,message:"No appointments found"});   
    }
    return res.status(200).json({success:true,appointments:appointments});
  } catch (error) {
    return res.status(500).json({success:false,message:"Error in getting appointments"}); 
  }
}

export const getAppointmentsByPatientId = async (req: Request, res: Response):Promise<any> => {
  try {
    const patientId = parseInt(req.params.id);
    if (isNaN(patientId)) {
      return res.status(400).json({ success: false, message: "Invalid patient ID" });
    }
    const appointments = await AppointmentService.getByPatientId(patientId);
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getAppointmentsByDoctorId = async (req: Request, res: Response):Promise<any> => {
  try {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }
    const appointments = await AppointmentService.getByDoctorId(doctorId);
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};



export const changeAppointmentStatus = async (req: Request, res: Response):Promise<any> => {
  try {
    const appointmentId = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    if (isNaN(appointmentId)) {
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    }

    const updatedAppointment = await AppointmentService.updateAppointmentStatus(appointmentId, status);

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updatedAppointment,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: (err as Error).message });
  }
};