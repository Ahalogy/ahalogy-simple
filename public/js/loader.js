$(document).ready(function() {

  // Set appropriate meta viewport tag
  setOrUpdateViewport();

  // Global Variables
  var ht = $(window).height();

  // Var to store whether or not to load carded content
  var displayCardedContent = (function()
  {
    var urlString = window.location.hash;
    var flag = "disableMobilify";
    var n = occurrences(urlString, flag);
    console.log(n);
    return (n == 0);
  })();

  // Display carded content
  if (displayCardedContent) displayCards();
});

function displayCards() {

  // Add the required stylesheet(s) and script(s)
  $("head").append("<link rel='stylesheet' href='styles/app.css'/>").
            append("<link rel='stylesheet' href='styles/animations.css'/>").
            append("<script src='js/skrollr.min.js'></script>").
            append("<script src='js/hammer.js'></script>").
            append("<script src='js/app.js'></script>");

  // Empty the body and replace with Loading screen
  $("body").empty().append("<div class='loader'><div class='loading'></div></div>");

  // Attempt to fetch carded content
  // data-mobilify=1, data-clientId=[Client Identifier], data-articleId=[Article Identifier]
  // (Client ID)-(Article ID)-iphone.html
  var cardedData = $("#mobilify-loader").data();
  var clientIdentifier = cardedData.client;
  var articleIdentifier = cardedData.article;
  var cardedURL = clientIdentifier + "-" + articleIdentifier + "-iphone.html";
  var request = $.ajax( cardedURL )
  .done(function( html ) {
    $("body").empty().append(html).append("<div class='loader'><div class='loading'></div></div>");

    $(".post-title").each(function() {
      if ($(this).length > 54) {
        $(this).text($(this).text().substring(0,54)+"...");
      }
    });

    // Setup Skrollr deferred
    setTimeout(initSkrollr, 2000);
  })
  .fail(function() {
    displayOriginalSite();
  })
  .always(function() {
  });
}

function displayOriginalSite() {
  window.location.hash = "#disableMobilify";
  window.location.reload(true);
}

function setOrUpdateViewport() {
  var viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
  } else {
    $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
  }
}

function initSkrollr() {
  console.log("Init Skrollr");
  window.s = skrollr.init({
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

function occurrences(string, substring) {
  var n = 0;
  var pos = 0;

  while (true) {
    pos = string.indexOf(substring, pos);
    if (pos != -1) {
      n++;
      pos += substring.length;
    } else {
      break;
    }
  }
  return (n);
}
