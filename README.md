# ebay-test-app


###### npm install ######

###### % node app.js --rebuild --database=ebay --user=test --password=abc123 ######

###### % node app.js --rebuild --database=ebay --user=test --password=abc123 ######

###### % node app.js --render=179281 --database=ebay --user=test --password=abc123 ######

###### % node app.js --render=179022 --database=ebay --user=test --password=abc123 ######




CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(45) NOT NULL,
  `CategoryLevel` int(11) NOT NULL DEFAULT '1',
  `BestOfferEnabled` tinyint(4) NOT NULL DEFAULT '1',
  `CategoryParentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `Id_UNIQUE` (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;