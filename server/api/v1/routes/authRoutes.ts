import express,{Request,Response} from "express";
import { register, login } from "../controllers/authController";
import { passport } from "../config/passport";
import authService from "../services/authService";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));


router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    async (req: Request, res: Response): Promise<any> => {
      try {
        const result = await authService.google(req.user);
        if (!result?.success) {
          throw new Error(result?.message);
        }
        if (!result.token) {
          return res.status(400).json({ message: "Token not found" });
        }
        const decodedUser = await jwt.decode(result.token);
        const userString = JSON.stringify(decodedUser);
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/success?token=${result.token}&user=${userString}`
        );
      } catch (error) {
        console.log("Error in google callback", error);
        return res
          .status(500)
          .json({ success: false, message: "ERROR IN GOOGLE AUTH" });
      }
    }
  );

export default router;
