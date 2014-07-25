var currentQuery = {};

function hideErrorImage(event) {
  $(event.target.parentNode).addClass('show_big_pic_class');
}

function hideErrorIcon(event) {
  $(event.target).attr('src','img/dummyico.png');
}

function install(url) {
  window.open(url);
}

/* **********
 * 2 - Android
 * 1 - iOS
 * 0 - other
 * **********/
function androidOriOs() {
  var ret = 0;
  if( /android/i.test( navigator.userAgent.toLowerCase() ) ) { ret = 2; }
  if( /iphone|ipad|ipod/i.test( navigator.userAgent.toLowerCase() ) ) { ret = 1; }
  return ret;
}

( function() {
  var DESKTOP_PAGESIZE = 19;
  var MOBILE_PAGESIZE = 6;
  var MOBILE_HS_PAGESIZE = 12;
  var totalResults = 0;
  var page = 0;
  var pageSize = DESKTOP_PAGESIZE;
  var CC = false;

  var currentKWAdder = '';

  var currentPlatforms = [1, 2];

  var globalSrcShow = true;

  var curCategory = 'all';
  var curPrice = 'all';
  var advApps = 1;
  var iDev = [];
  var stores = [];

  var cachedResults = [];
  var emptyResults = false;
  var initSearch = true;

  var hideImgs = false;

  var stateTTL = 60*100;

  var loading = false;

  var appTemplate =  '<div class="the-app {{sp-class}}">' +
                      '<div class="app-data-row {{sp-class}}">' +
                          '<div class="app-icon-holder">' +
                            '<a href="{{applink}}" target="_blank">' +
                              '<img onerror="hideErrorIcon(event)" src="{{icon}}" class="app-icon" width="50" height="50">' +
                            '</a>' +
                          '</div>' +
                          '<div class="app-data-text" style="">' +
                            '<div class="app-title"><a href="{{applink}}" target="_blank">{{title}}</a></div>' +
                            '<div class="app-data">' +
                              '<a onclick="install(\'{{applink}}\')" class="app-price {{free}}"><span>{{price}}</span></a>' +
                            '</div> ' +
                          '</div>' +
                          '<div class="sp-box" style="{{sponsored-class}}">Sponsored</div>' +
                        '<div class="clr"></div>' +
                        '</div> ' +
                        '{{screenshot}}' +
                        '<div class="app-description">' +
                          '<div class="app-rating">' +
                            '<div class="rating">' +
                              '{{rating}}' +
                            '</div>' +
                          '</div>' +
                          '{{description}}' +
                        '</div>' +
                    '</div>';

  var screenshotTemplate = '<div class="app-screenshot{{show_src_global}} {{sp-class}}">' +
                                '<img onerror="hideErrorImage(event)" src="{{screenshot}}" width="260">' +
                            '</div>';

  var noAppTemplate = '<div id="no-apps">' +
                      '<div class="no-apps-header">' +
                        '<img class="no-app-logo" src="{{noresico}}" alt="red logo">' +
                        '<h3  class="no-app-title">Your search did not match any apps !</h3>' +
                        '<div class="clr"></div>' +
                      '</div>' +
                      '<div class="no-apps-sugg">' +
                        '<p class="sugg-header">Suggestions:</p>' +
                        '<ol class="sugg-list">' +
                          '<li>Try different keywords.</li>' +
                          '<li>Try more general keywords.</li>' +
                          '<li>Try fewer keywords.</li>' +
                          '<li>Check if all words are spelled correctly.</li>' +
                          '<li>Try changing the filters.</li>' +
                        '</ol></div></div>';

  var storesTemplate = '<div class="tap-inner-block stores-block">' +
                          '<h3>From App Store(s)</h3>' +
                          '<div class="tap-inner-btns clr" id="stores-template">' +
                            '<label for="check-itunes">iTunes' + '<input type="radio" id="check-itunes" name="checkStores" value="1">' + '</label>' +
                            '<label for="check-google">Google Play' + '<input type="radio" id="check-google" name="checkStores" value="2">' + '</label>' +
                            '<label for="check-amazon">Amazon' + '<input type="radio" id="check-amazon" name="checkStores" value="3">' + '</label>' +
                            '<label for="check-wandoujia">Wandoujia' + '<input type="radio" id="check-wandoujia" name="checkStores" value="5">' + '</label>' +
                            '<label for="check-nook">Nook' + '<input type="radio" id="check-nook" name="checkStores" value="4">' + '</div>' +
                          '</div></div>';

  var androidTemplate = '<div class="tap-inner-block android-block">' +
                          '<h3>From App Store(s)</h3>' +
                          '<div class="tap-inner-btns clr" id="androidTemplate">' +
                            '<label for="check-google" class="active">Google Play' + '<input type="radio" id="check-google" name="checkStores" value="2">' + '</label>' +
                            '<label for="check-amazon">Amazon' + '<input type="radio" id="check-amazon" name="checkStores" value="3">' + '</label>' +
                            '<label for="check-wandoujia">Wandoujia' + '<input type="radio" id="check-wandoujia" name="checkStores" value="5">' + '</label>' +
                            '<label for="check-nook">Nook' + '<input type="radio" id="check-nook" name="checkStores" value="4">' + '</div>' +
                          '</div></div>';

  var devicesTemplate = '<div class="tap-inner-block dev-template-block">' +
                          '<h3>For Device(s)</h3>' +
                          '<div class="tap-inner-btns clr" id="devices-template">' +
                            '<label for="check-phones">Phones' + '<input type="radio" id="check-phones" name="checkDevice" value="phone">' + '</label>' +
                            '<label for="check-tablets">Tablets' + '<input type="radio" id="check-tablets" name="checkDevice" value="tablet">' + '</div>' +
                        '</div></div>';

  var displayTemplate = '<div class="tap-inner-block dispTemplate-block">' +
                          '<h3>Display Style</h3>' +
                          '<div class="tap-inner-btns clr" id="displayTemplate">' +
                            '<label for="check-simple">Simple' + '<input type="radio" id="check-simple" name="checkDisplaySt" value="true">' + '</label>' +
                            '<label for="check-colorful">Colorful' + '<input type="radio" id="check-colorful" name="checkDisplaySt" value="false">' + '</div>' +
                        '</div></div>';
  var deviceType = androidOriOs();
  if (deviceType === 0) {
    $('.tap-menu-block').html(storesTemplate + devicesTemplate + displayTemplate);
    stores = [1];
  } else if (deviceType === 1) {
    $('.tap-menu-block').html(devicesTemplate + displayTemplate);
    stores = [1];
  } else if (deviceType === 2) {
    $('.tap-menu-block').html(androidTemplate + displayTemplate);
    stores = [2];
  }

  //Tap Menu Block show/hide
  $(document).on('click', function() {
    $('.tap-menu').removeClass('active');
    $('.tap-menu-block').fadeOut();
  });

  $('.tap-menu').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();

    if ( $(this).hasClass('active') ) {
      $(this).removeClass('active');
      $('.tap-menu-block').fadeOut();
    } else {
      $(this).addClass('active');
      $('.tap-menu-block').fadeIn();
    }
  });

  $('.tap-menu-block').on('click', function(e) {
    e.stopPropagation();
  });

  function highLightCurStore() {
    switch (parseInt(stores)) {
      case 1: $('#check-itunes').parent().addClass('active'); break;
      case 2: $('#check-google').parent().addClass('active'); break;
      case 3: $('#check-amazon').parent().addClass('active'); break;
      case 4: $('#check-nook').parent().addClass('active'); break;
      case 5: $('#check-wandoujia').parent().addClass('active'); break;
    }
  }

  function highLightCurDev() {
    switch(iDev.toString()) {
      case "phone": $('#check-phones').parent().addClass('active'); break;
      case "tablet": $('#check-tablets').parent().addClass('active'); break;
    }
  }

  function highLightCurDisplay() {
    switch(hideImgs) {
      case true: $('#check-simple').parent().addClass('active'); break;
      case false: $('#check-colorful').parent().addClass('active'); break;
    }
  }

  function removeDeviceTypeBlock() {
    if (deviceType !== 0) {
      return null;    
    }
    var devTpl = $('.dev-template-block');
    if ( stores.indexOf('1') !== -1 ) {
      devTpl.show();
    } else {
      devTpl.hide();
      iDev = [];
      devTpl.find('label').removeClass('active');
    }
  }

  //Switching of tap buttons
  $('input:radio').on('click', function() {
    $(this).closest('div').find('label').removeClass('active');
    $(this).parent().addClass('active');
  });

  $('input:radio[name=checkStores]').on('click', function() {
    stores = [$(this).val()];
    removeDeviceTypeBlock();
    highLightCurStore();
    doSearch(null);
  });

  $('input:radio[name=checkDevice]').on('click', function() {
    iDev = [$(this).val()];
    highLightCurDev();
    doSearch(null);
  });

  $('input:radio[name=checkDisplaySt]').on('click', function() {
    hideImgs = $(this).val() === 'true' ? true : false;
    highLightCurDisplay();
    doSearch(null);
  });

  function showLoader() {
    loading = true;
    $('.search-button-loader').show();
    if( document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ) {
      $('.go-top').hide();
      $('.go-top-cont').show();
    }
  }

  function hideLoader() {
    $('.search-button-loader').hide();
    $('.go-top-cont').hide();
    if( document.body.scrollTop > 0 || document.documentElement.scrollTop > 0 ) {
      $('.go-top').show();
    }
    loading = false;
  }

  function doSearch(query, platform, params, customCredentials, type) {
    if(typeof query === 'object' && query !== null) {
      currentKWAdder = query.metaKeywords || currentKWAdder;
      query = query.query;
    }
    $('#main-holder').css('min-height', (window.innerHeight - 226) + 'px');
    $('.search-text-icon').hide();
    showLoader();

    if(query === null) {
      query = $('#query-input').val();
    }
    else {
      $('#query-input').val( decodeURIComponent( query.trim() ) );
    }

    if( query.trim() !== '') {
      $('.clear-q').show();
    }
    
    resetGrid();
    
    var adWanted = 0;
    if( androidOriOs() != 0 ) {
      adWanted = advApps;
    }

    var queryToServer = {
      size: pageSize,
      adSize: adWanted
    };
    if(query.substring(0,7) === 'http://' || query.substring(0,8)  === 'https://') {
      queryToServer.url = query;
      $('#query-input').val('');
      $('.clear-q').hide();
    } else {
      queryToServer.query = query + ' ' + currentKWAdder;
    }
    if(platform && platform[0]) {
      queryToServer.platforms = platform;
      if( platform[0] == 2 ) {
        queryToServer.stores = [ 2 ];
      }
    }

    queryToServer.ssf = true;
    if( !!customCredentials ) {
      queryToServer.apiKey = customCredentials.apiKey;
      queryToServer.clientId = customCredentials.clientId;
      queryToServer.adSize = customCredentials.adSize;
      CC = customCredentials;
    }

    if( curPrice != 'all') {
      queryToServer.price = curPrice;
    }
     
    if( curCategory != 'all') {
      if( curCategory == 'games' ) {
        queryToServer.categories = [ 6 ];
      } else {
        queryToServer.categories = [ -6 ];
      }
    }

    if( params && params.idev != undefined ) {
      queryToServer.deviceType = params.idev;
    } else {
      if( iDev ) {
        queryToServer.deviceType = iDev;
      }
    }

    if( params && params.stores != undefined ) {
      queryToServer.stores = params.stores;
    } else {
      if( stores.length > 0 ) {
        queryToServer.stores = stores;
      }
    }

    if(type === 'dynamic') {
      queryToServer.url = query;
    } else if(type === 'static') {
      queryToServer.url = query;
    } else if(type === 'keywords') {
      queryToServer.metaKeywords = query;
    } else if (type === 'kwlist') {
      queryToServer.metaKeywords = query;
    }
    if(type){
      delete queryToServer.query;
    }
    
    currentQuery = queryToServer;
    airomo.search(queryToServer, function(err, data) {
      if(!err) {
        page = 1;
        totalResults = data.total;

        $('#main-holder').css('min-height', (window.innerHeight - 226 - 82) + 'px');
        if( totalResults > pageSize ) {
          scrollEnabled = false;
        }
        if( data.results && data.results.length > 0 ) {
          cachedResults = data.results;
          renderResults( data.results );
        } else {
          emptyResults = true;
          cachedResults = [];
          renderNoResults();
        }
        if( initSearch ) {
          replaceState( query.trim(), cachedResults );
          initSearch = false;
        } else {
          saveState( query.trim(), cachedResults );
        }
        $('.search-text-icon').show();
        hideLoader();
      }
      else {
        $('.search-text-icon').show();
        hideLoader();
        console.log('Something went wrong...', err);
      }
    });
  }

  function nextPage() {
    $('.search-text-icon').hide();
    showLoader();
    var nextPageQuery = currentQuery;
    nextPageQuery.size = pageSize;
    nextPageQuery.offset = pageSize*page;
    nextPageQuery.adOffset = 1*page;
    if(CC) {
      nextPageQuery.adOffset = nextPageQuery.adSize*page;
      nextPageQuery.size = pageSize - nextPageQuery.adSize;
    }
    if( nextPageQuery.offset < totalResults ) {
      airomo.search(nextPageQuery, function(err, data) {
        if(!err) {
          page++;
          renderResults( data.results );
          if( totalResults < pageSize*page ) {
            scrollEnabled = false;
          }
          $('.search-text-icon').show();
          hideLoader();
        }
        else {
          scrollEnabled = true;
          console.log('Something went wrong...', err);
        }
      });
    } else {
      $('.search-text-icon').show();
      hideLoader();
    }
  }

  function highlightCurPrice() {
    $('.val-selector .m-item').find('a').removeClass('cur');
    $('.val-selector .val-' + curPrice ).find('a').addClass('cur');
  }

  function highlightCurCat() {
    $('.cat-selector .m-item').find('a').removeClass('cur');
    $('.cat-selector .cat-' + curCategory ).find('a').addClass('cur');
  }

  function shuffle( array ) {
    var currentIndex = array.length, 
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  function renderNoResults() {
    $('#main-holder').html( noAppTemplate.replace('{{noresico}}', 'img/noreslogo.png') );
    scrollEnabled = false;
  }

  function renderResults(results) {
    var plainHTMLArr = [],
        arrToShuffle = [],
        resArr = results,
        toShuffle;

    if( androidOriOs() != 0 && results && results.length && results.length > advApps && results[0].sponsored === true ) {
      toShuffle = 0;
      if( advApps <= 3) {
        toShuffle = advApps * 5;
      } else if( advApps <= 5 ) {
        toShuffle = advApps * 4;
      } else {
        toShuffle = advApps * 3;
      }
      arrToShuffle = results.slice(0, toShuffle);
      
      var tempArr = shuffle( arrToShuffle );

      while( tempArr[0].sponsored === true ) {
        tempArr = shuffle( tempArr );
      }

      resArr = tempArr.concat( results.slice( arrToShuffle.length ) )
    }

    $.each( resArr, function(i, e) {
      e.stars = '';
      var priceAlias = 'Free';
      var free = 'for-free';
      if(e.price !== '0.00') {
        priceAlias = '$' + e.price;
        free = '';
      }
      if(!e.social) {
        e.social = {};
      }
      e.title = /^[\000-\177]*$/.test(e.title) ? e.title : e.title.substring(0,13);
      var curApp = appTemplate
        .replace(new RegExp('{{applink}}', 'g'), e.trackingUrl)
        .replace('{{screenshot}}', hideImgs ? '' : screenshotTemplate)
        .replace('{{title}}', e.title.length > 16 ? e.title.substring(0,16) + '...' : e.title)
        .replace('{{icon}}', e.icon)
        .replace('{{rating}}', makeRating( e.rating ) )
        .replace('{{price}}', priceAlias)
        .replace('{{free}}', free)
        .replace('{{description}}', e.description.substring(0, 90) + '...')
        .replace('{{show_src_global}}', globalSrcShow ? '' : ' totally-hidden-src')
        .replace('{{screenshot}}', e.screenshots[0] || 'http://dummy')
        .replace('{{sponsored-class}}', e.sponsored === true ? 'display:block;' : '')
        .replace('{{sp-class}}', e.sponsored === true ? 'sp-cl' : '')
        .replace('{{non-sponsored-class}}', e.sponsored === true ? 'display:none;' : '');

        plainHTMLArr.push( curApp );
    });
    
    if( plainHTMLArr.length != 0) {
      $('#main-holder').gridalicious('append', plainHTMLArr );
    }

    scrollEnabled = true;
  }

  function resetGrid() {
    $('#main-holder').remove();
    $('<div id="main-holder"></div>').insertAfter('header');
    $("#main-holder").gridalicious({
        width: 300,
        gutter: 10,
        selector: '.the-app',
        animate: true
    });
  }

  function saveState(q, res) {
    History.pushState( {
      query: q, 
      platform: currentPlatforms,
      category: curCategory,
      price: curPrice,
      dt: iDev,
      stores: stores,
      stateTime: Date.now(),
      currentQuery: currentQuery,
      totalResults: totalResults,
      emptyResults: emptyResults,
      cachedResults: res,
      hideImgs: hideImgs
    },'Contextual app discovery and game search from Airomo',
     '?q=' +  q + 
    (currentPlatforms.length === 1 ? '&platform=' + currentPlatforms[0] : '') +
    (stores.length > 0 ? '&stores=' + stores : '') +
    (iDev.length > 0   ? '&dt=' + iDev     : '') +
    (hideImgs ? '&hs=' + hideImgs : '') );
  }

  function replaceState(q, res) {
    History.replaceState( {
      query: q, 
      platform: currentPlatforms,
      category: curCategory,
      price: curPrice,
      dt: iDev,
      stores: stores,
      stateTime: Date.now(),
      currentQuery: currentQuery,
      totalResults: totalResults,
      emptyResults: emptyResults,
      cachedResults: res,
      hideImgs: hideImgs
    },'Contextual app discovery and game search from Airomo', 
    '?q=' +  q + 
    (currentPlatforms.length === 1 ? '&platform=' + currentPlatforms[0] : '') +
    (stores.length > 0 ? '&stores=' + stores : '') +
    (iDev.length > 0   ? '&dt=' + iDev      : '') +
    (hideImgs ? '&hs=' + hideImgs : '') );
  }

  History.Adapter.bind( window,'statechange',function() {
    var State = History.getState();
    if( State !== undefined ) {

      totalResults = State.data.totalResults;
      page         = 1;

      hideImgs = State.data.hideImgs || false;

      pageSize     = ( androidOriOs() != 0 ) ? mobilePageSize( hideImgs ) : DESKTOP_PAGESIZE;
      advApps      = 1;

      curCategory = State.data.category || 'all';
      highlightCurCat();

      curPrice = State.data.price || 'all';
      highlightCurPrice();

      currentPlatforms = State.data.platform || [1,2];
      stores           = State.data.stores || [];
      highLightCurStore();
      highLightCurDev();
      highLightCurDisplay();
      currentQuery     = State.data.currentQuery;
      cachedResults    = State.data.cachedResults || [];
      emptyResults     = State.data.emptyResults || false;

      if( State.data.query !== undefined && State.data.cachedResults && State.data.cachedResults.length === 0 && !emptyResults ) {
        doSearch( State.data.query, State.data.platform );
      } else if( State.data.cachedResults && State.data.cachedResults.length > 0 ) {
        $('#query-input').val( decodeURIComponent( State.data.query ) );
        resetGrid();
        renderResults( State.data.cachedResults );
      } else if( State.data.emptyResults ) {
        $('#query-input').val( decodeURIComponent( State.data.query ) );
        renderNoResults();
      }
    }
  });

  /* **********
   * 'tablet' - iPad
   * 'phone' - iPhones
   * 0 - other
   * **********/
  function ipadOriPhones() {
    var ret = [];
    if( /ipad/i.test( navigator.userAgent.toLowerCase() ) ) { ret.push('tablet'); }
    if( /iphone|ipod/i.test( navigator.userAgent.toLowerCase() ) ) { ret.push('phone'); }
    return ret;
  }

  function mobilePageSize( hideImgs ) {
    return hideImgs ? MOBILE_HS_PAGESIZE : MOBILE_PAGESIZE;
  }

  function makeRating( rate ) {
    var solidStar = '<span class="solid-star">★</span>';
    var emptyStar = '<span class="empty-star">☆</span>';
    return Array( Math.round( rate ) + 1 ).join( solidStar ) + Array( 6 - Math.round( rate ) ).join( emptyStar )
  }

  var scrollDistance = 0;
  var scrollEnabled = true;
  var checkWhenEnabled = false;

  var scrollHandler = function() {
    if( document.body.scrollTop <= 0 && document.documentElement.scrollTop <= 0 ) {
      $('.go-top').hide();
    } else {
      if( !loading ) {
        $('.go-top').show();
      }
    }
    var elementBottom, remaining, shouldScroll, windowBottom;
    var elem = $('#main-holder');
    windowBottom = $(window).height() + $(window).scrollTop();
    elementBottom = elem.offset().top + elem.height();
    remaining = elementBottom - windowBottom;
    shouldScroll = remaining <= $(window).height() * scrollDistance;
    if (shouldScroll && scrollEnabled) {
      scrollEnabled = false;
      nextPage();
    } else if (shouldScroll) {
      return checkWhenEnabled = true;
    }
  };

  $(window).on('scroll', scrollHandler);

  $('#query-input').on('keyup', function( e ) {
    if( e.keyCode == 13 ){
      doSearch(null);
    }
    if(!$('#query-input').val()) {
      $('.clear-q').hide();
    } else {
      $('.clear-q').show();
    }
  });

  $('.go-btn').click( function() {
    doSearch(null);
  });

  $('.close-that-popup').click( function() {
    closeMsg = {
      message: 'close-popup',
      currentQuery: currentQuery
    }
    window.parent.postMessage( JSON.stringify( closeMsg ), '*' );
  });

  $('.clear-q').click( function() {
    $('#query-input').val('');
    $('.clear-q').hide();
    $('#query-input').focus();
  });

  $('.go-top').click( function() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    return false; 
  });

  $('.cat-apps').click( function(e) {
    if( curCategory == 'all' || curCategory == 'games') {
      curCategory = 'apps';
      highlightCurCat();
      doSearch(null);
    } 
  });

  $('.cat-games').click( function(e) {
    if( curCategory == 'all' || curCategory == 'apps') {
      curCategory = 'games';
      highlightCurCat();
      doSearch(null);
    }
  });

  $('.cat-all').click( function(e) {
    if( curCategory == 'games' || curCategory == 'apps') {
      curCategory = 'all';
      highlightCurCat();
      doSearch(null);
    } 
  });

  $( '.cat-' + curCategory ).find('a').addClass('cur');

  $('.val-free').click(function(e) {
    if( curPrice == 'all' || curPrice == 'paid') {
      curPrice = 'free';
      highlightCurPrice();
      doSearch(null);
    } 
  });

  $('.val-paid').click(function(e) {
    if( curPrice == 'all' || curPrice == 'free') {
      curPrice = 'paid';
      highlightCurPrice();
      doSearch(null);
    }
  });

  $('.val-all').click(function(e) {
    if( curPrice == 'free' || curPrice == 'paid') {
      curPrice = 'all';
      highlightCurPrice();
      doSearch(null);
    } 
  });

  $( '.val-' + curPrice ).find('a').addClass('cur');


  window.parent.postMessage('results-ready', '*');
  if (window.self !== window.top) {
    airomo.setEnv({clientId:a2ClientId, apiKey:a2ApiKey});
    $('.close-that-popup').show();
  } else {
    airomo.setEnv({clientId:CRXTA2ClientId, apiKey:CRXTA2ApiKey});
    var options = { q:'', platform: androidOriOs() };

    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function($, key, value) {
      options[key] = value;
    });

    if( options.hs === 'true' ) {
      hideImgs = true;
    }

    if( androidOriOs() != 0 ) {
      pageSize = mobilePageSize( hideImgs );
    }

    if( options.platform !== 0 ) {
      currentPlatforms = [options.platform];
    }

    var otherParams = {};
    if( options.stores && options.stores.length > 0) {
      otherParams.stores = options.stores.split(',');
      stores = otherParams.stores;
    }

    if( options.dt && options.dt.length > 0) {
      otherParams.idev = options.dt.split(',');
      iDev = otherParams.idev;
    } else {
      var tDev = ipadOriPhones();
      if( tDev.length > 0 ) {
        otherParams.idev = tDev;
        iDev = otherParams.idev;
      }
    }

    doSearch( decodeURIComponent(options.q), [options.platform], otherParams );
  }
    
  var $handleResponse = function(event) {
    try {
      var recivedData = JSON.parse(event.data);
      if(recivedData.message === 'initiate-search') {
        doSearch(recivedData, recivedData.platform, {}, recivedData.customCredentials);
      } else if(recivedData.message === 'advanced-search') {
        doSearch(recivedData, recivedData.platform, {}, recivedData.customCredentials, recivedData.queryType);
      }
    } catch(e) {}
  };

  if(window.addEventListener) {
    window.addEventListener('message', $handleResponse, false);
  }
  else if(window.attachEvent) {
    window.attachEvent('message', $handleResponse);
  }
})();

function getScript(url, success) {
  var script = document.createElement('script');
  script.src = url;
    
  var head = document.getElementsByTagName('head')[0],
  done = false;
    
  script.onload = script.onreadystatechange = function() {
    if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
      done = true;

      success();
          
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    };  
  };
  head.appendChild(script);
};



$(document).ready(
  function() {  
    if( androidOriOs() == 1 ) {
      getScript('js/jquery.nicescroll.min.js', function() {
        $("html").niceScroll();
      });
    }
  }
);