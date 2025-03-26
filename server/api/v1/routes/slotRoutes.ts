import express from "express";
import { getSlotsByDoctor, createSlot, updateSlotAvailability } from "../controllers/slotController";

const router = express.Router();

router.get("/:doctor_id", getSlotsByDoctor);
router.post("/", createSlot);
router.patch("/:slot_id", updateSlotAvailability);

export default router;
