import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbPool from "../config/db";

const registerUser = async ({ email, password, name, role = "patient" }: any) => {
  console.log(email,password,name);
  const salt=await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await dbPool.query(
    "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, hashedPassword, name, role]
  );
  return result.rows[0];
};

  const loginUser = async ({ email, password }: any) => {
    const result = await dbPool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return {
      token:token,
      user:user
    };
  };
  const google= async (user: any) => {
    try {
      if (!user) {
        return {
          success: false,
          message: "GOOGLE AUTH FAILED",
        };
      }
      const token = await jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        process.env.JWT_SECRET || "hellojwt",
        { expiresIn: "1d" }
      );
      return { success: true, token: token, user: user };
    } catch (error) {}
  }

export default { registerUser, loginUser,google };
