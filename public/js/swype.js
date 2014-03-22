///////////////////////////////////
// Global variables and settings //
///////////////////////////////////

$(document).ready(function() {
  'use strict';

  function StickySwipe(element)
  {
    var self = this;
    element = $(element);

    var container = $(">div", element);
    var panes = $(">div>div", element);

    var pane_height = 0;
    var pane_count = panes.length;

    var current_pane = 0;

    /**
     * initial
     */
    this.init = function() {
      $(window).on("load orientationchange", function() {
        setLayerDimensions();
      })
    };

    /**
     * set the layer dimensions and scale the container
     */
    function setLayerDimensions() {
      panes.each(function(index) {

        // This is the first data- attribute, always set
        // to top: 0px; so that the div doesn't move before
        // it is scrolled to
        var prevHeight = 0;
        for (var i = 0; i < index; i++) {
          prevHeight += $(panes[i]).height()+80;
        }

        // Calculate the final height which is previous height
        // plus current div height, where we would expect the
        // div to "go away" and have top = -(div height)
        var currHeight = $(this).height()+80;
        var finalHeight = prevHeight + currHeight;

        // Set the data attributes
        $(this).attr("data-"+prevHeight,  "top:0px;display:block;");
        $(this).attr("data-"+finalHeight, "top:-"+currHeight+"px;display:none;");

        // Refresh Skrollr instance
        s.refresh();
      });

      pane_height = element.height();
      container.height(pane_height);
    };

    this.showPane = function(index, animate) {
      index = Math.max(0, Math.min(index, pane_count-1));
      current_pane = index;
      setSkrollrOffset();
    };

    this.nearbySection = function(anchor) {
      s.animateTo(anchor, {
        duration: 200,
        easing: 'sqrt'
      });
    }

    function setSkrollrOffset() {

      var currPane = panes[current_pane];
      var elapsedHeight = 0;
      for (var i = 0; i < current_pane; i++) {
        var ht = $(panes[i]).height()+80;
        elapsedHeight += ht;
      }

      s.animateTo(elapsedHeight, {
        duration: 200,
        easing: 'sqrt'
      });

      if (current_pane == 0) {
        $("#page-counter").fadeOut(300);
      } else if (current_pane == 1) {
        $("#page-counter").fadeIn(300);
      }

      $("#page-counter").text("Page "+current_pane+" of "+(pane_count-1));
    }

    this.next = function() { return this.showPane(current_pane+1, true); };
    this.prev = function() { return this.showPane(current_pane-1, true); };

    function handleHammer(e) {

      var prevHeight = 0;
      for (var i = 0; i < current_pane; i++) {
        prevHeight += $(panes[i]).height()+80;
        prevHeight = (i == 0) ? prevHeight : prevHeight+80;
      }

      var g = e.gesture;
      g.preventDefault();

      var divHeight = $(panes[current_pane]).height();
      divHeight = (current_pane == 0) ? divHeight : divHeight+80;

      var quotient  = (divHeight/pane_height>>0);
      var remainder = (divHeight % pane_height);
      var d = s.getScrollTop();
      var r = (d - prevHeight);
      var subQuo = (divHeight/r>>0);
      var subRem = (divHeight%r);
      var subPane = (r/pane_height>>0);

      if (g.direction == 'up') {
        // Scroll to next section or card
        //
        if (quotient == 0 || (quotient == 1 && remainder == 0)) {
          self.next();
        } else {
          if (quotient == subPane) {
            self.next();
          } else if (quotient-subPane > 1) {
            var nextSubPane = prevHeight + (subPane*pane_height) + pane_height - 80;
            self.nearbySection(nextSubPane);
          } else {
            var nextSubPane = prevHeight + (subPane*pane_height) + remainder;
            self.nearbySection(nextSubPane);
          }
        }
      } else {
        if (quotient == 0 || (quotient == 1) && remainder == 0) {
          self.prev();
        } else {
          if (r <= 0) {
            self.prev();
          } else {
            var prevSubPane = prevHeight + (subPane*pane_height);
            self.nearbySection(prevSubPane);
          }
        }
      }
    }

    new Hammer(container[0], { drag_lock_to_axis: true }).on("release", handleHammer);
  }

  var stickySwipe = new StickySwipe("#stickySwipe");
  stickySwipe.init();

});
