var express = require('express');
const path = require('path');
var session = require('express-session')
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var db = require('../database-mysql');
var APIKey = process.env.API_KEY || require('./yelpAPI.js').yelpAPI;
var utilsMethods = require('./utils.js');
var axios = require('axios');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
//original configuration for socket.io
//var socketIO = require('socket.io');
var SocketManager = require('./socketManager');
//**************** */
//var io = require('socket.io');
aws.config.update({
    secretAccessKey: '/Y+qnTBGnfpFiRWoJh6X/Mbl19O4cAut3vpS1//U',
    accessKeyId: 'AKIAJXYWBNHV4ON7KGGQ',
    region: 'us-east-1'
});
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'postlistingimages',
    key: function(req, file, cb) {
      cb(null, `${new Date()}-${file.originalname}`);
    }
  })
});

var app = express();

//diff config for socket
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//var io = module.exports.io = require('socket.io').listen(server)
//console.log('io server', io)

app.use(express.static(__dirname + '/../react-client/dist'));

app.use(express.static(__dirname + '/assets'));

app.use(bodyParser.json())
app.use(session({
  resave: false, 
  saveUninitialized: false, 
  secret: 'someSuperSecretString', 
  cookie: {maxAge : 600000}
}));

var checkSession = function(req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    console.log('session user id does not exist')
  }
}

// signup endpoint: takes user input, queries db to check if user exists, inserts into db with default tasks for that user
app.post('/signup', (req, res) => {
  // check if all 3 user fields provided
  if (req.body.username && req.body.password && req.body.zipcode) {
    var user = req.body.username
    var pass = req.body.password
    var zipcode = req.body.zipcode
    // query db for provided username
    db.connection.query(
      `SELECT * FROM users WHERE username = '${user}'`,
      function(err, results) {
        if (err) console.error(err);
        // if user is not in the db, length of results will be zero
        if (results.length === 0) { 
          // hash the provided password
          bcrypt.hash(pass, null, null, (err, hash) => {
            if (err) console.error(err)
            // insert user, password, zipcode into 'users' table
            db.connection.query(
              `INSERT INTO users (id, username, password, zipcodefrom, totalbudget) VALUES (?, ?, ?, ?, ?)`,
              [null, user, hash, zipcode, null], 
              function(err) {
                if (err) console.error(err)
                // get the assigned numerical id for that user
                db.connection.query(
                  `SELECT id FROM users WHERE username = '${user}'`,
                  function(err, results) {
                    if (err) { console.error(err) }
                    var id = results[0].id
                    // bulk insert a set of default tasks into 'todos' table, unique to that user       
                    db.connection.query(
                      `INSERT INTO todos (id, user, task, price, complete, searchterm) VALUES 
                      (null, ${id}, 'End your lease', null, 0, null),
                      (null, ${id}, 'Buy packing supplies', 0, 0, null),   
                      (null, ${id}, 'Pack your things', null, 0, null),
                      (null, ${id}, 'Hire movers or rent a truck', 0, 0, null),
                      (null, ${id}, 'Pack the truck', null, 0, null),
                      (null, ${id}, 'Clean your old place', null, 0, null),
                      (null, ${id}, 'Drive the truck', null, 0, null),
                      (null, ${id}, 'Unpack and enjoy your new home!', null, 0, null)`, 
                      function(err) {
                        if (err) console.error(err)
                        res.status(201).send()
                      } 
                    )
                  }
                )
              }
            )
          })
        } else {
          res.status(403).send(/*negative*/)
        }
      }
    )
  } else {
    res.status(403).send(/*negative*/)
  }
})

app.post('/login', (req, res) => {
  if (req.body.username && req.body.password) {
    var user = req.body.username
    var pass = req.body.password
    db.connection.query(
      `SELECT * FROM users WHERE username = '${user}'`,
      function(err, results) {
        if (err) console.error(err);
        if (results.length > 0) {
          bcrypt.compare(pass, results[0].password, function(err, exists) {
            if (exists) {
              req.session.userId = results[0].id
              res.send()
            } else {
              res.status(403).send(/*negative*/)
            }
          })
        } else {
          res.status(403).send(/*negative*/)
        }
      }
    )
  } else {
    res.status(403).send(/*negative*/)
  }
})

app.get('/logout', checkSession, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err)
    } else {
      res.status(202).send()
    }
  })
})

app.get('/tasks', checkSession, (req, res) => {
  db.connection.query(
    `SELECT * FROM todos WHERE user = '${req.session.userId}'`,
    function(err, data) {
      if(err) console.error(err)
      res.status(200).send(data)
    }
  )
})

app.post('/tasks', checkSession, (req, res) => {
  db.connection.query(
    `INSERT INTO todos (id, user, task, price, complete, searchterm) VALUES (?, ?, ?, ?, ?, ?)`,
    [null, req.session.userId, req.body.task, req.body.cost, req.body.complete, null],
    function(err) {
      if (err) console.error(err)
      res.status(201).send()
    }
  )
})

app.post('/delete', checkSession, (req, res) => {
  db.connection.query(
    `DELETE FROM todos WHERE id = '${req.body.taskId}'`,
    function(err) {
      if (err) console.error(err)
      res.status(202).send()
    }
  )
})

app.post('/budget', checkSession, (req, res) => {
  db.connection.query(
    `UPDATE users SET totalbudget = '${req.body.budget}' WHERE id = '${req.session.userId}'`,
    function(err) {
      if (err) console.error(err)
      res.status(201).send()
    }
  )
})

app.get('/budget', checkSession, (req, res) => {
  db.connection.query(
    `SELECT totalbudget FROM users WHERE id = '${req.session.userId}'`,
    function(err, data) {
      if (err) console.error(err)
      res.status(200).send(data)
    }
  )
})

app.post('/checklist', checkSession, (req, res) => {
  db.connection.query(
    `UPDATE todos SET complete = !complete WHERE id = '${req.body.taskId}'`,
    function(err) {
      if (err) console.error(err)
      res.status(201).send()
    }
  )
})

app.post('/expenses', checkSession, (req, res) => {
  db.connection.query(
    `UPDATE todos SET price = '${req.body.cost}' WHERE id = '${req.body.taskId}'`,
    function(err) {
      if (err) console.error(err)
      res.status(201).send()
    }
  )
})

app.get('/zipcode', checkSession, (req, res) => {
  db.connection.query(
    `SELECT zipcodefrom FROM users WHERE id = '${req.session.userId}'`,
    function(err, data) {
      if (err) console.error(err)
      res.status(200).send(data)
    }
  )
})

app.post('/newpost', upload.any(), (req, res)=>{
  let postData = req.body
  let queryString = `INSERT into communitypost (user_id, title, description, category, price, isdonated, zipcode, username) VALUES (${req.session.userId}, "${postData.title}", "${postData.description}", "${postData.category}", "${postData.price}","${postData.isdonated}", "${postData.zipcode}", "${postData.username}")`
  if(req.files.length > 0){
    imageUrls = req.files.map(photo => photo.location)
    let stringURLS = `[${imageUrls.join(',')}]`
    queryString = `INSERT into communitypost (user_id, title, description, category, price, isdonated, zipcode, image, username) VALUES (${req.session.userId}, "${postData.title}", "${postData.description}", "${postData.category}", "${postData.price}","${postData.isdonated}", "${postData.zipcode}", "${stringURLS}", "${postData.username}")`
  }
  db.connection.query(queryString, function(err, data) {
      if(err) console.error(err)
      res.status(200).end()
    })
})


app.get('/categories', (req, res) =>{
  db.connection.query(`SELECT description FROM communitycategory`, (err,data) =>{
    if(err) console.error(err)
    res.status(200).send(data)
  })
})

app.get('/userPosts', checkSession, (req, res) => {
  db.connection.query(
    `SELECT * FROM communitypost WHERE user_id="${req.session.userId}"`,
    (err, data) => {
      //console.log(data);
      if (err) console.error(err);

      const parsedData = JSON.parse(JSON.stringify(data));
      //console.log(parsedData)
      for (let datum of parsedData) {
        if(datum.image !== null){
          datum.image = datum.image.slice(1, -1).split(',');
        }
      }
      //console.log(parsedData)
      res.status(200).send(parsedData);
    }
  );
});

//getting all posting from communitypost 
app.get('/allPosts', checkSession, (req, res) => {
  db.connection.query(
    "SELECT * FROM communitypost" ,
    (err, data) => {
      //console.log(data);
      if (err) console.error(err);

      const parsedData = JSON.parse(JSON.stringify(data));
      //console.log(parsedData)
      for (let datum of parsedData) {
        datum.image = data.image? datum.image.slice(1, -1).split(',') : data.image;
      }
      //console.log(parsedData)
      res.status(200).send(parsedData);
    }
  );
});

app.post('/deletepost', checkSession, (req, res) =>{
  let id = req.body.id
  db.connection.query(`DELETE FROM communitypost WHERE id=${id}`, 
    (err,data) =>{
      if(err) console.error(err)
      res.end()
    })
})

app.get('/yelpRequest', checkSession, (req, res) => {
  // this gets back business from yelp based on the item searched from the dropdown in services
  // as well as the user's zip code
	axios.get('https://api.yelp.com/v3/businesses/search', {
  	headers: {
  		Authorization : `Bearer ${APIKey}`
  	}, 
  	params: {
  		term: req.query.term,
  		location: req.query.location,
  		sort_by: 'distance',
  		limit: 5
  	}
  })
  .then((response) => {
    // data from yelp is then passed into our data cleaner function in utils
    // and saved to the cleanedData variable, which is then sent to the client
    var cleanedData = utilsMethods.dataCleaner(response.data.businesses)
    res.status(200)
  	res.send(cleanedData)
  })
  .catch((err) => {
    console.error(err)
  })
})

const parseWeatherData = data => data.data;

app.post('/weather', (request, response) => {
  const {lat, lng, dateInUnix} = request.body;
  console.log('in weatehr', lat, lng, dateInUnix)
  const url = `https://api.darksky.net/forecast/${
    process.env.DARK_SKY_API_KEY
  }/${lat},${lng},${dateInUnix}`;

  axios
    .get(url)
    .then(results => response.send(parseWeatherData(results)))
    .catch(err => {
      console.log(err);
    });
});

app.post('/geocoder', (request, response) => {
  const {location} = request.body;
  const base = `https://maps.googleapis.com/maps/api/geocode/json`;
  const extras = `?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const url = base + extras;
  axios
    .get(url)
    .then(results => response.send(results.data.results[0].geometry.location))
    .catch(err => console.log(err));
});

app.post('/widget', (request, response) => {
  const {user, moveoutday, lat, lng, location, toUpdate} = request.body;
  db.insertMovingInfo({user, moveoutday, lat, lng, location}, (err, data) => {
    response.send({msg: 'Inserted!'});
  })
});

app.post('/movingInfo', (request, response) => {
  const { user } = request.body;
  db.getMovingInfo(user, (err, data) => {
    response.send(data);
  })
})

app.delete('/movingInfo', (request, response) => {
  const {user} = request.query;
  console.log(user)
  db.deleteMovingInfo(user, (err, data) => {
    if (err) {
      throw err;
    }
    response.send({msg: 'Successfully Deleted!'});
  });
});

app.post('/getItemsNoBox', (req, res) => {
  var {user} = req.body;
  console.log(`[server] user: ${user}`);
  db.getItemsNoBox(user, data => {
    console.log(`[database -> server] data: ${data}`);
    res.send(data); //array of object {"name": item}
  });
});

app.post('/getItemsByBox', (req, res) => {
  var {user, boxName} = req.body;
  db.getItemsByBox(user, boxName, data => {
    res.send(data); //array of object {"name": item}
  });
});

app.post('/getBoxes', (req, res) => {
  var {user} = req.body;
  db.getBoxes(user, data => {
    res.send(data);
  });
});

app.post('/postItemNoBox', (req, res) => {
  var {user, item} = req.body;
  console.log(user, item);
  db.postItemNoBox(user, item, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.send();
  });
});

app.post('/itemFromBoxToBox', (req, res) => {
  var {user, item, fromBox, toBox} = req.body;
  db.itemFromBoxToBox(user, item, fromBox, toBox, result => {
    res.send();
  });
});

app.post('/itemFromBoxToEmpty', (req, res) => {
  var {user, item, fromBox} = req.body;
  db.itemFromBoxToEmpty(user, item, fromBox, result => {
    res.send();
  });
});

app.post('/itemFromEmptyToBox', (req, res) => {
  var {user, item, toBox} = req.body;
  db.itemFromEmptyToBox(user, item, toBox, result => {
    res.send();
  });
});

app.post('/postBox', (req, res) => {
  var {user, boxName} = req.body;
  db.postBox(user, boxName, () => {
    res.send();
  });
});

app.post('/deleteItem', (req, res) => {
  var {user, item} = req.body;
  db.deleteItem(user, item, () => {
    res.send();
  });
});

app.post('/deleteItemByBox', (req, res) => {
  var {user, item, boxName} = req.body;
  db.deleteItemByBox(user, item, boxName, () => {
    res.send();
  });
});

app.post('/deleteBox', (req, res) => {
  var {user, boxName} = req.body;
  db.deleteBox(user, boxName, () => {
    res.send();
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../react-client/dist/index.html'));
});



//socketIO original
// var server = app.listen(process.env.PORT || 3000, function() {
//   console.log(`listening on port ${process.env.PORT || '3000'}!`);
// });
// io = socketIO(server);
io.on('connection', (socket) =>  {SocketManager(socket, io)})
server.listen(process.env.PORT || 3000);
//var io = module.exports.io = require('socket.io')(server)
//when connection is established, io send a socket to a function
//and the function here is SocketManager


//console.log('io', io)
// module.exports = {
//   io
// }

// exports = module.exports = {}
// exports.io = io;
//module.exports = io;
