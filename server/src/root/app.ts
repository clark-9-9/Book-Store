import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pg, { Client } from "pg";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: "Book-Store",
});

app.get("/users-shared-books", async (req, res) => {
    try {
        const data = await client.query(
            `SELECT * FROM "amazon-books" LIMIT 10`
        );

        res.json({ rowCount: data.rowCount, data: data.rows });
    } catch (err) {
        console.log(err);
        throw err;
    }
});

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    const salt = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, salt);

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
        await client.query(query, values);
        res.status(200).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to create user", error: err });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email ILIKE $1`;

    try {
        const user = await client.query(query, [email]);
        console.log(user.rows);

        if (user.rows.length === 0) {
            res.status(404).json({ message: "User's email not found" });
            return;
        }

        if (!email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.rows[0].password
        );

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
    } catch (err) {
        console.log(err);
        throw err;
    }
});

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

        app.listen(port, () =>
            console.log(`Server is listening on port ${port}`)
        );
    } catch (err) {
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
