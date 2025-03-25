import express from "express";
import api from "./api/index";
import dotenv from "dotenv";
import dbPool from "./api/v1/config/db";

dotenv.config();

const server = express();
const SERVER_PORT = process.env.PORT || 8001;

server.use(express.json());
server.use('/api', api);

server.listen(SERVER_PORT, async () => {
    try {
        await dbPool.connect();
        console.log(`Server is running on port ${SERVER_PORT}`);
    } 
    catch (error) {
        console.error("Error in starting the server", error);
    }
});
