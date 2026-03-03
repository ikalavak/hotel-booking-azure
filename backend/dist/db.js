"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mssql_1 = __importDefault(require("mssql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || "",
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: true, // required for Azure SQL
        trustServerCertificate: false
    }
};
const connectDB = async () => {
    try {
        await mssql_1.default.connect(config);
        console.log("✅ Connected to Azure SQL Database");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
exports.default = mssql_1.default;
