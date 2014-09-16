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

    
    // var options = {};

    // var fetch = function(options){
    //   appsFactory.fetchApplications(options, function(err, result){
    //     $scope.$apply(function(){
    //       $location.search(options);
    //       $scope.apps = result.result;
    //     });
    //   });
    // };

    // $scope.checkStore = function(stores) {
    //   options['stores'] = (stores || 1);
    //   fetch(options);
    //   $scope.stores = stores;
    // };

    // $scope.hiddenScreen = function(hideImgs) {
    //   $scope.hideImgs = hideImgs;
    // };

    // $scope.menuItems = function(item) {
    //   $scope.menuItem = item;
    // };

    // $scope.isActive = function (viewLocation) {
    //   var active = (viewLocation === $location.path());
    //   return active;
    // };

    // $scope.priceVal = function(price){
    //   var appPrice = $scope.app.price;
    //   appPrice = $scope.app.price === 0 ? 'free' : appPrice;
    //   return appPrice;
    // };
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

    // var fetch = function(options){
    //   appsFactory.fetchApplications(options, function(err, result){
    //     $scope.$apply(function(){
    //       $location.search(options);
    //       $scope.apps = result.result;
    //     });
    //   });
    // };

    var fetch = function(options){
      appsFactory.fetchApplications(options, function(err, result) {
        $scope.apps = result.result;
        $scope.$apply();
      });
    };

    
    $scope.sortApp = function(order) {
      options['order'] = (order || 'newest');
      $scope.order = (order || 'newest');
      $location.search(options);
      fetch(options);
      console.log('111111');
    };

    $scope.sortApp();
    
    // $scope.scrollTo = function(id) {
    //   alert('fgsfsfg');
    //   $location.hash(id);
    //   console.log($location.hash());
    //   $anchorScroll();
    // };

    // var fetch = function(options){
    //   appsFactory.fetchApplications(options, function(err, result) {
    //     $scope.apps = result.result;
    //     $scope.$apply();
    //   });
    // };

    // fetch(options);


    // $("#main-holder").gridalicious({
    //   width: 300,
    //   gutter: 10,
    //   selector: '.the-app',
    //   animate: true
    // });

    // $scope.onComplete = function() {
    //   $('.galcolumn:empty').remove();

    //   $(document).bind('scroll', function() {
    //     // console.log(raw.scrollTop +' + '+ raw.offsetHeight + ' >= ' + raw.scrollHeight);

    //     var makeboxes = function(){
    //       appsFactory.fetchApplications(options, function(err, result) {
    //         $scope.$apply(function(){
    //           $scope.apps.concat(result.result);
    //         });
    //       });
    //       // console.log('agadgadgad');
    //     };

    //     if (document.documentElement.clientHeight + $(document).scrollTop() >= document.body.offsetHeight) {
    //       $("#main-holder").gridalicious('append', makeboxes());
    //     }
    //   });
    // };

    $scope.filterApp = function(type) {
      if ('games' === type) {
        options['categories'] = 6;
        $scope.filter = type;
      } else {
        options['categories'] = -6;
        $scope.filter = type;
      }

      fetch(options);
      console.log('333333');
    };

    // $scope.sortApp = function(order) {
    //   options['order'] = (order || 'newest');
    //   $scope.order = (order || 'newest');
    //   $location.search(options);
    //   fetch(options);
    // };

    // $scope.searchApps = function(query) {
    //   options['query'] = $scope.query;
    //   fetch(options);
    // };

    // $scope.$on('ngRepeatFinished', function(e, el) {
    //   $('#main-holder').gridalicious('append', el.innerHtml);
    // });

    // $scope.custom = true;
    // $scope.menu = true;
    // $scope.sortApp();

    // $scope.busy = false;
    // $scope.next = function() {
    //   if ($scope.busy) return;

    //   $scope.busy = true;
    //   options['offset'] += 10;
    //   appsFactory.fetchApplications(options, function(err, json) {
    //     json.result.forEach(function(e) {
    //       $scope.apps.push(e);
    //     });
    //     $scope.$apply();
    //     $scope.busy = false;
    //   });
    // };

    // $(document).on('scroll', function(e) {
    //   var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    //   if ($(document).height() - $(window).height() <= scrolled) {
    //     $scope.next();
    //   }
    // });

    $scope.fetchNext = function() {
        var i=0;

        if(!busy) {
            console.log('Fetching next')
            busy = true;

            for(var i=0; i<30; i++) {
                $scope.images.push({
                    src: '250/' + heights[i % heights.length] + '/' + cats[Math.floor(Math.random() * cats.length )]
                }); 

                // $scope.images2.push({
                //     src: '150/' + heights[i % heights.length] + '/' + cats[Math.floor(Math.random() * cats.length )]
                // });     
            }

        }

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