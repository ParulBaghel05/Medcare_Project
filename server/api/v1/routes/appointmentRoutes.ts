import express from "express";
import { bookAppointment, getAppointmentsByPatientId, getAppointmentsByDoctorId, changeAppointmentStatus, getAllAppointments } from "../controllers/appointmentController";

const router = express.Router();
router.get("/",getAllAppointments)
router.post("/book", bookAppointment);
router.get("/patient/:id", getAppointmentsByPatientId);
router.get("/doctor/:id", getAppointmentsByDoctorId);
router.patch("/:id/status", changeAppointmentStatus);

export default router;