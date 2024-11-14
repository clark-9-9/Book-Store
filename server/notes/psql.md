```js
const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres-sql?main:password<123>",
    database: "Test",
});

client.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("connected to database");
    console.log();
});

client.query(
    `
        SELECT SUM(temp_hi) / COUNT(*) average
        FROM weather
        WHERE temp_hi IS NOT NULL;
`,
    (err, res) => {
        console.log(res.rows);
        console.log();
        console.log(res.rows);
    }
);

client.query(
    `
        SELECT * FROM weather;
    `,
    (err, res) => {
        console.log(res.rows);
    }
);
```

---

Yes, there are several ways to perform similar searches in SQL without using `LIKE`. Here are a few alternatives, each suitable for different situations:

### 1. **Using `ILIKE` (Case-insensitive search in PostgreSQL)**

If you're using PostgreSQL, `ILIKE` works like `LIKE` but ignores case sensitivity.

```sql
SELECT *
FROM "amazon-books"
WHERE title ILIKE '%laws%';
```

### 2. **Using Full-Text Search (PostgreSQL)**

Full-text search is powerful for natural language queries and handles more complex searches.

```sql
SELECT *
FROM "amazon-books"
WHERE to_tsvector(title) @@ to_tsquery('laws');
```

### 3. **Using Regular Expressions (PostgreSQL)**

You can use `~` (case-sensitive) or `~*` (case-insensitive) for regular expression pattern matching.

```sql
SELECT *
FROM "amazon-books"
WHERE title ~* 'laws';
```

### 4. **Using `POSITION()` or `INSTR()` (Some SQL Databases)**

In some SQL flavors, `POSITION()` or `INSTR()` can find the position of a substring in a string, and you can filter results based on whether the substring is found.

```sql
SELECT *
FROM "amazon-books"
WHERE POSITION('laws' IN title) > 0;
```

### 5. **Using `CONTAINS` (SQL Server)**

In SQL Server, `CONTAINS` performs full-text search. However, this requires full-text indexing to be set up on the `title` column.

```sql
SELECT *
FROM "amazon-books"
WHERE CONTAINS(title, 'laws');
```

### 6. **Using JSON/Document Search in NoSQL Databases**

If your database supports JSON or document storage (like MongoDB or a JSON column in PostgreSQL), you can use specific JSON search functions.

---
