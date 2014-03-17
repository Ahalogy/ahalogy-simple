///////////////////////////////////
// Global variables and settings //
///////////////////////////////////

$(document).ready(function() {

  Hammer(window).on("swipeup swipedown dragup dragdown release", function(e) {
    console.log(e);
  });

});
