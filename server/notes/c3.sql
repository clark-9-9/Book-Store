SELECT * FROM "new-books";


select 
	* 
from 
	"new-books" 
where 
	title LIKE '%laws%';

select 
	* 
from 
	"new-books" 
where 
	title LIKE 'laws';


select 
	* 
from 
	"new-books" 
where 
	title @@ 'laws';

select 
	* 
from 
	"books" 
where 
	"Book-Title" @@ 'rich';

select * from "amazon-books"
	where 
	"title" @@ 'think and grow rich';


select distinct on (category_name) from "amazon-books" ;

select stars, price from "amazon-books" ;


select author, stars, price, sold_by, is_best_seller, title from "amazon-books" where stars = 5 and is_best_seller = true;

