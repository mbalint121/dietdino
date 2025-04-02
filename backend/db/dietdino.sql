CREATE DATABASE dietdino;

USE dietdino;

CREATE TABLE roles(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    roleName VARCHAR(16) NOT NULL UNIQUE
);

CREATE TABLE users(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(256) NOT NULL UNIQUE,
    password BLOB NOT NULL,
    roleID INT NOT NULL,
    FOREIGN KEY(roleID) REFERENCES roles(ID)
);

CREATE TABLE recipeStates(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    stateName VARCHAR(16) NOT NULL UNIQUE
);

CREATE TABLE recipes(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    uploaderID INT NOT NULL,
    recipeName VARCHAR(64) NOT NULL,
    image VARCHAR(256),
    preparationTime TIME NOT NULL,
    preparationDescription TEXT NOT NULL,
    uploadDateTime DATETIME NOT NULL,
    stateID INT,
    FOREIGN KEY(uploaderID) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY(stateID) REFERENCES recipeStates(ID)
);

CREATE TABLE commodityTypes(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    commodityTypeName VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE commodities(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    commodityName VARCHAR(64) NOT NULL UNIQUE,
    commodityTypeID INT NOT NULL,
    calorieValue FLOAT NOT NULL,
    FOREIGN KEY(commodityTypeID) REFERENCES commodityTypes(ID) ON DELETE CASCADE
);

CREATE TABLE measures(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    measureName VARCHAR(64) NOT NULL UNIQUE,
    grams FLOAT NOT NULL
);

CREATE TABLE usableMeasures(
    commodityTypeID INT NOT NULL,
    measureID INT NOT NULL,
    FOREIGN KEY(commodityTypeID) REFERENCES commodityTypes(ID) ON DELETE CASCADE,
    FOREIGN KEY(measureID) REFERENCES measures(ID) ON DELETE CASCADE
);

CREATE TABLE ingredients(
    recipeID INT NOT NULL,
    commodityID INT NOT NULL,
    measureID INT NOT NULL,
    quantity FLOAT NOT NULL,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID) ON DELETE CASCADE,
    FOREIGN KEY(commodityID) REFERENCES commodities(ID) ON DELETE CASCADE,
    FOREIGN KEY(measureID) REFERENCES measures(ID) ON DELETE CASCADE
);

CREATE TABLE comments(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    authorID INT NOT NULL,
    recipeID INT NOT NULL,
    text TEXT NOT NULL,
    commentDateTime DATETIME NOT NULL,
    FOREIGN KEY(authorID) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID) ON DELETE CASCADE
);

CREATE TABLE favorites(
    userID INT NOT NULL,
    recipeID INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID) ON DELETE CASCADE
);

CREATE TABLE likes(
    userID INT NOT NULL,
    recipeID INT NOT NULL,
    FOREIGN KEY(userID) REFERENCES users(ID) ON DELETE CASCADE,
    FOREIGN KEY(recipeID) REFERENCES recipes(ID) ON DELETE CASCADE
);

DELIMITER $$

CREATE PROCEDURE GetUserRoles()
BEGIN
    SELECT roles.roleName AS roleName FROM roles;
END$$

CREATE PROCEDURE AddUserRole(IN roleName VARCHAR(16))
BEGIN
    INSERT INTO roles VALUES(NULL, roleName);
END$$

CREATE PROCEDURE AddUser(IN username VARCHAR(16), IN email VARCHAR(256), IN password VARCHAR(256), IN role VARCHAR(16))
BEGIN
    INSERT INTO users VALUES(NULL, username, email, password, (SELECT roles.ID FROM roles WHERE roles.roleName = role));
END$$

CREATE PROCEDURE RegisterUser(IN username VARCHAR(16), IN email VARCHAR(256), IN password VARCHAR(256))
BEGIN
    INSERT INTO users VALUES(NULL, username, email, password, (SELECT roles.ID FROM roles WHERE roles.roleName = "User"));
END$$

CREATE PROCEDURE ResetPassword(IN userID INT, IN newPassword VARCHAR(256))
BEGIN
    UPDATE users SET password = SaltAndHashPassword(newPassword) WHERE users.ID = userID;
END$$

CREATE PROCEDURE GetUserByUsernameOrEmailAndPassword(IN username VARCHAR(16), IN email VARCHAR(256), IN password VARCHAR(256))
BEGIN
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users JOIN roles ON users.roleID = roles.ID WHERE users.username = username AND users.password = SaltAndHashPassword(password) OR users.email = email AND users.password = SaltAndHashPassword(password);
END$$

CREATE PROCEDURE GetUsers()
BEGIN
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users, roles WHERE users.roleID = roles.ID;
END$$

CREATE PROCEDURE GetUserByID(IN userID INT)
BEGIN
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users JOIN roles ON users.roleID = roles.ID AND users.ID = userID;
END$$

CREATE PROCEDURE UpdateUser(IN userID INT, IN username VARCHAR(16))
BEGIN
    UPDATE users SET users.username = username WHERE users.ID = userID;
END$$

CREATE PROCEDURE UpdateUserRole(IN userID INT, IN roleName VARCHAR(16))
BEGIN
    UPDATE users SET users.roleID = (SELECT roles.ID FROM roles WHERE roles.roleName = roleName) WHERE users.ID = userID;
END$$

CREATE PROCEDURE DeleteUserByID(IN userID INT)
BEGIN
    DELETE FROM users WHERE users.ID = userID;
END$$

CREATE PROCEDURE GetRecipeStates()
BEGIN
    SELECT recipeStates.stateName AS stateName FROM recipeStates;
END$$

CREATE PROCEDURE AddRecipeState(IN stateName VARCHAR(16))
BEGIN
    INSERT INTO recipeStates VALUES(NULL, stateName);
END$$

CREATE PROCEDURE GetRecipeByID(IN recipeID INT)
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE GetAcceptedRecipes()
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted";
END$$

CREATE PROCEDURE GetWaitingRecipes()
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Waiting";
END$$

CREATE PROCEDURE GetDraftRecipes()
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Draft";
END$$

CREATE PROCEDURE GetRecipesByUserID(IN userID INT)
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.uploaderID = userID;
END$$

CREATE PROCEDURE GetAcceptedRecipesByUsername(IN username VARCHAR(16))
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE users.username = username AND recipeStates.stateName = "Accepted";
END$$

CREATE PROCEDURE GetAcceptedFavoriteRecipesByUserID(IN userID INT)
BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID JOIN favorites ON recipes.ID = favorites.recipeID WHERE recipestates.stateName = "Accepted" AND favorites.userID = userID;
END$$

CREATE PROCEDURE AddRecipe(IN uploaderID INT, IN recipeName VARCHAR(64), IN preparationTime TIME, IN preparationDescription TEXT, IN uploadDateTime DATETIME, IN state VARCHAR(16))
BEGIN
    INSERT INTO recipes VALUES(NULL, uploaderID, recipeName, NULL, preparationTime, preparationDescription, uploadDateTime, (SELECT recipestates.ID FROM recipeStates WHERE recipeStates.stateName = state));
END$$

CREATE PROCEDURE NewRecipe(IN uploaderID INT, IN recipeName VARCHAR(64), IN preparationTime TIME, IN preparationDescription TEXT, IN state VARCHAR(16))
BEGIN
    INSERT INTO recipes VALUES(NULL, uploaderID, recipeName, NULL, preparationTime, preparationDescription, NOW(), (SELECT recipestates.ID FROM recipeStates WHERE recipeStates.stateName = state));
    SELECT LAST_INSERT_ID() AS insertID;
END$$

CREATE PROCEDURE UpdateRecipeByID(IN recipeID INT, IN recipeName VARCHAR(64), IN image VARCHAR(64), IN preparationTime TIME, IN preparationDescription TEXT, IN state VARCHAR(16))
BEGIN
    UPDATE recipes SET recipes.recipeName = recipeName, recipes.image = image, recipes.preparationTime = preparationTime, recipes.preparationDescription = preparationDescription, recipes.uploadDateTime = NOW(), recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = state) WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE AcceptRecipeByID(IN recipeID INT)
BEGIN
    UPDATE recipes SET recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = "Accepted") WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE RejectRecipeByID(IN recipeID INT)
BEGIN
    UPDATE recipes SET recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = "Draft") WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE NewImageByRecipeID(IN recipeID INT, IN image VARCHAR(256))
BEGIN
    UPDATE recipes SET recipes.image = image WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE DeleteRecipeByID(IN recipeID INT)
BEGIN
    DELETE FROM recipes WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE AddCommodityType(IN commodityTypeName VARCHAR(64))
BEGIN
    INSERT INTO commodityTypes VALUES(NULL, commodityTypeName);
END$$

CREATE PROCEDURE GetCommodities()
BEGIN
    SELECT commodities.commodityName AS commodityName FROM commodities;
END$$

CREATE PROCEDURE AddCommodity(IN commodityName VARCHAR(64), IN commodityTypeName VARCHAR(64), IN calorieValue FLOAT)
BEGIN
    INSERT INTO commodities VALUES(NULL, commodityName, (SELECT commodityTypes.ID FROM commodityTypes WHERE commodityTypes.commodityTypeName = commodityTypeName),calorieValue);
END$$

CREATE PROCEDURE AddMeasure(IN measureName VARCHAR(64), IN grams FLOAT)
BEGIN
    INSERT INTO measures VALUES(NULL, measureName, grams);
END$$

CREATE PROCEDURE AddUseableMeasure(IN commodityTypeName VARCHAR(64), IN measureName VARCHAR(64))
BEGIN
    INSERT INTO usableMeasures VALUES((SELECT commodityTypes.ID FROM commodityTypes WHERE commodityTypes.commodityTypeName = commodityTypeName), (SELECT measures.ID FROM measures WHERE measures.measureName = measureName));
END$$

CREATE PROCEDURE GetUsableMeasuresByCommodityName(IN commodityName VARCHAR(64))
BEGIN
    SELECT measures.measureName AS measureName FROM measures JOIN usableMeasures ON measures.ID = usableMeasures.measureID JOIN commodityTypes ON usableMeasures.commodityTypeID = commodityTypes.ID JOIN commodities ON commodityTypes.ID = commodities.commodityTypeID WHERE commodities.commodityName = commodityName;
END$$

CREATE PROCEDURE GetIngredientsByRecipeID(IN recipeID INT)
BEGIN
    SELECT commodities.commodityName AS commodity, measures.measureName AS measure, ingredients.quantity AS quantity FROM ingredients JOIN commodities ON ingredients.commodityID = commodities.ID JOIN measures ON ingredients.measureID = measures.ID WHERE ingredients.recipeID = recipeID;
END$$

CREATE PROCEDURE NewIngredientByRecipeID(IN recipeID INT, IN commodityName VARCHAR(64), IN measureName VARCHAR(64), IN quantity FLOAT)
BEGIN
    INSERT INTO ingredients VALUES(recipeID, (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName), (SELECT measures.ID FROM measures WHERE measures.measureName = measureName), quantity);
END$$

CREATE PROCEDURE UpdateIngredientByRecipeIDAndCommodityName(IN recipeID INT, IN commodityName VARCHAR(64), IN measureName VARCHAR(64), IN quantity FLOAT)
BEGIN
    UPDATE ingredients SET ingredients.measureID = (SELECT measures.ID FROM measures WHERE measures.measureName = measureName), ingredients.quantity = quantity WHERE ingredients.recipeID = recipeID AND ingredients.commodityID = (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName);
END$$

CREATE PROCEDURE AddOrUpdateIngredientByRecipeIDAndCommodityName(IN recipeID INT, IN commodityName VARCHAR(64), IN measureName VARCHAR(64), IN quantity FLOAT)
BEGIN
    IF EXISTS(SELECT * FROM ingredients WHERE ingredients.recipeID = recipeID AND ingredients.commodityID = (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName)) THEN
        CALL UpdateIngredientByRecipeIDAndCommodityName(recipeID, commodityName, measureName, quantity);
    ELSE
        CALL NewIngredientByRecipeID(recipeID, commodityName, measureName, quantity);
    END IF;
END$$

CREATE PROCEDURE DeleteIngredientByRecipeIDAndCommodityName(IN recipeID INT, IN commodityName VARCHAR(64))
BEGIN
    DELETE FROM ingredients WHERE ingredients.recipeID = recipeID AND ingredients.commodityID = (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName);
END$$

CREATE PROCEDURE GetCommentsByRecipeID(IN recipeID INT)
BEGIN
    SELECT comments.ID AS ID, users.username AS author, comments.text as text, comments.commentDateTime AS commentDateTime FROM comments JOIN users ON comments.authorID = users.ID WHERE comments.recipeID = recipeID;
END$$

CREATE PROCEDURE GetCommentByID(IN commentID INT)
BEGIN
    SELECT comments.ID AS ID, users.username AS author, comments.text as text, comments.commentDateTime AS commentDateTime FROM comments JOIN users ON comments.authorID = users.ID WHERE comments.ID = commentID;
END$$

CREATE PROCEDURE NewCommentByRecipeID(IN authorID INT, IN recipeID INT, IN text TEXT)
BEGIN
    INSERT INTO comments VALUES(NULL, authorID, recipeID, text, NOW());
END$$

CREATE PROCEDURE UpdateCommentByID(IN commentID INT, IN text TEXT)
BEGIN
    UPDATE comments SET comments.text = text, comments.commentDateTime = NOW() WHERE comments.ID = commentID;
END$$

CREATE PROCEDURE DeleteCommentByID(IN commentID INT)
BEGIN
    DELETE FROM comments WHERE comments.ID = commentID;
END$$

CREATE PROCEDURE GetFavorite(IN userID INT, IN recipeID INT)
BEGIN
    SELECT favorites.userID AS userID, favorites.recipeID AS recipeID FROM favorites WHERE favorites.userID = userID AND favorites.recipeID = recipeID;
END$$

CREATE PROCEDURE NewFavorite(IN userID INT, IN recipeID INT)
BEGIN
    INSERT INTO favorites VALUES(userID, recipeID);
END$$

CREATE PROCEDURE DeleteFavorite(IN userID INT, IN recipeID INT)
BEGIN
    DELETE FROM favorites WHERE favorites.userID = userID AND favorites.recipeID = recipeID;
END$$

CREATE PROCEDURE GetLike(IN userID INT, IN recipeID INT)
BEGIN
    SELECT likes.userID AS userID, likes.recipeID AS recipeID FROM likes WHERE likes.userID = userID AND likes.recipeID = recipeID;
END$$

CREATE PROCEDURE NewLike(IN userID INT, IN recipeID INT)
BEGIN
    INSERT INTO likes VALUES(userID, recipeID);
END$$

CREATE PROCEDURE DeleteLike(IN userID INT, IN recipeID INT)
BEGIN
    DELETE FROM likes WHERE likes.userID = userID AND likes.recipeID = recipeID;
END$$

CREATE FUNCTION UserExistsWithID(userID INT)
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) FROM users WHERE users.ID = userID);
END$$

CREATE FUNCTION UserExistsWithUsernameOrEmail(username VARCHAR(16), email VARCHAR(256))
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) FROM users WHERE users.username = username OR users.email = email);
END$$

CREATE FUNCTION GetUserIDByEmail(email VARCHAR(256))
RETURNS INT
BEGIN
    RETURN(SELECT users.ID FROM users WHERE users.email = email);
END$$

CREATE FUNCTION GetUserRoleByID(userID INT)
RETURNS VARCHAR(16)
BEGIN
    RETURN(SELECT roles.roleName FROM users, roles WHERE users.ID = userID AND users.roleID = roles.ID);
END$$

CREATE FUNCTION GetUploaderIDByRecipeID(recipeID INT)
RETURNS INT
BEGIN
    RETURN(SELECT recipes.uploaderID FROM recipes WHERE recipes.ID = recipeID);
END$$

CREATE FUNCTION GetCalorieValueByRecipeID(recipeID INT)
RETURNS FLOAT
BEGIN
    DECLARE calorieValue FLOAT;
    SET calorieValue = 0;

    SELECT SUM(ingredients.quantity * measures.grams * commodities.calorieValue)
    INTO calorieValue
    FROM ingredients
    JOIN commodities ON ingredients.commodityID = commodities.ID
    JOIN measures ON ingredients.measureID = measures.ID
    WHERE ingredients.recipeID = recipeID;

    RETURN calorieValue;
END$$

CREATE FUNCTION GetLikeCountByRecipeID(recipeID INT)
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) FROM likes WHERE likes.recipeID = recipeID);
END$$

CREATE FUNCTION GetCommentCountByRecipeID(recipeID INT)
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) FROM comments WHERE comments.recipeID = recipeID);
END$$

CREATE FUNCTION GetImageByRecipeID(recipeID INT)
RETURNS VARCHAR(256)
BEGIN
    RETURN(SELECT recipes.image FROM recipes WHERE recipes.ID = recipeID);
END$$

CREATE FUNCTION GetAuthorIDByCommentID(commentID INT)
RETURNS INT
BEGIN
    RETURN(SELECT comments.authorID FROM comments WHERE comments.ID = commentID);
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

CALL AddUserRole("Admin");
CALL AddUserRole("Moderator");
CALL AddUserRole("User");

CALL AddUser("TestAdmin", "admin@testuser.com", "admin", "Admin");
CALL AddUser("TestMod", "mod@testuser.com", "mod", "Moderator");
CALL AddUser("TestUser", "user@testuser.com", "user", "User");

CALL AddRecipeState("Draft");
CALL AddRecipeState("Waiting");
CALL AddRecipeState("Accepted");

CALL AddRecipe(1, "Piszkozat Recept", "00:30:00", "Teszt recept leírás", "2024-01-01 17:00:00", "Draft");
CALL AddRecipe(2, "Várakozó Recept", "00:10:00", "Teszt recept leírás", "2024-01-02 18:00:00", "Waiting");
CALL AddRecipe(3, "Elfogadott Recept", "01:30:00", "Teszt recept leírás", "2024-01-03 19:00:00", "Accepted");

CALL AddCommodityType("Solid");
CALL AddCommodityType("Liquid");

CALL AddMeasure("milligramm", 0.1);
CALL AddMeasure("gramm", 1);
CALL AddMeasure("dekagramm", 10);
CALL AddMeasure("kilogramm", 1000);
CALL AddMeasure("milliliter", 1);
CALL AddMeasure("centiliter", 10);
CALL AddMeasure("deciliter", 100);
CALL AddMeasure("liter", 1000);

CALL AddUseableMeasure("Solid", "milligramm");
CALL AddUseableMeasure("Solid", "gramm");
CALL AddUseableMeasure("Solid", "dekagramm");
CALL AddUseableMeasure("Solid", "kilogramm");
CALL AddUseableMeasure("Liquid", "milliliter");
CALL AddUseableMeasure("Liquid", "centiliter");
CALL AddUseableMeasure("Liquid", "deciliter");
CALL AddUseableMeasure("Liquid", "liter");

CALL AddCommodity("Só", "Solid", 0);
CALL AddCommodity("Feketebors", "Solid", 2.51);
CALL AddCommodity("Cukor", "Solid", 4.01);
CALL AddCommodity("Kakaópor", "Solid", 2.275);
CALL AddCommodity("Liszt", "Solid", 3.59);
CALL AddCommodity("Margarin", "Solid", 7.59);
CALL AddCommodity("Csirkemell", "Solid", 1.12);
CALL AddCommodity("Marhahús", "Solid", 2.43);
CALL AddCommodity("Sertéskaraj", "Solid", 1.63);
CALL AddCommodity("Burgonya", "Solid", 0.94);
CALL AddCommodity("Csiperke gomba", "Solid", 0.4);
CALL AddCommodity("Tészta", "Solid", 0.94);
CALL AddCommodity("Víz", "Liquid", 0);
CALL AddCommodity("Tej", "Liquid", 0.69);
CALL AddCommodity("Olaj", "Liquid", 9.28);

CALL NewIngredientByRecipeID(1, "Só", "gramm", 5);
CALL NewIngredientByRecipeID(1, "Feketebors", "gramm", 2);
CALL NewIngredientByRecipeID(1, "Burgonya", "kilogramm", 0.5);
CALL NewIngredientByRecipeID(1, "Csirkemell", "dekagramm", 30);

CALL NewCommentByRecipeID(1, 1, "Teszt komment. Nagyon finom volt.");
CALL NewCommentByRecipeID(2, 1, "Teszt komment. Nekem nem ízlett.");
CALL NewCommentByRecipeID(3, 2, "Teszt komment. Az egész családnak ízlett.");

CAll NewLike(1, 1);
CAll NewLike(2, 2);
CAll NewLike(3, 3);

CALL NewFavorite(1, 1);
CALL NewFavorite(2, 2);
CALL NewFavorite(3, 3);