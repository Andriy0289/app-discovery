(function(){
  'use strict';

  var ctrl = angular.module('controllers', ['infinite-scroll']);

  ctrl.controller('NavigationCtrl', function($scope, $location, appsFactory) {
    $scope.isIos = true;
    $scope.isAndroid = true;
    $scope.isDesctop = true;

    if( /android/i.test( navigator.userAgent.toLowerCase() ) ) {
      $scope.isIos = false;
      $scope.isDesctop = false;
    }

    if( /iphone|ipad|ipod/i.test( navigator.userAgent.toLowerCase() ) ) {
      $scope.isAndroid = false;
      $scope.isDesctop = false;
    }

    var options = {};

    var fetch = function(options){
      appsFactory.fetchApplications(options, function(err, result){
        $scope.$apply(function(){
          $location.search(options);
          $scope.apps = result.result;
        });
      });
    };

    $scope.checkStore = function(stores) {
      options['stores'] = stores;
      fetch(options);
    };
  });

  ctrl.controller('SearchCtrl', function($scope, $location, appsFactory) {

    var options = {};

    $scope.apps = {};

    var fetch = function(options){
      appsFactory.fetchApplications(options, function(err, result){
        $scope.$apply(function(){
          $location.search(options);
          $scope.apps = result.result;
        });
      });
    };

    $scope.getApp = function(type) {
      if ('games' === type) {
        options['categories'] = 6;
      } else if ('apps' === type) {
        options['categories'] = -6;
      } else if ('all' === type) {
        options['categories'] = [];
      }

      fetch(options);
    };

    $scope.sortApp = function(prices) {
      options['prices'] = (prices || 'all');

      fetch(options);
    };

    $scope.searchApps = function(query) {
      options['query'] = $scope.query;

      fetch(options);
    };

    $scope.getApp();
  });

  ctrl.controller('ExploreCtrl', function($scope, $location, appsFactory) {
    var options = {};

    $scope.apps = {};

    var fetch = function(options){
      appsFactory.fetchApplications(options, function(err, result) {
        $scope.$apply(function(){
          $scope.apps = result.result;
        });
      });
    };

    var grid = function(){
      $scope.$watch("apps", function () { 
        $("#main-holder").gridalicious({
          width: 300,
          gutter: 10,
          selector: '.the-app',
          animate: true
        });
        $('.galcolumn:empty').fadeOut(0);
      });
    };

    $scope.filterApp = function(type) {
      if ('games' === type) {
        options['categories'] = 6;
      } else {
        options['categories'] = -6;
      }

      fetch(options);
      grid();
    };

    $scope.sortApp = function(order) {
      options['order'] = (order || 'newest');
      $location.search(options);
      fetch(options);
      grid();
      console.log($location.$$search.order);
    };

    $scope.searchApps = function(query) {
      options['query'] = $scope.query;

      fetch(options);
    };

    $scope.scrollEvent = function(){

    };

    // $scope.sortApp();
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
