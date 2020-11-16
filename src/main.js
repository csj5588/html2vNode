import _ from './utils';
import cssS from './cssS'

var html2vNode = (function () {
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
		var el = document.createElement(this.tagName);
		var props = this.props;

		// 转化style
		if (_.check(false, props.style)) {
			var objToPair = _.compose(
				_.join(';'),
				_.map(_.join(':')),
				_.map(_.transformToInlineStyle),
			)
			var strStyle = objToPair(props.style);
			props.style = strStyle;
		}

		// need rebuild s
		for (var propName in props) {
			el.setAttribute(propName, props[propName]);
		}

		if (this.text) {
			el.innerText = this.text;
		}

		this.children.forEach((child) => {
			var childNode = (child instanceof vNode) ? child.render() : document.createTextNode(child)
			el.appendChild(childNode)
		})
		// need rebuild e

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

	// implement v ss
  var root = document.getElementById('container');
  var body = document.body;
  var tree = new vTree(root);
  var vv = tree.getVTree();
  console.log(vv);
  body.appendChild(vv.render());
})();
