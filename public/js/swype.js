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
      setLayerDimensions();
      $(window).on("load resize orientationchange", function() {
        setLayerDimensions();
      })
    };

    /**
     * set the layer dimensions and scale the container
     */
    function setLayerDimensions() {
      pane_height = element.height();
      console.log("PANE height", pane_height);
      container.height(pane_height);
    };

    this.showPane = function(index, animate) {
      index = Math.max(0, Math.min(index, pane_count-1));
      current_pane = index;

      var offset = -((100/pane_count)*current_pane);
      setSkrollrOffset(offset, animate);
    };

    function setSkrollrOffset(percent, animate) {

      var currPane = panes[current_pane];
      var currPaneHeight = $(currPane).height();
      var currTop = s.getScrollTop();
      console.log("PANE HEIGHT, PANE TOP", currPaneHeight, currTop);

      var elapsedHeight = 0;
      for (var i = 0; i < current_pane; i++) {
        var ht = $(panes[i]).height();
        elapsedHeight += ht;
      }

      s.animateTo(elapsedHeight, {
        duration: 400,
        easing: 'sqrt'
      });
    }

    this.next = function() { return this.showPane(current_pane+1, true); };
    this.prev = function() { return this.showPane(current_pane-1, true); };

    function handleHammer(e) {

      var g = e.gesture;
      var d = s.getScrollTop();

      g.preventDefault();

      switch (e.type) {
        case 'dragdown':
        case 'dragup':
          var layer_offset = -(100/pane_count)*current_pane;
          console.log("Layer offset / current pane", layer_offset, current_pane);
          var drag_offset = ((100/pane_height)*g.deltaY) / pane_count;

          /*if ((current_pane == 0 && g.direction == "down") ||
            (current_pane == pane_count-1 && g.direction == "up")) {
            drag_offset *= .4;
          }

          setSkrollrOffset(drag_offset + layer_offset);*/
          break;

        case 'swipeup':
          console.log('swipe up');
          self.next();
          g.stopDetect();
          break;

        case 'swipedown':
          console.log('swipe down');
          self.prev();
          g.stopDetect();
          break;

        case 'release':
          console.log('release');
          if (Math.abs(g.deltaY) > pane_height/3) {
            if (g.direction == 'up') {
              self.next();
            } else {
              self.prev();
            }
          } else {
            self.showPane(current_pane, true);
          }
          break;
      }
    }

    new Hammer(container[0], { drag_lock_to_axis: true }).on("release dragup dragdown slideup slidedown", handleHammer);
  }

  var stickySwipe = new StickySwipe("#stickySwipe");
  stickySwipe.init();

});
