// connect to local database
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// this is a counter for indexing the notes
// it will increment automatically in production mode
var counter = 20;

module.exports = {
  GET: function(req, res) {
    // if this is a search term, search the db
    if (req.query.query) {
      client.search({
        index: 'notes',
        type: 'document',
        body: {
              query: {
                  query_string:{
                     query: req.query.query
                  }
              }
          }
      })
      .then(function(results) {
        res.send(JSON.stringify(results));
      })
      .catch(function(err) {
        console.log(new Error(err));
      });
    } else {
      // if it's not a search, return all notes
      client.search({
        index: 'notes',
        type: 'document'
      })
      .then(function(results) {
        res.send(JSON.stringify(results));
      })
      .catch(function(err) {
        console.log(new Error(err));
      });
    }
  },

  POST: function(req, res) {
    // insert new note into the db
    client.index({
      index: 'notes',
      type: 'document',
      id: counter,
      body: {
        text: req.body.text
      }
    }).then(function(response) {
      counter++;
      console.log(response);
      res.send('GOOD JOB');
    })
    .catch(function(err) {
      console.log(new Error(err));
    });
  }
};
