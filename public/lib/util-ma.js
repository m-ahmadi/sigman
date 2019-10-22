if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
if (typeof Object.keys !== 'function') {
  Object.keys = function (o) {
    var keys = [],
      k;
    for (k in o) {
      if ( o.hasOwnProperty(k) ) {
        keys.push(k);
      }
    }
    return keys;
  };
}
if (typeof Array.prototype.forEach !== 'function') {
  Array.prototype.forEach = function (c, t) {
    var o, len, k, kVal;
    if (this !== null) {
      o = Object(this);
      len = o.length >>> 0;
      if (typeof c === 'function') {
        k = 0;
        while (k < len) {
          if (k in o) {
            kVal = o[k];
            c.call(t, kVal, k, o);
          }
          k += 1;
        }
      }
    }
  };
}
(function (exported) {
  if (typeof define === 'function' && define.amd) {
    define(exported);
  } else if (typeof process !== 'undefined' &&
             typeof process.versions.node !== 'undefined') {
    module.exports = exported;
  } else {
    window.u = exported;
  }
}((function () {
  'use strict';
  // arrays
  function isArr(v) {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(v);
    } else {
      return (
        v &&
        typeof v === 'object' &&
        typeof v.length === 'number' &&
        typeof v.splice === 'function' &&
        !v.propertyIsEnumerable('length') &&
        Object.prototype.toString.call(v) === '[object Array]'
      ) ? true : false;
    }
  }
  function moveArrItem(a, f, t) { // array, from, to
    a.splice( t, 0, a.splice(f, 1)[0] );
  }
  // functions
  function isFn(v) {
    return typeof v === 'function';
  }
  function getArgs(a) {
    var len, args, i;
    if (a) {
      len = a.length;
      args = new Array(len);
      for (i=0; i<len; i+=1) {
        args[i] = a[i];
      }
      return args;
    }
  }
  // strings
  function isStr(v) {
    return typeof v === 'string';
  }
  function isEmptyStr(v) {
    return typeof v === 'string'  &&  v.length === 0;
  }
  function substrBeforeLast(c, s) {
    return isStr(c) && isStr(s) ? s.substr( 0, s.lastIndexOf(c) ) : undefined;
  }
  function substrAfterLast(c, s) {
    return isStr(c) && isStr(s) ? s.substring(s.lastIndexOf(c) + 1) : undefined;
  }
  function substrBeforeFirst(c, s) {
    return isStr(c) && isStr(s) ? s.substr( 0, s.indexOf(c) ) : undefined;
  }
  function substrAfterFirst(c, s) {
    return isStr(c) && isStr(s) ? s.substring(s.indexOf(c) + 1) : undefined;
  }
  // numbers
  function isNum(v) {
    return typeof v === 'number' && !isNAN(v);
  }
  function isNAN(v) {
    if (typeof Number.isNaN === 'function') {
      return Number.isNaN(v);
    } else if (typeof isNaN === 'function') {
      return (
        !isObj(v) &&
        !isArr(v) &&
        !isStr(v) &&
        !isBool(v) &&
        !isUndef(v) &&
        !v === null &&
        typeof v === 'number' &&
        isNaN(v)
      ) ? true : false;
    }
  }
  function isInt(n) {
    return isNum(n)  &&  n % 1 === 0;
  }
  function isNumOdd(n) {
    return isNum(n)  &&  (n % 2);
  }
  function negateNum(n) {
    return isNum(n) ? Math.abs(n) * -1 : undefined;
  }
  function positNum(n) {
    return isNum(n) ? Math.abs(n) : undefined;
  }
  function reverseNumSign(n) {
    if ( isNum(n) ) {
      if (n > 0) {
        return negateNum(n);
      } else if (n < 0) {
        return positNum(n);
      }
    }
  }
  function randInt(min, max) { // default between 0 and 10
    min = min ? Math.ceil(min) : 0;
    max = max ? Math.floor(max) : 10;
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function randFloat(min, max) { // default between 0 and 10
    min = min ? min : 0;
    max = max ? max : 10;
    return Math.random() * (max - min) + min;
  }
  function toDecimalPlace(n, p) {
    return isNum(n) ? parseFloat( n.toFixed(p) ) : undefined;
  }
  // misc
  function isBool(v) {
    return typeof v === 'boolean';
  }
  function isUndef(v) {
    return typeof v === 'undefined';
  }
  function isNull(v) {
    return typeof v === 'object' && v === null;
  }
  // objects
  function isObj(v) {
    return (
      v &&
      typeof v === 'object' &&
      typeof v !== null &&
      Object.prototype.toString.call(v) === '[object Object]'
    ) ? true : false;
  }
  function isEmptyObj(o) {
    var k;
    if ( isObj(o) ) {
      if ( typeof Object.getOwnPropertyNames === 'function' ) {
        return Object.getOwnPropertyNames(o).length === 0; // ES5
      } else {
        for ( k in o ) {
          if (  o.hasOwnProperty( k )  ) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
  function objLength(o) {
    if ( isObj(o) ) {
      return Object.keys(o).length;
    }
  }
  function extend() {
    var args = getArgs(arguments),
      len = args.length,
      arr = [],
      objects = [],
      first, last,
      result;

    if (len === 1) {
      first = args[0];
      if ( isArr(first)  &&  first.length > 1 ) {
        last = first.pop();
        objects = first;
      } else if ( isObj(first) ){
        result = Object.create(first);
      }
    } else if (len === 2) {
      first = args[0];
      last = args[len-1];
      if ( isObj(first) ) {
        result = Object.create(first);
      }
    } else if (len > 2) {
      last = args.pop();
      objects = args;
    }

    if (objects.length !== 0) {
      arr.push( {} );
      objects.forEach(function (el, i) {
        if ( isObj(el) ) {
          Object.keys(el).forEach(function (k) {
            arr[i][k] = el[k];
          });
          arr.push( Object.create(arr[i]) );
        }
      });
      result = arr[arr.length-1];
    }

    if ( last && isObj(last) ) {
      Object.keys(last).forEach(function (key) {
        result[key] = last[key];
      });
    }
    return result;
  }
  // jQuery:
  function noJq() {
    return typeof jQuery === 'undefined'  &&  typeof $ === 'undefined';
  }
  function getCommentsInside(selector) {
    if ( noJq() ) { return; }
    return $(selector).contents().filter( function () { return this.nodeType === 8; } );
  }
  function getFirstCommentInside(selector) {
    if ( noJq() ) { return; }
    return getCommentsInside(selector)[0].nodeValue.trim();
  }
  function isValidSelector(selector) {
    var el;
    if ( !isStr(selector) ) return false;
    try {
      el = $(selector);
    } catch (err) {
      return false;
    }
    return true;
  }
  function getEls(root, obj) {
    if ( noJq() || (!root && !obj) ) return;
    var o = {},
      el, els;
    if ( isStr(root) ) {
      if ( !isValidSelector(root) ) { throw new TypeError('getEls(): Invalid jQuery selector.'); }
      o.root = $(root);
      el = $(root+' [data-el]');
      els = $(root+' [data-els]');
    } else if (root instanceof jQuery) {
      o.root = root;
      el = root.find('[data-el]');
      els = root.find('[data-els]');
    }
    el.each(function (i, domEl) {
      var j = $(domEl);
      o[ j.data('el') ] = j;
    });
    els.each(function (i, domEl) {
      var j = $(domEl),
        keys = j.data('els').split(' ');
      keys.forEach(function (k) {
        var p;
        if ( !o[k] ) o[k] = $();
        p = o[k];
        o[k] = p.add(j);
      });
    });
    if (obj) {
      Object.keys(o).forEach(function (k) {
        if ( !obj[k] ) obj[k] = o[k];
      });
    } else {
      return o;
    }
  }
  // Handlebars:
  function getTemps(space, src) {
    var o = src || Handlebars.templates,
      f = substrAfterLast,
      res = {};
    Object.keys(o).forEach(function (k) {
      if ( k.indexOf(space) !== -1 ) {
        res[ f('/', k) ] = o[k];
      } else if ( k.indexOf('/') === -1 ) {
        res[k] = o[k];
      }
    });
    return res;
  }

  return {
    isObj: isObj,
    isArr: isArr,
    getArgs: getArgs,
    moveArrItem: moveArrItem,
    isInt: isInt,
    negateNum: negateNum,
    positNum: positNum,
    reverseNumSign: reverseNumSign,
    isNumOdd: isNumOdd,
    randInt: randInt,
    randFloat: randFloat,
    toDecimalPlace: toDecimalPlace,
    isEmptyObj: isEmptyObj,
    isFn: isFn,
    isStr: isStr,
    isNum: isNum,
    isNAN: isNAN,
    isBool: isBool,
    isUndef: isUndef,
    isNull: isNull,
    isEmptyStr: isEmptyStr,
    objLength: objLength,
    substrBeforeLast: substrBeforeLast,
    substrAfterLast: substrAfterLast,
    substrBeforeFirst: substrBeforeFirst,
    substrAfterFirst: substrAfterFirst,
    extend: extend,
    // jQuery:
    getCommentsInside: getCommentsInside,
    getFirstCommentInside: getFirstCommentInside,
    isValidSelector: isValidSelector,
    getEls: getEls,
    // Handlebars:
    getTemps: getTemps
  };
}())));
