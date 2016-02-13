// vendored https://github.com/mweststrate/mobservable/releases/tag/1.2.4
// brunch.io had problems with NPM package and also with bower package... really weird.
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mobservable"] = factory();
	else
		root["mobservable"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var core = __webpack_require__(1);
	var dnode_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(7);
	var extras_1 = __webpack_require__(3);
	var simpleeventemitter_1 = __webpack_require__(6);
	__export(__webpack_require__(11));
	var core_1 = __webpack_require__(1);
	exports.isObservable = core_1.isObservable;
	exports.isObservableObject = core_1.isObservableObject;
	exports.isObservableArray = core_1.isObservableArray;
	exports.isObservableMap = core_1.isObservableMap;
	exports.observable = core_1.observable;
	exports.extendObservable = core_1.extendObservable;
	exports.asReference = core_1.asReference;
	exports.asFlat = core_1.asFlat;
	exports.asStructure = core_1.asStructure;
	exports.observe = core_1.observe;
	exports.autorun = core_1.autorun;
	exports.autorunUntil = core_1.autorunUntil;
	exports.autorunAsync = core_1.autorunAsync;
	exports.expr = core_1.expr;
	exports.toJSON = core_1.toJSON;
	exports.isReactive = core_1.isObservable;
	exports.map = core_1.map;
	exports.fastArray = core_1.fastArray;
	exports.makeReactive = core_1.observable;
	exports.extendReactive = core_1.extendObservable;
	exports.observeUntil = core_1.autorunUntil;
	exports.observeAsync = core_1.autorunAsync;
	var transform_1 = __webpack_require__(12);
	exports.createTransformer = transform_1.createTransformer;
	var dnode_2 = __webpack_require__(2);
	exports.untracked = dnode_2.untracked;
	exports.transaction = dnode_2.transaction;
	var observablemap_1 = __webpack_require__(10);
	exports.ObservableMap = observablemap_1.ObservableMap;
	exports._ = {
	    isComputingView: dnode_1.isComputingView,
	    quickDiff: utils_1.quickDiff
	};
	exports.extras = {
	    getDNode: extras_1.getDNode,
	    getDependencyTree: extras_1.getDependencyTree,
	    getObserverTree: extras_1.getObserverTree,
	    trackTransitions: extras_1.trackTransitions,
	    SimpleEventEmitter: simpleeventemitter_1.default,
	    withStrict: core.withStrict
	};
	//# sourceMappingURL=index.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var dnode_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(7);
	var observablevalue_1 = __webpack_require__(9);
	var observableview_1 = __webpack_require__(5);
	var observablearray_1 = __webpack_require__(8);
	var observableobject_1 = __webpack_require__(4);
	var observablemap_1 = __webpack_require__(10);
	var dnode_2 = __webpack_require__(2);
	function observable(v, keyOrScope) {
	    if (typeof arguments[1] === "string")
	        return observableDecorator.apply(null, arguments);
	    switch (arguments.length) {
	        case 0:
	            throw new Error("[mobservable.observable] Please provide at least one argument.");
	        case 1:
	            break;
	        case 2:
	            if (typeof v === "function")
	                break;
	            throw new Error("[mobservable.observable] Only one argument expected.");
	        default:
	            throw new Error("[mobservable.observable] Too many arguments. Please provide exactly one argument, or a function and a scope.");
	    }
	    if (isObservable(v))
	        return v;
	    var _a = getValueModeFromValue(v, ValueMode.Recursive), mode = _a[0], value = _a[1];
	    var sourceType = mode === ValueMode.Reference ? ValueType.Reference : getTypeOfValue(value);
	    switch (sourceType) {
	        case ValueType.Reference:
	        case ValueType.ComplexObject:
	            return toGetterSetterFunction(new observablevalue_1.ObservableValue(value, mode, null));
	        case ValueType.ComplexFunction:
	            throw new Error("[mobservable.observable] To be able to make a function reactive it should not have arguments. If you need an observable reference to a function, use `observable(asReference(f))`");
	        case ValueType.ViewFunction: {
	            var context = {
	                name: value.name,
	                object: value
	            };
	            return toGetterSetterFunction(new observableview_1.ObservableView(value, keyOrScope, context, mode === ValueMode.Structure));
	        }
	        case ValueType.Array:
	        case ValueType.PlainObject:
	            return makeChildObservable(value, mode, null);
	    }
	    throw "Illegal State";
	}
	exports.observable = observable;
	function map(initialValues, valueModifier) {
	    return new observablemap_1.ObservableMap(initialValues, valueModifier);
	}
	exports.map = map;
	function fastArray(initialValues) {
	    return observablearray_1.createObservableArray(initialValues, ValueMode.Flat, false, null);
	}
	exports.fastArray = fastArray;
	function asReference(value) {
	    return new AsReference(value);
	}
	exports.asReference = asReference;
	function asStructure(value) {
	    return new AsStructure(value);
	}
	exports.asStructure = asStructure;
	function asFlat(value) {
	    return new AsFlat(value);
	}
	exports.asFlat = asFlat;
	function isObservable(value, property) {
	    if (value === null || value === undefined)
	        return false;
	    if (property !== undefined) {
	        if (value instanceof observablemap_1.ObservableMap || value instanceof observablearray_1.ObservableArray)
	            throw new Error("[mobservable.isObservable] isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
	        else if (value.$mobservable instanceof observableobject_1.ObservableObject) {
	            var o = value.$mobservable;
	            return o.values && !!o.values[property];
	        }
	        return false;
	    }
	    return !!value.$mobservable || value instanceof dnode_2.DataNode;
	}
	exports.isObservable = isObservable;
	function autorun(view, scope) {
	    var _a = getValueModeFromValue(view, ValueMode.Recursive), mode = _a[0], unwrappedView = _a[1];
	    if (typeof unwrappedView !== "function")
	        throw new Error("[mobservable.autorun] expects a function");
	    if (unwrappedView.length !== 0)
	        throw new Error("[mobservable.autorun] expects a function without arguments");
	    var observable = new observableview_1.ObservableView(unwrappedView, scope, {
	        object: scope || view,
	        name: view.name
	    }, mode === ValueMode.Structure);
	    var disposedPrematurely = false;
	    var started = false;
	    dnode_2.runAfterTransaction(function () {
	        if (!disposedPrematurely) {
	            observable.setRefCount(+1);
	            started = true;
	        }
	    });
	    var disposer = utils_1.once(function () {
	        if (started)
	            observable.setRefCount(-1);
	        else
	            disposedPrematurely = true;
	    });
	    disposer.$mobservable = observable;
	    return disposer;
	}
	exports.autorun = autorun;
	function autorunUntil(predicate, effect, scope) {
	    var disposeImmediately = false;
	    var disposer = autorun(function () {
	        if (predicate.call(scope)) {
	            if (disposer)
	                disposer();
	            else
	                disposeImmediately = true;
	            dnode_1.untracked(function () { return effect.call(scope); });
	        }
	    });
	    if (disposeImmediately)
	        disposer();
	    return disposer;
	}
	exports.autorunUntil = autorunUntil;
	function autorunAsyncDeprecated(view, effect, delay, scope) {
	    if (delay === void 0) { delay = 1; }
	    var latestValue = undefined;
	    var timeoutHandle;
	    var disposer = autorun(function () {
	        latestValue = view.call(scope);
	        if (!timeoutHandle) {
	            timeoutHandle = setTimeout(function () {
	                effect.call(scope, latestValue);
	                timeoutHandle = null;
	            }, delay);
	        }
	    });
	    return utils_1.once(function () {
	        disposer();
	        if (timeoutHandle)
	            clearTimeout(timeoutHandle);
	    });
	}
	function autorunAsync(func, delay, scope) {
	    if (delay === void 0) { delay = 1; }
	    if (typeof delay === "function") {
	        console.warn("[mobservable] autorun(func, func) is deprecated and will removed in 2.0");
	        return autorunAsyncDeprecated.apply(null, arguments);
	    }
	    var shouldRun = false;
	    var tickScheduled = false;
	    var tick = observable(0);
	    var observedValues = [];
	    var disposer;
	    var isDisposed = false;
	    function schedule(f) {
	        setTimeout(f, delay);
	    }
	    function doTick() {
	        tickScheduled = false;
	        shouldRun = true;
	        tick(tick() + 1);
	    }
	    disposer = autorun(function () {
	        if (isDisposed)
	            return;
	        tick();
	        if (shouldRun) {
	            func.call(scope);
	            observedValues = disposer.$mobservable.observing;
	            shouldRun = false;
	        }
	        else {
	            observedValues.forEach(function (o) { return o.notifyObserved(); });
	            if (!tickScheduled) {
	                tickScheduled = true;
	                schedule(doTick);
	            }
	        }
	    });
	    return utils_1.once(function () {
	        isDisposed = true;
	        if (disposer)
	            disposer();
	    });
	}
	exports.autorunAsync = autorunAsync;
	function expr(expr, scope) {
	    if (!dnode_1.isComputingView())
	        console.warn("[mobservable.expr] 'expr' should only be used inside other reactive functions.");
	    return observable(expr, scope)();
	}
	exports.expr = expr;
	function extendObservable(target) {
	    var properties = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        properties[_i - 1] = arguments[_i];
	    }
	    if (arguments.length < 2)
	        throw new Error("[mobservable.extendObservable] expected 2 or more arguments");
	    if (target instanceof observablemap_1.ObservableMap || properties instanceof observablemap_1.ObservableMap)
	        throw new Error("[mobservable.extendObservable] 'extendObservable' should not be used on maps, use map.merge instead");
	    properties.forEach(function (propSet) {
	        if (!propSet || typeof target !== "object")
	            throw new Error("[mobservable.extendObservable] 'extendObservable' expects one or more objects with properties to define");
	        extendObservableHelper(target, propSet, ValueMode.Recursive, null);
	    });
	    return target;
	}
	exports.extendObservable = extendObservable;
	function observableDecorator(target, key, baseDescriptor) {
	    if (arguments.length < 2 || arguments.length > 3)
	        throw new Error("[mobservable.@observable] A decorator expects 2 or 3 arguments, got: " + arguments.length);
	    var isDecoratingGetter = baseDescriptor && baseDescriptor.hasOwnProperty("get");
	    var descriptor = {};
	    var baseValue = undefined;
	    if (baseDescriptor) {
	        if (baseDescriptor.hasOwnProperty('get'))
	            baseValue = baseDescriptor.get;
	        else if (baseDescriptor.hasOwnProperty('value'))
	            baseValue = baseDescriptor.value;
	        else if (baseDescriptor.initializer) {
	            baseValue = baseDescriptor.initializer();
	            if (typeof baseValue === "function")
	                baseValue = asReference(baseValue);
	        }
	    }
	    if (!target || typeof target !== "object")
	        throw new Error("The @observable decorator can only be used on objects");
	    if (isDecoratingGetter) {
	        if (typeof baseValue !== "function")
	            throw new Error("@observable expects a getter function if used on a property (in member: '" + key + "').");
	        if (descriptor.set)
	            throw new Error("@observable properties cannot have a setter (in member: '" + key + "').");
	        if (baseValue.length !== 0)
	            throw new Error("@observable getter functions should not take arguments (in member: '" + key + "').");
	    }
	    descriptor.configurable = true;
	    descriptor.enumerable = true;
	    descriptor.get = function () {
	        var _this = this;
	        withStrict(false, function () {
	            observableobject_1.ObservableObject.asReactive(_this, null, ValueMode.Recursive).set(key, baseValue);
	        });
	        return this[key];
	    };
	    descriptor.set = isDecoratingGetter
	        ? observableview_1.throwingViewSetter(key)
	        : function (value) {
	            observableobject_1.ObservableObject.asReactive(this, null, ValueMode.Recursive).set(key, typeof value === "function" ? asReference(value) : value);
	        };
	    if (!baseDescriptor) {
	        Object.defineProperty(target, key, descriptor);
	    }
	    else {
	        return descriptor;
	    }
	}
	function toJSON(source, detectCycles, __alreadySeen) {
	    if (detectCycles === void 0) { detectCycles = true; }
	    if (__alreadySeen === void 0) { __alreadySeen = null; }
	    function cache(value) {
	        if (detectCycles)
	            __alreadySeen.push([source, value]);
	        return value;
	    }
	    if (detectCycles && __alreadySeen === null)
	        __alreadySeen = [];
	    if (detectCycles && source !== null && typeof source === "object") {
	        for (var i = 0, l = __alreadySeen.length; i < l; i++)
	            if (__alreadySeen[i][0] === source)
	                return __alreadySeen[i][1];
	    }
	    if (!source)
	        return source;
	    if (Array.isArray(source) || source instanceof observablearray_1.ObservableArray) {
	        var res = cache([]);
	        res.push.apply(res, source.map(function (value) { return toJSON(value, detectCycles, __alreadySeen); }));
	        return res;
	    }
	    if (source instanceof observablemap_1.ObservableMap) {
	        var res = cache({});
	        source.forEach(function (value, key) { return res[key] = toJSON(value, detectCycles, __alreadySeen); });
	        return res;
	    }
	    if (typeof source === "object" && utils_1.isPlainObject(source)) {
	        var res = cache({});
	        for (var key in source)
	            if (source.hasOwnProperty(key))
	                res[key] = toJSON(source[key], detectCycles, __alreadySeen);
	        return res;
	    }
	    if (isObservable(source) && source.$mobservable instanceof observablevalue_1.ObservableValue)
	        return toJSON(source(), detectCycles, __alreadySeen);
	    return source;
	}
	exports.toJSON = toJSON;
	var strict = false;
	function getStrict() {
	    return strict;
	}
	exports.getStrict = getStrict;
	function withStrict(newStrict, func) {
	    var baseStrict = strict;
	    strict = newStrict;
	    try {
	        func();
	    }
	    finally {
	        strict = baseStrict;
	    }
	}
	exports.withStrict = withStrict;
	(function (ValueType) {
	    ValueType[ValueType["Reference"] = 0] = "Reference";
	    ValueType[ValueType["PlainObject"] = 1] = "PlainObject";
	    ValueType[ValueType["ComplexObject"] = 2] = "ComplexObject";
	    ValueType[ValueType["Array"] = 3] = "Array";
	    ValueType[ValueType["ViewFunction"] = 4] = "ViewFunction";
	    ValueType[ValueType["ComplexFunction"] = 5] = "ComplexFunction";
	})(exports.ValueType || (exports.ValueType = {}));
	var ValueType = exports.ValueType;
	(function (ValueMode) {
	    ValueMode[ValueMode["Recursive"] = 0] = "Recursive";
	    ValueMode[ValueMode["Reference"] = 1] = "Reference";
	    ValueMode[ValueMode["Structure"] = 2] = "Structure";
	    ValueMode[ValueMode["Flat"] = 3] = "Flat";
	})(exports.ValueMode || (exports.ValueMode = {}));
	var ValueMode = exports.ValueMode;
	function getTypeOfValue(value) {
	    if (value === null || value === undefined)
	        return ValueType.Reference;
	    if (typeof value === "function")
	        return value.length ? ValueType.ComplexFunction : ValueType.ViewFunction;
	    if (Array.isArray(value) || value instanceof observablearray_1.ObservableArray)
	        return ValueType.Array;
	    if (typeof value == 'object')
	        return utils_1.isPlainObject(value) ? ValueType.PlainObject : ValueType.ComplexObject;
	    return ValueType.Reference;
	}
	exports.getTypeOfValue = getTypeOfValue;
	function extendObservableHelper(target, properties, mode, context) {
	    var meta = observableobject_1.ObservableObject.asReactive(target, context, mode);
	    for (var key in properties)
	        if (properties.hasOwnProperty(key)) {
	            meta.set(key, properties[key]);
	        }
	    return target;
	}
	exports.extendObservableHelper = extendObservableHelper;
	function toGetterSetterFunction(observable) {
	    var f = function (value) {
	        if (arguments.length > 0)
	            observable.set(value);
	        else
	            return observable.get();
	    };
	    f.$mobservable = observable;
	    f.observe = function (listener, fire) {
	        return observable.observe(listener, fire);
	    };
	    f.toString = function () {
	        return observable.toString();
	    };
	    return f;
	}
	exports.toGetterSetterFunction = toGetterSetterFunction;
	var AsReference = (function () {
	    function AsReference(value) {
	        this.value = value;
	        assertUnwrapped(value, "Modifiers are not allowed to be nested");
	    }
	    return AsReference;
	})();
	exports.AsReference = AsReference;
	var AsStructure = (function () {
	    function AsStructure(value) {
	        this.value = value;
	        assertUnwrapped(value, "Modifiers are not allowed to be nested");
	    }
	    return AsStructure;
	})();
	exports.AsStructure = AsStructure;
	var AsFlat = (function () {
	    function AsFlat(value) {
	        this.value = value;
	        assertUnwrapped(value, "Modifiers are not allowed to be nested");
	    }
	    return AsFlat;
	})();
	exports.AsFlat = AsFlat;
	function getValueModeFromValue(value, defaultMode) {
	    if (value instanceof AsReference)
	        return [ValueMode.Reference, value.value];
	    if (value instanceof AsStructure)
	        return [ValueMode.Structure, value.value];
	    if (value instanceof AsFlat)
	        return [ValueMode.Flat, value.value];
	    return [defaultMode, value];
	}
	exports.getValueModeFromValue = getValueModeFromValue;
	function getValueModeFromModifierFunc(func) {
	    if (func === asReference)
	        return ValueMode.Reference;
	    else if (func === asStructure)
	        return ValueMode.Structure;
	    else if (func === asFlat)
	        return ValueMode.Flat;
	    else if (func !== undefined)
	        throw new Error("[mobservable] Cannot determine value mode from function. Please pass in one of these: mobservable.asReference, mobservable.asStructure or mobservable.asFlat, got: " + func);
	    return ValueMode.Recursive;
	}
	exports.getValueModeFromModifierFunc = getValueModeFromModifierFunc;
	function makeChildObservable(value, parentMode, context) {
	    var childMode;
	    if (isObservable(value))
	        return value;
	    switch (parentMode) {
	        case ValueMode.Reference:
	            return value;
	        case ValueMode.Flat:
	            assertUnwrapped(value, "Items inside 'asFlat' canont have modifiers");
	            childMode = ValueMode.Reference;
	            break;
	        case ValueMode.Structure:
	            assertUnwrapped(value, "Items inside 'asStructure' canont have modifiers");
	            childMode = ValueMode.Structure;
	            break;
	        case ValueMode.Recursive:
	            _a = getValueModeFromValue(value, ValueMode.Recursive), childMode = _a[0], value = _a[1];
	            break;
	        default:
	            throw "Illegal State";
	    }
	    if (Array.isArray(value) && Object.isExtensible(value))
	        return observablearray_1.createObservableArray(value, childMode, true, context);
	    if (utils_1.isPlainObject(value) && Object.isExtensible(value))
	        return extendObservableHelper(value, value, childMode, context);
	    return value;
	    var _a;
	}
	exports.makeChildObservable = makeChildObservable;
	function assertUnwrapped(value, message) {
	    if (value instanceof AsReference || value instanceof AsStructure || value instanceof AsFlat)
	        throw new Error("[mobservable] asStructure / asReference / asFlat cannot be used here. " + message);
	}
	exports.assertUnwrapped = assertUnwrapped;
	function isObservableObject(thing) {
	    return thing && typeof thing === "object" && thing.$mobservable instanceof observableobject_1.ObservableObject;
	}
	exports.isObservableObject = isObservableObject;
	function isObservableArray(thing) {
	    return thing instanceof observablearray_1.ObservableArray;
	}
	exports.isObservableArray = isObservableArray;
	function isObservableMap(thing) {
	    return thing instanceof observablemap_1.ObservableMap;
	}
	exports.isObservableMap = isObservableMap;
	function observe(thing, property, listener) {
	    if (arguments.length === 2) {
	        listener = property;
	        property = undefined;
	    }
	    if (typeof thing === "function") {
	        console.error("[mobservable.observe] is deprecated in combination with a function, use 'mobservable.autorun' instead");
	        return autorun(thing);
	    }
	    if (typeof listener !== "function")
	        throw new Error("[mobservable.observe] expected second argument to be a function");
	    if (isObservableArray(thing))
	        return thing.observe(listener);
	    if (isObservableMap(thing)) {
	        if (property) {
	            if (!thing._has(property))
	                throw new Error("[mobservable.observe] the provided observable map has no key with name: " + property);
	            return thing._data[property].observe(listener);
	        }
	        else {
	            return thing.observe(listener);
	        }
	    }
	    if (isObservableObject(thing)) {
	        if (property) {
	            if (!isObservable(thing, property))
	                throw new Error("[mobservable.observe] the provided object has no observable property with name: " + property);
	            return thing.$mobservable.values[property].observe(listener);
	        }
	        return thing.$mobservable.observe(listener);
	    }
	    if (utils_1.isPlainObject(thing))
	        return observable(thing).$mobservable.observe(listener);
	    throw new Error("[mobservable.observe] first argument should be an observable array, observable map, observable object or plain object.");
	}
	exports.observe = observe;
	//# sourceMappingURL=core.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	if (global.__mobservableTrackingStack)
	    throw new Error("[mobservable] An incompatible version of mobservable is already loaded.");
	global.__mobservableViewStack = [];
	var inTransaction = 0;
	var changedValues = [];
	var afterTransactionItems = [];
	var mobservableId = 0;
	function checkIfStateIsBeingModifiedDuringView(context) {
	    if (core_1.getStrict() === true && isComputingView()) {
	        var ts = global.__mobservableViewStack;
	        throw new Error("[mobservable] It is not allowed to change the state during the computation of a reactive view. Should the data you are trying to modify actually be a view? \nUse 'mobservable.extras.withStrict(false, block)' to allow changes to be made inside views (unrecommended).\nView name: " + context.name + ".\nCurrent stack size is " + ts.length + ", active view: \"" + ts[ts.length - 1].toString() + "\".");
	    }
	}
	exports.checkIfStateIsBeingModifiedDuringView = checkIfStateIsBeingModifiedDuringView;
	function transaction(action, thisArg) {
	    inTransaction += 1;
	    try {
	        return action.call(thisArg);
	    }
	    finally {
	        if (--inTransaction === 0) {
	            var values = changedValues.splice(0);
	            for (var i = 0, l = values.length; i < l; i++)
	                values[i].markReady(true);
	            var actions = afterTransactionItems.splice(0);
	            for (var i = 0, l = actions.length; i < l; i++)
	                actions[i]();
	        }
	    }
	}
	exports.transaction = transaction;
	function runAfterTransaction(action) {
	    if (inTransaction === 0)
	        action();
	    else
	        afterTransactionItems.push(action);
	}
	exports.runAfterTransaction = runAfterTransaction;
	function isInTransaction() {
	    return inTransaction > 0;
	}
	exports.isInTransaction = isInTransaction;
	function untracked(action) {
	    try {
	        var dnode = new ViewNode({ object: null, name: "untracked" });
	        global.__mobservableViewStack.push(dnode);
	        return action();
	    }
	    finally {
	        global.__mobservableViewStack.pop();
	    }
	}
	exports.untracked = untracked;
	(function (NodeState) {
	    NodeState[NodeState["STALE"] = 0] = "STALE";
	    NodeState[NodeState["PENDING"] = 1] = "PENDING";
	    NodeState[NodeState["READY"] = 2] = "READY";
	})(exports.NodeState || (exports.NodeState = {}));
	var NodeState = exports.NodeState;
	;
	var DataNode = (function () {
	    function DataNode(context) {
	        this.id = ++mobservableId;
	        this.state = NodeState.READY;
	        this.observers = [];
	        this.isDisposed = false;
	        this.externalRefenceCount = 0;
	        if (!context)
	            context = { name: undefined, object: undefined };
	        if (!context.name)
	            context.name = "[m#" + this.id + "]";
	        this.context = context;
	    }
	    DataNode.prototype.setRefCount = function (delta) {
	        this.externalRefenceCount += delta;
	    };
	    DataNode.prototype.addObserver = function (node) {
	        this.observers[this.observers.length] = node;
	    };
	    DataNode.prototype.removeObserver = function (node) {
	        var obs = this.observers, idx = obs.indexOf(node);
	        if (idx !== -1)
	            obs.splice(idx, 1);
	    };
	    DataNode.prototype.markStale = function () {
	        this.state = NodeState.STALE;
	        if (extras_1.transitionTracker)
	            extras_1.reportTransition(this, "STALE");
	        this.notifyObservers();
	    };
	    DataNode.prototype.markReady = function (stateDidActuallyChange) {
	        if (inTransaction > 0) {
	            changedValues.push(this);
	            return;
	        }
	        this.state = NodeState.READY;
	        if (extras_1.transitionTracker)
	            extras_1.reportTransition(this, "READY", true, this["_value"]);
	        this.notifyObservers(stateDidActuallyChange);
	    };
	    DataNode.prototype.notifyObservers = function (stateDidActuallyChange) {
	        if (stateDidActuallyChange === void 0) { stateDidActuallyChange = false; }
	        var os = this.observers.slice();
	        for (var l = os.length, i = 0; i < l; i++)
	            os[i].notifyStateChange(this, stateDidActuallyChange);
	    };
	    DataNode.prototype.notifyObserved = function () {
	        var ts = global.__mobservableViewStack, l = ts.length;
	        if (l > 0) {
	            var deps = ts[l - 1].observing, depslength = deps.length;
	            if (deps[depslength - 1] !== this && deps[depslength - 2] !== this)
	                deps[depslength] = this;
	        }
	    };
	    DataNode.prototype.dispose = function () {
	        if (this.observers.length)
	            throw new Error("[mobservable] Cannot dispose DNode; it is still being observed");
	        this.isDisposed = true;
	    };
	    DataNode.prototype.toString = function () {
	        return "DNode[" + this.context.name + ", state: " + this.state + ", observers: " + this.observers.length + "]";
	    };
	    return DataNode;
	})();
	exports.DataNode = DataNode;
	var ViewNode = (function (_super) {
	    __extends(ViewNode, _super);
	    function ViewNode() {
	        _super.apply(this, arguments);
	        this.isSleeping = true;
	        this.hasCycle = false;
	        this.observing = [];
	        this.prevObserving = null;
	        this.dependencyChangeCount = 0;
	        this.dependencyStaleCount = 0;
	        this.onSleepEmitter = null;
	    }
	    ViewNode.prototype.setRefCount = function (delta) {
	        var rc = this.externalRefenceCount += delta;
	        if (rc === 0)
	            this.tryToSleep();
	        else if (rc === delta)
	            this.wakeUp();
	    };
	    ViewNode.prototype.removeObserver = function (node) {
	        _super.prototype.removeObserver.call(this, node);
	        this.tryToSleep();
	    };
	    ViewNode.prototype.tryToSleep = function () {
	        if (!this.isSleeping && this.observers.length === 0 && this.externalRefenceCount === 0) {
	            for (var i = 0, l = this.observing.length; i < l; i++)
	                this.observing[i].removeObserver(this);
	            this.observing = [];
	            this.isSleeping = true;
	            if (this.onSleepEmitter !== null)
	                this.onSleepEmitter.emit(this._value);
	        }
	    };
	    ViewNode.prototype.wakeUp = function () {
	        if (this.isSleeping) {
	            this.isSleeping = false;
	            this.state = NodeState.PENDING;
	            this.computeNextState();
	        }
	    };
	    ViewNode.prototype.notifyStateChange = function (observable, stateDidActuallyChange) {
	        if (observable.state === NodeState.STALE) {
	            if (++this.dependencyStaleCount === 1)
	                this.markStale();
	        }
	        else {
	            if (stateDidActuallyChange)
	                this.dependencyChangeCount += 1;
	            if (this.dependencyStaleCount > 0 && --this.dependencyStaleCount === 0) {
	                this.state = NodeState.PENDING;
	                if (this.dependencyChangeCount > 0)
	                    this.computeNextState();
	                else
	                    this.markReady(false);
	                this.dependencyChangeCount = 0;
	            }
	        }
	    };
	    ViewNode.prototype.computeNextState = function () {
	        var _this = this;
	        this.trackDependencies();
	        if (extras_1.transitionTracker)
	            extras_1.reportTransition(this, "PENDING");
	        var hasError = true;
	        try {
	            var stateDidChange;
	            core_1.withStrict(this.externalRefenceCount === 0, function () {
	                stateDidChange = _this.compute();
	            });
	            hasError = false;
	        }
	        finally {
	            if (hasError)
	                console.error("[mobservable.view '" + this.context.name + "'] There was an uncaught error during the computation of " + this.toString());
	            this.isComputing = false;
	            this.bindDependencies();
	            this.markReady(stateDidChange);
	        }
	    };
	    ViewNode.prototype.compute = function () {
	        throw "Abstract!";
	    };
	    ViewNode.prototype.trackDependencies = function () {
	        this.prevObserving = this.observing;
	        this.observing = [];
	        global.__mobservableViewStack[global.__mobservableViewStack.length] = this;
	    };
	    ViewNode.prototype.bindDependencies = function () {
	        global.__mobservableViewStack.length -= 1;
	        var _a = utils_1.quickDiff(this.observing, this.prevObserving), added = _a[0], removed = _a[1];
	        this.prevObserving = null;
	        this.hasCycle = false;
	        for (var i = 0, l = added.length; i < l; i++) {
	            var dependency = added[i];
	            if (dependency instanceof ViewNode && dependency.findCycle(this)) {
	                this.hasCycle = true;
	                this.observing.splice(this.observing.indexOf(added[i]), 1);
	                dependency.hasCycle = true;
	            }
	            else {
	                added[i].addObserver(this);
	            }
	        }
	        for (var i = 0, l = removed.length; i < l; i++)
	            removed[i].removeObserver(this);
	    };
	    ViewNode.prototype.findCycle = function (node) {
	        var obs = this.observing;
	        if (obs.indexOf(node) !== -1)
	            return true;
	        for (var l = obs.length, i = 0; i < l; i++)
	            if (obs[i] instanceof ViewNode && obs[i].findCycle(node))
	                return true;
	        return false;
	    };
	    ViewNode.prototype.onceSleep = function (onSleep) {
	        if (this.onSleepEmitter === null)
	            this.onSleepEmitter = new simpleeventemitter_1.default();
	        this.onSleepEmitter.once(onSleep);
	    };
	    ViewNode.prototype.dispose = function () {
	        if (this.observing)
	            for (var l = this.observing.length, i = 0; i < l; i++)
	                this.observing[i].removeObserver(this);
	        this.observing = null;
	        _super.prototype.dispose.call(this);
	    };
	    return ViewNode;
	})(DataNode);
	exports.ViewNode = ViewNode;
	function stackDepth() {
	    return global.__mobservableViewStack.length;
	}
	exports.stackDepth = stackDepth;
	function isComputingView() {
	    return global.__mobservableViewStack.length > 0;
	}
	exports.isComputingView = isComputingView;
	var core_1 = __webpack_require__(1);
	var extras_1 = __webpack_require__(3);
	var utils_1 = __webpack_require__(7);
	var simpleeventemitter_1 = __webpack_require__(6);
	//# sourceMappingURL=dnode.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var dnode_1 = __webpack_require__(2);
	var observableobject_1 = __webpack_require__(4);
	var observablemap_1 = __webpack_require__(10);
	var simpleeventemitter_1 = __webpack_require__(6);
	var utils_1 = __webpack_require__(7);
	var core_1 = __webpack_require__(1);
	function getDNode(thing, property) {
	    var propError = "[mobservable.getDNode] property '" + property + "' of '" + thing + "' doesn't seem to be a reactive property";
	    if (thing instanceof observablemap_1.ObservableMap && property) {
	        var dnode = thing._data[property];
	        if (!dnode)
	            throw new Error(propError);
	        return dnode;
	    }
	    if (!core_1.isObservable(thing, property)) {
	        if (property)
	            throw new Error(propError);
	        throw new Error("[mobservable.getDNode] " + thing + " doesn't seem to be reactive");
	    }
	    if (property !== undefined) {
	        if (thing.$mobservable instanceof observableobject_1.ObservableObject)
	            return thing.$mobservable.values[property];
	        throw new Error(propError);
	    }
	    if (thing instanceof dnode_1.DataNode)
	        return thing;
	    if (thing.$mobservable) {
	        if (thing.$mobservable instanceof observableobject_1.ObservableObject || thing instanceof observablemap_1.ObservableMap)
	            throw new Error("[mobservable.getDNode] missing properties parameter. Please specify a property of '" + thing + "'.");
	        return thing.$mobservable;
	    }
	    throw new Error("[mobservable.getDNode] " + thing + " doesn't seem to be reactive");
	}
	exports.getDNode = getDNode;
	function reportTransition(node, state, changed, newValue) {
	    if (changed === void 0) { changed = false; }
	    if (newValue === void 0) { newValue = null; }
	    exports.transitionTracker.emit({
	        id: node.id,
	        name: node.context.name,
	        context: node.context.object,
	        state: state,
	        changed: changed,
	        newValue: newValue
	    });
	}
	exports.reportTransition = reportTransition;
	exports.transitionTracker = null;
	function getDependencyTree(thing, property) {
	    return nodeToDependencyTree(getDNode(thing, property));
	}
	exports.getDependencyTree = getDependencyTree;
	function nodeToDependencyTree(node) {
	    var result = {
	        id: node.id,
	        name: node.context.name,
	        context: node.context.object || null
	    };
	    if (node instanceof dnode_1.ViewNode && node.observing.length)
	        result.dependencies = utils_1.unique(node.observing).map(nodeToDependencyTree);
	    return result;
	}
	function getObserverTree(thing, property) {
	    return nodeToObserverTree(getDNode(thing, property));
	}
	exports.getObserverTree = getObserverTree;
	function nodeToObserverTree(node) {
	    var result = {
	        id: node.id,
	        name: node.context.name,
	        context: node.context.object || null
	    };
	    if (node.observers.length)
	        result.observers = utils_1.unique(node.observers).map(nodeToObserverTree);
	    if (node.externalRefenceCount > 0)
	        result.listeners = node.externalRefenceCount;
	    return result;
	}
	function createConsoleReporter(extensive) {
	    var lines = [];
	    var scheduled = false;
	    return function (line) {
	        if (extensive || line.changed)
	            lines.push(line);
	        if (!scheduled) {
	            scheduled = true;
	            setTimeout(function () {
	                console[console["table"] ? "table" : "dir"](lines);
	                lines = [];
	                scheduled = false;
	            }, 1);
	        }
	    };
	}
	function trackTransitions(extensive, onReport) {
	    if (extensive === void 0) { extensive = false; }
	    if (!exports.transitionTracker)
	        exports.transitionTracker = new simpleeventemitter_1.default();
	    var reporter = onReport
	        ? function (line) {
	            if (extensive || line.changed)
	                onReport(line);
	        }
	        : createConsoleReporter(extensive);
	    var disposer = exports.transitionTracker.on(reporter);
	    return utils_1.once(function () {
	        disposer();
	        if (exports.transitionTracker.listeners.length === 0)
	            exports.transitionTracker = null;
	    });
	}
	exports.trackTransitions = trackTransitions;
	//# sourceMappingURL=extras.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var core_1 = __webpack_require__(1);
	var observableview_1 = __webpack_require__(5);
	var observablevalue_1 = __webpack_require__(9);
	var simpleeventemitter_1 = __webpack_require__(6);
	var ObservableObject = (function () {
	    function ObservableObject(target, context, mode) {
	        this.target = target;
	        this.context = context;
	        this.mode = mode;
	        this.values = {};
	        this._events = new simpleeventemitter_1.default();
	        if (target.$mobservable)
	            throw new Error("Illegal state: already an reactive object");
	        if (!context) {
	            this.context = {
	                object: target,
	                name: ""
	            };
	        }
	        else if (!context.object) {
	            context.object = target;
	        }
	        Object.defineProperty(target, "$mobservable", {
	            enumerable: false,
	            configurable: false,
	            value: this
	        });
	    }
	    ObservableObject.asReactive = function (target, context, mode) {
	        if (target.$mobservable)
	            return target.$mobservable;
	        return new ObservableObject(target, context, mode);
	    };
	    ObservableObject.prototype.set = function (propName, value) {
	        if (this.values[propName])
	            this.target[propName] = value;
	        else
	            this.defineReactiveProperty(propName, value);
	    };
	    ObservableObject.prototype.defineReactiveProperty = function (propName, value) {
	        var observable;
	        var context = {
	            object: this.context.object,
	            name: (this.context.name || "") + "." + propName
	        };
	        if (typeof value === "function" && value.length === 0)
	            observable = new observableview_1.ObservableView(value, this.target, context, false);
	        else if (value instanceof core_1.AsStructure && typeof value.value === "function" && value.value.length === 0)
	            observable = new observableview_1.ObservableView(value.value, this.target, context, true);
	        else
	            observable = new observablevalue_1.ObservableValue(value, this.mode, context);
	        this.values[propName] = observable;
	        Object.defineProperty(this.target, propName, {
	            configurable: true,
	            enumerable: observable instanceof observablevalue_1.ObservableValue,
	            get: function () {
	                return this.$mobservable ? this.$mobservable.values[propName].get() : undefined;
	            },
	            set: function (newValue) {
	                var oldValue = this.$mobservable.values[propName].get();
	                this.$mobservable.values[propName].set(newValue);
	                this.$mobservable._events.emit({
	                    type: "update",
	                    object: this,
	                    name: propName,
	                    oldValue: oldValue
	                });
	            }
	        });
	        this._events.emit({
	            type: "add",
	            object: this.target,
	            name: propName
	        });
	    };
	    ObservableObject.prototype.observe = function (callback) {
	        return this._events.on(callback);
	    };
	    return ObservableObject;
	})();
	exports.ObservableObject = ObservableObject;
	//# sourceMappingURL=observableobject.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var dnode_1 = __webpack_require__(2);
	var simpleeventemitter_1 = __webpack_require__(6);
	var utils_1 = __webpack_require__(7);
	function throwingViewSetter(name) {
	    return function () {
	        throw new Error("[mobservable.view '" + name + "'] View functions do not accept new values");
	    };
	}
	exports.throwingViewSetter = throwingViewSetter;
	var ObservableView = (function (_super) {
	    __extends(ObservableView, _super);
	    function ObservableView(func, scope, context, compareStructural) {
	        _super.call(this, context);
	        this.func = func;
	        this.scope = scope;
	        this.compareStructural = compareStructural;
	        this.isComputing = false;
	        this.changeEvent = new simpleeventemitter_1.default();
	    }
	    ObservableView.prototype.get = function () {
	        if (this.isComputing)
	            throw new Error("[mobservable.view '" + this.context.name + "'] Cycle detected");
	        if (this.state === dnode_1.NodeState.STALE && dnode_1.isInTransaction()) {
	            return this.func.call(this.scope);
	        }
	        if (this.isSleeping) {
	            if (dnode_1.isComputingView()) {
	                this.wakeUp();
	                this.notifyObserved();
	            }
	            else {
	                this.wakeUp();
	                this.tryToSleep();
	            }
	        }
	        else {
	            this.notifyObserved();
	        }
	        if (this.hasCycle)
	            throw new Error("[mobservable.view '" + this.context.name + "'] Cycle detected");
	        return this._value;
	    };
	    ObservableView.prototype.set = function (x) {
	        throwingViewSetter(this.context.name)();
	    };
	    ObservableView.prototype.compute = function () {
	        if (this.isComputing)
	            throw new Error("[mobservable.view '" + this.context.name + "'] Cycle detected");
	        this.isComputing = true;
	        var newValue = this.func.call(this.scope);
	        this.isComputing = false;
	        var changed = this.compareStructural ? !utils_1.deepEquals(newValue, this._value) : newValue !== this._value;
	        if (changed) {
	            var oldValue = this._value;
	            this._value = newValue;
	            this.changeEvent.emit(newValue, oldValue);
	            return true;
	        }
	        return false;
	    };
	    ObservableView.prototype.observe = function (listener, fireImmediately) {
	        var _this = this;
	        if (fireImmediately === void 0) { fireImmediately = false; }
	        this.setRefCount(+1);
	        if (fireImmediately)
	            listener(this.get(), undefined);
	        var disposer = this.changeEvent.on(listener);
	        return utils_1.once(function () {
	            _this.setRefCount(-1);
	            disposer();
	        });
	    };
	    ObservableView.prototype.toString = function () {
	        return "ComputedObservable[" + this.context.name + " (current value:'" + this._value + "')] " + this.func.toString();
	    };
	    return ObservableView;
	})(dnode_1.ViewNode);
	exports.ObservableView = ObservableView;
	//# sourceMappingURL=observableview.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var utils_1 = __webpack_require__(7);
	var SimpleEventEmitter = (function () {
	    function SimpleEventEmitter() {
	        this.listeners = [];
	    }
	    SimpleEventEmitter.prototype.emit = function () {
	        var listeners = this.listeners.slice();
	        var l = listeners.length;
	        switch (arguments.length) {
	            case 0:
	                for (var i = 0; i < l; i++)
	                    listeners[i]();
	                break;
	            case 1:
	                var data = arguments[0];
	                for (var i = 0; i < l; i++)
	                    listeners[i](data);
	                break;
	            default:
	                for (var i = 0; i < l; i++)
	                    listeners[i].apply(null, arguments);
	        }
	    };
	    SimpleEventEmitter.prototype.on = function (listener) {
	        var _this = this;
	        this.listeners.push(listener);
	        return utils_1.once(function () {
	            var idx = _this.listeners.indexOf(listener);
	            if (idx !== -1)
	                _this.listeners.splice(idx, 1);
	        });
	    };
	    SimpleEventEmitter.prototype.once = function (listener) {
	        var subscription = this.on(function () {
	            subscription();
	            listener.apply(this, arguments);
	        });
	        return subscription;
	    };
	    return SimpleEventEmitter;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = SimpleEventEmitter;
	//# sourceMappingURL=simpleeventemitter.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	function once(func) {
	    var invoked = false;
	    return function () {
	        if (invoked)
	            return;
	        invoked = true;
	        return func.apply(this, arguments);
	    };
	}
	exports.once = once;
	function unique(list) {
	    var res = [];
	    list.forEach(function (item) {
	        if (res.indexOf(item) === -1)
	            res.push(item);
	    });
	    return res;
	}
	exports.unique = unique;
	function isPlainObject(value) {
	    return value !== null && typeof value == 'object' && Object.getPrototypeOf(value) === Object.prototype;
	}
	exports.isPlainObject = isPlainObject;
	function makeNonEnumerable(object, props) {
	    for (var i = 0; i < props.length; i++) {
	        Object.defineProperty(object, props[i], {
	            configurable: true,
	            writable: true,
	            enumerable: false,
	            value: object[props[i]]
	        });
	    }
	}
	exports.makeNonEnumerable = makeNonEnumerable;
	function deepEquals(a, b) {
	    if (a === null && b === null)
	        return true;
	    if (a === undefined && b === undefined)
	        return true;
	    var aIsArray = Array.isArray(a) || a instanceof observablearray_1.ObservableArray;
	    if (aIsArray !== (Array.isArray(b) || b instanceof observablearray_1.ObservableArray)) {
	        return false;
	    }
	    else if (aIsArray) {
	        if (a.length !== b.length)
	            return false;
	        for (var i = a.length; i >= 0; i--)
	            if (!deepEquals(a[i], b[i]))
	                return false;
	        return true;
	    }
	    else if (typeof a === "object" && typeof b === "object") {
	        if (a === null || b === null)
	            return false;
	        if (Object.keys(a).length !== Object.keys(b).length)
	            return false;
	        for (var prop in a) {
	            if (!b.hasOwnProperty(prop))
	                return false;
	            if (!deepEquals(a[prop], b[prop]))
	                return false;
	        }
	        return true;
	    }
	    return a === b;
	}
	exports.deepEquals = deepEquals;
	function quickDiff(current, base) {
	    if (!base || !base.length)
	        return [current, []];
	    if (!current || !current.length)
	        return [[], base];
	    var added = [];
	    var removed = [];
	    var currentIndex = 0, currentSearch = 0, currentLength = current.length, currentExhausted = false, baseIndex = 0, baseSearch = 0, baseLength = base.length, isSearching = false, baseExhausted = false;
	    while (!baseExhausted && !currentExhausted) {
	        if (!isSearching) {
	            if (currentIndex < currentLength && baseIndex < baseLength && current[currentIndex] === base[baseIndex]) {
	                currentIndex++;
	                baseIndex++;
	                if (currentIndex === currentLength && baseIndex === baseLength)
	                    return [added, removed];
	                continue;
	            }
	            currentSearch = currentIndex;
	            baseSearch = baseIndex;
	            isSearching = true;
	        }
	        baseSearch += 1;
	        currentSearch += 1;
	        if (baseSearch >= baseLength)
	            baseExhausted = true;
	        if (currentSearch >= currentLength)
	            currentExhausted = true;
	        if (!currentExhausted && current[currentSearch] === base[baseIndex]) {
	            added.push.apply(added, current.slice(currentIndex, currentSearch));
	            currentIndex = currentSearch + 1;
	            baseIndex++;
	            isSearching = false;
	        }
	        else if (!baseExhausted && base[baseSearch] === current[currentIndex]) {
	            removed.push.apply(removed, base.slice(baseIndex, baseSearch));
	            baseIndex = baseSearch + 1;
	            currentIndex++;
	            isSearching = false;
	        }
	    }
	    added.push.apply(added, current.slice(currentIndex));
	    removed.push.apply(removed, base.slice(baseIndex));
	    return [added, removed];
	}
	exports.quickDiff = quickDiff;
	var observablearray_1 = __webpack_require__(8);
	//# sourceMappingURL=utils.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var utils_1 = __webpack_require__(7);
	var dnode_1 = __webpack_require__(2);
	var simpleeventemitter_1 = __webpack_require__(6);
	var core_1 = __webpack_require__(1);
	var StubArray = (function () {
	    function StubArray() {
	    }
	    return StubArray;
	})();
	exports.StubArray = StubArray;
	StubArray.prototype = [];
	var ObservableArrayAdministration = (function (_super) {
	    __extends(ObservableArrayAdministration, _super);
	    function ObservableArrayAdministration(array, mode, supportEnumerable, context) {
	        _super.call(this, context ? context : { name: undefined, object: undefined });
	        this.array = array;
	        this.mode = mode;
	        this.supportEnumerable = supportEnumerable;
	        this.lastKnownLength = 0;
	        if (!this.context.object)
	            this.context.object = array;
	    }
	    ObservableArrayAdministration.prototype.getLength = function () {
	        this.notifyObserved();
	        return this.values.length;
	    };
	    ObservableArrayAdministration.prototype.setLength = function (newLength) {
	        if (typeof newLength !== "number" || newLength < 0)
	            throw new Error("[mobservable.array] Out of range: " + newLength);
	        var currentLength = this.values.length;
	        if (newLength === currentLength)
	            return;
	        else if (newLength > currentLength)
	            this.spliceWithArray(currentLength, 0, new Array(newLength - currentLength));
	        else
	            this.spliceWithArray(newLength, currentLength - newLength);
	    };
	    ObservableArrayAdministration.prototype.updateLength = function (oldLength, delta) {
	        if (oldLength !== this.lastKnownLength)
	            throw new Error("[mobservable] Modification exception: the internal structure of an observable array was changed. Did you use peek() to change it?");
	        this.lastKnownLength += delta;
	        if (delta < 0) {
	            dnode_1.checkIfStateIsBeingModifiedDuringView(this.context);
	            if (this.supportEnumerable)
	                for (var i = oldLength + delta; i < oldLength; i++)
	                    delete this.array[i];
	        }
	        else if (delta > 0) {
	            dnode_1.checkIfStateIsBeingModifiedDuringView(this.context);
	            if (oldLength + delta > OBSERVABLE_ARRAY_BUFFER_SIZE)
	                reserveArrayBuffer(oldLength + delta);
	            if (this.supportEnumerable)
	                for (var i = oldLength, end = oldLength + delta; i < end; i++)
	                    Object.defineProperty(this.array, i, ENUMERABLE_PROPS[i]);
	        }
	    };
	    ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
	        var _this = this;
	        var length = this.values.length;
	        if ((newItems === undefined || newItems.length === 0) && (deleteCount === 0 || length === 0))
	            return [];
	        if (index === undefined)
	            index = 0;
	        else if (index > length)
	            index = length;
	        else if (index < 0)
	            index = Math.max(0, length + index);
	        if (arguments.length === 1)
	            deleteCount = length - index;
	        else if (deleteCount === undefined || deleteCount === null)
	            deleteCount = 0;
	        else
	            deleteCount = Math.max(0, Math.min(deleteCount, length - index));
	        if (newItems === undefined)
	            newItems = [];
	        else
	            newItems = newItems.map(function (value) { return _this.makeReactiveArrayItem(value); });
	        var lengthDelta = newItems.length - deleteCount;
	        this.updateLength(length, lengthDelta);
	        var res = (_a = this.values).splice.apply(_a, [index, deleteCount].concat(newItems));
	        this.notifySplice(index, res, newItems);
	        return res;
	        var _a;
	    };
	    ObservableArrayAdministration.prototype.makeReactiveArrayItem = function (value) {
	        core_1.assertUnwrapped(value, "Array values cannot have modifiers");
	        if (this.mode === core_1.ValueMode.Flat || this.mode === core_1.ValueMode.Reference)
	            return value;
	        return core_1.makeChildObservable(value, this.mode, {
	            object: this.context.object,
	            name: this.context.name + "[x]"
	        });
	    };
	    ObservableArrayAdministration.prototype.notifyChildUpdate = function (index, oldValue) {
	        this.notifyChanged();
	        if (this.changeEvent)
	            this.changeEvent.emit({ object: this.array, type: 'update', index: index, oldValue: oldValue });
	    };
	    ObservableArrayAdministration.prototype.notifySplice = function (index, deleted, added) {
	        if (deleted.length === 0 && added.length === 0)
	            return;
	        this.notifyChanged();
	        if (this.changeEvent)
	            this.changeEvent.emit({ object: this.array, type: 'splice', index: index, addedCount: added.length, removed: deleted });
	    };
	    ObservableArrayAdministration.prototype.notifyChanged = function () {
	        this.markStale();
	        this.markReady(true);
	    };
	    return ObservableArrayAdministration;
	})(dnode_1.DataNode);
	exports.ObservableArrayAdministration = ObservableArrayAdministration;
	function createObservableArray(initialValues, mode, supportEnumerable, context) {
	    return new ObservableArray(initialValues, mode, supportEnumerable, context);
	}
	exports.createObservableArray = createObservableArray;
	var ObservableArray = (function (_super) {
	    __extends(ObservableArray, _super);
	    function ObservableArray(initialValues, mode, supportEnumerable, context) {
	        _super.call(this);
	        var adm = new ObservableArrayAdministration(this, mode, supportEnumerable, context);
	        Object.defineProperty(this, "$mobservable", {
	            enumerable: false,
	            configurable: false,
	            value: adm
	        });
	        if (initialValues && initialValues.length) {
	            adm.updateLength(0, initialValues.length);
	            adm.values = initialValues.map(function (v) { return adm.makeReactiveArrayItem(v); });
	        }
	        else
	            adm.values = [];
	    }
	    ObservableArray.prototype.observe = function (listener, fireImmediately) {
	        if (fireImmediately === void 0) { fireImmediately = false; }
	        if (this.$mobservable.changeEvent === undefined)
	            this.$mobservable.changeEvent = new simpleeventemitter_1.default();
	        if (fireImmediately)
	            listener({ object: this, type: 'splice', index: 0, addedCount: this.$mobservable.values.length, removed: [] });
	        return this.$mobservable.changeEvent.on(listener);
	    };
	    ObservableArray.prototype.clear = function () {
	        return this.splice(0);
	    };
	    ObservableArray.prototype.replace = function (newItems) {
	        return this.$mobservable.spliceWithArray(0, this.$mobservable.values.length, newItems);
	    };
	    ObservableArray.prototype.toJSON = function () {
	        this.$mobservable.notifyObserved();
	        return this.$mobservable.values.slice();
	    };
	    ObservableArray.prototype.peek = function () {
	        this.$mobservable.notifyObserved();
	        return this.$mobservable.values;
	    };
	    ObservableArray.prototype.find = function (predicate, thisArg, fromIndex) {
	        if (fromIndex === void 0) { fromIndex = 0; }
	        this.$mobservable.notifyObserved();
	        var items = this.$mobservable.values, l = items.length;
	        for (var i = fromIndex; i < l; i++)
	            if (predicate.call(thisArg, items[i], i, this))
	                return items[i];
	        return null;
	    };
	    ObservableArray.prototype.splice = function (index, deleteCount) {
	        var newItems = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            newItems[_i - 2] = arguments[_i];
	        }
	        switch (arguments.length) {
	            case 0:
	                return [];
	            case 1:
	                return this.$mobservable.spliceWithArray(index);
	            case 2:
	                return this.$mobservable.spliceWithArray(index, deleteCount);
	        }
	        return this.$mobservable.spliceWithArray(index, deleteCount, newItems);
	    };
	    ObservableArray.prototype.push = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        this.$mobservable.spliceWithArray(this.$mobservable.values.length, 0, items);
	        return this.$mobservable.values.length;
	    };
	    ObservableArray.prototype.pop = function () {
	        return this.splice(Math.max(this.$mobservable.values.length - 1, 0), 1)[0];
	    };
	    ObservableArray.prototype.shift = function () {
	        return this.splice(0, 1)[0];
	    };
	    ObservableArray.prototype.unshift = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        this.$mobservable.spliceWithArray(0, 0, items);
	        return this.$mobservable.values.length;
	    };
	    ObservableArray.prototype.reverse = function () {
	        this.$mobservable.notifyObserved();
	        var clone = this.slice();
	        return clone.reverse.apply(clone, arguments);
	    };
	    ObservableArray.prototype.sort = function (compareFn) {
	        this.$mobservable.notifyObserved();
	        var clone = this.slice();
	        return clone.sort.apply(clone, arguments);
	    };
	    ObservableArray.prototype.remove = function (value) {
	        var idx = this.$mobservable.values.indexOf(value);
	        if (idx > -1) {
	            this.splice(idx, 1);
	            return true;
	        }
	        return false;
	    };
	    ObservableArray.prototype.toString = function () {
	        return "[mobservable.array] " + Array.prototype.toString.apply(this.$mobservable.values, arguments);
	    };
	    ObservableArray.prototype.toLocaleString = function () {
	        return "[mobservable.array] " + Array.prototype.toLocaleString.apply(this.$mobservable.values, arguments);
	    };
	    return ObservableArray;
	})(StubArray);
	exports.ObservableArray = ObservableArray;
	utils_1.makeNonEnumerable(ObservableArray.prototype, [
	    "constructor",
	    "clear",
	    "find",
	    "observe",
	    "pop",
	    "peek",
	    "push",
	    "remove",
	    "replace",
	    "reverse",
	    "shift",
	    "sort",
	    "splice",
	    "split",
	    "toJSON",
	    "toLocaleString",
	    "toString",
	    "unshift"
	]);
	Object.defineProperty(ObservableArray.prototype, "length", {
	    enumerable: false,
	    configurable: true,
	    get: function () {
	        return this.$mobservable.getLength();
	    },
	    set: function (newLength) {
	        this.$mobservable.setLength(newLength);
	    }
	});
	[
	    "concat",
	    "every",
	    "filter",
	    "forEach",
	    "indexOf",
	    "join",
	    "lastIndexOf",
	    "map",
	    "reduce",
	    "reduceRight",
	    "slice",
	    "some",
	].forEach(function (funcName) {
	    var baseFunc = Array.prototype[funcName];
	    Object.defineProperty(ObservableArray.prototype, funcName, {
	        configurable: false,
	        writable: true,
	        enumerable: false,
	        value: function () {
	            this.$mobservable.notifyObserved();
	            return baseFunc.apply(this.$mobservable.values, arguments);
	        }
	    });
	});
	var OBSERVABLE_ARRAY_BUFFER_SIZE = 0;
	var ENUMERABLE_PROPS = [];
	function createArrayBufferItem(index) {
	    var prop = ENUMERABLE_PROPS[index] = {
	        enumerable: true,
	        configurable: true,
	        set: function (value) {
	            var impl = this.$mobservable;
	            var values = impl.values;
	            core_1.assertUnwrapped(value, "Modifiers cannot be used on array values. For non-reactive array values use makeReactive(asFlat(array)).");
	            if (index < values.length) {
	                dnode_1.checkIfStateIsBeingModifiedDuringView(impl.context);
	                var oldValue = values[index];
	                var changed = impl.mode === core_1.ValueMode.Structure ? !utils_1.deepEquals(oldValue, value) : oldValue !== value;
	                if (changed) {
	                    values[index] = impl.makeReactiveArrayItem(value);
	                    impl.notifyChildUpdate(index, oldValue);
	                }
	            }
	            else if (index === values.length)
	                this.push(impl.makeReactiveArrayItem(value));
	            else
	                throw new Error("[mobservable.array] Index out of bounds, " + index + " is larger than " + values.length);
	        },
	        get: function () {
	            var impl = this.$mobservable;
	            if (impl && index < impl.values.length) {
	                impl.notifyObserved();
	                return impl.values[index];
	            }
	            return undefined;
	        }
	    };
	    Object.defineProperty(ObservableArray.prototype, "" + index, {
	        enumerable: false,
	        configurable: true,
	        get: prop.get,
	        set: prop.set
	    });
	}
	function reserveArrayBuffer(max) {
	    for (var index = OBSERVABLE_ARRAY_BUFFER_SIZE; index < max; index++)
	        createArrayBufferItem(index);
	    OBSERVABLE_ARRAY_BUFFER_SIZE = max;
	}
	reserveArrayBuffer(1000);
	//# sourceMappingURL=observablearray.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var dnode_1 = __webpack_require__(2);
	var simpleeventemitter_1 = __webpack_require__(6);
	var core_1 = __webpack_require__(1);
	var utils_1 = __webpack_require__(7);
	var ObservableValue = (function (_super) {
	    __extends(ObservableValue, _super);
	    function ObservableValue(value, mode, context) {
	        _super.call(this, context);
	        this.value = value;
	        this.mode = mode;
	        this.changeEvent = new simpleeventemitter_1.default();
	        var _a = core_1.getValueModeFromValue(value, core_1.ValueMode.Recursive), childmode = _a[0], unwrappedValue = _a[1];
	        if (this.mode === core_1.ValueMode.Recursive)
	            this.mode = childmode;
	        this._value = this.makeReferenceValueReactive(unwrappedValue);
	    }
	    ObservableValue.prototype.makeReferenceValueReactive = function (value) {
	        return core_1.makeChildObservable(value, this.mode, this.context);
	    };
	    ObservableValue.prototype.set = function (newValue) {
	        core_1.assertUnwrapped(newValue, "Modifiers cannot be used on non-initial values.");
	        dnode_1.checkIfStateIsBeingModifiedDuringView(this.context);
	        var changed = this.mode === core_1.ValueMode.Structure ? !utils_1.deepEquals(newValue, this._value) : newValue !== this._value;
	        if (changed) {
	            var oldValue = this._value;
	            this.markStale();
	            this._value = this.makeReferenceValueReactive(newValue);
	            this.changeEvent.emit(this._value, oldValue);
	            this.markReady(true);
	        }
	        return changed;
	    };
	    ObservableValue.prototype.get = function () {
	        this.notifyObserved();
	        return this._value;
	    };
	    ObservableValue.prototype.observe = function (listener, fireImmediately) {
	        if (fireImmediately === void 0) { fireImmediately = false; }
	        if (fireImmediately)
	            listener(this.get(), undefined);
	        return this.changeEvent.on(listener);
	    };
	    ObservableValue.prototype.toString = function () {
	        return "Observable[" + this.context.name + ":" + this._value + "]";
	    };
	    return ObservableValue;
	})(dnode_1.DataNode);
	exports.ObservableValue = ObservableValue;
	//# sourceMappingURL=observablevalue.js.map

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var observablevalue_1 = __webpack_require__(9);
	var core_1 = __webpack_require__(1);
	var simpleeventemitter_1 = __webpack_require__(6);
	var dnode_1 = __webpack_require__(2);
	var observablearray_1 = __webpack_require__(8);
	var utils_1 = __webpack_require__(7);
	var ObservableMap = (function () {
	    function ObservableMap(initialData, valueModeFunc) {
	        var _this = this;
	        this.$mobservable = {};
	        this._data = {};
	        this._hasMap = {};
	        this._keys = new observablearray_1.ObservableArray(null, core_1.ValueMode.Reference, false, {
	            name: ".keys()",
	            object: this
	        });
	        this._events = new simpleeventemitter_1.default();
	        this._valueMode = core_1.getValueModeFromModifierFunc(valueModeFunc);
	        if (utils_1.isPlainObject(initialData))
	            this.merge(initialData);
	        else if (Array.isArray(initialData))
	            initialData.forEach(function (_a) {
	                var key = _a[0], value = _a[1];
	                return _this.set(key, value);
	            });
	    }
	    ObservableMap.prototype._has = function (key) {
	        return typeof this._data[key] !== 'undefined';
	    };
	    ObservableMap.prototype.has = function (key) {
	        this.assertValidKey(key);
	        if (this._hasMap[key])
	            return this._hasMap[key].get();
	        return this._updateHasMapEntry(key, false).get();
	    };
	    ObservableMap.prototype.set = function (key, value) {
	        var _this = this;
	        this.assertValidKey(key);
	        core_1.assertUnwrapped(value, "[mobservable.map.set] Expected unwrapped value to be inserted to key '" + key + "'. If you need to use modifiers pass them as second argument to the constructor");
	        if (this._has(key)) {
	            var oldValue = this._data[key]._value;
	            var changed = this._data[key].set(value);
	            if (changed) {
	                this._events.emit({
	                    type: "update",
	                    object: this,
	                    name: key,
	                    oldValue: oldValue
	                });
	            }
	        }
	        else {
	            dnode_1.transaction(function () {
	                _this._data[key] = new observablevalue_1.ObservableValue(value, _this._valueMode, {
	                    name: "." + key,
	                    object: _this
	                });
	                _this._updateHasMapEntry(key, true);
	                _this._keys.push(key);
	            });
	            this._events.emit({
	                type: "add",
	                object: this,
	                name: key
	            });
	        }
	    };
	    ObservableMap.prototype.delete = function (key) {
	        var _this = this;
	        this.assertValidKey(key);
	        if (this._has(key)) {
	            var oldValue = this._data[key]._value;
	            dnode_1.transaction(function () {
	                _this._keys.remove(key);
	                _this._updateHasMapEntry(key, false);
	                var observable = _this._data[key];
	                observable.set(undefined);
	                _this._data[key] = undefined;
	            });
	            this._events.emit({
	                type: "delete",
	                object: this,
	                name: key,
	                oldValue: oldValue
	            });
	        }
	    };
	    ObservableMap.prototype._updateHasMapEntry = function (key, value) {
	        var entry = this._hasMap[key];
	        if (entry) {
	            entry.set(value);
	        }
	        else {
	            entry = this._hasMap[key] = new observablevalue_1.ObservableValue(value, core_1.ValueMode.Reference, {
	                name: ".(has)" + key,
	                object: this
	            });
	        }
	        return entry;
	    };
	    ObservableMap.prototype.get = function (key) {
	        this.assertValidKey(key);
	        if (this.has(key))
	            return this._data[key].get();
	        return undefined;
	    };
	    ObservableMap.prototype.keys = function () {
	        return this._keys.slice();
	    };
	    ObservableMap.prototype.values = function () {
	        return this.keys().map(this.get, this);
	    };
	    ObservableMap.prototype.entries = function () {
	        var _this = this;
	        return this.keys().map(function (key) { return [key, _this.get(key)]; });
	    };
	    ObservableMap.prototype.forEach = function (callback, thisArg) {
	        var _this = this;
	        this.keys().forEach(function (key) { return callback.call(thisArg, _this.get(key), key); });
	    };
	    ObservableMap.prototype.merge = function (other) {
	        var _this = this;
	        dnode_1.transaction(function () {
	            if (other instanceof ObservableMap)
	                other.keys().forEach(function (key) { return _this.set(key, other.get(key)); });
	            else
	                Object.keys(other).forEach(function (key) { return _this.set(key, other[key]); });
	        });
	        return this;
	    };
	    ObservableMap.prototype.clear = function () {
	        var _this = this;
	        dnode_1.transaction(function () {
	            _this.keys().forEach(_this.delete, _this);
	        });
	    };
	    Object.defineProperty(ObservableMap.prototype, "size", {
	        get: function () {
	            return this._keys.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ObservableMap.prototype.toJs = function () {
	        var _this = this;
	        var res = {};
	        this.keys().forEach(function (key) { return res[key] = _this.get(key); });
	        return res;
	    };
	    ObservableMap.prototype.assertValidKey = function (key) {
	        if (key === null || key === undefined)
	            throw new Error("[mobservable.map] Invalid key: '" + key + "'");
	        if (typeof key !== "string" && typeof key !== "number")
	            throw new Error("[mobservable.map] Invalid key: '" + key + "'");
	    };
	    ObservableMap.prototype.toString = function () {
	        var _this = this;
	        return "[mobservable.map { " + this.keys().map(function (key) { return (key + ": " + ("" + _this.get(key))); }).join(", ") + " }]";
	    };
	    ObservableMap.prototype.observe = function (callback) {
	        return this._events.on(callback);
	    };
	    return ObservableMap;
	})();
	exports.ObservableMap = ObservableMap;
	//# sourceMappingURL=observablemap.js.map

/***/ },
/* 11 */
/***/ function(module, exports) {

	//# sourceMappingURL=interfaces.js.map

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var observableview_1 = __webpack_require__(5);
	function createTransformer(transformer, onCleanup) {
	    var _this = this;
	    if (typeof transformer !== "function" || transformer.length !== 1)
	        throw new Error("[mobservable] transformer parameter should be a function that accepts one argument");
	    var objectCache = {};
	    return function (object) {
	        var identifier = getMemoizationId(object);
	        var reactiveTransformer = objectCache[identifier];
	        if (reactiveTransformer)
	            return reactiveTransformer.get();
	        reactiveTransformer = objectCache[identifier] = new observableview_1.ObservableView(function () {
	            return transformer(object);
	        }, _this, {
	            object: object,
	            name: "transformer-" + transformer.name + "-" + identifier
	        }, false);
	        reactiveTransformer.onceSleep(function (lastValue) {
	            delete objectCache[identifier];
	            if (onCleanup)
	                onCleanup(lastValue, object);
	        });
	        return reactiveTransformer.get();
	    };
	}
	exports.createTransformer = createTransformer;
	var transformId = 0;
	function getMemoizationId(object) {
	    if (object === null || typeof object !== "object")
	        throw new Error("[mobservable] transform expected some kind of object, got: " + object);
	    var tid = object.$transformId;
	    if (tid === undefined)
	        return object.$transformId = ++transformId;
	    return tid;
	}
	//# sourceMappingURL=transform.js.map

/***/ }
/******/ ])
});
;
//# sourceMappingURL=mobservable.js.map
