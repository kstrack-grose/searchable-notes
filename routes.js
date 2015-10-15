var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var counter = 15;

module.exports = {
  GET: function(req, res) {
    console.log('--------- QUERY ----------', req.query.query);
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
      });
    } else {
      client.search({
        index: 'notes',
        type: 'document'
      })
      .then(function(results) {
        res.send(JSON.stringify(results));
      });
    }
  },

  POST: function(req, res) {
    console.log('--------------------------', req.body)
    client.index({
      index: 'notes',
      type: 'document',
      id: counter,
      body: {
              name: counter, 
              text: req.body.text
      }
    }).then(function(response) {
      counter++;
      console.log(response);
      res.send('GOOD JOB');
    })
  }
}