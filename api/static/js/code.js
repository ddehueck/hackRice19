var cy;
var tick_edges;

test = function(){
    console.log("test")
}

initialize = function(func_elements) {
    console.log(func_elements);
    console.log("in here");
    cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: cytoscape.stylesheet()
        .selector('node')
        .style({
          'content': 'data(id)'
        })
        .selector('.highlighted-node')
        .style({
          'content': 'data(id)',
          'background-color': '#61bffc',
        })
      .selector('edge')
          .style({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'width': 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
          })
        .selector('.highlighted')
          .style({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          })

          .selector('.highlighted-red')
              .style({
                'background-color': '#FF0000',
                'line-color': '#FF0000',
                'target-arrow-color': '#FF0000',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
          }),

      elements: func_elements,

      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a',
        padding: 5
      }
    });

tick_function = function(hist) {
    console.log("in tick");
    tick_edges = hist;
    console.log(tick_edges);
    nextHighlight();
}

//    var layout = cy.layout({
//    name: 'random'});
//
//    layout.run();

//  let options = {
//  name: 'concentric',
//
//  fit: true, // whether to fit the viewport to the graph
//  padding: 30, // the padding on fit
//  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
//  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
//  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
//  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
//  minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
//  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
//  height: undefined, // height of layout area (overrides container height)
//  width: undefined, // width of layout area (overrides container width)
//  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
//  concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
//  return node.degree();
//  },
//  levelWidth: function( nodes ){ // the letiation of concentric values in each level
//  return nodes.maxDegree() / 4;
//  },
//  animate: false, // whether to transition the node positions
//  animationDuration: 500, // duration of animation in ms if enabled
//  animationEasing: undefined, // easing of animation if enabled
//  animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
//  ready: undefined, // callback on layoutready
//  stop: undefined, // callback on layoutstop
//  transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
//   };

  let options = {
  name: 'breadthfirst',

  fit: true, // whether to fit the viewport to the graph
  directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
  padding: 30, // padding on fit
  circle: false, // put depths in concentric circles if true, put depths top down if false
  grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
  spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  roots: undefined, // the roots of the trees
  maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled,
  animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
  };
  var layout = cy.layout(options);
  layout.run();

}



// Highlight an edge (highlights target nodes and un-highlights source nodes)
function highlightEdge(id, color) {
  let edge = cy.edges().filter(x => x.data('id') == id)
  if (color == "red") {
    edge.addClass('highlighted-red');
  } else {
    edge.target().addClass("highlighted-node");
    edge.addClass('highlighted');
  }

}

function unHighlightEdge(id, color) {
  let edge = cy.edges().filter(x => x.data('id') == id)
  if (color == "red") {
    edge.removeClass('highlighted-red')
  } else {
    edge.removeClass('highlighted');
  }
  edge.target().removeClass("highlighted-node");
}

function highlightTick(i) {
  for (e = 0; e < tick_edges[i].length; e++) {
    highlightEdge(tick_edges[i][e][0], tick_edges[i][e][1]);
  }
}

function unHighlightTick(i) {
  for (e = 0; e < tick_edges[i].length; e++) {
    unHighlightEdge(tick_edges[i][e][0], tick_edges[i][e][1]);
  }
}

// Holds the current tick
var i = 0;

//var tick_edges = [
//  [
//    ["ae", "red"],
//    ["ab", "blue"],
//  ],
//  [
//    ["bc", "red"],
//    ["be", "blue"],
//    ["ec", "red"],
//  ],
//  [
//    ["cd", "red"],
//  ],
//  [
//    ["di", "red"],
//    ["dj", "red"],
//    ["dg", "red"],
//    ["dh", "red"],
//  ],
//]

// Performs highlights at each tick
var nextHighlight = function(){
  if (i < tick_edges.length) {
    console.log(tick_edges[i]);
    highlightTick(i);
    if (i > 0) {
      unHighlightTick(i - 1);
    }
    i++;
    // Kick off next highlight
    setTimeout(nextHighlight, 1000);
  } else {
    unHighlightTick(tick_edges.length - 1);
  }
};


// Kick off first highlight