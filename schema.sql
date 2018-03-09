DROP DATABASE IF EXISTS moving;

CREATE DATABASE moving;

USE moving;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  password varchar(100) NOT NULL,
  zipcodefrom integer NOT NULL,
  totalbudget integer,
  PRIMARY KEY (id)
);

-- 'todos' table has 'one-to-many' relationship to a user: 
-- one user has many todos, each todo is unique to one user.
-- on signup, 'default' todo rows are created for the new user

CREATE TABLE todos (
  id integer NOT NULL AUTO_INCREMENT,
  user integer NOT NULL REFERENCES users(id),
  task varchar(255) NOT NULL,
  price integer,
  complete boolean NOT NULL default 0,
  searchterm varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE communitycategory (
  id integer NOT NULL AUTO_INCREMENT,
  description varchar(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE communitypost (
  id integer NOT NULL AUTO_INCREMENT,
  user integer NOT NULL REFERENCES users(id),
  title varchar(255) NOT NULL,
  description varchar (400) NOT NULL,
  category varchar(50) NOT NULL REFERENCES communitycategory(id),
  price varchar(10),
  isdonated boolean NOT NULL,
  zipcode varchar(10) NOT NULL,
  image varchar(1000),
  PRIMARY KEY (id)
);

CREATE TABLE chat (
  chatId varchar(255) NOT NULL,
  users varchar(500) NOT NULL
)


INSERT INTO communitycategory (id, description) VALUES (1, "Bedroom");
INSERT INTO communitycategory (id, description) VALUES (2, "Kitchen");
INSERT INTO communitycategory (id, description) VALUES (3, "Dining Room");
INSERT INTO communitycategory (id, description) VALUES (4, "Appliance");
INSERT INTO communitycategory (id, description) VALUES (5,"Electronics");
INSERT INTO communitycategory (id, description) VALUES (6,"Clothes");
INSERT INTO communitycategory (id, description) VALUES (7, "Misc");

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
