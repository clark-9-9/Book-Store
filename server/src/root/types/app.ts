export interface BooksType {
    _id: string;
    asin: string;
    title: string;
    author: string;
    sold_by: string;
    img_url: string;
    product_url: string;
    stars: number;
    reviews: number;
    price: number;
    is_kindle_unlimited: boolean;
    category_id: number;
    is_best_seller: boolean;
    is_editors_pick: boolean;
    is_good_reads_choice: boolean;
    published_date: string;
    category_name: string;
}

export interface UserDataType {
    id: string;
    username: string;
    email: string;
    password: string;
}
