```sql
SELECT * FROM "amazon-books";


-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Books Table (Shared by All Users) --> amazon-books

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Book Collections Table (Links Users to Their Collections)
CREATE TABLE book_collections (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES "amazon-books"(_id) ON DELETE CASCADE
);

-- Rated Books Table (Tracks Ratings by Users)
CREATE TABLE rated_books (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES "amazon-books"(_id) ON DELETE CASCADE,
    user_rating DOUBLE PRECISION,
    description TEXT
);

```
