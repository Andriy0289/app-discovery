(function(){
  'use strict';

  var ctrl = angular.module('controllers', []);

  ctrl.controller('NavigationCtrl', function($scope, $location, $anchorScroll, appsFactory) {
    var ua = navigator.userAgent.toLowerCase();
    $scope.isIos = true;
    $scope.isAndroid = true;
    $scope.isDesctop = true;
    $scope.hideImgs = false;
    $scope.menuItem = 'explore';

    if( /android/i.test( ua ) ) {
      $scope.isIos = false;
      $scope.isDesctop = false;
    }

    if( /iphone|ipad|ipod/i.test( ua ) ) {
      $scope.isAndroid = false;
      $scope.isDesctop = false;
    }

    $scope.checkStore = function(stores) {
      options['stores'] = (stores || 1);
      fetch(options);
      $scope.stores = stores;
    };

    $scope.hiddenScreen = function(hideImgs) {
      $scope.hideImgs = hideImgs;
    };

    $scope.menuItems = function(item) {
      $scope.menuItem = item;
    };

    $scope.isActive = function (viewLocation) {
      var active = (viewLocation === $location.path());
      return active;
    };

    $scope.priceVal = function(price){
      var appPrice = $scope.app.price;
      appPrice = $scope.app.price === 0 ? 'free' : appPrice;
      return appPrice;
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

  ctrl.controller('ExploreCtrl', function($scope, $location, appsFactory, AppsProvider) {
    var options = {};

    //$scope.apps = {};


    // var fetch = function(options){
    //   appsFactory.fetchApplications(options, function(err, result) {
    //     $scope.apps = result.result;
    //     $scope.$apply();
    //   });
    // };

    // options['order'] = 'newest';
    // $scope.order = 'newest';
    // $location.search(options);
    // AppsProvider.options = options;
    // $scope.appsProvider = AppsProvider;

    
    $scope.sortApp = function(order) {
      options['order'] = (order || 'newest');
      $scope.order = (order || 'newest');
      $location.search(options);
      AppsProvider.options = options;
      $scope.appsProvider = AppsProvider;
      console.log('111111');
    };

    $scope.sortApp();

    $scope.filterApp = function(type) {
      if ('games' === type) {
        options['categories'] = 6;
        $scope.filter = type;
      } else {
        options['categories'] = -6;
        $scope.filter = type;
      }
      AppsProvider.offset = 0;
      AppsProvider.options = options;
      $scope.appsProvider = AppsProvider;
      console.log('333333');
    };
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