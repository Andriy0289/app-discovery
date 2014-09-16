(function(){
  'use strict';

  AI.init(function() { });
  angular.module('respApps', [
    'ngRoute',
    'filters',
    'services',
    'directives',
    'controllers',
    'masonryLayout', 
    'infinite-scroll'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'partials/search.html', 
        controller: 'SearchCtrl'
      })
      .when('/explore', {
        templateUrl: 'partials/explore.html',
        controller: 'ExploreCtrl'
        , reloadOnSearch: false
      })
      .when('/categories', {
        templateUrl: 'partials/categories.html',
        controller: 'CategoryCtrl'
      })
      .when('/category-details', {
        templateUrl: 'partials/category-details.html',
        controller: 'CategoryDetailsCrtl'
      })
      .when('/tags', {
        templateUrl: 'partials/tags.html',
        controller: 'TagsCtrl'
      })
      .when('/tags-details', {
        templateUrl: 'partials/tags-details.html',
        controller: 'TagsDetailsCtrl'
      })
      .otherwise({redirectTo: '/explore'});
  });
})();
