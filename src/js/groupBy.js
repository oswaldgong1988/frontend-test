var ObjProto = Object.prototype;
var hasOwnProperty = ObjProto.hasOwnProperty;
var extendOwn = createAssigner(keys);
var nativeIsArray = Array.isArray;
var isFunction = tagTester('Function');
var isArray = nativeIsArray || tagTester('Array');
var getLength = shallowProperty('length');
var isArrayLike = createSizePropertyCheck(getLength);
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function toPath(path) {
    return isArray(path) ? path : [path];
}

function property(path) {
    path = toPath(path);
    return function (obj) {
        return deepGet(obj, path);
    };
}

function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return length ? obj : void 0;
}

function createAssigner(keysFunc, defaults) {
    return function (obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
        }
        return obj;
    };
}

function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
}

function createSizePropertyCheck(getSizeProperty) {
    return function (collection) {
        var sizeProperty = getSizeProperty(collection);
        return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
}

function shallowProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    };
}

function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
            iteratee(obj[i], i, obj);
        }
    } else {
        var _keys = keys(obj);
        for (i = 0, length = _keys.length; i < length; i++) {
            iteratee(obj[_keys[i]], _keys[i], obj);
        }
    }
    return obj;
}

function createAssigner(keysFunc, defaults) {
    return function (obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
        }
        return obj;
    };
}

function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function (obj) {
        return toString.call(obj) === tag;
    };
}

var isFunction$1 = isFunction;

function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function (obj) {
        return isMatch(obj, attrs);
    };
}

function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
}

function cb(value, context, argCount) {
    return baseIteratee(value, context, argCount);
}

function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
}

function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
        case 1:
            return function (value) {
                return func.call(context, value);
            };
        // The 2-argument case is omitted because we’re not using it.
        case 3:
            return function (value, index, collection) {
                return func.call(context, value, index, collection);
            };
        case 4:
            return function (accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
    }
    return function () {
        return func.apply(context, arguments);
    };
}

function group(behavior, partition) {
    return function (obj, iteratee, context) {
        var result = partition ? [[], []] : {};
        iteratee = cb(iteratee, context);
        each(obj, function (value, index) {
            var key = iteratee(value, index, obj);
            behavior(result, value, key);
        });
        return result;
    };
}

var groupBy = group(function (result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
});

