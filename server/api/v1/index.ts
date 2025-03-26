import express from "express";
import authRoutes from "../v1/routes/authRoutes";
import doctorRoutes from "../v1/routes/doctorRoutes";
import appointmentRoutes from "../v1/routes/appointmentRoutes";
import slotRoutes from "../v1/routes/slotRoutes";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/slot',slotRoutes);

export default router;