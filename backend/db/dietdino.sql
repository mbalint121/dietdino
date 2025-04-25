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

CREATE PROCEDURE GetUsersPaginated(IN pageNumber INT, IN pageSize INT)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users, roles WHERE users.roleID = roles.ID LIMIT pageSize OFFSET offsetNumber;
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

CREATE PROCEDURE GetAcceptedRecipesPaginated(IN pageNumber INT, IN pageSize INT, IN searchTerm TEXT, IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE PROCEDURE GetWaitingRecipesPaginated(IN pageNumber INT, IN pageSize INT)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Waiting" LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE PROCEDURE GetDraftRecipesPaginated(IN pageNumber INT, IN pageSize INT)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Draft" LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE PROCEDURE GetRecipesByUserIDPaginated(IN userID INT, IN pageNumber INT, IN pageSize INT, IN searchTerm TEXT, IN startDate DATETIME, IN endDate DATETIME, IN states TEXT)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.uploaderID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) AND (states IS NULL OR FIND_IN_SET(recipeStates.stateName, states)) LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE PROCEDURE GetAcceptedFavoriteRecipesByUserIDPaginated(IN userID INT, IN pageNumber INT, IN pageSize INT, IN searchTerm TEXT, IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID JOIN favorites ON recipes.ID = favorites.recipeID WHERE recipestates.stateName = "Accepted" AND favorites.userID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE PROCEDURE GetAcceptedRecipesByUsernamePaginated(IN username VARCHAR(16), IN pageNumber INT, IN pageSize INT, IN searchTerm TEXT, IN startDate DATETIME, IN endDate DATETIME)
BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE users.username = username AND recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) LIMIT pageSize OFFSET offsetNumber;
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

CREATE PROCEDURE UpdateRecipeByID(IN recipeID INT, IN recipeName VARCHAR(64), IN preparationTime TIME, IN preparationDescription TEXT)
BEGIN
    UPDATE recipes SET recipes.recipeName = recipeName, recipes.preparationTime = preparationTime, recipes.preparationDescription = preparationDescription, recipes.uploadDateTime = NOW() WHERE recipes.ID = recipeID;
END$$

CREATE PROCEDURE UpdateRecipeStateByID(IN recipeID INT, IN state VARCHAR(16))
BEGIN
    UPDATE recipes SET recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = state) WHERE recipes.ID = recipeID;
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

CREATE FUNCTION GetUserCount()
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM users);
END$$

CREATE FUNCTION UserExistsWithID(userID INT)
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.ID = userID);
END$$

CREATE FUNCTION UserExistsWithUsername(username VARCHAR(16))
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.username = username);
END$$

CREATE FUNCTION UserExistsWithEmail(email VARCHAR(256))
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.email = email);
END$$

CREATE FUNCTION UserExistsWithUsernameOrEmail(username VARCHAR(16), email VARCHAR(256))
RETURNS INT
BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.username = username OR users.email = email);
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

CREATE FUNCTION GetAcceptedRecipeCount(searchTerm TEXT, startDate DATETIME, endDate DATETIME)
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate));
END$$

CREATE FUNCTION GetWaitingRecipeCount()
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Waiting");
END$$

CREATE FUNCTION GetDraftRecipeCount()
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Draft");
END$$

CREATE FUNCTION GetRecipeCountByUserID(userID INT, searchTerm TEXT, startDate DATETIME, endDate DATETIME, states TEXT)
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.uploaderID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) AND (states IS NULL OR FIND_IN_SET(recipeStates.stateName, states)));
END$$

CREATE FUNCTION GetAcceptedFavoriteRecipeCountByUserID(userID INT, searchTerm TEXT, startDate DATETIME, endDate DATETIME)
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID JOIN favorites ON recipes.ID = favorites.recipeID WHERE recipestates.stateName = "Accepted" AND favorites.userID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate));
END$$

CREATE FUNCTION GetAcceptedRecipeCountByUsername(username VARCHAR(16), searchTerm TEXT, startDate DATETIME, endDate DATETIME)
RETURNS INT
BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE users.username = username AND recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate));
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

CREATE FUNCTION GetRecipeStateByRecipeID(recipeID INT)
RETURNS VARCHAR(16)
BEGIN
    RETURN(SELECT recipeStates.stateName FROM recipeStates JOIN recipes ON recipes.stateID = recipeStates.ID WHERE recipes.ID = recipeID);
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

CALL AddRecipe(1, "Sült csirkemell burgonyával", "00:30:00", "Süsd meg a csirkét, és a burgonyát is, fűszerezd ízlés szerint.", "2024-01-01 17:00:00", "Accepted");
CALL NewImageByRecipeID(1, "SultCsirkemellBurgonyaval.png");
CALL AddRecipe(2, "Tejbegríz", "00:10:00", "Keverd össze a hozzávalókat.", "2024-01-02 18:00:00", "Accepted");
CALL NewImageByRecipeID(2, "Tejbegriz.png");
CALL AddRecipe(3, "Marhahúsleves", "01:30:00", "Főzd meg forró vízben a hozzávalókat.", "2024-01-03 19:00:00", "Accepted");
CALL NewImageByRecipeID(3, "Marhahusleves.png");
CALL AddRecipe(2, "Csirke zöldségleves", "01:00:00", "Főzd meg a csirkemellet, burgonyát, sárgarépát, vöröshagymát, fokhagymát és petrezselyemgyökeret egy lábasban, majd sóval és feketeborssal ízesítsd.", "2024-02-03 18:00:00", "Waiting");
CALL NewImageByRecipeID(4, "CsirkeZoldsegleves.png");
CALL AddRecipe(3, "Marhahúsos rakottburgonya", "01:30:00", "Rétegezd a burgonyát, marhahúst, vöröshagymát, tejfölt és sajtot, sóval és feketeborssal ízesítve, majd süsd össze.", "2024-02-04 20:00:00", "Waiting");
CALL NewImageByRecipeID(5, "MarhahusosRakottburgonya.png");
CALL AddRecipe(1, "Rántott csirkemell sültburgonyával", "00:20:00", "Rántsd ki a csirkemellet, főzd meg a burgonyát.", "2024-02-05 14:00:00", "Draft");
CALL NewImageByRecipeID(6, "RantottCsirkemellSultburgonyaval.png");

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
CALL AddCommodity("Liszt", "Solid", 3.59);
CALL AddCommodity("Sütőpor", "Solid", 0.53);
CALL AddCommodity("Cukor", "Solid", 4.01);
CALL AddCommodity("Kakaópor", "Solid", 2.275);
CALL AddCommodity("Fahéj", "Solid", 2.47);
CALL AddCommodity("Zsemlemorzsa", "Solid", 3.95);
CALL AddCommodity("Rizs", "Solid", 3.53);
CALL AddCommodity("Tojás (egész)", "Solid", 1.7);
CALL AddCommodity("Tojás (fehérje)", "Solid", 0.58);
CALL AddCommodity("Tojás (sárgája)", "Solid", 3.62);
CALL AddCommodity("Víz", "Liquid", 0);
CALL AddCommodity("Olaj", "Liquid", 9.28);
CALL AddCommodity("Margarin", "Solid", 7.59);
CALL AddCommodity("Csirkemell", "Solid", 1.12);
CALL AddCommodity("Marhahús", "Solid", 2.43);
CALL AddCommodity("Sertéskaraj", "Solid", 1.63);
CALL AddCommodity("Tészta", "Solid", 0.94);
CALL AddCommodity("Tej", "Liquid", 0.69);
CALL AddCommodity("Tejföl", "Solid", 2.16);
CALL AddCommodity("Túró", "Solid", 1.47);
CALL AddCommodity("Trappista sajt", "Solid", 3.81);
CALL AddCommodity("Mozzarella sajt", "Solid", 4.02);
CALL AddCommodity("Csiperke gomba", "Solid", 0.4);
CALL AddCommodity("Burgonya", "Solid", 0.94);
CALL AddCommodity("Brokkoli", "Solid", 0.24);
CALL AddCommodity("Fokhagyma", "Solid", 1.37);
CALL AddCommodity("Paradicsom", "Solid", 0.23);
CALL AddCommodity("Petrezselyemgyökér", "Solid", 0.3);
CALL AddCommodity("Sárgarépa", "Solid", 0.4);
CALL AddCommodity("Uborka", "Solid", 0.12);
CALL AddCommodity("Vöröshagyma", "Solid", 0.4);
CALL AddCommodity("Pritamin", "Solid", 0.57);
CALL AddCommodity("Alma", "Solid", 0.31);
CALL AddCommodity("Banán", "Solid", 0.105);
CALL AddCommodity("Citrom", "Solid", 0.27);
CALL AddCommodity("Cseresznye", "Solid", 0.63);
CALL AddCommodity("Szamóca", "Solid", 0.35);
CALL AddCommodity("Körte", "Solid", 0.52);
CALL AddCommodity("Málna", "Solid", 0.29);
CALL AddCommodity("Meggy", "Solid", 0.52);
CALL AddCommodity("Narancs", "Solid", 0.41);
CALL AddCommodity("Nektarin", "Solid", 0.49);
CALL AddCommodity("Őszibarack", "Solid", 0.41);
CALL AddCommodity("Kajszibarack", "Solid", 0.48);
CALL AddCommodity("Szilva", "Solid", 0.58);
CALL AddCommodity("Szőlő", "Solid", 0.78);

CALL NewIngredientByRecipeID(1, "Só", "gramm", 5);
CALL NewIngredientByRecipeID(1, "Feketebors", "gramm", 2);
CALL NewIngredientByRecipeID(1, "Burgonya", "kilogramm", 0.5);
CALL NewIngredientByRecipeID(1, "Csirkemell", "dekagramm", 30);
CALL NewIngredientByRecipeID(2, "Tej", "deciliter", 5);
CALL NewIngredientByRecipeID(2, "Cukor", "dekagramm", 3);
CALL NewIngredientByRecipeID(2, "Kakaópor", "dekagramm", 1);
CALL NewIngredientByRecipeID(3, "Marhahús", "dekagramm", 50);
CALL NewIngredientByRecipeID(3, "Víz", "liter", 2);
CALL NewIngredientByRecipeID(3, "Burgonya", "dekagramm", 4);
CALL NewIngredientByRecipeID(3, "Vöröshagyma", "dekagramm", 2);
CALL NewIngredientByRecipeID(3, "Sárgarépa", "dekagramm", 3);
CALL NewIngredientByRecipeID(3, "Petrezselyemgyökér", "dekagramm", 1);
CALL NewIngredientByRecipeID(3, "Fokhagyma", "gramm", 10);
CALL NewIngredientByRecipeID(4, "Csirkemell", "dekagramm", 30);
CALL NewIngredientByRecipeID(4, "Burgonya", "kilogramm", 0.5);
CALL NewIngredientByRecipeID(4, "Vöröshagyma", "dekagramm", 2);
CALL NewIngredientByRecipeID(4, "Sárgarépa", "dekagramm", 3);
CALL NewIngredientByRecipeID(4, "Fokhagyma", "gramm", 10);
CALL NewIngredientByRecipeID(4, "Petrezselyemgyökér", "dekagramm", 1);
CALL NewIngredientByRecipeID(4, "Só", "gramm", 2);
CALL NewIngredientByRecipeID(4, "Feketebors", "gramm", 1);
CALL NewIngredientByRecipeID(4, "Víz", "liter", 2);
CALL NewIngredientByRecipeID(5, "Marhahús", "dekagramm", 50);
CALL NewIngredientByRecipeID(5, "Burgonya", "dekagramm", 4);
CALL NewIngredientByRecipeID(5, "Vöröshagyma", "dekagramm", 2);
CALL NewIngredientByRecipeID(5, "Tejföl", "dekagramm", 5);
CALL NewIngredientByRecipeID(5, "Só", "gramm", 2);
CALL NewIngredientByRecipeID(5, "Feketebors", "gramm", 1);
CALL NewIngredientByRecipeID(6, "Csirkemell", "dekagramm", 30);
CALL NewIngredientByRecipeID(6, "Liszt", "dekagramm", 5);
CALL NewIngredientByRecipeID(6, "Tojás (egész)", "dekagramm", 2);
CALL NewIngredientByRecipeID(6, "Zsemlemorzsa", "dekagramm", 7);
CALL NewIngredientByRecipeID(6, "Olaj", "deciliter", 1);
CALL NewIngredientByRecipeID(6, "Burgonya", "kilogramm", 0.5);

CALL NewCommentByRecipeID(1, 1, "Teszt komment. Nagyon finom volt.");
CALL NewCommentByRecipeID(2, 1, "Teszt komment. Nekem nem ízlett.");
CALL NewCommentByRecipeID(3, 2, "Teszt komment. Az egész családnak ízlett.");