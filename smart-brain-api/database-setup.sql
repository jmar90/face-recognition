/***************************/
/*		DATABASE SET-UP	   */
/***************************/

/* CREATE USERS TABLE */
CREATE TABLE users (
    id serial PRIMARY KEY,
    name varchar(100),
    email text UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL 
);

/* CREATE LOGIN TABLE */
CREATE TABLE login (
    id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL
);