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
        var startFade   = prevHeight + currHeight - (568/2);

        // Set the data attributes
        $(this).attr("data-"+prevHeight,  "top:0px;display:block;");

        if (index < pane_count-1) {
          $(this).attr("data-"+finalHeight, "top:-"+currHeight+"px;display:none;");
          
          // Add a special div to apply fade-out effects to
          $(this).append("<div class='card-fader'></div>");
          var fader = $(this).find('.card-fader');
          fader.attr("data-"+prevHeight,  "opacity:0;");
          fader.attr("data-"+startFade,   "opacity:0;");
          fader.attr("data-"+finalHeight, "opacity:1;");

          // Add an invisible footer to each card to account for padding issues
          $(this).append("<div class='fake-footer'></div>");

        } else {
        }

        // Add appropriate page numbering to card
        $(this).find(".paging").text("Page " + index + " of " + (pane_count-2));

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

    // Calculate the height of the previous panes
    var currPane = panes[current_pane];
    var currentPaneHeight = $(currPane).height();
    var anchor = 0;
    for (var i = 0; i < current_pane; i++) {
      anchor += $(panes[i]).height();
    }

    if (direction == -1 && currentPaneHeight > 460) {
      quotient = (Math.floor(currentPaneHeight/460)-1);
      remainder = currentPaneHeight%460;
      anchor += (quotient*460 + remainder);
    }

    // Animate to the top of the Card at anchor point
    s.animateTo(anchor, {
      duration: 200,
      easing: 'sqrt'
    });
  };

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
    var pctOfCardVisible  = (currentPaneHeight-relativeDistance)/460;
    var pctOfCardSkrolld  = relativeDistance/currentPaneHeight;

    switch(e.type)
    {
    case "drag":
      break;

    case "tap":
      e.gesture.stopDetect();
      break;

    // Handle Release
    case "release":

      mixpanel.track("Finger Release", {
        "velocityY": e.gesture.velocityY,
        "deltaY": e.gesture.deltaY,
        "time": e.gesture.deltaTime
      });

      if (e.gesture.direction == 'up') {
        // Navigating to next card
        if (e.gesture.velocityY > 1.5 || pctOfCardVisible < 0.4) {
          self.next();
        }
      } else {
        // Navigating to previous card
        if (e.gesture.velocityY > 1) {
          self.prev();
        } else {
          if (pctOfCardSkrolld < -0.2) {
            self.prev();
          } else if (pctOfCardSkrolld >= -0.2 && pctOfCardSkrolld < 0.1) {
            self.curr();
          }
        }
      }
      break;
    }
  }

  // Initialize Hammer function with the container and respond to "release"
  new Hammer(document.body, { drag_lock_to_axis: true }).on("drag tap release", handleHammer);
}
