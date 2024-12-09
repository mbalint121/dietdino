CREATE DATABASE dietdino;

USE dietdino;

CREATE TABLE roles(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    roleName VARCHAR(16) NOT NULL
);

CREATE TABLE users(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(256) NOT NULL UNIQUE,
    password BLOB NOT NULL,
    roleID INT,
    FOREIGN KEY(roleID) REFERENCES roles(ID)
);

CREATE TABLE recipeStates(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    stateName VARCHAR(16) NOT NULL
);

CREATE TABLE recipes(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    uploaderID INT,
    recipeName VARCHAR(64) NOT NULL,
    preparationTime TIME NOT NULL,
    preparationDescription TEXT NOT NULL,
    uploadDateTime DATETIME NOT NULL,
    likeCount INT NOT NULL,
    stateID INT,
    FOREIGN KEY(uploaderID) REFERENCES users(ID),
    FOREIGN KEY(stateID) REFERENCES recipeStates(ID)
);

CREATE TABLE images(
    recipeID INT,
    imageUrl VARCHAR(64) NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID)
);

CREATE TABLE comments(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    recipeID INT,
    text TEXT NOT NULL,
    commentDateTime DATETIME NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID),
    FOREIGN KEY(userID) REFERENCES users(ID)
);

CREATE TABLE favorites(
    userID INT,
    recipeID INT,
    FOREIGN KEY(userID) REFERENCES users(ID),
    FOREIGN KEY(recipeID) REFERENCES recipes(ID)
);

CREATE TABLE likes(
    userID INT,
    recipeID INT,
    FOREIGN KEY(userID) REFERENCES users(ID),
    FOREIGN KEY(recipeID) REFERENCES recipes(ID)
);

CREATE TABLE commodities(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    commodityName VARCHAR(64) UNIQUE NOT NULL,
    calorieValue INT NOT NULL
);

CREATE TABLE measures(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    measureName VARCHAR(64) UNIQUE NOT NULL,
    grams INT NOT NULL
);

CREATE TABLE ingredients(
    recipeID INT,
    commodityID INT,
    measureID INT,
    quantity INT NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID),
    FOREIGN KEY(commodityID) REFERENCES commodities(ID),
    FOREIGN KEY(measureID) REFERENCES measures(ID)
);

DELIMITER $$

CREATE PROCEDURE AddRole(IN roleName VARCHAR(16))
BEGIN
    INSERT INTO roles VALUES(null, roleName);
END $$

CREATE PROCEDURE AddUser(IN username VARCHAR(16), IN email VARCHAR(256), IN password VARCHAR(256), IN roleID INT)
BEGIN
    INSERT INTO users VALUES(null, username, email, password, roleID);
END $$

CREATE PROCEDURE RegisterUser(IN username VARCHAR(16), IN email VARCHAR(256), IN password VARCHAR(256))
BEGIN
    INSERT INTO users VALUES(null, username, email, password, 3);
END$$

CREATE PROCEDURE ResetPassword(IN userID INT, IN newPassword VARCHAR(256))
BEGIN
    UPDATE users SET password = SaltAndHashPassword(newPassword) WHERE users.ID = userID;
END$$

CREATE PROCEDURE GetUserByUsernameOrEmailAndPassword(IN username VARCHAR(16), IN email VARCHAR(256), IN password VARCHAR(256))
BEGIN
    SELECT users.ID AS ID, users.username AS username, users.email AS email FROM users WHERE users.username = username OR users.email = email AND users.password = SaltAndHashPassword(password);
END$$

CREATE FUNCTION UserExistsWithId(userID INT)
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) FROM users WHERE users.ID = userID);
END$$

CREATE FUNCTION GetUserIdByEmail(email VARCHAR(256))
RETURNS INT
BEGIN
    RETURN(SELECT users.ID FROM users WHERE users.email = email);
END$$

CREATE FUNCTION SaltAndHashPassword(password VARCHAR(256))
RETURNS BLOB
DETERMINISTIC
BEGIN
    RETURN SHA2(CONCAT(password, "mbszhd"), 256);
END$$

CREATE TRIGGER UserAdded
BEFORE INSERT
ON users
FOR EACH ROW
    SET NEW.password = SaltAndHashPassword(NEW.password)$$

DELIMITER ;

CALL AddRole("Admin");
CALL AddRole("Moderator");
CALL AddRole("User");

CALL AddUser("TestAdmin", "admin@testuser.com", "admin", 1);
CALL AddUser("TestMod", "mod@testuser.com", "mod", 2);
CALL AddUser("TestUser", "user@testuser.com", "user", 3);