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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const client = new pg_1.Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: "Book-Store",
});
app.get("/users-shared-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield client.query(`SELECT * FROM "amazon-books" LIMIT 10`);
        res.json({ rowCount: data.rowCount, data: data.rows });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hassPassword = yield bcryptjs_1.default.hash(password, salt);
    const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
    `;
    // Define the actual values for the placeholders
    const values = [username, email, hassPassword];
    if (!username || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        yield client.query(query, values);
        res.status(200).json({ message: "User created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user", error: err });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email ILIKE $1`;
    try {
        const user = yield client.query(query, [email]);
        console.log(user.rows);
        if (user.rows.length === 0) {
            res.status(404).json({ message: "User's email not found" });
            return;
        }
        if (!email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.rows[0].password);
        if (!email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        if (isPasswordCorrect === false) {
            res.status(400).json({ message: "Incorrect password" });
            return;
        }
        res.status(200).json({
            message: "Login successful",
        });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}));
const port = process.env.PORT || 3000;
function start() {
    try {
        client.connect((err) => {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log("connected to database");
            console.log();
        });
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    }
    catch (err) {
        console.log(err);
    }
}
start();
/*
    client.query(`SELECT * FROM "amazon-books" limit 2`, (err, res) => {
        if (err) throw err;
        console.log(res.rows);
    });


    app.get("/", (req, res) => {
        client.query(`SELECT * FROM "amazon-books" LIMIT 2`)
            .then((result) => {
                console.log(result.rows);
                res.json({ data: result.rows });
            })
            .catch((err) => {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Failed to retrieve data" });
            });
    });
 */
