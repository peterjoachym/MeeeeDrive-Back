/* Replace with your SQL commands */
-- TABLES without foreign keys to import first (-_-)
CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(80) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255),
    theme VARCHAR(80),
    is_admin BOOLEAN NOT NULL DEFAULT 0
);

--
--
CREATE TABLE folder (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    folder_name VARCHAR(255) NOT NULL,
    folder_parent_id INT,
    user_id INT NOT NULL,
    is_in_the_bin BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_folder FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

--
CREATE TABLE drive_file (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(100) NOT NULL,
    file_display_name TEXT NOT NULL,
    user_id INT NOT NULL,
    folder_id INT NOT NULL,
    is_in_the_bin BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_crypted_file FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT fk_folder_crypted_file FOREIGN KEY (folder_id) REFERENCES folder (id) ON DELETE CASCADE
);

--