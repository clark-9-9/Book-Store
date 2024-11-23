import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pg, { Client } from "pg";

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

app.post("/create-user", async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
    `;
    // Define the actual values for the placeholders
    const values = [username, email, password];

    try {
        const result = await client.query(query, values);

        res.json({ message: "User created successfully" });
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
