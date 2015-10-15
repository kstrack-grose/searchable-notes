angular.module('notesApp', [])
.factory('Notes', function($http) {
  var factoryTest = function() {
    return $http({
      method: 'POST',
      url: '/notes',
      data: {
        test: 'hello world'
      }
    })
    .then(function(results) {
      console.log(results);
      return results.data;
    })
    .catch(function(err) {
      console.log(new Error(err));
    });
  };

  var postNote = function(text) {
    return $http({
      method: 'POST',
      url: '/notes',
      data: {
        'text': text
      }
    });
  };

  var getAll = function() {
    return $http({
      method: 'GET',
      url: '/notes'
    });
  };

  var searchFor = function(term) {
    return $http({
      method: 'GET',
      url: '/notes?query=' + term
    });
  };

  return {
    factoryTest: factoryTest,
    postNote: postNote,
    getAll: getAll,
    searchFor: searchFor
  }
})
.controller('NotesController', function($scope, Notes) {
  $scope.test = 'HELLO WORLD ARE YOU OUT THERE';
  $scope.searchTerm = '';
  $scope.noteMessage = '';
  $scope.allNotes = [];
  $scope.laggingSearchTerm = '';

  $scope.testFunction = function() {
    console.log('!!!!!!!!!');
    console.log(Notes.factoryTest());
  };

  $scope.submitNote = function() {
    Notes.postNote($scope.noteMessage)
    .then(function(result) {
      console.log(result, 37, 'app.js');
      $scope.noteMessage = '';
    })
    .catch(function(err) {
      console.log(new Error(err));
    });
  };

  $scope.getNotes = function() {
    Notes.getAll()
    .then(function(result) {
      var entries = result.data.hits.hits;
      for (var i = 0; i < entries.length; i++) {
        $scope.allNotes.push(entries[i]._source.text);
      }
    });
  };

  $scope.search = function() {
    $scope.allNotes = [];
    $scope.laggingSearchTerm = $scope.searchTerm
    Notes.searchFor($scope.searchTerm)
    .then(function(results) {
      var entries = results.data.hits.hits;
      for (var i = 0; i < entries.length; i++) {
        $scope.allNotes.push(entries[i]._source.text);
      }
      $scope.searchTerm = '';
    })
    .catch(function(err) {
      console.log(new Error(err));
    });
  };

});












