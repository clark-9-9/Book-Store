SELECT * FROM public."amazon-books"

select category_name from "amazon-books";

SELECT DISTINCT category_name  FROM "amazon-books";

SELECT title, category_name, COUNT(*) 
FROM "amazon-books" 
GROUP BY title, category_name;


SELECT *
FROM "amazon-books"
WHERE title LIKE '%laws%';

SELECT *
FROM "amazon-books"
WHERE CONTAINS(title, 'laws');


