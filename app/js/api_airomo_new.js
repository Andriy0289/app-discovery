/* *************************************
 *      JSON object polyfil
 * ************************************/

 var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

/* *************************************
 *      Airomo API Object 0.6
 * ************************************/

var AI = (function() {
	var _config = {
		API_URL: window.location.protocol + '//' + window.location.host,
		CHANNEL_ORIGIN: 'https://api.airomo.net',
		INIT_TIMEOUT: 50000,
		API_CALL_TIMEOUT: 50000
	},
	_inited = false,
	_ifrm = null,
	_initTimer = null,
	_cbQueue = {},
	_rQueue = [],
	_debug = false,
	_locCache = {};

	var _isFunction = function(smth) {
		return smth && {}.toString.call(smth) == '[object Function]';
	};

	var _getUID = function() {
		function _s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' +
			_s4() + '-' + _s4() + _s4() + _s4();
	};

	var _getCacheKey = function(r, opts) {
		return JSON.stringify({
				r: r,
				o: opts
		});
	};

	var _setMessageListener = function() {
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		eventer(messageEvent, function(e) {
			if( e.origin == _config.CHANNEL_ORIGIN ) {
				var msg = JSON.parse( e.data );
				if( msg.err ) {
					_dispatchChannelEvent( msg, e );
				} else {
					_dispatchChannelEvent( null, e );
				}
			} else if( e.origin == _config.API_URL ) {
				var errPayload;
				try {
					errPayload = JSON.parse(e.data);
				} catch(event) {
					return;
				}
				if( errPayload.err && errPayload.err === 'timeout') {
					_dispatchChannelEvent( {err: 'timeout', guid: errPayload.guid}, e );
				}
			}
		}, false);
	};

	var _initedF = function(guid) {
		if('init' === guid) {
			_inited = true;
			_initedF = function() {};
			_doRequestQueue();
		}
	};

	var _doRequestQueue = function() {
		while(_rQueue.length > 0) {
			var currentRequest = _rQueue.pop();
			if(_isFunction( currentRequest.f )) {
				currentRequest.f.apply(this, currentRequest.p);
			}
		}
	};

	var _dispatchChannelEvent = function( err, e ) {
		if( err ) {
			_debug && console.log('Callback with error', err);
			if( _cbQueue[err.guid] && _cbQueue[err.guid].t && _cbQueue[err.guid].cb && _isFunction( _cbQueue[err.guid].cb) ) {
				clearTimeout( _cbQueue[err.guid].t );
				var fn = _cbQueue[err.guid].cb;
				delete _cbQueue[err.guid];
				fn( {err: err.err}, null );
				return;
			}
		}
		_debug && console.log('data from message in API', e.data);
		var idata = e.data || '';
		var payload = JSON.parse(idata);
		var guid = payload && payload.guid || 'error';
		_initedF(guid);
		if( _cbQueue[guid] && _cbQueue[guid].cb && _isFunction( _cbQueue[guid].cb ) ) {
			clearTimeout( _cbQueue[guid].t );
			var callback = _cbQueue[guid].cb;
			if( _cbQueue[guid].ck ) {
				_locCache[ _cbQueue[guid].ck ] = payload.data;
			} else if( guid === 'init') {
				_locCache['init'] = payload.data;
			}
			delete _cbQueue[guid];
			callback( null, payload.data );
		}
	};

	var _postServiceMessage = function( guid ) {
		var sM = { err: 'timeout', guid: guid };
		window.postMessage( JSON.stringify(sM), _config.API_URL );
	};

	var _handleRequest = function(r, rName, options, callback, withCache, guidP) {
		if( _inited ) {
			if( withCache ) {
				var ck = _getCacheKey(rName, options);
				if( _locCache[ck] ) {
					if( _isFunction( callback ) ) {
						callback( null, _locCache[ck] );
					}
				} else {
					r.call(this, options, callback, withCache, guidP);
				}
			} else {
				r.call(this, options, callback, withCache, guidP);
			}
		} else {
			_rQueue.unshift({
				f: r,
				p: Array.prototype.slice.call(arguments, 2)
			});
		}
	};

	var _appQs = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('appQs', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'appQs');
		}
		var payload = {
			r: 'appQs',
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _appSearch = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('appSearch', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'appSearch');
		}
		var payload = {
			r: 'appSearch',
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _getAppByMarketId = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('getAppByMarketId', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'getAppByMarketId');
		}
		var payload = {
			r: 'getAppByMarketId',
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _allUsersFeeds = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('allUsersFeeds', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'allUsersFeeds');
		}
		var payload = {
			r: 'allUsersFeeds',
			userId: options.userId,
			size: options.size || 10,
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

		var _userFeeds = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('userFeeds', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'userFeeds');
		}
		var payload = {
			r: 'userFeeds',
			userId: options.userId,
			size: options.size || 10,
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _appFeeds = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('appFeeds', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'appFeeds');
		}
		var payload = {
			r: 'appFeeds',
			appId: options.appId,
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _installApp = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('installApp', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'installApp');
		}
		var payload = {
			r: 'installApp',
			appId: options.appId,
			deviceId: options.deviceId,
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _getDevices = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('getDevices', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'getDevices');
		}
		var payload = {
			r: 'getDevices',
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	var _collect = function(options, callback, withCache, guidP) {
		var guid = guidP || _getUID();
		if( _isFunction( callback ) ) {
			var callTimer = setTimeout( function() {
				_postServiceMessage( guid );
			}, _config.API_CALL_TIMEOUT);
			_cbQueue[guid] = { cb: callback, t: callTimer };
			var ck;
			if( withCache ) {
				ck = _getCacheKey('collect', options);
				_cbQueue[guid].ck = ck;
			}
			_debug && (_cbQueue[guid].m = 'collect');
		}
		var collectQuery = '';
		if(options.collector_query) {
			collectQuery = options.collector_query;
			delete options.collector_query;
		}
		var payload = {
			r: 'collect',
			query: collectQuery,
			options: options,
			guid: guid
		};
		_ifrm.contentWindow && _ifrm.contentWindow.postMessage(JSON.stringify(payload), _config.CHANNEL_ORIGIN);
	};

	return {
		init: function(callback) {
			if (!_inited) {
				_debug && console.log(_config.CHANNEL_ORIGIN);
				_ifrm = document.createElement('iframe');
				_ifrm.setAttribute('src', 'https://api.airomo.net/new-channel.html');
				_ifrm.setAttribute('class', 'airomo-api-channel');
				_ifrm.style.visibility = 'hidden';
				_ifrm.style.display = 'none';

				if( _isFunction(callback) ) {
					var callTimer = setTimeout( function() {
						_postServiceMessage( 'init' );
					}, _config.INIT_TIMEOUT);
					_cbQueue['init'] = { cb: callback,  t: callTimer };
				}

				_setMessageListener();
				document.body.appendChild(_ifrm);
			} else {
				if(_locCache['init'] && _isFunction(callback)) {
					callback( null, _locCache['init'] );
				} else if( _isFunction(callback) ) {
					callback( {err: 'inited'}, {} );
				}
			}
		},
		appQs: function(options /*q, platforms, stores, size*/ , callback, withCache, guidP) {
			_handleRequest(_appQs, 'appQs', options, callback, withCache, guidP);
		},
		appSearch: function(options /*q, page, size*/ , callback, withCache, guidP) {
			_handleRequest(_appSearch, 'appSearch', options, callback, withCache, guidP);
		},
		getAppByMarketId: function(options, callback, withCache, guidP) {
			_handleRequest(_getAppByMarketId, 'getAppByMarketId', options, callback, withCache, guidP);
		},
		appFeeds: function(options, callback, withCache, guidP) {
			_handleRequest(_appFeeds, 'appFeeds', options, callback, withCache, guidP);
		},
		allUsersFeeds: function(options, callback, withCache, guidP) {
			_handleRequest(_allUsersFeeds, 'allUsersFeeds', options, callback, withCache, guidP);
		},
		userFeeds: function(options, callback, withCache, guidP) {
			_handleRequest(_userFeeds, 'userFeeds', options, callback, withCache, guidP);
		},
		installApp: function(options, callback, withCache, guidP) {
			_handleRequest(_installApp, 'installApp', options, callback, withCache, guidP);
		},
		getDevices: function(options, callback, withCache, guidP) {
			_handleRequest(_getDevices, 'getDevices', options, callback, withCache, guidP);
		},
		collect: function(query, options, callback, withCache, guidP) {
			if(options) {
				options['collector_query'] = query;
			}
			_handleRequest(_collect, 'collect', options, callback, withCache, guidP);
		}
	};
}());
