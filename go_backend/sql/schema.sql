CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(64) PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS threads (
    id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    creator VARCHAR(64) NOT NULL,
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    num_comments INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_creator FOREIGN KEY (creator) REFERENCES users(username) ON DELETE CASCADE,
    CONSTRAINT created_time_not_future CHECK (created_time <= CURRENT_TIMESTAMP),
    CONSTRAINT updated_time_not_future CHECK (updated_time <= CURRENT_TIMESTAMP),
    CONSTRAINT updated_time_not_before_created_time CHECK (updated_time >= created_time),
    CONSTRAINT num_comments_not_negative CHECK (num_comments >= 0)
);

CREATE TABLE IF NOT EXISTS comments (
    id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    body TEXT NOT NULL,
    creator VARCHAR(64) NOT NULL,
    thread_id CHAR(36) NOT NULL,
    created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_creator FOREIGN KEY (creator) REFERENCES users(username) ON DELETE CASCADE,
    CONSTRAINT fk_thread FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE,
    CONSTRAINT created_time_not_future CHECK (created_time <= CURRENT_TIMESTAMP),
    CONSTRAINT updated_time_not_future CHECK (updated_time <= CURRENT_TIMESTAMP),
    CONSTRAINT updated_time_not_before_created_time CHECK (updated_time >= created_time)
);

CREATE TABLE IF NOT EXISTS tags (
    name VARCHAR(64) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS thread_tags (
    thread_id CHAR(36) NOT NULL,
    tag_name VARCHAR(64) NOT NULL,
    PRIMARY KEY (thread_id, tag_name),
    CONSTRAINT fk_thread FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_name) REFERENCES tags(name) ON DELETE CASCADE
);