DROP TABLE IF EXISTS testDatabase.birdUsers;
DROP TABLE IF EXISTS testDatabase.bird_categories;
DROP TABLE IF EXISTS testDatabase.birdcodes;
DROP TABLE IF EXISTS testDatabase.birdSighting;
CREATE TABLE testDatabase.birdUsers LIKE defaultdb.birdUsers;
INSERT INTO testDatabase.birdUsers SELECT * FROM defaultdb.birdUsers;
CREATE TABLE testDatabase.bird_categories LIKE defaultdb.bird_categories;
INSERT INTO testDatabase.bird_categories SELECT * FROM defaultdb.bird_categories;
CREATE TABLE testDatabase.birdcodes LIKE defaultdb.birdcodes ;
INSERT INTO testDatabase.birdcodes  SELECT * FROM defaultdb.birdcodes;
CREATE TABLE testDatabase.birdSighting LIKE defaultdb.birdSighting ;
INSERT INTO testDatabase.birdSighting  SELECT * FROM defaultdb.birdSighting;