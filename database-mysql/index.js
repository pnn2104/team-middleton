var mysql = require('mysql');
var bcrypt = require('bcrypt');

// information for database hosted on AWS, deployed on Heroku
var connection = mysql.createConnection({
  host: process.env.DB_URL || 'moving.cgipzmxzylvi.us-east-1.rds.amazonaws.com',
  user: 'middleton',
  password: 'h4ckr34t0r',
  database: 'moving',
});

const getItemsNoBox = function(user, cb) {
  connection.query(
    `select name from items where user="${user}" and boxName="0";`,
    (err, data) => {
      console.log(`[database] data: ${data}`);
      cb(data);
    },
  );
};

const postItemNoBox = function(user, item) {
  connection.query(
    `insert into items (name, user) values ("${item}", "${user}");`,
  );
};

const getBoxes = function(user, cb) {
  connection.query(
    `select name from boxes where user="${user}";`,
    (err, data) => {
      cb(data);
    },
  );
};

const getItemsByBox = function(user, boxName, cb) {
  connection.query(
    `select name from items where user="${user}" and boxName="${boxName}";`,
    (err, data) => {
      cb(data);
    },
  );
};

const postBox = function(user, box) {
  connection.query(
    `insert into boxes (name, user) values ("${box}", "${user}");`,
  );
};

const itemFromBoxToBox = function(user, item, fromBox, toBox, cb) {
  connection.query(
    `insert into items (name, user, boxName) values ("${item}", "${user}", "${toBox}");`,
    () => {
      connection.query(
        `delete from items where name="${item}" and user="${user}" and boxName="${fromBox}";`,
        result => {
          cb(result);
        },
      );
    },
  );
};

const itemFromBoxToEmpty = function(user, item, fromBox, cb) {
  connection.query(
    `insert into items (name, user) values ("${item}", "${user}");`,
    () => {
      connection.query(
        `delete from items where name="${item}" and user="${user}" and boxName="${fromBox}";`,
        result => {
          cb(result);
        },
      );
    },
  );
};

const itemFromEmptyToBox = function(user, item, toBox, cb) {
  connection.query(
    `insert into items (name, user, boxName) values ("${item}", "${user}", "${toBox}");`,
    () => {
      connection.query(
        `delete from items where user="${user}" and name="${item}" and boxName="0";`,
        result => {
          cb(result);
        },
      );
    },
  );
};

const deleteBox = function(user, box, cb) {
  connection.query(
    `delete from boxes where user="${user}" and name="${box}";`,
    result => {
      cb(result);
    },
  );
};

const deleteItem = function(user, item, cb) {
  connection.query(
    `delete from items where user="${user}" and name="${item}" and boxName="0";`,
    result => {
      cb(result);
    },
  );
};

const deleteItemByBox = function(user, item, box, cb) {
  connection.query(
    `delete from items where user="${user}" and name="${item}" and boxName="${box}";`,
    result => {
      cb(result);
    },
  );
};

connection.connect(err => {
  console.log(process.env.DB_URL);
  if (err) {
    console.log('error connecting to db');
    return;
  }
  console.log('connected to the db');
});

// export connection for import to the server file
// database and tables created in schema.sql
module.exports = {
  connection,
  getItemsNoBox,
  postItemNoBox,
  getBoxes,
  getItemsByBox,
  postBox,
  itemFromBoxToBox,
  itemFromBoxToEmpty,
  itemFromEmptyToBox,
  deleteBox,
  deleteItem,
  deleteItemByBox,
};
