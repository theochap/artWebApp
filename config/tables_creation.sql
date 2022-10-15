CREATE TABLE IF NOT EXISTS "user"(
    id UUID PRIMARY KEY,
    username VARCHAR(200) UNIQUE,
    email VARCHAR(200) UNIQUE,
    password VARCHAR(256),
    joined DATE
);

CREATE TABLE IF NOT EXISTS "post"(
    id UUID PRIMARY KEY,
    title VARCHAR(200),
    content TEXT,
    data BYTEA,
    created DATE,
    modified DATE
);

CREATE TABLE IF NOT EXISTS "reactions"(
    id UUID PRIMARY KEY,
    post_id uuid,
    prev_react uuid,
    content TEXT,
    emoji INTEGER,
    created DATE,
    modified DATE
);

CREATE TABLE IF NOT EXISTS "user_post"(
    user_id uuid,
    post_id uuid
);