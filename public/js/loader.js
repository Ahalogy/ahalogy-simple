$(document).ready(function() {

  var viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
  } else {
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
  }

  // Global Variables
  var ht = $(window).height();

  $("head").append("<link rel='stylesheet' href='styles/app.css'/>").
            append("<link rel='stylesheet' href='styles/animations.css'/>").
            append("<script src='js/skrollr.min.js'></script>").
            append("<script src='js/hammer.js'></script>").
            append("<script src='js/app.js'></script>");

  // Var to store whether or not to load carded content
  var displayCardedContent = (function()
  {

    // TODO:
    // 1) Detect if we're inside of the Pinterest app
    // 2) Detect if the referral is from Pinterest
    // 3) Don't load on presence of disableMobilify (KVP)
    var shouldDisplayCardedContent = true;
    return shouldDisplayCardedContent;
  })();

  if (displayCardedContent) {

    // Empty the body and replace with Loading screen
    $("body").empty().append("<div class='loader'><div class='loading'></div><div id='loading-text'>loading</div></div>");

  // Attempt to fetch carded content
  // data-mobilify=1, data-clientId=[Client Identifier], data-articleId=[Article Identifier]
  // (Client ID)-(Article ID)-iphone.html
  var request = $.ajax( "carded-content-1.html" )
    .done(function( html ) {

      $("body").empty().append(html).append("<div class='loader'><div class='loading'></div><div id='loading-text'>loading</div></div>");
      // Setup Skrollr deferred
      setTimeout(initSkrollr, 4000);
    })
    .fail(function() {
      // TODO:
      // Redirect to the same page
      // with a flag to not load carded contetn
    })
    .always(function() {
    });
  } else {
  }
});

function initSkrollr() {
  console.log("Init Skrollr");
  window.s = skrollr.init({
    mobileDeceleration: 0.9,
    edgeStrategy: 'set',
    easing: {
      WTF: Math.random,
      inverted: function(p) {
        return 1-p;
      }
    }
  });

  // Set and initialize the stickySwipe function
  var stickySwipe = new StickySwipe("#stickySwipe");
  stickySwipe.init();

  // Fade out the loading screen
  $(".loader").stop().fadeOut();
}
