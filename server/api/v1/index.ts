import express from "express";
import authRoutes from "../v1/routes/authRoutes";
import doctorRoutes from "../v1/routes/doctorRoutes";
import appointmentRoutes from "../v1/routes/appointmentRoutes";
import slotRoutes from "../v1/routes/slotRoutes";
import adminRoutes from "../v1/routes/adminRoutes";
import uploadController from "./controllers/uploadController";
import upload from "./middlewares/uploadMiddleware";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/slot',slotRoutes);
router.use('/admin',adminRoutes);
router.use('/upload', upload.single("image"), uploadController);

export default router;