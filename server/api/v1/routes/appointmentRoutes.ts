import express from "express";
import { bookAppointment } from "../controllers/appointmentController";

const router = express.Router();

router.post("/book", bookAppointment);

export default router;