'use strict';

var services = angular.module('services', []);

services.factory('appsFactory', function() {
  return {
    fetchApplications: function(options, callback) {
      AI.collect('applications', options, callback);
    }
  };
}).
service('AppsProvider', function( $timeout, $http, $log, $rootScope ) {
	this.apps = [];
	this.busy = false;
	this.offset = 0;
	this.options = {};
	this.getMoreApps = function( callback ) {
		if( this.busy ) return;
		this.busy = true;
		$timeout( $.proxy( function() {
			this.options['offset'] = this.offset;
			AI.collect( 'applications', this.options, $.proxy( function( err, res ) {
				if( !err ) {
					$log.debug( res );
					if (this.offset === 0) {
						this.apps = res.result;
					} else {
						$.merge( this.apps, res.result );						
					};
					this.offset += res.result.length;
					console.log(this.offset);
				}
				this.busy = false;
				callback && callback( err, res );
				if( !err ) {
					$rootScope.$broadcast( 'apps:new', res.result, this.offset == 0 );
				}
			}, this ));
		}, this));
	};
});