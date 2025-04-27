-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 27. 18:08
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `dietdino`
--
CREATE DATABASE IF NOT EXISTS `dietdino` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `dietdino`;

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AcceptRecipeByID` (IN `recipeID` INT)   BEGIN
    UPDATE recipes SET recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = "Accepted") WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddCommodity` (IN `commodityName` VARCHAR(64), IN `commodityTypeName` VARCHAR(64), IN `calorieValue` FLOAT)   BEGIN
    INSERT INTO commodities VALUES(NULL, commodityName, (SELECT commodityTypes.ID FROM commodityTypes WHERE commodityTypes.commodityTypeName = commodityTypeName),calorieValue);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddCommodityType` (IN `commodityTypeName` VARCHAR(64))   BEGIN
    INSERT INTO commodityTypes VALUES(NULL, commodityTypeName);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddMeasure` (IN `measureName` VARCHAR(64), IN `grams` FLOAT)   BEGIN
    INSERT INTO measures VALUES(NULL, measureName, grams);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddOrUpdateIngredientByRecipeIDAndCommodityName` (IN `recipeID` INT, IN `commodityName` VARCHAR(64), IN `measureName` VARCHAR(64), IN `quantity` FLOAT)   BEGIN
    IF EXISTS(SELECT * FROM ingredients WHERE ingredients.recipeID = recipeID AND ingredients.commodityID = (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName)) THEN
        CALL UpdateIngredientByRecipeIDAndCommodityName(recipeID, commodityName, measureName, quantity);
    ELSE
        CALL NewIngredientByRecipeID(recipeID, commodityName, measureName, quantity);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddRecipe` (IN `uploaderID` INT, IN `recipeName` VARCHAR(64), IN `preparationTime` TIME, IN `preparationDescription` TEXT, IN `uploadDateTime` DATETIME, IN `state` VARCHAR(16))   BEGIN
    INSERT INTO recipes VALUES(NULL, uploaderID, recipeName, NULL, preparationTime, preparationDescription, uploadDateTime, (SELECT recipestates.ID FROM recipeStates WHERE recipeStates.stateName = state));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddRecipeState` (IN `stateName` VARCHAR(16))   BEGIN
    INSERT INTO recipeStates VALUES(NULL, stateName);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddUseableMeasure` (IN `commodityTypeName` VARCHAR(64), IN `measureName` VARCHAR(64))   BEGIN
    INSERT INTO usableMeasures VALUES((SELECT commodityTypes.ID FROM commodityTypes WHERE commodityTypes.commodityTypeName = commodityTypeName), (SELECT measures.ID FROM measures WHERE measures.measureName = measureName));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddUser` (IN `username` VARCHAR(16), IN `email` VARCHAR(256), IN `password` VARCHAR(256), IN `role` VARCHAR(16))   BEGIN
    INSERT INTO users VALUES(NULL, username, email, password, (SELECT roles.ID FROM roles WHERE roles.roleName = role));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddUserRole` (IN `roleName` VARCHAR(16))   BEGIN
    INSERT INTO roles VALUES(NULL, roleName);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteCommentByID` (IN `commentID` INT)   BEGIN
    DELETE FROM comments WHERE comments.ID = commentID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteFavorite` (IN `userID` INT, IN `recipeID` INT)   BEGIN
    DELETE FROM favorites WHERE favorites.userID = userID AND favorites.recipeID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteIngredientByRecipeIDAndCommodityName` (IN `recipeID` INT, IN `commodityName` VARCHAR(64))   BEGIN
    DELETE FROM ingredients WHERE ingredients.recipeID = recipeID AND ingredients.commodityID = (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteLike` (IN `userID` INT, IN `recipeID` INT)   BEGIN
    DELETE FROM likes WHERE likes.userID = userID AND likes.recipeID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteRecipeByID` (IN `recipeID` INT)   BEGIN
    DELETE FROM recipes WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteUserByID` (IN `userID` INT)   BEGIN
    DELETE FROM users WHERE users.ID = userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAcceptedFavoriteRecipesByUserIDPaginated` (IN `userID` INT, IN `pageNumber` INT, IN `pageSize` INT, IN `searchTerm` TEXT, IN `startDate` DATETIME, IN `endDate` DATETIME)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID JOIN favorites ON recipes.ID = favorites.recipeID WHERE recipestates.stateName = "Accepted" AND favorites.userID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) ORDER BY recipes.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAcceptedRecipesByUsernamePaginated` (IN `username` VARCHAR(16), IN `pageNumber` INT, IN `pageSize` INT, IN `searchTerm` TEXT, IN `startDate` DATETIME, IN `endDate` DATETIME)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE users.username = username AND recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) ORDER BY recipes.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAcceptedRecipesPaginated` (IN `pageNumber` INT, IN `pageSize` INT, IN `searchTerm` TEXT, IN `startDate` DATETIME, IN `endDate` DATETIME)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) ORDER BY recipes.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCommentByID` (IN `commentID` INT)   BEGIN
    SELECT comments.ID AS ID, users.username AS author, comments.text as text, comments.commentDateTime AS commentDateTime FROM comments JOIN users ON comments.authorID = users.ID WHERE comments.ID = commentID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCommentsByRecipeID` (IN `recipeID` INT)   BEGIN
    SELECT comments.ID AS ID, users.username AS author, comments.text as text, comments.commentDateTime AS commentDateTime FROM comments JOIN users ON comments.authorID = users.ID WHERE comments.recipeID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCommodities` ()   BEGIN
    SELECT commodities.commodityName AS commodityName FROM commodities;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDraftRecipesPaginated` (IN `pageNumber` INT, IN `pageSize` INT)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Draft" ORDER BY recipes.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFavorite` (IN `userID` INT, IN `recipeID` INT)   BEGIN
    SELECT favorites.userID AS userID, favorites.recipeID AS recipeID FROM favorites WHERE favorites.userID = userID AND favorites.recipeID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetFreshRecipes` ()   BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted" ORDER BY recipes.uploadDateTime DESC LIMIT 3;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetHotRecipes` ()   BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted" ORDER BY GetLikeCountByRecipeID(recipes.ID) DESC LIMIT 3;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetIngredientsByRecipeID` (IN `recipeID` INT)   BEGIN
    SELECT commodities.commodityName AS commodity, measures.measureName AS measure, ingredients.quantity AS quantity FROM ingredients JOIN commodities ON ingredients.commodityID = commodities.ID JOIN measures ON ingredients.measureID = measures.ID WHERE ingredients.recipeID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLike` (IN `userID` INT, IN `recipeID` INT)   BEGIN
    SELECT likes.userID AS userID, likes.recipeID AS recipeID FROM likes WHERE likes.userID = userID AND likes.recipeID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRecipeByID` (IN `recipeID` INT)   BEGIN
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRecipesByUserIDPaginated` (IN `userID` INT, IN `pageNumber` INT, IN `pageSize` INT, IN `searchTerm` TEXT, IN `startDate` DATETIME, IN `endDate` DATETIME, IN `states` TEXT)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.uploaderID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) AND (states IS NULL OR FIND_IN_SET(recipeStates.stateName, states)) ORDER BY recipes.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRecipeStates` ()   BEGIN
    SELECT recipeStates.stateName AS stateName FROM recipeStates;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsableMeasuresByCommodityName` (IN `commodityName` VARCHAR(64))   BEGIN
    SELECT measures.measureName AS measureName FROM measures JOIN usableMeasures ON measures.ID = usableMeasures.measureID JOIN commodityTypes ON usableMeasures.commodityTypeID = commodityTypes.ID JOIN commodities ON commodityTypes.ID = commodities.commodityTypeID WHERE commodities.commodityName = commodityName;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByID` (IN `userID` INT)   BEGIN
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users JOIN roles ON users.roleID = roles.ID AND users.ID = userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByUsernameOrEmailAndPassword` (IN `username` VARCHAR(16), IN `email` VARCHAR(256), IN `password` VARCHAR(256))   BEGIN
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users JOIN roles ON users.roleID = roles.ID WHERE users.username = username AND users.password = SaltAndHashPassword(password) OR users.email = email AND users.password = SaltAndHashPassword(password);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserRoles` ()   BEGIN
    SELECT roles.roleName AS roleName FROM roles;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsersPaginated` (IN `pageNumber` INT, IN `pageSize` INT)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT users.ID AS ID, users.username AS username, users.email AS email, roles.roleName AS role FROM users, roles WHERE users.roleID = roles.ID ORDER BY users.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetWaitingRecipesPaginated` (IN `pageNumber` INT, IN `pageSize` INT)   BEGIN
    DECLARE offsetNumber INT;
    SET offsetNumber = (pageNumber - 1) * pageSize;
    SELECT recipes.ID AS ID, recipes.recipeName AS recipeName, recipes.image AS image, recipes.preparationTime AS preparationTime, recipes.preparationDescription AS preparationDescription, recipes.uploadDateTime AS uploadDateTime, users.username AS uploader, recipeStates.stateName AS state FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Waiting" ORDER BY recipes.ID LIMIT pageSize OFFSET offsetNumber;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `NewCommentByRecipeID` (IN `authorID` INT, IN `recipeID` INT, IN `text` TEXT)   BEGIN
    INSERT INTO comments VALUES(NULL, authorID, recipeID, text, NOW());
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `NewFavorite` (IN `userID` INT, IN `recipeID` INT)   BEGIN
    INSERT INTO favorites VALUES(userID, recipeID);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `NewImageByRecipeID` (IN `recipeID` INT, IN `image` VARCHAR(256))   BEGIN
    UPDATE recipes SET recipes.image = image WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `NewIngredientByRecipeID` (IN `recipeID` INT, IN `commodityName` VARCHAR(64), IN `measureName` VARCHAR(64), IN `quantity` FLOAT)   BEGIN
    INSERT INTO ingredients VALUES(recipeID, (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName), (SELECT measures.ID FROM measures WHERE measures.measureName = measureName), quantity);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `NewLike` (IN `userID` INT, IN `recipeID` INT)   BEGIN
    INSERT INTO likes VALUES(userID, recipeID);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `NewRecipe` (IN `uploaderID` INT, IN `recipeName` VARCHAR(64), IN `preparationTime` TIME, IN `preparationDescription` TEXT, IN `state` VARCHAR(16))   BEGIN
    INSERT INTO recipes VALUES(NULL, uploaderID, recipeName, NULL, preparationTime, preparationDescription, NOW(), (SELECT recipestates.ID FROM recipeStates WHERE recipeStates.stateName = state));
    SELECT LAST_INSERT_ID() AS insertID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RegisterUser` (IN `username` VARCHAR(16), IN `email` VARCHAR(256), IN `password` VARCHAR(256))   BEGIN
    INSERT INTO users VALUES(NULL, username, email, password, (SELECT roles.ID FROM roles WHERE roles.roleName = "User"));
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RejectRecipeByID` (IN `recipeID` INT)   BEGIN
    UPDATE recipes SET recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = "Draft") WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ResetPassword` (IN `userID` INT, IN `newPassword` VARCHAR(256))   BEGIN
    UPDATE users SET password = SaltAndHashPassword(newPassword) WHERE users.ID = userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateCommentByID` (IN `commentID` INT, IN `text` TEXT)   BEGIN
    UPDATE comments SET comments.text = text, comments.commentDateTime = NOW() WHERE comments.ID = commentID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateIngredientByRecipeIDAndCommodityName` (IN `recipeID` INT, IN `commodityName` VARCHAR(64), IN `measureName` VARCHAR(64), IN `quantity` FLOAT)   BEGIN
    UPDATE ingredients SET ingredients.measureID = (SELECT measures.ID FROM measures WHERE measures.measureName = measureName), ingredients.quantity = quantity WHERE ingredients.recipeID = recipeID AND ingredients.commodityID = (SELECT commodities.ID FROM commodities WHERE commodities.commodityName = commodityName);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateRecipeByID` (IN `recipeID` INT, IN `recipeName` VARCHAR(64), IN `preparationTime` TIME, IN `preparationDescription` TEXT)   BEGIN
    UPDATE recipes SET recipes.recipeName = recipeName, recipes.preparationTime = preparationTime, recipes.preparationDescription = preparationDescription, recipes.uploadDateTime = NOW() WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateRecipeStateByID` (IN `recipeID` INT, IN `state` VARCHAR(16))   BEGIN
    UPDATE recipes SET recipes.stateID = (SELECT recipeStates.ID FROM recipeStates WHERE recipeStates.stateName = state) WHERE recipes.ID = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateUser` (IN `userID` INT, IN `username` VARCHAR(16))   BEGIN
    UPDATE users SET users.username = username WHERE users.ID = userID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateUserRole` (IN `userID` INT, IN `roleName` VARCHAR(16))   BEGIN
    UPDATE users SET users.roleID = (SELECT roles.ID FROM roles WHERE roles.roleName = roleName) WHERE users.ID = userID;
END$$

--
-- Függvények
--
CREATE DEFINER=`root`@`localhost` FUNCTION `GetAcceptedFavoriteRecipeCountByUserID` (`userID` INT, `searchTerm` TEXT, `startDate` DATETIME, `endDate` DATETIME) RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID JOIN favorites ON recipes.ID = favorites.recipeID WHERE recipestates.stateName = "Accepted" AND favorites.userID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate));
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetAcceptedRecipeCount` (`searchTerm` TEXT, `startDate` DATETIME, `endDate` DATETIME) RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate));
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetAcceptedRecipeCountByUsername` (`username` VARCHAR(16), `searchTerm` TEXT, `startDate` DATETIME, `endDate` DATETIME) RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE users.username = username AND recipeStates.stateName = "Accepted" AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate));
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetAuthorIDByCommentID` (`commentID` INT) RETURNS INT(11)  BEGIN
    RETURN(SELECT comments.authorID FROM comments WHERE comments.ID = commentID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetCalorieValueByRecipeID` (`recipeID` INT) RETURNS FLOAT  BEGIN
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

CREATE DEFINER=`root`@`localhost` FUNCTION `GetCommentCountByRecipeID` (`recipeID` INT) RETURNS INT(11)  BEGIN
    RETURN(SELECT COUNT(*) FROM comments WHERE comments.recipeID = recipeID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetDraftRecipeCount` () RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Draft");
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetImageByRecipeID` (`recipeID` INT) RETURNS VARCHAR(256) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
    RETURN(SELECT recipes.image FROM recipes WHERE recipes.ID = recipeID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetLikeCountByRecipeID` (`recipeID` INT) RETURNS INT(11)  BEGIN
    RETURN(SELECT COUNT(*) FROM likes WHERE likes.recipeID = recipeID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetRecipeCountByUserID` (`userID` INT, `searchTerm` TEXT, `startDate` DATETIME, `endDate` DATETIME, `states` TEXT) RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN users ON recipes.uploaderID = users.ID JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipes.uploaderID = userID AND (searchTerm IS NULL OR recipes.recipeName LIKE CONCAT("%", searchTerm, "%") OR recipes.preparationDescription LIKE CONCAT("%", searchTerm, "%") OR users.username LIKE CONCAT("%", searchTerm, "%")) AND (recipes.uploadDateTime BETWEEN startDate AND endDate) AND (states IS NULL OR FIND_IN_SET(recipeStates.stateName, states)));
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetRecipeStateByRecipeID` (`recipeID` INT) RETURNS VARCHAR(16) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
    RETURN(SELECT recipeStates.stateName FROM recipeStates JOIN recipes ON recipes.stateID = recipeStates.ID WHERE recipes.ID = recipeID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetUploaderIDByRecipeID` (`recipeID` INT) RETURNS INT(11)  BEGIN
    RETURN(SELECT recipes.uploaderID FROM recipes WHERE recipes.ID = recipeID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserCount` () RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM users);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserIDByEmail` (`email` VARCHAR(256)) RETURNS INT(11)  BEGIN
    RETURN(SELECT users.ID FROM users WHERE users.email = email);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetUserRoleByID` (`userID` INT) RETURNS VARCHAR(16) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
    RETURN(SELECT roles.roleName FROM users, roles WHERE users.ID = userID AND users.roleID = roles.ID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `GetWaitingRecipeCount` () RETURNS INT(11)  BEGIN
    RETURN (SELECT COUNT(*) AS count FROM recipes JOIN recipeStates ON recipes.stateID = recipeStates.ID WHERE recipeStates.stateName = "Waiting");
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `SaltAndHashPassword` (`password` VARCHAR(256)) RETURNS BLOB DETERMINISTIC BEGIN
    RETURN SHA2(CONCAT(password, "mbszhd"), 256);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `UserExistsWithEmail` (`email` VARCHAR(256)) RETURNS INT(11)  BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.email = email);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `UserExistsWithID` (`userID` INT) RETURNS INT(11)  BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.ID = userID);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `UserExistsWithUsername` (`username` VARCHAR(16)) RETURNS INT(11)  BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.username = username);
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `UserExistsWithUsernameOrEmail` (`username` VARCHAR(16), `email` VARCHAR(256)) RETURNS INT(11)  BEGIN
    RETURN(SELECT COUNT(*) AS count FROM users WHERE users.username = username OR users.email = email);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `ID` int(11) NOT NULL,
  `authorID` int(11) NOT NULL,
  `recipeID` int(11) NOT NULL,
  `text` text NOT NULL,
  `commentDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`ID`, `authorID`, `recipeID`, `text`, `commentDateTime`) VALUES
(1, 1, 1, 'Teszt komment. Nagyon finom volt.', '2025-04-27 18:08:00'),
(2, 2, 1, 'Teszt komment. Nekem nem ízlett.', '2025-04-27 18:08:00'),
(3, 3, 2, 'Teszt komment. Az egész családnak ízlett.', '2025-04-27 18:08:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `commodities`
--

CREATE TABLE `commodities` (
  `ID` int(11) NOT NULL,
  `commodityName` varchar(64) NOT NULL,
  `commodityTypeID` int(11) NOT NULL,
  `calorieValue` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `commodities`
--

INSERT INTO `commodities` (`ID`, `commodityName`, `commodityTypeID`, `calorieValue`) VALUES
(1, 'Só', 1, 0),
(2, 'Feketebors', 1, 2.51),
(3, 'Liszt', 1, 3.59),
(4, 'Sütőpor', 1, 0.53),
(5, 'Cukor', 1, 4.01),
(6, 'Kakaópor', 1, 2.275),
(7, 'Fahéj', 1, 2.47),
(8, 'Zsemlemorzsa', 1, 3.95),
(9, 'Rizs', 1, 3.53),
(10, 'Tojás (egész)', 1, 1.7),
(11, 'Tojás (fehérje)', 1, 0.58),
(12, 'Tojás (sárgája)', 1, 3.62),
(13, 'Víz', 2, 0),
(14, 'Olaj', 2, 9.28),
(15, 'Margarin', 1, 7.59),
(16, 'Csirkemell', 1, 1.12),
(17, 'Marhahús', 1, 2.43),
(18, 'Sertéskaraj', 1, 1.63),
(19, 'Tészta', 1, 0.94),
(20, 'Tej', 2, 0.69),
(21, 'Tejföl', 1, 2.16),
(22, 'Túró', 1, 1.47),
(23, 'Trappista sajt', 1, 3.81),
(24, 'Mozzarella sajt', 1, 4.02),
(25, 'Csiperke gomba', 1, 0.4),
(26, 'Burgonya', 1, 0.94),
(27, 'Brokkoli', 1, 0.24),
(28, 'Fokhagyma', 1, 1.37),
(29, 'Paradicsom', 1, 0.23),
(30, 'Petrezselyemgyökér', 1, 0.3),
(31, 'Sárgarépa', 1, 0.4),
(32, 'Uborka', 1, 0.12),
(33, 'Vöröshagyma', 1, 0.4),
(34, 'Pritamin', 1, 0.57),
(35, 'Alma', 1, 0.31),
(36, 'Banán', 1, 0.105),
(37, 'Citrom', 1, 0.27),
(38, 'Cseresznye', 1, 0.63),
(39, 'Szamóca', 1, 0.35),
(40, 'Körte', 1, 0.52),
(41, 'Málna', 1, 0.29),
(42, 'Meggy', 1, 0.52),
(43, 'Narancs', 1, 0.41),
(44, 'Nektarin', 1, 0.49),
(45, 'Őszibarack', 1, 0.41),
(46, 'Kajszibarack', 1, 0.48),
(47, 'Szilva', 1, 0.58),
(48, 'Szőlő', 1, 0.78);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `commoditytypes`
--

CREATE TABLE `commoditytypes` (
  `ID` int(11) NOT NULL,
  `commodityTypeName` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `commoditytypes`
--

INSERT INTO `commoditytypes` (`ID`, `commodityTypeName`) VALUES
(2, 'Liquid'),
(1, 'Solid');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorites`
--

CREATE TABLE `favorites` (
  `userID` int(11) NOT NULL,
  `recipeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `favorites`
--

INSERT INTO `favorites` (`userID`, `recipeID`) VALUES
(1, 1),
(1, 3),
(2, 1),
(2, 3),
(3, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ingredients`
--

CREATE TABLE `ingredients` (
  `recipeID` int(11) NOT NULL,
  `commodityID` int(11) NOT NULL,
  `measureID` int(11) NOT NULL,
  `quantity` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `ingredients`
--

INSERT INTO `ingredients` (`recipeID`, `commodityID`, `measureID`, `quantity`) VALUES
(1, 1, 2, 5),
(1, 2, 2, 2),
(1, 26, 4, 0.5),
(1, 16, 3, 30),
(2, 20, 7, 5),
(2, 5, 3, 3),
(2, 6, 3, 1),
(3, 17, 3, 50),
(3, 13, 8, 2),
(3, 26, 3, 4),
(3, 33, 3, 2),
(3, 31, 3, 3),
(3, 30, 3, 1),
(3, 28, 2, 10),
(4, 16, 3, 30),
(4, 26, 4, 0.5),
(4, 33, 3, 2),
(4, 31, 3, 3),
(4, 28, 2, 10),
(4, 30, 3, 1),
(4, 1, 2, 2),
(4, 2, 2, 1),
(4, 13, 8, 2),
(5, 17, 3, 50),
(5, 26, 3, 4),
(5, 33, 3, 2),
(5, 21, 3, 5),
(5, 1, 2, 2),
(5, 2, 2, 1),
(6, 16, 3, 30),
(6, 3, 3, 5),
(6, 10, 3, 2),
(6, 8, 3, 7),
(6, 14, 7, 1),
(6, 26, 4, 0.5),
(7, 3, 3, 3),
(7, 10, 3, 2),
(7, 20, 7, 2),
(7, 5, 3, 1),
(7, 1, 2, 1),
(8, 19, 3, 30),
(8, 16, 3, 40),
(8, 33, 3, 3),
(8, 29, 3, 3),
(8, 1, 2, 2),
(8, 2, 2, 1),
(9, 19, 3, 40),
(9, 27, 3, 5),
(9, 33, 3, 2),
(9, 29, 3, 3),
(9, 14, 7, 1),
(9, 1, 2, 1),
(9, 2, 2, 1),
(10, 17, 3, 60),
(10, 13, 8, 3),
(10, 26, 3, 50),
(10, 33, 3, 3),
(10, 28, 2, 15),
(10, 29, 3, 4),
(10, 1, 2, 2),
(10, 2, 2, 1),
(10, 31, 3, 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `likes`
--

CREATE TABLE `likes` (
  `userID` int(11) NOT NULL,
  `recipeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `likes`
--

INSERT INTO `likes` (`userID`, `recipeID`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1),
(3, 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `measures`
--

CREATE TABLE `measures` (
  `ID` int(11) NOT NULL,
  `measureName` varchar(64) NOT NULL,
  `grams` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `measures`
--

INSERT INTO `measures` (`ID`, `measureName`, `grams`) VALUES
(1, 'milligramm', 0.1),
(2, 'gramm', 1),
(3, 'dekagramm', 10),
(4, 'kilogramm', 1000),
(5, 'milliliter', 1),
(6, 'centiliter', 10),
(7, 'deciliter', 100),
(8, 'liter', 1000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `recipes`
--

CREATE TABLE `recipes` (
  `ID` int(11) NOT NULL,
  `uploaderID` int(11) NOT NULL,
  `recipeName` varchar(64) NOT NULL,
  `image` varchar(256) DEFAULT NULL,
  `preparationTime` time NOT NULL,
  `preparationDescription` text NOT NULL,
  `uploadDateTime` datetime NOT NULL,
  `stateID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `recipes`
--

INSERT INTO `recipes` (`ID`, `uploaderID`, `recipeName`, `image`, `preparationTime`, `preparationDescription`, `uploadDateTime`, `stateID`) VALUES
(1, 1, 'Sült csirkemell burgonyával', 'SultCsirkemellBurgonyaval.png', '00:30:00', 'Süsd meg a csirkét, és a burgonyát is, fűszerezd ízlés szerint.', '2024-01-01 17:00:00', 3),
(2, 2, 'Tejbegríz', 'Tejbegriz.png', '00:10:00', 'Keverd össze a hozzávalókat.', '2024-01-02 18:00:00', 3),
(3, 3, 'Marhahúsleves', 'Marhahusleves.png', '01:30:00', 'Főzd meg forró vízben a hozzávalókat.', '2024-01-03 19:00:00', 3),
(4, 2, 'Csirke zöldségleves', 'CsirkeZoldsegleves.png', '01:00:00', 'Főzd meg a csirkemellet, burgonyát, sárgarépát, vöröshagymát, fokhagymát és petrezselyemgyökeret egy lábasban, majd sóval és feketeborssal ízesítsd.', '2024-02-03 18:00:00', 2),
(5, 3, 'Marhahúsos rakottburgonya', 'MarhahusosRakottburgonya.png', '01:30:00', 'Rétegezd a burgonyát, marhahúst, vöröshagymát, tejfölt és sajtot, sóval és feketeborssal ízesítve, majd süsd össze.', '2024-02-04 20:00:00', 2),
(6, 1, 'Rántott csirkemell sültburgonyával', 'RantottCsirkemellSultburgonyaval.png', '00:20:00', 'Rántsd ki a csirkemellet, főzd meg a burgonyát.', '2024-02-05 14:00:00', 1),
(7, 1, 'Palacsinta', 'Palacsinta.png', '00:15:00', 'Készítsd el a palacsintatésztát liszt, tojás, tej, cukor és egy csipet só felhasználásával, majd süsd ki serpenyőben.', '2024-02-06 10:00:00', 3),
(8, 2, 'Csirke paprikás', 'CsirkePaprikas.png', '00:45:00', 'Fűszerezd a csirkemellet hagymával, paradicsommal, sóval és feketeborssal, majd főzd össze egy lábasban.', '2024-02-07 12:00:00', 3),
(9, 3, 'Zöldséges tészta', 'ZoldsegesTeszta.png', '00:30:00', 'Főzd meg a tésztát, majd keverd össze brokkolival, vöröshagymával, paradicsommal, egy kevés olajjal, sóval és feketeborssal.', '2024-02-08 14:00:00', 3),
(10, 2, 'Gulyásleves', 'Gulyasleves.png', '01:00:00', 'Forrald fel a vizet, rakd bele a zldségeket és a húst, majd főzd meg.', '2024-02-10 15:00:00', 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `recipestates`
--

CREATE TABLE `recipestates` (
  `ID` int(11) NOT NULL,
  `stateName` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `recipestates`
--

INSERT INTO `recipestates` (`ID`, `stateName`) VALUES
(3, 'Accepted'),
(1, 'Draft'),
(2, 'Waiting');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `roles`
--

CREATE TABLE `roles` (
  `ID` int(11) NOT NULL,
  `roleName` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `roles`
--

INSERT INTO `roles` (`ID`, `roleName`) VALUES
(1, 'Admin'),
(2, 'Moderator'),
(3, 'User');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `usablemeasures`
--

CREATE TABLE `usablemeasures` (
  `commodityTypeID` int(11) NOT NULL,
  `measureID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `usablemeasures`
--

INSERT INTO `usablemeasures` (`commodityTypeID`, `measureID`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `username` varchar(16) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` blob NOT NULL,
  `roleID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `username`, `email`, `password`, `roleID`) VALUES
(1, 'TestAdmin', 'admin@testuser.com', 0x39663430643634623634636533653635353230306335363537376137636464393235643636303762383362396236306536623131343932303638306264363265, 1),
(2, 'TestMod', 'mod@testuser.com', 0x63313861303061636531653736303236303566643036376134343064383464313065666635666164613162636562336432643132316134313537316665323064, 2),
(3, 'TestUser', 'user@testuser.com', 0x38323361343536303164613530393638306230666137323561656364363463343561663834343733313737343931373430623362336135383036353939376539, 3);

--
-- Eseményindítók `users`
--
DELIMITER $$
CREATE TRIGGER `UserAdded` BEFORE INSERT ON `users` FOR EACH ROW SET NEW.password = SaltAndHashPassword(NEW.password)
$$
DELIMITER ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `authorID` (`authorID`),
  ADD KEY `recipeID` (`recipeID`);

--
-- A tábla indexei `commodities`
--
ALTER TABLE `commodities`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `commodityName` (`commodityName`),
  ADD KEY `commodityTypeID` (`commodityTypeID`);

--
-- A tábla indexei `commoditytypes`
--
ALTER TABLE `commoditytypes`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `commodityTypeName` (`commodityTypeName`);

--
-- A tábla indexei `favorites`
--
ALTER TABLE `favorites`
  ADD KEY `userID` (`userID`),
  ADD KEY `recipeID` (`recipeID`);

--
-- A tábla indexei `ingredients`
--
ALTER TABLE `ingredients`
  ADD KEY `recipeID` (`recipeID`),
  ADD KEY `commodityID` (`commodityID`),
  ADD KEY `measureID` (`measureID`);

--
-- A tábla indexei `likes`
--
ALTER TABLE `likes`
  ADD KEY `userID` (`userID`),
  ADD KEY `recipeID` (`recipeID`);

--
-- A tábla indexei `measures`
--
ALTER TABLE `measures`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `measureName` (`measureName`);

--
-- A tábla indexei `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `uploaderID` (`uploaderID`),
  ADD KEY `stateID` (`stateID`);

--
-- A tábla indexei `recipestates`
--
ALTER TABLE `recipestates`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `stateName` (`stateName`);

--
-- A tábla indexei `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `roleName` (`roleName`);

--
-- A tábla indexei `usablemeasures`
--
ALTER TABLE `usablemeasures`
  ADD KEY `commodityTypeID` (`commodityTypeID`),
  ADD KEY `measureID` (`measureID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `roleID` (`roleID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `commodities`
--
ALTER TABLE `commodities`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT a táblához `commoditytypes`
--
ALTER TABLE `commoditytypes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `measures`
--
ALTER TABLE `measures`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `recipes`
--
ALTER TABLE `recipes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `recipestates`
--
ALTER TABLE `recipestates`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `roles`
--
ALTER TABLE `roles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`authorID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`recipeID`) REFERENCES `recipes` (`ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `commodities`
--
ALTER TABLE `commodities`
  ADD CONSTRAINT `commodities_ibfk_1` FOREIGN KEY (`commodityTypeID`) REFERENCES `commoditytypes` (`ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`recipeID`) REFERENCES `recipes` (`ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`recipeID`) REFERENCES `recipes` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `ingredients_ibfk_2` FOREIGN KEY (`commodityID`) REFERENCES `commodities` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `ingredients_ibfk_3` FOREIGN KEY (`measureID`) REFERENCES `measures` (`ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`recipeID`) REFERENCES `recipes` (`ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`uploaderID`) REFERENCES `users` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`stateID`) REFERENCES `recipestates` (`ID`);

--
-- Megkötések a táblához `usablemeasures`
--
ALTER TABLE `usablemeasures`
  ADD CONSTRAINT `usablemeasures_ibfk_1` FOREIGN KEY (`commodityTypeID`) REFERENCES `commoditytypes` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `usablemeasures_ibfk_2` FOREIGN KEY (`measureID`) REFERENCES `measures` (`ID`) ON DELETE CASCADE;

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `roles` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
