import dotenv from "dotenv";
dotenv.config();
import express from "express";
import pg, { Client } from "pg";
import bcrypt from "bcryptjs";
import cors from "cors";
import { BooksType, UserDataType } from "./types/app";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
    cors({
        // origin: ["http://localhost:4000", "http://localhost:4000/main/home"], // Allow requests from your Next.js frontend
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: "Book-Store",
});

app.get("/users-shared-books", async (req, res) => {
    let { limit } = req.query;

    try {
        const data = await client.query(
            `SELECT * FROM "amazon-books" where published_date >= '2015-01-01'::date order by title LIMIT $1`,
            [limit ? limit : 50000]
        );

        res.json({ rowCount: data.rowCount, data: data.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.get("/best-seller", async (req, res) => {
    try {
        // const query = `select * from "amazon-books" where is_best_seller = true order by stars DESC`;
        const query = `select * 
            from "amazon-books"  
            where is_best_seller = true 
            and published_date >= '2010-01-01'::date 
            order by stars DESC, title ASC 
            limit 50
        `;
        const data = await client.query(query);

        res.json({ rowCount: data.rowCount, data: data.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.get("/category/:id", async (req, res) => {
    const { id } = req.params;
    const { limit } = req.query;

    try {
        const query = `select * from "amazon-books" where category_name = $1 order by title limit $2`;
        const data = await client.query(query, [id, limit ? limit : 50000]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

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
        const result = await client.query(query, [email]);
        const user: UserDataType[] = result.rows;

        if (user.length === 0) {
            res.status(404).json({ error: "User's email not found" });
            return;
        }

        if (!email || !password) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user[0].password
        );

        if (isPasswordCorrect === false) {
            res.status(400).json({ error: "Incorrect password" });
            return;
        }

        res.status(200).json({
            userId: user[0].id,
            userName: user[0].username,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to login", error: err });
    }
});

app.post("/user-data", async (req, res) => {
    const { userId } = req.body;
    const query = `SELECT * FROM users WHERE id = $1`;

    try {
        const result = await client.query(query, [userId]);
        const user: UserDataType[] = result.rows;
        res.status(200).json({ data: user });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/change-user-data", async (req, res) => {
    const { userId, change, inputValue } = req.body;

    try {
        let result;
        if (change === "password") {
            const salt = await bcrypt.genSalt(10);
            const hassPassword = await bcrypt.hash(inputValue, salt);
            result = await client.query(
                `UPDATE users SET password = $1 WHERE id = $2`,
                [hassPassword, userId]
            );
        } else if (change === "username") {
            result = await client.query(
                `UPDATE users SET username = $1 WHERE id = $2`,
                [inputValue, userId]
            );
        } else {
            result = await client.query(
                `UPDATE users SET email = $1 WHERE id = $2`,
                [inputValue, userId]
            );
        }

        const user: UserDataType[] = result.rows;
        console.log(user);

        res.status(200).json({
            message: "Your changes were successful",
        });
    } catch (err) {
        console.error("Error updating user data:", err);
        res.status(500).json({
            message: "Failed to update data",
            error: err,
        });
    }
});

app.get("/search-books", async (req, res) => {
    const query = `SELECT * FROM "amazon-books" WHERE title ILIKE '%' || $1 || '%' ORDER BY title limit $2`;
    // let query = `SELECT * FROM "amazon-books" WHERE title ILIKE '%' || $1 AND stars >= $2 AND stars <= $3 AND price >= $4 AND price <= $5`;
    const { searched, limit } = req.query;

    try {
        let data = await client.query(query, [searched, limit ? limit : 50000]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/get-collections", async (req, res) => {
    const { userId } = req.body;
    const query = `SELECT * FROM "book_collections" WHERE user_id = $1`;
    const numOfBooksInCollection: { id: string; count: number }[] = [];
    const query2 = `SELECT * FROM "saved_books" WHERE collection_id=$1 AND user_id=$2`;

    try {
        if (!userId) {
            res.status(400).json({ error: "User id is not found" });
            return;
        }

        const data = await client.query(query, [userId]);

        for (const collection of data.rows) {
            const data2 = await client.query(query2, [collection.id, userId]);
            numOfBooksInCollection.push({
                id: collection.id,
                count: data2.rowCount!,
            });
        }

        res.json({
            rowCount: data.rowCount,
            data: data.rows,
            numOfBooksInCollection,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/add-collection", async (req, res) => {
    const { userId, name } = req.body;
    const query = `INSERT INTO "book_collections" (user_id, collection_name) VALUES ($1, $2)`;

    try {
        await client.query(query, [userId, name]);
        res.json({ message: "Collection was successfully added" });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/delete-collection", async (req, res) => {
    const { userId, collectionsId } = req.body;
    const query = `DELETE FROM "book_collections" WHERE id=$1 AND user_id=$2`;

    try {
        for (const collectionId of collectionsId) {
            await client.query(query, [collectionId, userId]);
        }
        res.json({ message: "Collection was successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/save-book", async (req, res) => {
    const { userId, bookId, collectionsId } = req.body;
    const query = `INSERT INTO "saved_books" (book_id, user_id, collection_id) VALUES ($1, $2, $3)`;

    try {
        for (const collectionId of collectionsId) {
            await client.query(query, [bookId, userId, collectionId]);
        }

        res.json({ message: "Book was successfully added" });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/get-collection-saved-books", async (req, res) => {
    const { userId, collectionId } = req.body;
    const query = `SELECT * FROM "saved_books" WHERE collection_id=$1 AND user_id=$2`;
    const books: BooksType[] = [];
    try {
        const data = await client.query(query, [collectionId, userId]);
        const dataRow: {
            book_id: string;
            user_id: string;
            collection_id: string;
        }[] = data.rows;

        for (const book of dataRow) {
            const getBook = await client.query(
                `SELECT * FROM "amazon-books" WHERE _id=$1`,
                [book.book_id]
            );
            books.push(getBook.rows[0]);
        }

        res.json({ rowCount: data.rowCount, data: books });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
    }
});

app.post("/get-saved-books", async (req, res) => {
    const { userId } = req.body;
    const query = `SELECT * FROM "saved_books" WHERE  user_id=$1`;
    try {
        const data = await client.query(query, [userId]);
        res.json({ rowCount: data.rowCount, data: data.rows });
    } catch (err) {
        res.status(500).json({ message: "Failed to get data", error: err });
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
