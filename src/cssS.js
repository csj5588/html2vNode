/**
 * cssStrategy: style adaptation policy set
 * 
 * @author csj5588
 * @param vNode
 * @param vNode.children
 */

import _ from './utils';

var CHILDREN = 'children';

var FLEX = 'flex'
var SPACE_BETWEEN = 'space-between'
var ABSOLUTE = 'absolute'

var cssS = function(_node, vNode) {
  // check children Length
  var getChildrenLength = _.compose(
    _.length,
    _.safeProps(CHILDREN)
  )

  var childLength = getChildrenLength(vNode)

  // check layouts type
  var handleLayoutType = function(node) {

    var display = _.css('display', node); // normal
    var justifyContent = _.css('justify-content', node);

    var position = _.css('position', node); // static

    var isFlex = display === FLEX;
    var isSpaceBetween = justifyContent === SPACE_BETWEEN;
    var isAbs = position === ABSOLUTE

    if (isFlex) {
      if (!isSpaceBetween) {
        transFlexNoBetween(node);
      }
    }
    if (isAbs) return ABSOLUTE;
  }

  var transFlexNoBetween = function(node) {
    vNode.setPropsStyle({ 'flex-direction': 'column' })
  }

  handleLayoutType(_node);
}

export default cssS;
