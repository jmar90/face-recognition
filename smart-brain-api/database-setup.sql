/***************************/
/*		DATABASE SET-UP	   */
/***************************/
/* Prior to creating tables, be sure to create database by typing 'createdb [db name]' in your console.
I called my database 'smart-brain,' so I typed createdb 'smart-brain'*/

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