"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./api/index"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./api/v1/config/db"));
dotenv_1.default.config();
const server = (0, express_1.default)();
const SERVER_PORT = process.env.PORT || 8001;
server.use(express_1.default.json());
server.use('/api', index_1.default);
server.listen(SERVER_PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.connect();
        console.log(`Server is running on port ${SERVER_PORT}`);
    }
    catch (error) {
        console.error("Error in starting the server", error);
    }
}));
