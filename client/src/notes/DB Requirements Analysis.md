## Requirements Analysis

#### **User Roles** ?

- **Admin**:
    - Manage book inventory (add, update, delete books).
    - View all user activities and stats.
- **User**:
    - Browse, search, and sort books.
    - Add books to cart and purchase them.
    - Rate books and leave reviews.
    - Manage their account details (e.g., profile, password).

---

#### **Welcome Page**

- Displays:
    - Linked to home page (shared books by user) .
        - Links to popular genres, trending books, and sales.
    - Options to sign up or sign in.
    - Dynamic and visually appealing content.
    - . . .

---

#### **Dashboard (Visualization)**

- Statistics/Insights for users:
    - **Top-rated books or categories**.
    - **Best Seller Author**
    - **Books purchased and rated** over time.
    - . . .

---

### **The operations that are the most frequent and subject to performance requirements.**

#### **Book Browsing and Search**

- Search and filter books by:
    - Price range.
    - Rating.
    - Genre.
    - Author.
- Sorting options:
    - Paid.
    - Free.
    - Highest Rated.

#### **Book Management**

- **Categorization**:
    - Predefined and dynamically added genres.
    - User can saved thier desire books in book collection section.

---

#### **User Management**

- Editable profiles:
    - Change name and password.
    - Update preferences like preferred genres.
- Account deletion and recovery.

---

#### **API Integration**

- Fetch User Data's.
- Fetch book details (e.g., cover images, titles, author, rating, ...)
- Fetch user book collections
- Fetch rated book collections by user

---

#### **Security**

- Use hashing to hash user password into Database.
- Password recovery through email.

---

#### **Additional Features**

- Book reviews, in addition to star ratings by user.

---

### **Data to be stored**

#### **Core Tables**

1. **Users Table**:

    - Fields: `id`, `name`, `email`, `password`, `role` (Admin/User), `signup_date`, `profile_picture`, `preferred_genres`.

2. **Books Table (amazon-books)**:

    - Fields: `_id`, `title`, `author`, `category_name`, `price`, `stars`, `ISBN`, `solid_by`, `img_url`, `product_url`, `reviews`,
      `category_id`, `is_best_seller`, `published_date`,

    - Indexes: `title`, `author`, `stars`, and `category_name`

3. **Book Collection Table**:

    - Fields: `id`, `user_id`, `book_id`, `collection_name`.

4. **Ratings(review) Table**:

    - Fields: `id`, `user_id`, `book_id`, `user_rating`, `description`.
