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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({
    // origin: ["http://localhost:4000", "http://localhost:4000/main/home"], // Allow requests from your Next.js frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const client = new pg_1.Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: "Book-Store",
});
app.get("/users-shared-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { limit } = req.query;
    try {
        const data = yield client.query(`SELECT * FROM "amazon-books" where published_date >= '2015-01-01'::date order by title LIMIT $1`, [limit ? limit : 50000]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.get("/best-seller", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const query = `select * from "amazon-books" where is_best_seller = true order by stars DESC`;
        const query = `select * 
            from "amazon-books"  
            where is_best_seller = true 
            and published_date >= '2010-01-01'::date 
            order by stars DESC, title ASC 
            limit 50
        `;
        const data = yield client.query(query);
        res.json({ rowCount: data.rowCount, data: data.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.get("/category/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { limit } = req.query;
    try {
        const query = `select * from "amazon-books" where category_name = $1 order by title limit $2`;
        const data = yield client.query(query, [id, limit ? limit : 50000]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashPassword = yield bcryptjs_1.default.hash(password, salt);
    const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
    `;
    // Define the actual values for the placeholders
    const values = [username, email, hashPassword];
    if (!username || !email || !password) {
        res.status(400).json({ error: "Missing required fields" });
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
        const result = yield client.query(query, [email]);
        const user = result.rows;
        if (user.length === 0) {
            res.status(404).json({ error: "User's email not found" });
            return;
        }
        if (!email || !password) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user[0].password);
        if (isPasswordCorrect === false) {
            res.status(400).json({ error: "Incorrect password" });
            return;
        }
        res.status(200).json({
            userId: user[0].id,
            userName: user[0].username,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to login", error: err });
    }
}));
app.post("/user-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const query = `SELECT * FROM users WHERE id = $1`;
    try {
        const result = yield client.query(query, [userId]);
        const user = result.rows;
        res.status(200).json({ data: user });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/change-user-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, change, inputValue } = req.body;
    try {
        let result;
        if (change === "password") {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hassPassword = yield bcryptjs_1.default.hash(inputValue, salt);
            result = yield client.query(`UPDATE users SET password = $1 WHERE id = $2`, [hassPassword, userId]);
        }
        else if (change === "username") {
            result = yield client.query(`UPDATE users SET username = $1 WHERE id = $2`, [inputValue, userId]);
        }
        else {
            result = yield client.query(`UPDATE users SET email = $1 WHERE id = $2`, [inputValue, userId]);
        }
        const user = result.rows;
        console.log(user);
        res.status(200).json({
            message: "Your changes were successful",
        });
    }
    catch (err) {
        console.error("Error updating user data:", err);
        res.status(500).json({
            message: "Failed to update data",
            error: err,
        });
    }
}));
app.get("/search-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM "amazon-books" WHERE title ILIKE '%' || $1 || '%' ORDER BY title limit $2`;
    // let query = `SELECT * FROM "amazon-books" WHERE title ILIKE '%' || $1 AND stars >= $2 AND stars <= $3 AND price >= $4 AND price <= $5`;
    const { searched, limit } = req.query;
    try {
        let data = yield client.query(query, [searched, limit ? limit : 50000]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/get-collections", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const query = `SELECT * FROM "book_collections" WHERE user_id = $1`;
    const numOfBooksInCollection = [];
    const query2 = `SELECT * FROM "saved_books" WHERE collection_id=$1 AND user_id=$2`;
    try {
        if (!userId) {
            res.status(400).json({ error: "User id is not found" });
            return;
        }
        const data = yield client.query(query, [userId]);
        for (const collection of data.rows) {
            const data2 = yield client.query(query2, [collection.id, userId]);
            numOfBooksInCollection.push({
                id: collection.id,
                count: data2.rowCount,
            });
        }
        res.json({
            rowCount: data.rowCount,
            data: data.rows,
            numOfBooksInCollection,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/add-collection", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name } = req.body;
    const query = `INSERT INTO "book_collections" (user_id, collection_name) VALUES ($1, $2)`;
    try {
        yield client.query(query, [userId, name]);
        res.json({ message: "Collection was successfully added" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/delete-collection", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, collectionsId } = req.body;
    const query = `DELETE FROM "book_collections" WHERE id=$1 AND user_id=$2`;
    try {
        for (const collectionId of collectionsId) {
            yield client.query(query, [collectionId, userId]);
        }
        res.json({ message: "Collection was successfully deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/save-book", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, bookId, collectionsId } = req.body;
    const query = `INSERT INTO "saved_books" (book_id, user_id, collection_id) VALUES ($1, $2, $3)`;
    try {
        for (const collectionId of collectionsId) {
            yield client.query(query, [bookId, userId, collectionId]);
        }
        res.json({ message: "Book was successfully added" });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/get-collection-saved-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, collectionId } = req.body;
    const query = `SELECT * FROM "saved_books" WHERE collection_id=$1 AND user_id=$2`;
    const books = [];
    try {
        const data = yield client.query(query, [collectionId, userId]);
        const dataRow = data.rows;
        for (const book of dataRow) {
            const getBook = yield client.query(`SELECT * FROM "amazon-books" WHERE _id=$1`, [book.book_id]);
            books.push(getBook.rows[0]);
        }
        res.json({ rowCount: data.rowCount, data: books });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
}));
app.post("/get-saved-books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    const query = `SELECT * FROM "saved_books" WHERE  user_id=$1`;
    try {
        const data = yield client.query(query, [userId]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
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
