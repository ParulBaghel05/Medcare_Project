import express from 'express';
import { getDoctors, getDoctor } from '../controllers/doctorController';

const router = express.Router();

router.get("/getDoctors", getDoctors);
router.get("/:id", getDoctor);
export default router;