import { Request, Response } from "express";
import AuthService from "../services/authService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const token = await AuthService.loginUser(req.body);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
};
