/**
 * functors
 */

// identity
var _c = function(x) {
  console.log(x);
  return x;
}

var _curry = function (fn) {
  return function curriedFn(...args1) {
    if (args1.length < fn.length) {
      return function (...args2) {
        return curriedFn(...args1, ...args2);
      }
    }
    return fn(...args1);
  }
}

var _compose = function () {
  let fns = Array.from(arguments)
  return function (data) {
    return fns.reverse().reduce(function (pre, item) {
      return item(pre)
    }, data)
  }
}

var _isEmpty = function (el) {
  if (Array.isArray(el)) {
    return el.length === 0 || el[0] === null;
  }
  if (typeof el === 'object') {
    return JSON.stringify(el) === '{}';
  }
  return el === undefined || el === null;
}

var _for = _curry(function (context, fn, xs) {
  var container = []
  for (var i = 0; i < xs.length; i++) {
    var result = fn.bind(context)(xs[i], i);
    container.push(result)
  };
  return container;
})

var _forObject = _curry(function (context, fn, obj) {
  var container = []
  for (var i in obj) {
    var result = fn.bind(context)(obj[i], i);
    container.push(result)
  };
  return container;
})

var _map = _curry(function (fn, xs) {
  return xs.map(fn);
})

var _randKey = function () {
  return +new Date() + Math.random();
}

var _toLowerCase = function (x) {
  return x.toLowerCase();
}

var _safeProps = _curry(function (x, obj) {
  return obj[x];
})

var _check = _curry(function (defaultValue, x) {
  return _isEmpty(x) ? defaultValue : x;
})

var _filter = _curry(function (fn, xs) {
  return xs.filter(fn);
})

var _forEach = _curry(function (fn, xs) {
  return xs.forEach(fn);
});

var _join = _curry(function (rule, x) {
  return x.join(rule);
});

var _length = function(xs) {
  const safeXs = _check([], xs);
  return safeXs.length;
}

var _split = _curry(function (rule, x) {
  return x.split(rule);
});

var _trim = function(x) {
  return x.trim();
}

var _assign = _curry(function (obj, it) {
  return Object.assign(obj, it)
});

var _concat = _curry(function (xs, target) {
  return xs.concat(target)
});

var _clone = _curry(function (xs, target) {
  return xs.concat(target)
});

var _arrayToObject = function (xs) {
  var obj = {};
  var forAssign = _forEach(_assign(obj))
  forAssign(xs)
  return obj;
}

var _css = _curry(function (css, node) {
  return node.currentStyle ?
    node.currentStyle.getAttribute(css) :
    window.getComputedStyle(node, null).getPropertyValue(css)
})

var _transformToInlineStyle = function(obj) {
  var keyValueToString = function(val, key) {
    return `${key}: ${val}`;
  }
  var styleArray = _forObject(obj, keyValueToString, obj)
  return styleArray;
}

var _ = {};
_.c = _c;
_.for = _for;
_.isEmpty = _isEmpty;
_.curry = _curry;
_.compose = _compose;
_.randKey = _randKey;
_.toLowerCase = _toLowerCase;
_.safeProps = _safeProps;
_.check = _check;
_.filter = _filter;
_.map = _map;
_.forEach = _forEach;
_.forObject = _forObject;
_.join = _join;
_.length = _length;
_.split = _split;
_.assign = _assign;
_.concat = _concat;
_.arrayToObject = _arrayToObject;
_.css = _css;
_.transformToInlineStyle = _transformToInlineStyle;
_.trim = _trim;

export default _;