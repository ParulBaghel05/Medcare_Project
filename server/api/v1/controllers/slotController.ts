import { Request, Response } from "express";
import SlotService from "../services/slotServices";

export const getSlotsByDoctor = async (req: Request, res: Response) => {
  try {
    const { doctor_id } = req.params;
    console.log(doctor_id);
    const slots = await SlotService.getSlotsByDoctor(parseInt(doctor_id));
    res.status(200).json({success: true, message: "Slots fetched successfully",slots: slots});
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const slot = await SlotService.createSlot(req.body);
    res.status(201).json({success: true, message: "Slot created successfully",slot: slot});
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const updateSlotAvailability = async (req: Request, res: Response) => {
  try {
    const { slot_id } = req.params;
    const { is_available } = req.body;
    const updatedSlot = await SlotService.updateSlotAvailability(parseInt(slot_id), is_available);
    res.status(200).json({success: true, message: "Slot updated successfully", updatedSlot: updatedSlot});
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
