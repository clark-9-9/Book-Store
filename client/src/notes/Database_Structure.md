```sql
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
    collection_name NOT NULL TEXT
);

-- Rated Books Table (Tracks Ratings by Users)
CREATE TABLE rated_books (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id TEXT NOT NULL REFERENCES "amazon-books"(_id) ON DELETE CASCADE,
    user_rating DOUBLE PRECISION,
    description TEXT
);


CREATE TABLE "saved_books" (
	id TEXT PRIMARY KEY REFERENCES "amazon-books"(_id) ON DELETE CASCADE,
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	collection_id TEXT NOT NULL REFERENCES book_collections(id) ON DELETE CASCADE
);



CREATE TABLE "saved_books" (
	id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id TEXT NOT NULL REFERENCES "amazon-books"(_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_id TEXT NOT NULL REFERENCES book_collections(id) ON DELETE CASCADE,
    UNIQUE (user_id, collection_id, book_id)
);
```
