'use strict';

var services = angular.module('services', []);

services.factory('appsFactory', function() {
  return {
    fetchApplications: function(options, callback) {
      AI.collect('applications', options, callback);
    }
  }
});