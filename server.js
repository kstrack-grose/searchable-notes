var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http');

var router = require('./routes');

var app = express();

// connect to local database
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

/* middleware */
//serve static angular file
app.use(express.static(__dirname + '/client'));

//logger
app.use(morgan('dev'));

//body parser for requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/notes', router.GET);
app.post('*', router.POST);

app.listen(3030);

// ping local database
client.ping({
  // ping usually has a 3000ms timeout 
  requestTimeout: Infinity,
  // undocumented params are appended to the query string 
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
