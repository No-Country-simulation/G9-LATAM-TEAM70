CREATE TABLE categories (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_categories_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE input_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE key_words (
    id BIGINT NOT NULL AUTO_INCREMENT,
    word VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_key_words_word UNIQUE (word)
) ENGINE=InnoDB;

CREATE TABLE output_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    input_user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    score FLOAT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_output_user_input FOREIGN KEY (input_user_id) REFERENCES input_user (id),
    CONSTRAINT fk_output_user_category FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB;

CREATE TABLE output_keyword (
    output_user_id BIGINT NOT NULL,
    keyword_id BIGINT NOT NULL,
    PRIMARY KEY (output_user_id, keyword_id),
    CONSTRAINT fk_output_keyword_output FOREIGN KEY (output_user_id) REFERENCES output_user (id),
    CONSTRAINT fk_output_keyword_keyword FOREIGN KEY (keyword_id) REFERENCES key_words (id)
) ENGINE=InnoDB;