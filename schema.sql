CREATE TABLE user(
    id VARCHAR (50),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE not NULL,
    password VARCHAR(50) not NULL
)