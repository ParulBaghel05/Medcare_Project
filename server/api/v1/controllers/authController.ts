import { Request, Response } from "express";
import AuthService from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.registerUser(req.body);
    res.status(201).json({success:true,message:"User registered successfully", user:user});
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await AuthService.loginUser(req.body);
    res.status(200).json({succes:true, message: "Logged in successfully", token:token });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
};
