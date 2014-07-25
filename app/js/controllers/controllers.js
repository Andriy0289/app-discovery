(function(){
  'use strict';

  var ctrl = angular.module('controllers', []);

  ctrl.controller('SearchCtrl', function($scope, appsFactory) {


    var options = {};

    $scope.apps = [];

    $scope.getApp = function(type) {
      if ('games' === type) {
        options['categories'] = 6;
      } else if ('apps' === type) {
        options['categories'] = -6;
      } else if ('all' === type) {
        options['categories'] = [];
      }

      appsFactory.fetchApplications(options, function(err, result) {
        $scope.$apply(function(){
          $scope.apps = result.result;
        });
      });
    };

    $scope.sortApp = function(prices) {
      options['prices'] = (prices || 'all');

      appsFactory.fetchApplications(options, function(err, result) {
        $scope.$apply(function(){
          $scope.apps = result.result;
        });
      });
    };

    

    $scope.getApp();
  });

  ctrl.controller('ExploreCtrl', function($scope, $location, appsFactory) {
    var options = {};

    $scope.apps = {};

    var fetch = function(options){
      appsFactory.fetchApplications(options, function(err, result) {
        $scope.$apply(function(){
          $location.search(options);
          $scope.apps = result.result;
        });
      });
    };

    $scope.filterApp = function(type) {
      if ('games' === type) {
        options['categories'] = 6;
      } else {
        options['categories'] = -6;
      }

      fetch(options);
    };

    $scope.sortApp = function(order) {
      options['order'] = (order || 'newest');
      fetch(options);
      console.log($location.$$search.order);
    };

    $scope.searchApps = function(query) {
      options['query'] = $scope.query;

      fetch(options);
    }

    $scope.sortApp();
  });
  
  ctrl.controller('CategoryCtrl', function($scope) {

  });

  ctrl.controller('CategoryDetailsCrtl', function($scope) {

  });

  ctrl.controller('TagsCtrl', function($scope) {

  });

  ctrl.controller('TagsDetailsCtrl', function($scope) {

  });

})();
