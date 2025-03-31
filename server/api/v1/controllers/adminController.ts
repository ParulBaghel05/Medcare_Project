import { Request, Response } from "express";
import authService from "../services/authService";

export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Fields cannot be empty" });
      return;
    }

    const token = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      token,
      message: "Login Successful",
    });

  } catch (error) {
    console.error("Error in admin login controller", error);
    res.status(500).json({ success: false, message: "Error in logging the admin" });
  }
};
