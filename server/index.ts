import express from "express";
import api from "./api/index";
import dotenv from "dotenv";
import dbPool from "./api/v1/config/db";
import cors from "cors";

dotenv.config();

const server = express();
const SERVER_PORT = process.env.PORT || 8001;

server.use(cors({
    origin:"*"
}))
server.use(express.json());
server.use('/api', api);

server.listen(SERVER_PORT, () =>console.log(`Server is running on port ${SERVER_PORT}`));
