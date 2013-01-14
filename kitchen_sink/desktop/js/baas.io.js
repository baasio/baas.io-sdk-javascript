/**
 * baas.io.js - v0.1.0
 * https://baas.io
 * JavaScript SDK for Hybrid Web Application based on baas.io
 * (c) 2012-2013 KTH, support@kthcorp.com
 */

//     Underscore.js 1.4.3
//     http://underscorejs.org
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // with specific `key:value` pairs.
  _.where = function(obj, attrs) {
    if (_.isEmpty(attrs)) return [];
    return _.filter(obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function(func, context) {
    var args, bound;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + (0 | Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = '' + ++idCounter;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);
/**
 * baas.io.js - v0.1.0
 * https://baas.io
 * JavaScript SDK for Hybrid Web Application based on baas.io
 * (c) 2012-2013 KTH, support@kthcorp.com
 */

(function() {
	
var root = this;

var baasio = root.baasio || {};

// Current version.
baasio.VERSION = '0.1.0';

// AMD 모듈 방식 - require() -과 Node.js 모듈 시스템을 위한 코드 
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = baasio;
	}

	exports.baasio = baasio;
} else {
	root.baasio = baasio;
}


baasio.ApiClient = (function () {
  //API endpoint
  var _apiUrl = "https://api.baas.io/";
  var _orgName = null;
  var _appName = null;
  var _token = null;
  var _callTimeout = 30000;
  var _queryType = null;
  var _loggedInUser = null;
  var _logoutCallback = null;
  var _callTimeoutCallback = null;


  function start(properties){
    if (properties.orgName) {
      this.setOrganizationName(properties.orgName);
    }
    if (properties.appName) {
      this.setApplicationName(properties.appName);
    }
    if (properties.timeoutValue) {
      this.setCallTimeout(properties.timeoutValue);
    }
  }

  /*
   *  A method to set up the ApiClient with orgname and appname
   *
   *  @method init
   *  @public
   *  @param {string} orgName
   *  @param {string} appName
   *  @return none
   *
   */
  function init(orgName, appName){
    this.setOrganizationName(orgName);
    this.setApplicationName(appName);
  }

  /*
  *  Public method to run calls against the app endpoint
  *
  *  @method runAppQuery
  *  @public
  *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
  *  @return none
  */
  function runAppQuery (Query) {
    var endpoint = "/" + this.getOrganizationName() + "/" + this.getApplicationName() + "/";
    // setQueryType(baasio.A);
    run(Query, endpoint);
  }

  /*
  *  Public method to run calls against the management endpoint
  *
  *  @method runManagementQuery
  *  @public
  *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
  *  @return none
  */
  function runManagementQuery (Query) {
    var endpoint = "/management/";
    // setQueryType(baasio.M);
    run(Query, endpoint)
  }

  /*
    *  A public method to get the organization name to be used by the client
    *
    *  @method getOrganizationName
    *  @public
    *  @return {string} the organization name
    */
  function getOrganizationName() {
    return _orgName;
  }

  /*
    *  A public method to set the organization name to be used by the client
    *
    *  @method setOrganizationName
    *  @param orgName - the organization name
    *  @return none
    */
  function setOrganizationName(orgName) {
    _orgName = orgName;
  }

  /*
  *  A public method to get the application name to be used by the client
  *
  *  @method getApplicationName
  *  @public
  *  @return {string} the application name
  */
  function getApplicationName() {
    return _appName;
  }

  /*
  *  A public method to set the application name to be used by the client
  *
  *  @method setApplicationName
  *  @public
  *  @param appName - the application name
  *  @return none
  */
  function setApplicationName(appName) {
    _appName = appName;
  }

  /*
  *  A public method to get current OAuth token
  *
  *  @method getToken
  *  @public
  *  @return {string} the current token
  */
  function getToken() {
    return _token;
  }

  /*
  *  A public method to set the current Oauth token
  *
  *  @method setToken
  *  @public
  *  @param token - the bearer token
  *  @return none
  */
  function setToken(token) {
    _token = token;
  }

  /*
   *  A public method to return the API URL
   *
   *  @method getApiUrl
   *  @public
   *  @return {string} the API url
   */
  function getApiUrl() {
    return _apiUrl;
  }

  /*
   *  A public method to overide the API url
   *
   *  @method setApiUrl
   *  @public
   *  @return none
   */
  function setApiUrl(apiUrl) {
    _apiUrl = apiUrl;
  }

  /*
   *  A public method to return the call timeout amount
   *
   *  @method getCallTimeout
   *  @public
   *  @return {string} the timeout value (an integer) 30000 = 30 seconds
   */
  function getCallTimeout() {
    return _callTimeout;
  }

  /*
   *  A public method to override the call timeout amount
   *
   *  @method setCallTimeout
   *  @public
   *  @return none
   */
  function setCallTimeout(callTimeout) {
    _callTimeout = callTimeout;
  }

  /*
   * Returns the call timeout callback function
   *
   * @public
   * @method setCallTimeoutCallback
   * @return none
   */
  function setCallTimeoutCallback(callback) {
    _callTimeoutCallback = callback;
  }

  /*
   * Returns the call timeout callback function
   *
   * @public
   * @method getCallTimeoutCallback
   * @return {function} Returns the callTimeoutCallback
   */
  function getCallTimeoutCallback() {
    return _callTimeoutCallback;
  }

  /*
   * Calls the call timeout callback function
   *
   * @public
   * @method callTimeoutCallback
   * @return {boolean} Returns true or false based on if there was a callback to call
   */
  function callTimeoutCallback(response) {
    if (_callTimeoutCallback && typeof(_callTimeoutCallback) === "function") {
      _callTimeoutCallback(response);
      return true;
    } else {
      return false;
    }
  }

  /*
   *  A public method to get the api url of the reset pasword endpoint
   *
   *  @method getResetPasswordUrl
   *  @public
   *  @return {string} the api rul of the reset password endpoint
   */
  function getResetPasswordUrl() {
    return getApiUrl() + "/management/users/resetpw"
  }

  /*
   *  A public method to get an Entity object for the current logged in user
   *
   *  @method getLoggedInUser
   *  @public
   *  @return {object} user - Entity object of type user
   */
  function getLoggedInUser() {
    return this._loggedInUser;
  }

  /*
   *  A public method to set an Entity object for the current logged in user
   *
   *  @method setLoggedInUser
   *  @public
   *  @param {object} user - Entity object of type user
   *  @return none
   */
  function setLoggedInUser(user) {
    this._loggedInUser = user;
  }

  /*
  *  A public method to log in an app user - stores the token for later use
  *
  *  @method logInAppUser
  *  @public
  *  @params {string} username
  *  @params {string} password
  *  @params {function} successCallback
  *  @params {function} failureCallback
  *  @return {response} callback functions return API response object
  */
  function logInAppUser (username, password, successCallback, failureCallback) {
    var self = this;
    var params = {"username": username, "password": password, "grant_type": "password"};
    this.runAppQuery(new baasio.Query('GET', 'token', null, params,
      function (response) {
        var user = new baasio.Entity('users');
        user.set('username', response.user.username);
        user.set('name', response.user.name);
        user.set('email', response.user.email);
        user.set('uuid', response.user.uuid);
        self.setLoggedInUser(user);
        self.setToken(response.access_token);
        if (successCallback && typeof(successCallback) === "function") {
          successCallback(response);
        }
      },
      function (response) {
        if (failureCallback && typeof(failureCallback) === "function") {
          failureCallback(response);
        }
      }
     ));
  }

  function logInWithFacebook (facebookToken, successCallback, failureCallback) {
    var self = this;
    var params = {fb_access_token: facebookToken};
    this.runAppQuery(new baasio.Query('GET', 'auth/facebook', null, params,
      function (response) {
        var user = new baasio.Entity('users');
        user.set('username', response.user.username);
        user.set('name', response.user.name);
        user.set('email', response.user.email);
        user.set('uuid', response.user.uuid);
        self.setLoggedInUser(user);
        self.setToken(response.access_token);
        if (successCallback && typeof(successCallback) === "function") {
          successCallback(response);
        }
      },
      function (response) {
        if (failureCallback && typeof(failureCallback) === "function") {
          failureCallback(response);
        }
      }
     ));
  }

  /*
   *  TODO:  NOT IMPLEMENTED YET - A method to renew an app user's token
   *  Note: waiting for API implementation
   *  @method renewAppUserToken
   *  @public
   *  @return none
   */
  function renewAppUserToken() {

  }

  /**
   *  A public method to log out an app user - clears all user fields from client
   *
   *  @method logoutAppUser
   *  @public
   *  @return none
   */
  function logoutAppUser() {
    this.setLoggedInUser(null);
    this.setToken(null);
  }

  /**
   *  A public method to test if a user is logged in - does not guarantee that the token is still valid,
   *  but rather that one exists, and that there is a valid UUID
   *
   *  @method isLoggedInAppUser
   *  @public
   *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
   *  @return {boolean} Returns true the user is logged in (has token and uuid), false if not
   */
  function isLoggedInAppUser() {
    var user = this.getLoggedInUser();
    return (this.getToken() && user.get('uuid'));
  }

   /*
   *  A public method to get the logout callback, which is called
   *
   *  when the token is found to be invalid
   *  @method getLogoutCallback
   *  @public
   *  @return {string} the api rul of the reset password endpoint
   */
  function getLogoutCallback() {
    return _logoutCallback;
  }

  /*
   *  A public method to set the logout callback, which is called
   *
   *  when the token is found to be invalid
   *  @method setLogoutCallback
   *  @public
   *  @param {function} logoutCallback
   *  @return none
   */
  function setLogoutCallback(logoutCallback) {
    _logoutCallback = logoutCallback;
  }

  /*
   *  A public method to call the logout callback, which is called
   *
   *  when the token is found to be invalid
   *  @method callLogoutCallback
   *  @public
   *  @return none
   */
  function callLogoutCallback() {
    if (_logoutCallback && typeof(_logoutCallback ) === "function") {
      _logoutCallback();
      return true;
    } else {
      return false;
    }
  }

  /**
   *  Private helper method to encode the query string parameters
   *
   *  @method encodeParams
   *  @public
   *  @params {object} params - an object of name value pairs that will be urlencoded
   *  @return {string} Returns the encoded string
   */
  function encodeParams (params) {
    tail = [];
    var item = [];
    if (params instanceof Array) {
      for (i in params) {
        item = params[i];
        if ((item instanceof Array) && (item.length > 1)) {
          tail.push(item[0] + "=" + encodeURIComponent(item[1]));
        }
      }
    } else {
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          var value = params[key];
          if (value instanceof Array) {
            for (i in value) {
              item = value[i];
              tail.push(key + "=" + encodeURIComponent(item));
            }
          } else {
            tail.push(key + "=" + encodeURIComponent(value));
          }
        }
      }
    }
    return tail.join("&");
  }

  /*
   *  A private method to get the type of the current api call - (Management or Application)
   *
   *  @method getQueryType
   *  @private
   *  @return {string} the call type
   */
  function getQueryType() {
    return _queryType;
  }
  /*
   *  A private method to set the type of the current api call - (Management or Application)
   *
   *  @method setQueryType
   *  @private
   *  @param {string} call type
   *  @return none
   */
  function setQueryType(type) {
    _queryType = type;
  }



  /**
   *  A private method to validate, prepare,, and make the calls to the API
   *  Use runAppQuery or runManagementQuery to make your calls!
   *
   *  @method run
   *  @private
   *  @params {object} baasio.Query - {method, path, jsonObj, params, successCallback, failureCallback}
   *  @params {string} endpoint - used to differentiate between management and app queries
   *  @return {response} callback functions return API response object
   */
  function run (Query, endpoint) {
    //validate parameters
    try {
      //verify that the query object is valid
      if(!(Query instanceof baasio.Query)) {
        throw(new Error('Query is not a valid object.'));
      }
      //for timing, call start
      Query.setQueryStartTime();
      //peel the data out of the query object
      var method = Query.getMethod().toUpperCase();
      var path = Query.getResource();
      var jsonObj = Query.getJsonObj() || {};
      var params = Query.getQueryParams() || {};

      //method - should be GET, POST, PUT, or DELETE only
      if (method != 'GET' && method != 'POST' && method != 'PUT' && method != 'DELETE') {
        throw(new Error('Invalid method - should be GET, POST, PUT, or DELETE.'));
      }

      //curl - append the bearer token if this is not the sandbox app
      var application_name = baasio.ApiClient.getApplicationName();
      if (application_name) {
        application_name = application_name.toUpperCase();
      }
      //if (application_name != 'SANDBOX' && baasio.ApiClient.getToken()) {
      if ( (application_name != 'SANDBOX' && baasio.ApiClient.getToken()) || (getQueryType() == baasio.M && baasio.ApiClient.getToken())) {
        Query.setToken(true);
      }

      //params - make sure we have a valid json object
      _params = JSON.stringify(params);
      if (!JSON.parse(_params)) {
        throw(new Error('Params object is not valid.'));
      }

      //add in the cursor if one is available
      if (Query.getCursor()) {
        params.cursor = Query.getCursor();
      } else {
        delete params.cursor;
      }

      //strip off the leading slash of the endpoint if there is one
      endpoint = endpoint.indexOf('/') == 0 ? endpoint.substring(1) : endpoint;

      //add the endpoint to the path
      path = endpoint + path;

      //make sure path never has more than one / together
      if (path) {
        //regex to strip multiple slashes
        while(path.indexOf('//') != -1){
          path = path.replace('//', '/');
        }
      }

      //add the http:// bit on the front
      path = baasio.ApiClient.getApiUrl() + path;

      //add in a timestamp for gets and deletes - to avoid caching by the browser
      if ((method == "GET") || (method == "DELETE")) {
        params['_'] = new Date().getTime();
      }

      //append params to the path
      var encoded_params = encodeParams(params);
      if (encoded_params) {
        path += "?" + encoded_params;
      }

      //jsonObj - make sure we have a valid json object
      jsonObj = JSON.stringify(jsonObj)
      if (!JSON.parse(jsonObj)) {
        throw(new Error('JSON object is not valid.'));
      }
      if (jsonObj == '{}') {
        jsonObj = null;
      }

    } catch (e) {
      //parameter was invalid
      console.log('error occured running query -' + e.message);
      return false;
    }

    try {
      curl = baasio.Curl.buildCurlCall(Query, endpoint);
      //log the curl call
      console.log(curl);
      //store the curl command back in the object
      Query.setCurl(curl);
    } catch(e) {
      //curl module not enabled
    }

    //so far so good, so run the query
    var xD = window.XDomainRequest ? true : false;
    var xhr = getXHR(method, path, jsonObj);

    // Handle response.
    xhr.onerror = function() {
      //for timing, call end
      Query.setQueryEndTime();
      //for timing, log the total call time
      console.log(Query.getQueryTotalTime());
      //network error
      clearTimeout(timeout);
      console.log('API call failed at the network level.');
      //send back an error (best we can do with what ie gives back)
      Query.callFailureCallback(response.innerText);
    };
    xhr.xdomainOnload = function (response) {
      //for timing, call end
      Query.setQueryEndTime();
      //for timing, log the total call time
      console.log('Call timing: ' + Query.getQueryTotalTime());
      //call completed
      clearTimeout(timeout);
      //decode the response
      response = JSON.parse(xhr.responseText);
      //if a cursor was present, grab it
      try {
        var cursor = response.cursor || null;
        Query.saveCursor(cursor);
      }catch(e) {}
      Query.callSuccessCallback(response);
    };
    xhr.onload = function(response) {
      //for timing, call end
      Query.setQueryEndTime();
      //for timing, log the total call time
      console.log('Call timing: ' + Query.getQueryTotalTime());
      //call completed
      clearTimeout(timeout);
      //decode the response
      response = JSON.parse(xhr.responseText);
      if (xhr.status != 200 && !xD)   {
        //there was an api error
        try {
          var error = response.error;
          console.log('API call failed: (status: '+xhr.status+').' + error.type);
          if ( (error.type == "auth_expired_session_token") ||
               (error.type == "unauthorized")   ||
               (error.type == "auth_missing_credentials")   ||
               (error.type == "auth_invalid")) {
            //this error type means the user is not authorized. If a logout function is defined, call it
            callLogoutCallback();
        }} catch(e){}
        //otherwise, just call the failure callback
        Query.callFailureCallback(response.error_description);
        return;
      } else {
        //query completed succesfully, so store cursor
        var cursor = response.cursor || null;
        Query.saveCursor(cursor);
        //then call the original callback
        Query.callSuccessCallback(response);
     }
    };

    var timeout = setTimeout(
      function() {
        xhr.abort();
        if (baasio.ApiClient.getCallTimeoutCallback() === 'function') {
          baasio.ApiClient.callTimeoutCallback('API CALL TIMEOUT');
        } else {
          Query.callFailureCallback('API CALL TIMEOUT');
        }
      },
      baasio.ApiClient.getCallTimeout()); //set for 30 seconds

    xhr.send(jsonObj);
  }

   /**
   *  A private method to return the XHR object
   *
   *  @method getXHR
   *  @private
   *  @params {string} method (GET,POST,PUT,DELETE)
   *  @params {string} path - api endpoint to call
   *  @return {object} jsonObj - the json object if there is one
   */
  function getXHR(method, path, jsonObj) {
    var xhr;
    if(window.XDomainRequest)
    {
      xhr = new window.XDomainRequest();
      if (baasio.ApiClient.getToken()) {
        if (path.indexOf("?")) {
          path += '&access_token='+Usergrid.ApiClient.getToken();
        } else {
          path = '?access_token='+Usergrid.ApiClient.getToken();
        }
      }
      xhr.open(method, path, true);
    }
    else
    {
      xhr = new XMLHttpRequest();
      xhr.open(method, path, true);
      //add content type = json if there is a json payload
      if (jsonObj) {
        xhr.setRequestHeader("Content-Type", "application/json");
      }
      if (baasio.ApiClient.getToken()) {
        xhr.setRequestHeader("Authorization", "Bearer " + baasio.ApiClient.getToken());
        xhr.withCredentials = true;
      }
    }
    return xhr;
  }

  return {
    init:init,
    runAppQuery:runAppQuery,
    runManagementQuery:runManagementQuery,
    getOrganizationName:getOrganizationName,
    setOrganizationName:setOrganizationName,
    getApplicationName:getApplicationName,
    setApplicationName:setApplicationName,
    getToken:getToken,
    setToken:setToken,
    getQueryType:getQueryType,
    getCallTimeout:getCallTimeout,
    setCallTimeout:setCallTimeout,
    getCallTimeoutCallback:getCallTimeoutCallback,
    setCallTimeoutCallback:setCallTimeoutCallback,
    callTimeoutCallback:callTimeoutCallback,
    getApiUrl:getApiUrl,
    setApiUrl:setApiUrl,
    getResetPasswordUrl:getResetPasswordUrl,
    getLoggedInUser:getLoggedInUser,
    setLoggedInUser:setLoggedInUser,
    logInAppUser:logInAppUser,
    logInWithFacebook:logInWithFacebook,
    renewAppUserToken:renewAppUserToken,
    logoutAppUser:logoutAppUser,
    encodeParams:encodeParams,
    isLoggedInAppUser:isLoggedInAppUser,
    getLogoutCallback:getLogoutCallback,
    setLogoutCallback:setLogoutCallback,
    callLogoutCallback:callLogoutCallback
  }
})();
/**
 *  A class to Model a Usergrid Entity.
 *
 *  @class Entity
 *  @author Rod Simpson (rod@apigee.com)
 */
(function (baasio) {
  baasio = baasio || {};

  baasio.Query = function(method, resource, jsonObj, paramsObj, successCallback, failureCallback) {
    //query vars
    this._method = method;
    this._resource = resource;
    this._jsonObj = jsonObj;
    this._paramsObj = paramsObj;
    this._successCallback = successCallback;
    this._failureCallback = failureCallback;

    //curl command - will be populated by runQuery function
    this._curl = '';
    this._token = false;

    //paging vars
    this._cursor = null;
    this._next = null;
    this._previous = [];
    this._start = 0;
    this._end = 0;
  };

  _.extend(baasio.Query.prototype, {

  	setQueryStartTime: function() {
       this._start = new Date().getTime();
     },

     setQueryEndTime: function() {
       this._end = new Date().getTime();
     },

     getQueryTotalTime: function() {
       var seconds = 0;
       var time = this._end - this._start;
       try {
          seconds = ((time/10) / 60).toFixed(2);
       } catch(e){ return 0; }
       return this.getMethod() + " " + this.getResource() + " - " + seconds + " seconds";
     },

    /**
     *  A method to set all settable parameters of the Query at one time
     *
     *  @public
     *  @method validateUsername
     *  @param {string} method
     *  @param {string} path
     *  @param {object} jsonObj
     *  @param {object} paramsObj
     *  @param {function} successCallback
     *  @param {function} failureCallback
     *  @return none
     */
    setAllQueryParams: function(method, resource, jsonObj, paramsObj, successCallback, failureCallback) {
      this._method = method;
      this._resource = resource;
      this._jsonObj = jsonObj;
      this._paramsObj = paramsObj;
      this._successCallback = successCallback;
      this._failureCallback = failureCallback;
    },

    /**
     *  A method to reset all the parameters in one call
     *
     *  @public
     *  @return none
     */
    clearAll: function() {
      this._method = null;
      this._resource = null;
      this._jsonObj = {};
      this._paramsObj = {};
      this._successCallback = null;
      this._failureCallback = null;
    },

    /**
    * Returns the method
    *
    * @public
    * @method getMethod
    * @return {string} Returns method
    */
    getMethod: function() {
      return this._method;
    },

    /**
    * sets the method (POST, PUT, DELETE, GET)
    *
    * @public
    * @method setMethod
    * @return none
    */
    setMethod: function(method) {
      this._method = method;
    },

    /**
    * Returns the resource
    *
    * @public
    * @method getResource
    * @return {string} the resource
    */
    getResource: function() {
      return this._resource;
    },

    /**
    * sets the resource
    *
    * @public
    * @method setResource
    * @return none
    */
    setResource: function(resource) {
      this._resource = resource;
    },

    /**
    * Returns the json Object
    *
    * @public
    * @method getJsonObj
    * @return {object} Returns the json Object
    */
    getJsonObj: function() {
      return this._jsonObj;
    },

    /**
    * sets the json object
    *
    * @public
    * @method setJsonObj
    * @return none
    */
    setJsonObj: function(jsonObj) {
      this._jsonObj = jsonObj;
    },
    
    /**
    * Returns the Query Parameters object
    *
    * @public
    * @method getQueryParams
    * @return {object} Returns Query Parameters object
    */
    getQueryParams: function() {
      return this._paramsObj;
    },

    /**
    * sets the query parameter object
    *
    * @public
    * @method setQueryParams
    * @return none
    */
    setQueryParams: function(paramsObj) {
      this._paramsObj = paramsObj;
    },

    /**
    * Returns the success callback function
    *
    * @public
    * @method getSuccessCallback
    * @return {function} Returns the successCallback
    */
    getSuccessCallback: function() {
      return this._successCallback;
    },

    /**
    * sets the success callback function
    *
    * @public
    * @method setSuccessCallback
    * @return none
    */
    setSuccessCallback: function(successCallback) {
      this._successCallback = successCallback;
    },

    /**
    * Calls the success callback function
    *
    * @public
    * @method callSuccessCallback
    * @return {boolean} Returns true or false based on if there was a callback to call
    */
    callSuccessCallback: function(response) {
      if (this._successCallback && typeof(this._successCallback ) === "function") {
        this._successCallback(response);
        return true;
      } else {
        return false;
      }
    },

    /**
    * Returns the failure callback function
    *
    * @public
    * @method getFailureCallback
    * @return {function} Returns the failureCallback
    */
    getFailureCallback: function() {
      return this._failureCallback;
    },

    /**
    * sets the failure callback function
    *
    * @public
    * @method setFailureCallback
    * @return none
    */
    setFailureCallback: function(failureCallback) {
      this._failureCallback = failureCallback;
    },

    /**
    * Calls the failure callback function
    *
    * @public
    * @method callFailureCallback
    * @return {boolean} Returns true or false based on if there was a callback to call
    */
    callFailureCallback: function(response) {
      if (this._failureCallback && typeof(this._failureCallback) === "function") {
        this._failureCallback(response);
        return true;
      } else {
        return false;
      }
    },

    /**
    * Returns the curl call
    *
    * @public
    * @method getCurl
    * @return {function} Returns the curl call
    */
    getCurl: function() {
      return this._curl;
    },

    /**
    * sets the curl call
    *
    * @public
    * @method setCurl
    * @return none
    */
    setCurl: function(curl) {
      this._curl = curl;
    },

    /**
    * Returns the Token
    *
    * @public
    * @method getToken
    * @return {function} Returns the Token
    */
    getToken: function() {
      return this._token;
    },

    /**
    * Method to set
    *
    * @public
    * @method setToken
    * @return none
    */
    setToken: function(token) {
      this._token = token;
    },

    /**
    * Resets the paging pointer (back to original page)
    *
    * @public
    * @method resetPaging
    * @return none
    */
    resetPaging: function() {
      this._previous = [];
      this._next = null;
      this._cursor = null;
    },

    /**
    * Method to determine if there is a previous page of data
    *
    * @public
    * @method hasPrevious
    * @return {boolean} true or false based on if there is a previous page
    */
    hasPrevious: function() {
      return (this._previous.length > 0);
    },

    /**
    * Method to set the paging object to get the previous page of data
    *
    * @public
    * @method getPrevious
    * @return none
    */
    getPrevious: function() {
      this._next=null; //clear out next so the comparison will find the next item
      this._cursor = this._previous.pop();
    },

    /**
    * Method to determine if there is a next page of data
    *
    * @public
    * @method hasNext
    * @return {boolean} true or false based on if there is a next page
    */
    hasNext: function(){
      return (this._next);
    },

    /**
    * Method to set the paging object to get the next page of data
    *
    * @public
    * @method getNext
    * @return none
    */
    getNext: function() {
      this._previous.push(this._cursor);
      this._cursor = this._next;
    },

    /**
    * Method to save off the cursor just returned by the last API call
    *
    * @public
    * @method saveCursor
    * @return none
    */
    saveCursor: function(cursor) {
      //if current cursor is different, grab it for next cursor
      if (this._next !== cursor) {
        this._next = cursor;
      }
    },

    /**
    * Method to determine if there is a next page of data
    *
    * @public
    * @method getCursor
    * @return {string} the current cursor
    */
    getCursor: function() {
      return this._cursor;
    },

    isUUID: function(uuid) {
      var uuidValueRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!uuid) return false;
      return uuidValueRegex.test(uuid);
    }
  });


})(baasio);
/**
 *  A class to Model a baasio Entity.
 *
 *  @class Entity
 *  @author Rod Simpson (rod@apigee.com)
 */
(function (baasio) {
  /**
   *  Constructor for initializing an entity
   *
   *  @constructor
   *  @param {string} collectionType - the type of collection to model
   *  @param {uuid} uuid - (optional), the UUID of the collection if it is known
   */
  baasio.Entity = function(collectionType, uuid) {
    this._collectionType = collectionType;
    this._data = {};
    if (uuid) {
      this._data['uuid'] = uuid;
    }
  };

  //inherit prototype from Query
  baasio.Entity.prototype = new baasio.Query();

  _.extend(baasio.Entity.prototype, {
    /**
     *  gets the current Entity type
     *
     *  @method getCollectionType
     *  @return {string} collection type
     */
    getCollectionType: function (){
      return this._collectionType;
    },

    /**
     *  sets the current Entity type
     *
     *  @method setCollectionType
     *  @param {string} collectionType
     *  @return none
     */
    setCollectionType: function (collectionType){
      this._collectionType = collectionType;
    },

    /**
     *  gets a specific field or the entire data object. If null or no argument
     *  passed, will return all data, else, will return a specific field
     *
     *  @method get
     *  @param {string} field
     *  @return {string} || {object} data
     */
    get: function (field){
      if (field) {
        return this._data[field];
      } else {
        return this._data;
      }
    },

    /**
     *  adds a specific field or object to the Entity's data
     *
     *  @method set
     *  @param {string} item || {object}
     *  @param {string} value
     *  @return none
     */
    set: function (item, value){
      if (typeof item === 'object') {
        for(var field in item) {
          this._data[field] = item[field];
        }
      } else if (typeof item === 'string') {
        if (value === null) {
          delete this._data[item];
        } else {
          this._data[item] = value;
        }
      } else {
        this._data = null;
      }
    },

    /**
     *  Saves the entity back to the database
     *
     *  @method save
     *  @public
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    save: function (successCallback, errorCallback){
      var path = this.getCollectionType();
      //TODO:  API will be changed soon to accomodate PUTs via name which create new entities
      //       This function should be changed to PUT only at that time, and updated to use
      //       either uuid or name
      var method = 'POST';
      if (this.isUUID(this.get('uuid'))) {
        method = 'PUT';
        path += "/" + this.get('uuid');
      }

      //if this is a user, update the password if it has been specified
      var data = {};
      if (path == 'users') {
        data = this.get();
        var pwdata = {};
        //Note: we have a ticket in to change PUT calls to /users to accept the password change
        //      once that is done, we will remove this call and merge it all into one
        if (data.oldpassword && data.newpassword) {
          pwdata.oldpassword = data.oldpassword;
          pwdata.newpassword = data.newpassword;
          this.runAppQuery(new baasio.Query('PUT', 'users/'+uuid+'/password', pwdata, null,
            function (response) {
              //not calling any callbacks - this section will be merged as soon as API supports
              //   updating passwords in general PUT call
            },
            function (response) {

            }
          ));
        }
        //remove old and new password fields so they don't end up as part of the entity object
        delete data.oldpassword;
        delete data.newpassword;
      }

      //update the entity
      var self = this;

      data = {};
      var entityData = this.get();
      //remove system specific properties
      for (var item in entityData) {
        if (item == 'metadata' || item == 'created' || item == 'modified' ||
            item == 'type' || item == 'activatted' ) { continue; }
        data[item] = entityData[item];
      }

      this.setAllQueryParams(method, path, data, null,
        function(response) {
          try {
            var entity = response.entities[0];
            self.set(entity);
            if (typeof(successCallback) === "function"){
              successCallback(response);
            }
          } catch (e) {
            if (typeof(errorCallback) === "function"){
              errorCallback(response);
            }
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
            errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    },

    /**
     *  refreshes the entity by making a GET call back to the database
     *
     *  @method fetch
     *  @public
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    fetch: function (successCallback, errorCallback){
      var path = this.getCollectionType();
      //if a uuid is available, use that, otherwise, use the name
      if (this.isUUID(this.get('uuid'))) {
        path += "/" + this.get('uuid');
      } else {
        if (path == "users") {
          if (this.get("username")) {
            path += "/" + this.get("username");
          } else {
            console.log('no username specified');
            if (typeof(errorCallback) === "function"){
              console.log('no username specified');
            }
          }
        } else {
          if (this.get()) {
            path += "/" + this.get();
          } else {
            console.log('no entity identifier specified');
            if (typeof(errorCallback) === "function"){
              console.log('no entity identifier specified');
            }
          }
        }
      }
      var self = this;
      this.setAllQueryParams('GET', path, null, null,
        function(response) {
          if (response.user) {
            self.set(response.user);
          } else if (response.entities[0]){
            self.set(response.entities[0]);
          }
          if (typeof(successCallback) === "function"){
            successCallback(response);
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
              errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    },

    /**
     *  deletes the entity from the database - will only delete
     *  if the object has a valid uuid
     *
     *  @method destroy
     *  @public
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     *
     */
    destroy: function (successCallback, errorCallback){
      var path = this.getCollectionType();
      if (this.isUUID(this.get('uuid'))) {
        path += "/" + this.get('uuid');
      } else {
        console.log('Error trying to delete object - no uuid specified.');
        if (typeof(errorCallback) === "function"){
          errorCallback('Error trying to delete object - no uuid specified.');
        }
      }
      var self = this;
      this.setAllQueryParams('DELETE', path, null, null,
        function(response) {
          //clear out this object
          self.set(null);
          if (typeof(successCallback) === "function"){
            successCallback(response);
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
              errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    }

  });


})(baasio);
/**
 *  The Collection class models baasio Collections.  It essentially
 *  acts as a container for holding Entity objects, while providing
 *  additional funcitonality such as paging, and saving
 *
 *  @class Collection
 *  @author Rod Simpson (rod@apigee.com)
 */
(function (baasio) {
  /**
   *  Collection is a container class for holding entities
   *
   *  @constructor
   *  @param {string} collectionPath - the type of collection to model
   *  @param {uuid} uuid - (optional), the UUID of the collection if it is known
   */
  baasio.Collection = function(path, uuid) {
    this._path = path;
    this._uuid = uuid;
    this._list = [];
    this._Query = new baasio.Query();
    this._iterator = -1; //first thing we do is increment, so set to -1
  };

  baasio.Collection.prototype = new baasio.Query();

  _.extend(baasio.Collection.prototype, {
    /**
     *  gets the current Collection path
     *
     *  @method getPath
     *  @return {string} path
     */
    getPath: function (){
      return this._path;
    },

    setPath: function (path){
      this._path = path;
    },
    getUUID: function (){
      return this._uuid;
    },

    /**
     *  sets the current Collection UUID
     *  @method setUUID
     *  @param {string} uuid
     *  @return none
     */
    setUUID: function (uuid){
      this._uuid = uuid;
    },

    /**
     *  Adds an Entity to the collection (adds to the local object)
     *
     *  @method addEntity
     *  @param {object} entity
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    addEntity: function (entity){
      //then add it to the list
      var count = this._list.length;
      this._list[count] = entity;
    },

    /**
     *  Adds a new Entity to the collection (saves, then adds to the local object)
     *
     *  @method addNewEntity
     *  @param {object} entity
     *  @return none
     */
    addNewEntity: function (entity, successCallback, errorCallback) {
      //add the entity to the list
      this.addEntity(entity);
      //then save the entity
      entity.save(successCallback, errorCallback);
    },

    destroyEntity: function (entity) {
      //first get the entities uuid
      var uuid = entity.get('uuid');
      //if the entity has a uuid, delete it
      if (uuid) {
        //then remove it from the list
        var count = this._list.length;
        var i=0;
        var reorder = false;
        for (i=0; i<count; i++) {
          if(reorder) {
            this._list[i-1] = this._list[i];
            this._list[i] = null;
          }
          if (this._list[i].get('uuid') == uuid) {
            this._list[i] = null;
            reorder=true;
          }
        }
      }
      //first destroy the entity on the server
      entity.destroy();
    },

    /**
     *  Looks up an Entity by a specific field - will return the first Entity that
     *  has a matching field
     *
     *  @method getEntityByField
     *  @param {string} field
     *  @param {string} value
     *  @return {object} returns an entity object, or null if it is not found
     */
    getEntityByField: function (field, value){
      var count = this._list.length;
      var i=0;
      for (i=0; i<count; i++) {
        if (this._list[i].getField(field) == value) {
          return this._list[i];
        }
      }
      return null;
    },

    /**
     *  Looks up an Entity by UUID
     *
     *  @method getEntityByUUID
     *  @param {string} UUID
     *  @return {object} returns an entity object, or null if it is not found
     */
    getEntityByUUID: function (UUID){
      var count = this._list.length;
      var i=0;
      for (i=0; i<count; i++) {
        if (this._list[i].get('uuid') == UUID) {
          return this._list[i];
        }
      }
      return null;
    },

    /**
     *  Returns the first Entity of the Entity list - does not affect the iterator
     *
     *  @method getFirstEntity
     *  @return {object} returns an entity object
     */
    getFirstEntity: function (){
      var count = this._list.length;
        if (count > 0) {
          return this._list[0];
        }
        return null;
    },

    /**
     *  Returns the last Entity of the Entity list - does not affect the iterator
     *
     *  @method getLastEntity
     *  @return {object} returns an entity object
     */
    getLastEntity: function (){
      var count = this._list.length;
        if (count > 0) {
          return this._list[count-1];
        }
        return null;
    },

    /**
     *  Entity iteration -Checks to see if there is a "next" entity
     *  in the list.  The first time this method is called on an entity
     *  list, or after the resetEntityPointer method is called, it will
     *  return true referencing the first entity in the list
     *
     *  @method hasNextEntity
     *  @return {boolean} true if there is a next entity, false if not
     */
    hasNextEntity: function (){
      var next = this._iterator + 1;
        if(next >=0 && next < this._list.length) {
          return true;
        }
        return false;
    },

    /**
     *  Entity iteration - Gets the "next" entity in the list.  The first
     *  time this method is called on an entity list, or after the method
     *  resetEntityPointer is called, it will return the,
     *  first entity in the list
     *
     *  @method hasNextEntity
     *  @return {object} entity
     */
    getNextEntity: function (){
      this._iterator++;
        if(this._iterator >= 0 && this._iterator <= this._list.length) {
          return this._list[this._iterator];
        }
        return false;
    },

    /**
     *  Entity iteration - Checks to see if there is a "previous"
     *  entity in the list.
     *
     *  @method hasPreviousEntity
     *  @return {boolean} true if there is a previous entity, false if not
     */
    hasPreviousEntity: function (){
      var previous = this._iterator - 1;
        if(previous >=0 && previous < this._list.length) {
          return true;
        }
        return false;
    },

    /**
     *  Entity iteration - Gets the "previous" entity in the list.
     *
     *  @method getPreviousEntity
     *  @return {object} entity
     */
    getPreviousEntity: function (){
       this._iterator--;
        if(this._iterator >= 0 && this._iterator <= this._list.length) {
          return this.list[this._iterator];
        }
        return false;
    },

    /**
     *  Entity iteration - Resets the iterator back to the beginning
     *  of the list
     *
     *  @method resetEntityPointer
     *  @return none
     */
    resetEntityPointer: function (){
       this._iterator  = -1;
    },

    /**
     *  gets and array of all entities currently in the colleciton object
     *
     *  @method getEntityList
     *  @return {array} returns an array of entity objects
     */
    getEntityList: function (){
       return this._list;
    },

    /**
     *  sets the entity list
     *
     *  @method setEntityList
     *  @param {array} list - an array of Entity objects
     *  @return none
     */
    setEntityLis: function (list){
      this._list = list;
    }, 

    /**
     *  Paging -  checks to see if there is a next page od data
     *
     *  @method hasNextPage
     *  @return {boolean} returns true if there is a next page of data, false otherwise
     */
    hasNextPage: function (){
      return this.hasNext();
    },

    /**
     *  Paging - advances the cursor and gets the next
     *  page of data from the API.  Stores returned entities
     *  in the Entity list.
     *
     *  @method getNextPage
     *  @return none
     */
    getNextPage: function (){
      if (this.hasNext()) {
          //set the cursor to the next page of data
          this.getNext();
          //empty the list
          this.setEntityList([]);
          baasio.ApiClient.runAppQuery(this);
        }
    },

    /**
     *  Paging -  checks to see if there is a previous page od data
     *
     *  @method hasPreviousPage
     *  @return {boolean} returns true if there is a previous page of data, false otherwise
     */
    hasPreviousPage: function (){
      return this.hasPrevious();
    },

    /**
     *  Paging - reverts the cursor and gets the previous
     *  page of data from the API.  Stores returned entities
     *  in the Entity list.
     *
     *  @method getPreviousPage
     *  @return none
     */
    getPreviousPage: function (){
      if (this.hasPrevious()) {
          this.getPrevious();
          //empty the list
          this.setEntityList([]);
          baasio.ApiClient.runAppQuery(this);
        }
    },

    /**
     *  clears the query parameters object
     *
     *  @method clearQuery
     *  @return none
     */
    clearQuery: function (){
      this.clearAll();
    },


    /**
     *  A method to get all items in the collection, as dictated by the
     *  cursor and the query.  By default, the API returns 10 items in
     *  a given call.  This can be overriden so that more or fewer items
     *  are returned.  The entities returned are all stored in the colleciton
     *  object's entity list, and can be retrieved by calling getEntityList()
     *
     *  @method get
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    fetch: function (successCallback, errorCallback){
      var self = this;
      var queryParams = this.getQueryParams();
      //empty the list
      this.setEntityList([]);
      this.setAllQueryParams('GET', this.getPath(), null, queryParams,
        function(response) {
          if (response.entities) {
            this.resetEntityPointer();
            var count = response.entities.length;
            for (var i=0;i<count;i++) {
              var uuid = response.entities[i].uuid;
              if (uuid) {
                var entity = new baasio.Entity(self.getPath(), uuid);
                //store the data in the entity
                var data = response.entities[i] || {};
                delete data.uuid; //remove uuid from the object
                entity.set(data);
                //store the new entity in this collection
                self.addEntity(entity);
              }
            }
            if (typeof(successCallback) === "function"){
              successCallback(response);
            }
          } else {
            if (typeof(errorCallback) === "function"){
                errorCallback(response);
            }
          }
        },
        function(response) {
          if (typeof(errorCallback) === "function"){
              errorCallback(response);
          }
        }
      );
      baasio.ApiClient.runAppQuery(this);
    },

    /**
     *  A method to save all items currently stored in the collection object
     *  caveat with this method: we can't update anything except the items
     *  currently stored in the collection.
     *
     *  @method save
     *  @param {function} successCallback
     *  @param {function} errorCallback
     *  @return none
     */
    save: function (successCallback, errorCallback){
      //loop across all entities and save each one
      var entities = this.getEntityList();
      var count = entities.length;
      var jsonObj = [];
      for (var i=0;i<count;i++) {
        entity = entities[i];
        data = entity.get();
        if (entity.get('uuid')) {
          data.uuid = entity.get('uuid');
          jsonObj.push(data);
        }
        entity.save();
      }
      this.setAllQueryParams('PUT', this.getPath(), jsonObj, null,successCallback, errorCallback);
      baasio.ApiClient.runAppQuery(this);
    }

  });

})(baasio);

}).call(this);