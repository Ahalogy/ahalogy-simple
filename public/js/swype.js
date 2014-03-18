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
          prevHeight += $(panes[i]).height();
        }

        // Calculate the final height which is previous height
        // plus current div height, where we would expect the
        // div to "go away" and have top = -(div height)
        var currHeight = $(this).height();
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
        var ht = $(panes[i]).height();
        elapsedHeight += ht;
      }

      s.animateTo(elapsedHeight, {
        duration: 200,
        easing: 'sqrt'
      });
    }

    this.next = function() { return this.showPane(current_pane+1, true); };
    this.prev = function() { return this.showPane(current_pane-1, true); };

    function handleHammer(e) {

      var prevHeight = 0;
      for (var i = 0; i < current_pane; i++) {
        prevHeight += $(panes[i]).height();
      }

      var g = e.gesture;
      var d = s.getScrollTop();
      var r = (d - prevHeight);

      g.preventDefault();

      var divHeight = $(panes[current_pane]).height();
      var modDivHeight = (divHeight % pane_height);

      if (modDivHeight == 0) {
        // The div is shorter than the viewport
        if (g.direction == 'up') {
          self.next();
        } else {
          self.prev();
        }
      } else {
        // The div is larger than the viewport
        if (r/divHeight < .5) {
          if (g.direction == 'up') {
            self.nearbySection(prevHeight + modDivHeight);
          } else {
            self.prev();
          }
        } else {
          if (g.direction == 'up') {
            self.next();
          } else {
            self.prev();
          }
        }
      }
    }

    new Hammer(container[0], { drag_lock_to_axis: true }).on("release", handleHammer);
  }

  var stickySwipe = new StickySwipe("#stickySwipe");
  stickySwipe.init();

});
