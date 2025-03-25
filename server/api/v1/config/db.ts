import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const dbPool=new Pool({
    connectionString:process.env.DATABASE_URL
})

dbPool.on("connect",()=>{
    console.log("Connected to PostgreSQL database");
})

export default dbPool;