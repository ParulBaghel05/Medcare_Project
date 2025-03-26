import { Request, Response } from "express";
import AppointmentService from "../services/appointmentServices";

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await AppointmentService.book(req.body);
    res.status(201).json({success: true, message: "Appointment booked successfully",appointment: appointment});
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
