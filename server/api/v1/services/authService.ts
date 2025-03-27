import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbPool from "../config/db";

const registerUser = async ({ email, password, name, role = "patient" }: any) => {
  const hashedPassword = await bcrypt.hash(password, 10);
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

    return token;
  };

export default { registerUser, loginUser };
