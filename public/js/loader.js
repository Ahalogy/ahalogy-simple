// Stop the DOM
// window.stop();

// Global Variables
var ht = $(window).height();

$("head").append("<link rel='stylesheet' href='styles/app.css'/>").
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

  console.log("Replacing body with loader");
  // Empty the body and replace with Loading screen
  $("body").empty().append("<div class='loader' style='position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:#000;'><h1>Loading...</h1></div>");
  $(".loader h1").css("margin-top", (ht/2)+"px");

// Attempt to fetch carded content
// data-mobilify=1, data-clientId=[Client Identifier], data-articleId=[Article Identifier]
// (Client ID)-(Article ID)-iphone.html
var request = $.ajax( "carded-content-1.html" )
  .done(function( html ) {

    $("body").empty().append(html);

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
