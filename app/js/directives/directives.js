'use strict';

var directives = angular.module('directives', []);

directives.directive('respApps', function($scope) {

});

directives.directive('appsGrid', function( $timeout, $templateCache, 
      $compile, $rootScope, AppsProvider ) {
  return {
    link: function(scope, elem, attrs) {
      scope.appsProvider.getMoreApps( function() {
        $(elem).gridalicious({
          selector: '.the-app',
          width: 300,
          gutter: 10,
          animate: true,
          animationOptions: {
            queue: true,
            speed: 200,
            duration: 300,
            effect: 'fadeInOnAppear'
          }
        });
      });

      var appTmpl;
      var appTmplFunc;
      
      scope.$on( 'apps:new', function( e, newvalsArr, reload) {
        var appsArr = [];
        var newItems = newvalsArr;
        if( newItems.length > 0 ) {
          appsArr = $.map( newItems, function( val, ind ) {
            var nScope = scope.$new();
            nScope.app = val;
            appTmpl = $templateCache.get('apptmpl.html');
            appTmplFunc = $compile( $.trim(appTmpl) );
            return appTmplFunc( nScope );
          });
        }
        if( reload === false && appsArr.length > 0 ) {
          $(elem).gridalicious('append', appsArr);
        } else {
          $(elem).gridalicious('append', appsArr);
        }
      });
    }
  };
});

/* Container Apps directive */
// directives.directive('containerApps', function () {
//   return {
//     restrict: 'E',
//     template: '<div infinite-scroll="fetchNext()" infinite-scroll-distance="0" style="display:inline-block; width:100%; height:100%">' +
//                 '<div id="main-holder" class="clr" data-masonry data-x-margin="10" data-y-margin="10" data-img-width="300">' +
//                 '</div>' +
//               '</div>',
//     replace: true,
//     link: function (scope, $elem, attrs) {
//       // $elem.masonry({
//       //   columnWidth: 300,
//       //   gutter: 10,
//       //   itemSelector: '.the-app'
//       //   // animate: true
//       // });
//       // console.log($elem);
//     }
//   }
// });

/* App directive */
// directives.directive('app', function () {
//   return {
//     restrict: 'E',
//     template: '<div class="the-app" on-render>' +
//                 '<div class="app-data-row">' +
//                   '<div class="app-icon-holder">' +
//                     '<a href="{{app.nativeUrl}}" target="_blank">' +
//                       '<img src="{{app.icon}}" class="app-icon" width="50" height="50">' +
//                     '</a>' +
//                   '</div>' +
//                   '<div class="app-data-text" style="">' +
//                     '<div class="app-title"><a href="{{app.nativeUrl}}" target="_blank">{{app.title | limitTo:16 }}</a></div>' +
//                     '<div class="app-data">' +
//                       '<a href="{{app.nativeUrl}}" class="app-price green-price" ng-if="app.price == 0" target="_blank">' +
//                         '<span>Free</span>' +
//                       '</a>' +
//                       '<a href="{{app.nativeUrl}}" class="app-price red-price" ng-if="app.price != 0" target="_blank">' +
//                         '<span>${{app.price}}</span>' +
//                       '</a>' +
//                     '</div>' +
//                   '</div>' +
//                   '<div class="clr"></div>' +
//                 '</div>' +
//                 '<div class="app-screenshot" ng-model="screens">' +
//                   '<img src="{{app.screenshots[0]}}">' +
//                 '</div>' +
//                 '<div class="app-description">' +
//                   '<div star-rating rating-value="app.rating" max="5" ></div>' +
//                   '<div>{{app.description | limitTo:90}}...</div>' +
//                 '</div>' +
//               '</div>',
//     link: function (scope, elem, attrs) {

//     }
//   }
// });

/* Rating stars directive */
directives.directive('starRating', function () {
  return {
    restrict: 'A',
    template: '<ul class="rating">' +
      '<li ng-repeat="star in stars" ng-class="star">' +
      '\u2605' +
      '</li>' +
      '</ul>',
    scope: {
      ratingValue: '=',
      max: '='
    },
    link: function (scope, elem, attrs) {
      scope.stars = [];
      for (var i = 0; i < 5; i++) {
        scope.stars.push({
          filled: i < scope.ratingValue
        });
      }
    }
  }
});

directives.directive("scroll", function ($window) {
  return function(scope, element, attrs) {
    angular.element($window).bind("scroll", function() {
      if (this.pageYOffset >= 100) {
        $('.go-top').addClass('active');
        $('.go-top').on('click', function(){
          $window.scrollTo(0, 0);
        });
      } else {
        $('.go-top').removeClass('active');
      }
    });
  };
});

// directives.directive('onRender', function ($timeout) {
//   var els = [];
//   return {
//     restrict: 'A',
//     link: function (scope, element, attr) {
//       els.push(element);
//       // console.log(scope, element, attr);
//       if (scope.$last) {
//         // console.log('last one', els.length);
//          $('#main-holder').gridalicious('append', els);
//       }
//       // $timeout(function () {
//       //   scope.$emit('ngRepeatFinished', element);
//       // });
//     }
//   }
// });


// directives.directive('exploreTemplate', function () {
//   return {
//     restrict: 'E',
//     template: 
//     	'<div ng-repeat="app in apps" class="the-app">' +
//         '<div class="app-data-row">' +
//           '<div class="app-icon-holder">' +
//             '<a href="{{app.nativeUrl}}" target="_blank">' +
//               '<img src="{{app.icon}}" class="app-icon" width="50" height="50">' +
//             '</a>' +
//           '</div>' +
//           '<div class="app-data-text" style="">' +
//             '<div class="app-title"><a href="{{app.nativeUrl}}" target="_blank">{{app.title | limitTo:16 }}</a></div>' +
//             '<div class="app-data">' +
//               '<a href="{{app.nativeUrl}}" class="app-price green-price" ng-if="app.price == 0" target="_blank">' +
//                 '<span>Free</span>' +
//               '</a>' +
//               '<a href="{{app.nativeUrl}}" class="app-price red-price" ng-if="app.price != 0" target="_blank">' +
//                 '<span>${{app.price}}</span>' +
//               '</a>' +
//             '</div>' +
//           '</div>' +
//           '<div class="clr"></div>' +
//         '</div>' +
//         '<div class="app-screenshot" ng-model="screens">' +
//           '<img src="{{app.screenshots[0]}}"> ' +
//         '</div>' +
//         '<div class="app-description">' +
//           '<div star-rating rating-value="app.rating" max="5" ></div>' +
//           '<div>{{app.description | limitTo:90}}...</div>' +
//         '</div>' +
//       '</div>',
//     link: function (scope, element, attrs, ngModelCtrl) { 
//       $scope.$watch("apps", function () { 
//         $("#main-holder").gridalicious({
//           width: 300,
//           gutter: 10,
//           selector: '.the-app',
//           animate: true,
//           animationOptions: {
//             complete: $scope.onComplete()
//           }
//         });
//       }); 
//     },
//     controller: function ($scope) {
//       $scope.save = function (data) {
//         // Assuming the document controller exposes a function "getUrl"
//         var url = $scope.documentController.getUrl(); 

//         myService.saveComments(url, data).then(function (result) {
//           // Do something
//         });
//       };
//     }
//   }
// });