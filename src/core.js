import _ from './utils';
import cssS from './cssS'

// CONTANTS
var SCRIPT = 'script';
var CHILDREN = 'children';
var ATTRIBUTES = 'attributes';

/**
 * vNode Container
 * @param {} root 
 */
var vNode = function (tagName, props, children) {
	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
	this.text = '';
}

vNode.of = function () {
	var fns = Array.from(arguments)
	return new vNode(...fns)
}

vNode.prototype.render = function () {
	var context = this;
	var el = document.createElement(this.tagName);
	var props = this.props;

	// transform style
	if (_.check(false, props.style)) {
		var objToPair = _.compose(
			_.join(';'),
			_.map(_.join(':')),
			_.map(_.transformToInlineStyle),
		)
		var strStyle = objToPair(props.style);
		props.style = strStyle;
	}

	// setAttribute :: dom -> a -> b -> done
	var setAttribute = _.curry(function(x, val, key) {
		console.log(x)
		return x.setAttribute(key, val);
	})

	var setAttributeWithEl = setAttribute(el);

	_.forObject(context, setAttributeWithEl, props)

	if (this.text) {
		el.innerText = this.text;
	}

	var judgeNodeType = (node) => {
		var isVNode = node instanceof vNode;
		var childNode = isVNode ?
			node.render() :
			document.createTextNode(node)

		el.appendChild(childNode)
	}

	_.forEach(judgeNodeType, this.children);

	return el;
}

vNode.prototype.getTagName = function () {
	return this.tagName
}

vNode.prototype.setProps = function (obj) {
	_.assign(this.props, obj)
}

vNode.prototype.stanardStyle = function () {
	var context = this;
	var style = _.safeProps('style', this.props);

	// intercept
	if (_.isEmpty(style)) return

	var pairToObj = function (x) {
		var strToArray = _.compose(
			_.split(':'),
			_.trim,
		)
		var [key, val] = strToArray(x)
		return { [key]: val };
	}

	var opStyle = _.compose(
		_.for(context, pairToObj),
		_.split(';'),
		_.check('')
	)

	this.props.style = opStyle(style)
}

vNode.prototype.setPropsStyle = function (obj) {
	var context = this;
	var style = this.props.style;

	var toGoup = function (val, key) {
		return { [key]: val }
	}

	var styleGroup = _.forObject(context, toGoup, obj)
	var nextStyleArray = style.concat(styleGroup)

	// WTF ???
	// var getNextStyleArray = _.compose(
	// 	_.concat(style),
	// 	_.forObject(context, toGoup)
	// )

	this.props.style = nextStyleArray;
}

vNode.prototype.setText = function (val) {
	this.text = val;
}

/**
 * vTree Container
 * @param {} root 
 */
var vTree = function (root) {
	this._tree = this.loopDomToVNodeTree(root);
};

vTree.of = function (x) {
	return new vTree(x);
}

vTree.prototype.map = function (fn) {
	return vTree.of(fn(this._tree))
}

vTree.prototype.getVTree = function () {
	return this._tree;
}

// loopDomToVNodeTree :: Node -> Tree [vNode]
vTree.prototype.loopDomToVNodeTree = function (node) {
	var context = this;

	var tagName = _.toLowerCase(node.nodeName);

	// vNodeTagNameAsScript : vNode -> boolean
	var vNodeTagNameAsScript = function (x) {
		return x.getTagName() !== SCRIPT
	}

	// vNodeTagNameAsScript : Node -> [vNode]
	var transformNodeToVNodes = _.compose(
		_.filter(vNodeTagNameAsScript),
		_.for(context, this.loopDomToVNodeTree),
		_.check([]),
		_.safeProps(CHILDREN)
	)

	var vNodeChilds = transformNodeToVNodes(node)

	// identity :: HTML attributes -> interface { key: val }
	var identity = function (x) {
		return {
			[x.localName]: x.value,
		}
	}

	// vNodeTagNameAsScript : Node -> Attributes object
	var getAttributes = _.compose(
		_.arrayToObject,
		_.for(context, identity),
		_.check([]),
		_.safeProps(ATTRIBUTES),
	)
	var attributes = getAttributes(node)

	// create current vNode
	var curNode = vNode.of(tagName, attributes, vNodeChilds);
	curNode.stanardStyle()

	// ----- division ---- 
	var hasChildren = !_.isEmpty(vNodeChilds);

	// strategy ? 
	hasChildren ?
		cssS(node, curNode) :
		curNode.setText(node.innerText);

	return curNode
}