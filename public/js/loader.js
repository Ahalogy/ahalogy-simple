// Stop the DOM
window.stop();

// Global Variables
var ht = $(window).height();

// Empty the body and replace with Loading screen
$("body").empty().append("<div class='loader'><h1>Loading...</h1></div>");
$(".loader h1").css("margin-top", (ht/2)+"px");
