You can use the EXISTS clause in PostgreSQL to achieve this. Here's an example:

```sql
SELECT EXISTS (
  SELECT 1
  FROM "amazon-books"
  WHERE _id = '672dbcccfdfba0f8c9fcbd8f'
) AS result;
```

This query will return `true` if the row exists in the table, and `false` if it doesn't.

If you want to return a boolean value directly, you can use the following query:

```sql
SELECT (_id = '672dbcccfdfba0f8c9fcbd8f')::boolean AS result
FROM "amazon-books"
LIMIT 1;
```

This query will return `true` if the row exists in the table, and `false` if it doesn't. The `::boolean` cast is used to convert the result to a boolean value.

You can also use the `FOUND` variable in PostgreSQL, which is set to `true` if the last SQL command affected at least one row, and `false` otherwise. Here's an example:

```sql
SELECT FOUND AS result
FROM "amazon-books"
WHERE _id = '672dbcccfdfba0f8c9fcbd8f';
```

This query will return `true` if the row exists in the table, and `false` if it doesn't.

---

```sql
SELECT (_id = '672dbcccfdfba0f8c9fcbd8f')::boolean AS result
FROM "amazon-books"
LIMIT 1;

SELECT (_id = '672dbd04fdfba0f8c9fe375c')::boolean
FROM "amazon-books"
WHERE _id = '672dbd04fdfba0f8c9fe375c';

SELECT (_id = '672dbd04fdfba0f8c9fe375c')::boolean
FROM "amazon-books"
WHERE _id = '672dbd04fdfba0f8c9fe375c';


SELECT (_id = '672dbcccfdfba0f8c9fcbd8f')::boolean
FROM "amazon-books"
WHERE _id = '672dbcccfdfba0f8c9fcbd8f'
ORDER BY _id;
```

---

```sql
ALTER TABLE book_collections
ALTER COLUMN collection_name SET NOT NULL;
```

---

```sql
SELECT
    ab._id,
    ab.title,
    ab.stars,
    ab.reviews,
    ab.price,
    ab.is_best_seller,
    u.username,
    bc.collection_name
FROM "amazon-books" ab
LEFT JOIN saved_books sb ON ab._id = sb.book_id
LEFT JOIN users u ON sb.user_id = u.id
LEFT JOIN book_collections bc ON sb.collection_id = bc.id
WHERE ab.author ILIKE '%Robert Greene%'
GROUP BY ab._id, ab.title, ab.stars, ab.reviews, ab.price, ab.is_best_seller, u.username, bc.collection_name;

SELECT
    ab._id,
    ab.title,
    ab.stars,
    ab.reviews,
    ab.price,
    ab.is_best_seller,
    u.username,
    bc.collection_name
FROM "amazon-books" ab
RIGHT JOIN saved_books sb ON ab._id = sb.book_id
RIGHT JOIN users u ON sb.user_id = u.id
RIGHT JOIN book_collections bc ON sb.collection_id = bc.id
WHERE ab.author ILIKE '%Robert Greene%'
GROUP BY ab._id, ab.title, ab.stars, ab.reviews, ab.price, ab.is_best_seller, u.username, bc.collection_name;

```

```sql
select * from "amazon-books";

select distinct author from "amazon-books" where stars > 4;


select _id, author, title, stars, reviews, price, is_best_seller
	from "amazon-books"
	-- where author
	-- ilike 'Robert Greene'
	group by _id, author;

select author, title, stars, reviews, price, is_best_seller
	from "amazon-books"
	group by author, title, stars, reviews, price, is_best_seller;


SELECT _id, title, stars, reviews, price, is_best_seller
FROM (
  SELECT _id, title, stars, reviews, price, is_best_seller
  FROM "amazon-books"
  WHERE author ILIKE '%Robert Greene%'
  GROUP BY _id, title, stars, reviews, price, is_best_seller
) AS subquery
inner JOIN "saved_books" ON subquery._id = "saved_books".book_id;


SELECT
    ab._id,
	ab.author,
    ab.title,
    ab.stars,
    ab.reviews,
    ab.price,
    ab.is_best_seller,
    u.username,
    bc.collection_name
FROM "amazon-books" ab
LEFT JOIN saved_books sb ON ab._id = sb.book_id
LEFT JOIN users u ON sb.user_id = u.id
LEFT JOIN book_collections bc ON sb.collection_id = bc.id
WHERE ab.author ILIKE '%Robert Greene%'
GROUP BY ab._id, ab.author, ab.title, ab.stars, ab.reviews, ab.price, ab.is_best_seller, u.username, bc.collection_name;



SELECT
    ab._id,
    ab.title,
    ab.stars,
    ab.reviews,
    ab.price,
    ab.is_best_seller,
    u.username,
    bc.collection_name
FROM "amazon-books" ab
RIGHT JOIN saved_books sb ON ab._id = sb.book_id
RIGHT JOIN users u ON sb.user_id = u.id
RIGHT JOIN book_collections bc ON sb.collection_id = bc.id
WHERE ab.author ILIKE '%Robert Greene%'
GROUP BY ab._id, ab.title, ab.stars, ab.reviews, ab.price, ab.is_best_seller, u.username, bc.collection_name;

```
