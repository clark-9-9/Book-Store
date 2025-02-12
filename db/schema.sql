-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE amazon_books (
    _id TEXT PRIMARY KEY,
    asin TEXT,
    title TEXT,
    author TEXT,
    sold_by TEXT,
    img_url TEXT,
    product_url TEXT,
    stars DOUBLE PRECISION,
    reviews INTEGER,
    price DOUBLE PRECISION,
    is_kindle_unlimited BOOLEAN,
    category_id INTEGER,
    is_best_seller BOOLEAN,
    is_editors_pick BOOLEAN,
    is_good_reads_choice BOOLEAN,
    published_date DATE,
    category_name TEXT
);

-- Enable the uuid-ossp extension for UUID generation

-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Book Collections Table (Links Users to Their Collections)
CREATE TABLE book_collections (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_name TEXT NOT NULL
);

-- Saved Books Table
CREATE TABLE saved_books (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id TEXT NOT NULL REFERENCES amazon_books(_id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_id TEXT NOT NULL REFERENCES book_collections(id) ON DELETE CASCADE,
    UNIQUE (user_id, collection_id, book_id)
);