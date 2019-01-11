// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204 

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

var result = {
	unix: null,
	utc: null
};

var date; 

// handle GET [project url]/api/timestamp/  --> no date specified
app.get("/api/timestamp/", function (req, res) {
  date = new Date();
  result.unix = date.getTime();
  result.utc = date.toUTCString();
  res.send(result);
});

// handle GET [project url]/api/timestamp/*   --> potential date specified
app.get("/api/timestamp/:dateString", function (req, res) {
  var inputDateString = req.params.dateString;
  
  console.log("req.params.dateString = ", req.params.dateString);
  console.log("req.params = ", req.params);
  console.log("req.url = ", req.url);
  
  // check if inputDateSring is unix timestamp or an ISO-8061 date
  if (!isNaN(inputDateString)) { // check is inputDateString is unix timetstamp
    date = new Date(parseInt(inputDateString));
    console.log("UNIX DATE : date = ", date);
    result.unix = date.getTime();
    result.utc = date.toUTCString();
    res.send(result);
  } else { // inputDateString is not a unix timestamp 
    date = new Date(inputDateString);
    console.log("CHECKING if ISO-8061 date : date = ", date);
    if (!isNaN(date.getTime())) { // check if we have a valid ISO-8061 date
      result.unix = date.getTime();
      result.utc = date.toUTCString();
      res.send(result);
    } else {
      result.unix = null;
      result.utc = "Invalid Date";
      res.send(result);
    }  
  }   
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
//var listener = app.listen(portNumber, function () { // 1/9/2019 - specify "portNumber" 
  console.log('Your app is listening on port ' + listener.address().port);
});  