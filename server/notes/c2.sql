SELECT * FROM public."new-books"

select subtitle from "new-books" where subtitle is not null;

select subtitle, count(*) from "new-books" where is not null;

SELECT subtitle FROM "new-books" WHERE subtitle IS NOT NULL;

SELECT subtitle, COUNT(*) FROM "new-books" group by subtitle having count(subtitle) >= 1;

