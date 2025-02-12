# Tables

---

![alt text](schema/tables.png)

---

### Table: amazon_books

-   this tables includes all books we use in our project

### Table: users

-   this tables contains all users that logen into the database
-   referenced by 2 tables (saved_books, book_collections) for user_id

### Table: saved_books

-   this tables contains all saved books by user
-   we retieve books for specific user using specified the user_id of current user that loged into the database and the collection_id where the book saved in
-   references by 3 tables (saved_books, book_collections, amazon_books)
-   reference properties are for book_id in amazon_books, user_id in users and collection_id in book_collections

### Table: book_collections

-   finally this one contains all collections of user
-   a collection contains many books
-   reference properties are only user_id in users

---

# Designs

![alt text](<db/Bookstore Management - Home.png>)

![text](<db/Sign In.png>)
![text](<db/Sign Up.png>)

![text](<db/Book Store Managements - Home.png>)

![text](<db/Book Store Managements - Dashboard.png>)

![text](<db/Book Store Managements - Bookmarks.png>)

![text](<db/Book Store Managements - Settings.png>)
