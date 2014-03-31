function StickySwipe(element)
{
  // Set self = this
  var self = this;
  element = $(element);

  // Variables to hold the container object and
  // individual panes ("Cards")
  var container = element;
  var panes = $(".content-section", element);
  var screenHeight = 0;
  var pane_count = panes.length;
  var current_pane = 0;

  // ---------------------------------------------- //
  // init ----------------------------------------- //
  // This method simply initializes the StickySwipe //
  // function by calling setLayerDimensions on load //
  // and on orientation change                      //
  // ---------------------------------------------- //
  this.init = function() {
    setLayerDimensions();
    $(window).on("load", function() {
      console.log("Window loaded!");
      setLayerDimensions();
    })
  };

  // --------------------------------------------------- //
  // setLayerDimsensions ------------------------------- //
  // Loop through each of the "Cards" and dynamically    //
  // set the data-attributes so Skrollr can do its thing //
  // --------------------------------------------------- //
  function setLayerDimensions() {

    // Loop through each pane ("Card") in order to set its
    // data-attributes. Skrollr uses a custom data-attribute
    // called data-[height in pixels] in order to perform CSS3
    // keyframe animations. So we need to go through and set all
    // of those data-attributes dynamically
    //
    panes.each(function(index) {

      // Calculate the combined height of the previous panes
      // This number will be set as the first data-attribute
      // with the value "top:0px;" to force the parallax effect
      var prevHeight = 0;
      for (var i = 0; i < index; i++) {
        prevHeight += $(panes[i]).height();
      }

      // Calculate the final height, or prevHeight + current div height
      // This number will be set as the second data-attribute
      // with the value "top:-(current pane height)px
      var currHeight = $(this).height();
      var finalHeight = prevHeight + currHeight;

      console.log(currHeight, finalHeight);

      // Set the data attributes
      $(this).attr("data-"+prevHeight,  "top:0px;display:block;");
      $(this).attr("data-"+finalHeight, "top:-"+currHeight+"px;display:none;");

      // Refresh Skrollr instance
      s.refresh();
    });
  };

  // ----------------------------------------------------------------- //
  // showPane -------------------------------------------------------- //
  // This function handles a few things, including:                    //
  //                                                                   //
  // 1) Update the current_pane variable                               //
  // 2) Update the page counter                                        //
  // 3) Calculate the height of previous panes                         //
  // 4) Animate to top of pane via Skrollr's custom animateTo function //
  // ----------------------------------------------------------------- //
  this.showPane = function(index, direction) {

    // Don't allow index to be greater than pane_count or zero
    index = Math.max(0, Math.min(index, pane_count-1));

    // Set current_pane variable to the current index
    current_pane = index;

    // Handle the page counter
    handlePageCounter();

    // Calculate the height of the previous panes
    var currPane = panes[current_pane];
    var currentPaneHeight = $(currPane).height();
    var anchor = 0;
    for (var i = 0; i < current_pane; i++) {
      anchor += $(panes[i]).height();
    }

    if (direction == -1 && currentPaneHeight > 568) {
      console.log(currentPaneHeight % 568);
      anchor += (currentPaneHeight % 568);
    }

    // Animate to the top of the Card at anchor point
    s.animateTo(anchor, {
      duration: 200,
      easing: 'sqrt'
    });
  };

  // ------------------------------------ //
  // handlePageCounter ------------------ //
  // Show/Hide the page counter           //
  // or                                   //
  // Increment/Decrement the page counter //
  // ------------------------------------ //
  function handlePageCounter() {
    if (current_pane == 0) {
      $("#page-counter").hide();
    } else if (current_pane == 1) {
      $("#page-counter").show();
    }

    if (current_pane == pane_count-1) {
      $("#page-counter").text("Recommended for You");
    } else {
      $("#page-counter").text("Page "+current_pane+" of "+(pane_count-1));
    }
  }

  // --------------------------------------------------------- //
  // next(), curr(), and prev() are shortcut functions for      //
  // snapping to the next card, current card, or previous card //
  // --------------------------------------------------------- //
  this.next = function() { return this.showPane(current_pane+1, 1); };
  this.curr = function() { return this.showPane(current_pane, 0); };
  this.bott = function() { return this.showPane(current_pane, -1); };
  this.prev = function() { return this.showPane(current_pane-1, -1); };

  // ------------------------------------------------------ //
  // handleHammer(event) ---------------------------------- //
  // This function handles the touch gestures using the     //
  // included Hammer.js library. Current we are only using  //
  // the "release" gesture, but Hammer also handles swipe,  //
  // drag, and other common mobile phone gestures           //
  // ------------------------------------------------------ //
  function handleHammer(e) {

    // Calculate the height of the previous panes
    var prevHeight = 0;
    for (var i = 0; i < current_pane; i++) {
      prevHeight += $(panes[i]).height();
    }

    // currentPaneHeight  = height of current pane
    // distanceSkrolld    = total distance from top
    // relativeDistance   = total distance minus the height of previous panes
    // pctOfCardSkrolld   = % of the way user has scrolled through current pane
    var currentPaneHeight = $(panes[current_pane]).height();
    var distanceSkrolld   = s.getScrollTop();
    var relativeDistance  = (distanceSkrolld - prevHeight);
    var pctOfCardVisible  = (currentPaneHeight-relativeDistance)/568;
    var pctOfCardSkrolld  = relativeDistance/currentPaneHeight;

    switch(e.type)
    {
      case "drag":
        if (e.gesture.direction == 'up') {
          console.log("Dragging up");
          s.scale = 1000;
          s.refresh();
        }
        break;

      case "tap":
        e.gesture.stopDetect();
        break;

      // Handle Release
      case "release":
        if (e.gesture.direction == 'up') {
          // Navigating to next card
          if (pctOfCardVisible < 0.6) {
            console.log("next");
            self.next();
          } else if (pctOfCardVisible >= 0.6 && pctOfCardVisible < 1) {
            console.log("bott");
            self.bott();
          } else if (pctOfCardSkrolld < 0.1) {
            console.log("curr");
            self.curr();
          }
        } else {
          // Navigating to previous card
          if (pctOfCardSkrolld < -0.2) {
            self.prev();
          } else if (pctOfCardSkrolld >= -0.2 && pctOfCardSkrolld < 0.1) {
            self.curr();
          }
        }
        break;
    }
  }

  // Initialize Hammer function with the container and respond to "release"
  new Hammer(document.body, { drag_lock_to_axis: true }).on("drag tap release", handleHammer);
}
