import { UploadApiResponse } from "cloudinary";
import express, { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res
        .status(404)
        .json({ success: true, message: "No file uploaded" });
    }
    const fileBuffer = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      fileBuffer,
      {
        folder: "uploads",
      }
    );

    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.log("Error in uploading the image", error);
    return res
      .status(500)
      .json({ success: false, message: "Error in uploading the image" });
  }
});

export default router;