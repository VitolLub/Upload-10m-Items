(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* global chrome browser */

// Note: it's an adapter for both chrome and web extension API
// chrome and web extension API have almost the same API signatures
// except that chrome accepts callback while web extension returns promises
//
// The whole idea here is to make sure all callback style API of chrome
// also return promises
//
// Important: You need to specify whatever API you need to use in `UsedAPI` below

(function () {
  var adaptChrome = function adaptChrome(obj, chrome) {
    var adapt = function adapt(src, ret, obj, fn) {
      return Object.keys(obj).reduce(function (prev, key) {
        var keyParts = key.split('.');

        var _keyParts$reduce = keyParts.reduce(function (tuple, subkey) {
          var tar = tuple[0];
          var src = tuple[1];

          tar[subkey] = tar[subkey] || {};
          return [tar[subkey], src && src[subkey]];
        }, [prev, src]),
            _keyParts$reduce2 = _slicedToArray(_keyParts$reduce, 2),
            target = _keyParts$reduce2[0],
            source = _keyParts$reduce2[1];

        obj[key].forEach(function (method) {
          fn(method, source, target);
        });

        return prev;
      }, ret);
    };

    var promisify = function promisify(method, source, target) {
      if (!source) return;
      var reg = /The message port closed before a res?ponse was received/;

      target[method] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new Promise(function (resolve, reject) {
          var callback = function callback(result) {
            // Note: The message port closed before a reponse was received.
            // Ignore this message
            if (chrome.runtime.lastError && !reg.test(chrome.runtime.lastError.message)) {
              console.error(chrome.runtime.lastError.message + ', ' + method + ', ' + JSON.stringify(args));
              return reject(chrome.runtime.lastError);
            }
            resolve(result);
          };

          source[method].apply(source, args.concat(callback));
        });
      };
    };

    var copy = function copy(method, source, target) {
      if (!source) return;
      target[method] = source[method];
    };

    return [[obj.toPromisify, promisify], [obj.toCopy, copy]].reduce(function (prev, tuple) {
      return adapt(chrome, prev, tuple[0], tuple[1]);
    }, {});
  };

  var UsedAPI = {
    toPromisify: {
      tabs: ['create', 'sendMessage', 'get', 'update', 'query', 'captureVisibleTab', 'remove', 'getZoom'],
      windows: ['update', 'getLastFocused', 'getCurrent', 'getAll', 'remove', 'create', 'get'],
      runtime: ['sendMessage', 'setUninstallURL'],
      cookies: ['get', 'getAll', 'set', 'remove'],
      notifications: ['create', 'clear'],
      browserAction: ['getBadgeText', 'setIcon'],
      bookmarks: ['create', 'getTree'],
      debugger: ['attach', 'detach', 'sendCommand', 'getTargets'],
      downloads: ['search'],
      extension: ['isAllowedFileSchemeAccess'],
      contextMenus: ['create', 'update', 'remove', 'removeAll'],
      'storage.local': ['get', 'set']
    },
    toCopy: {
      tabs: ['onActivated', 'onUpdated', 'onRemoved'],
      windows: ['onFocusChanged'],
      runtime: ['onMessage', 'onInstalled', 'getManifest'],
      storage: ['onChanged'],
      browserAction: ['setBadgeText', 'setBadgeBackgroundColor', 'onClicked'],
      extension: ['getURL'],
      debugger: ['onEvent', 'onDetach'],
      downloads: ['onCreated', 'onChanged', 'onDeterminingFilename', 'setShelfEnabled'],
      webRequest: ['onAuthRequired']
    }
  };

  var Ext = typeof chrome !== 'undefined' ? adaptChrome(UsedAPI, chrome) : browser;

  _extends(Ext, {
    isFirefox: function isFirefox() {
      return (/Firefox/.test(window.navigator.userAgent)
      );
    }
  });

  if (true) {
    module.exports = Ext;
  } else {}
})();

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Log factory is quite simple, just a wrapper on console.log
// so that you can use the same API, at the same, achieve following features
// 1. Hide all logs in production
// 2. Extend it to save logs in local storage / or send it back to you backend (for debug or analysis)
Object.defineProperty(exports, "__esModule", { value: true });
function logFactory(enabled) {
    let isEnabled = !!enabled;
    const obj = ['log', 'info', 'warn', 'error'].reduce((prev, method) => {
        prev[method] = (...args) => {
            if (!isEnabled)
                return;
            console[method]((new Date()).toISOString(), ' - ', ...args);
        };
        return prev;
    }, {});
    return Object.assign(obj.log, obj, {
        enable: () => { isEnabled = true; },
        disable: () => { isEnabled = false; }
    });
}
exports.logFactory = logFactory;
const logger = logFactory("production" !== 'production');
exports.default = logger;


/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(__webpack_require__(11));
function singletonGetter(factoryFn) {
    let instance = null;
    return (...args) => {
        if (instance)
            return instance;
        instance = factoryFn(...args);
        return instance;
    };
}
exports.singletonGetter = singletonGetter;
function singletonGetterByKey(getKey, factoryFn) {
    let cache = {};
    return (...args) => {
        const key = getKey(...args);
        if (cache[key])
            return cache[key];
        cache[key] = factoryFn(...args);
        return cache[key];
    };
}
exports.singletonGetterByKey = singletonGetterByKey;
function id(x) {
    return x;
}
exports.id = id;
function capitalInitial(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
exports.capitalInitial = capitalInitial;
function snakeToCamel(kebabStr) {
    const list = kebabStr.split('_');
    return list[0] + list.slice(1).map(capitalInitial).join('');
}
exports.snakeToCamel = snakeToCamel;
exports.delay = (fn, timeout) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(fn());
            }
            catch (e) {
                reject(e);
            }
        }, timeout);
    });
};
exports.until = (name, check, interval = 1000, expire = 10000) => {
    const start = new Date().getTime();
    const go = () => {
        if (expire && new Date().getTime() - start >= expire) {
            throw new Error(`until: ${name} expired!`);
        }
        const { pass, result } = check();
        if (pass)
            return Promise.resolve(result);
        return exports.delay(go, interval);
    };
    return new Promise((resolve, reject) => {
        try {
            resolve(go());
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.range = (start, end, step = 1) => {
    const ret = [];
    for (let i = start; i < end; i += step) {
        ret.push(i);
    }
    return ret;
};
exports.partial = (fn) => {
    const len = fn.length;
    let arbitary;
    arbitary = (curArgs, leftArgCnt) => (...args) => {
        if (args.length >= leftArgCnt) {
            return fn.apply(null, curArgs.concat(args));
        }
        return arbitary(curArgs.concat(args), leftArgCnt - args.length);
    };
    return arbitary([], len);
};
exports.reduceRight = (fn, initial, list) => {
    let ret = initial;
    for (let i = list.length - 1; i >= 0; i--) {
        ret = fn(list[i], ret);
    }
    return ret;
};
exports.compose = (...args) => {
    return exports.reduceRight((cur, prev) => {
        return (x) => cur(prev(x));
    }, (x) => x, args);
};
exports.map = exports.partial((fn, list) => {
    const result = [];
    for (let i = 0, len = list.length; i < len; i++) {
        result.push(fn(list[i]));
    }
    return result;
});
exports.on = exports.partial((key, fn, dict) => {
    if (Array.isArray(dict)) {
        return [
            ...dict.slice(0, key),
            fn(dict[key]),
            ...dict.slice(key + 1)
        ];
    }
    return Object.assign({}, dict, {
        [key]: fn(dict[key])
    });
});
exports.updateIn = exports.partial((keys, fn, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.map : exports.on(key)));
    return updater(fn)(obj);
});
exports.setIn = exports.partial((keys, value, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.map : exports.on(key)));
    return updater(() => value)(obj);
});
exports.getIn = exports.partial((keys, obj) => {
    return keys.reduce((prev, key) => {
        if (!prev)
            return prev;
        return prev[key];
    }, obj);
});
exports.safeMap = exports.partial((fn, list) => {
    const result = [];
    const safeList = list || [];
    for (let i = 0, len = safeList.length; i < len; i++) {
        result.push(fn(safeList[i]));
    }
    return result;
});
exports.safeOn = exports.partial((key, fn, dict) => {
    if (Array.isArray(dict)) {
        return [
            ...dict.slice(0, key),
            fn(dict[key]),
            ...dict.slice(key + 1)
        ];
    }
    return Object.assign({}, dict, {
        [key]: fn((dict || {})[key])
    });
});
exports.safeUpdateIn = exports.partial((keys, fn, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.safeMap : exports.safeOn(key)));
    return updater(fn)(obj);
});
exports.safeSetIn = exports.partial((keys, value, obj) => {
    const updater = exports.compose.apply(null, keys.map(key => key === '[]' ? exports.safeMap : exports.safeOn(key)));
    return updater(() => value)(obj);
});
exports.pick = (keys, obj) => {
    return keys.reduce((prev, key) => {
        prev[key] = obj[key];
        return prev;
    }, {});
};
exports.pickIfExist = (keys, obj) => {
    return keys.reduce((prev, key) => {
        if (obj[key] !== undefined) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
};
exports.without = (keys, obj) => {
    return Object.keys(obj).reduce((prev, key) => {
        if (keys.indexOf(key) === -1) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
};
exports.uid = () => {
    return '' + (new Date().getTime()) + '.' +
        Math.floor(Math.random() * 10000000).toString(16);
};
exports.flatten = (list) => {
    return [].concat.apply([], list);
};
exports.zipWith = (fn, ...listOfList) => {
    const len = Math.min(...listOfList.map(list => list.length));
    const res = [];
    for (let i = 0; i < len; i++) {
        res.push(fn(...listOfList.map(list => list[i])));
    }
    return res;
};
exports.and = (...list) => list.reduce((prev, cur) => prev && cur, true);
exports.or = (...list) => list.reduce((prev, cur) => prev || cur, false);
exports.withPostfix = (options) => {
    const { reg, str, fn } = options;
    const m = str.match(reg);
    const extName = m ? m[0] : '';
    const baseName = m ? str.replace(reg, '') : str;
    const result = fn(baseName, (name) => name + extName);
    if (result === null || result === undefined) {
        throw new Error('withPostfix: should not return null/undefined');
    }
    if (typeof result.then === 'function') {
        return result.then((name) => name + extName);
    }
    return result + extName;
};
exports.withFileExtension = (origName, fn) => {
    return exports.withPostfix({
        fn,
        str: origName,
        reg: /\.\w+$/
    });
};
function getExtName(fileName) {
    return exports.withFileExtension(fileName, () => '');
}
exports.getExtName = getExtName;
exports.uniqueName = (name, options) => {
    const opts = Object.assign({ generate: (old, step = 1) => {
            const reg = /_(\d+)$/;
            const m = old.match(reg);
            if (!m)
                return `${old}_${step}`;
            return old.replace(reg, (_, n) => `_${parseInt(n, 10) + step}`);
        }, check: () => Promise.resolve(true), postfixReg: /\.\w+$/ }, (options || {}));
    const { generate, check, postfixReg } = opts;
    return exports.withPostfix({
        str: name,
        reg: postfixReg,
        fn: (baseName, getFullName) => {
            const go = (fileName, step) => {
                return Promise.resolve(check(getFullName(fileName)))
                    .then(pass => {
                    if (pass)
                        return fileName;
                    return go(generate(fileName, step), step);
                });
            };
            return go(baseName, 1);
        }
    });
};
exports.objFilter = (filter, obj) => {
    return Object.keys(obj).reduce((prev, key, i) => {
        if (filter(obj[key], key, i)) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
};
function throttle(fn, timeout) {
    let lastTime = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastTime < timeout)
            return;
        lastTime = now;
        return fn(...args);
    };
}
exports.throttle = throttle;
exports.retry = (fn, options) => (...args) => {
    const { timeout, onFirstFail, onFinal, shouldRetry, retryInterval } = Object.assign({ timeout: 5000, retryInterval: 1000, onFirstFail: (() => { }), onFinal: (() => { }), shouldRetry: (e) => false }, options);
    let retryCount = 0;
    let lastError;
    let timerToClear;
    let done = false;
    const wrappedOnFinal = (...args) => {
        done = true;
        if (timerToClear) {
            clearTimeout(timerToClear);
        }
        return onFinal(...args);
    };
    const intervalMan = (function () {
        let lastInterval;
        const intervalFactory = (function () {
            switch (typeof retryInterval) {
                case 'function':
                    return retryInterval;
                case 'number':
                    return ((retryCount, lastInterval) => retryInterval);
                default:
                    throw new Error('retryInterval must be either a number or a function');
            }
        })();
        return {
            getLastInterval: () => lastInterval,
            getInterval: () => {
                const interval = intervalFactory(retryCount, lastInterval);
                lastInterval = interval;
                return interval;
            }
        };
    })();
    const onError = (e, _throwErr) => {
        const throwErr = _throwErr || ((e) => Promise.reject(e));
        if (retryCount === 0) {
            onFirstFail(e);
        }
        return new Promise(resolve => {
            resolve(shouldRetry(e));
        })
            .then((should) => {
            if (!should) {
                wrappedOnFinal(e);
                return throwErr(e);
            }
            lastError = e;
            const p = new Promise((resolve, reject) => {
                if (retryCount++ === 0) {
                    timerToClear = setTimeout(() => {
                        wrappedOnFinal(lastError);
                        reject(lastError);
                    }, timeout);
                }
                if (done)
                    return;
                exports.delay(run, intervalMan.getInterval())
                    .then(resolve, (e) => resolve(onError(e, (err) => reject(e))));
            });
            return p;
        });
    };
    const run = () => {
        return new Promise((resolve, reject) => {
            try {
                const res = fn(...args, {
                    retryCount,
                    retryInterval: intervalMan.getLastInterval()
                });
                resolve(res);
            }
            catch (e) {
                reject(e);
            }
        })
            .catch(onError);
    };
    return run()
        .then((result) => {
        wrappedOnFinal(null, result);
        return result;
    });
};
function retryWithCount(options, fn) {
    let n = 0;
    return exports.retry(fn, {
        timeout: 99999,
        retryInterval: options.interval,
        shouldRetry: () => ++n <= options.count
    });
}
exports.retryWithCount = retryWithCount;
function flow(...fns) {
    const result = new Array(fns.length);
    const finalPromise = fns.reduce((prev, fn, i) => {
        return prev.then((res) => {
            if (i > 0) {
                result[i - 1] = res;
            }
            return fn(res);
        });
    }, Promise.resolve());
    return finalPromise.then((res) => {
        result[fns.length - 1] = res;
        return result;
    });
}
exports.flow = flow;
function guardVoidPromise(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            try {
                resolve(fn(...args));
            }
            catch (e) {
                reject(e);
            }
        })
            .then(() => { }, (e) => {
            log_1.default.error(e);
        });
    };
}
exports.guardVoidPromise = guardVoidPromise;
function parseBoolLike(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return !!value;
    }
    if (value === undefined) {
        return fallback;
    }
    try {
        const val = JSON.parse(value.toLowerCase());
        return !!val;
    }
    catch (e) {
        return fallback;
    }
}
exports.parseBoolLike = parseBoolLike;
function strictParseBoolLike(value) {
    if (typeof value === 'boolean') {
        return value;
    }
    const result = JSON.parse(value.toLowerCase());
    if (typeof result !== 'boolean') {
        throw new Error('Not a boolean');
    }
    return result;
}
exports.strictParseBoolLike = strictParseBoolLike;
function sum(...list) {
    return list.reduce((x, y) => x + y, 0);
}
exports.sum = sum;
function concatUint8Array(...arrays) {
    const totalLength = sum(...arrays.map(arr => arr.length));
    const result = new Uint8Array(totalLength);
    for (let i = 0, offset = 0, len = arrays.length; i < len; i += 1) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }
    return result;
}
exports.concatUint8Array = concatUint8Array;
function withPromise(factory) {
    return new Promise((resolve) => {
        resolve(factory());
    });
}
exports.withPromise = withPromise;
function clone(data) {
    if (data === undefined)
        return undefined;
    return JSON.parse(JSON.stringify(data));
}
exports.clone = clone;
exports.objMap = (fn, obj) => {
    const keys = typeof obj === 'object' ? Object.keys(obj) : [];
    return keys.reduce((prev, key, i) => {
        prev[key] = fn(obj[key], key, i, obj);
        return prev;
    }, {});
};
function milliSecondsToStringInSecond(ms) {
    return (ms / 1000).toFixed(2) + 's';
}
exports.milliSecondsToStringInSecond = milliSecondsToStringInSecond;
exports.concurrent = function (max) {
    var queue = [];
    var running = 0;
    var free = function () {
        running--;
        check();
    };
    const check = function () {
        if (running >= max || queue.length <= 0)
            return;
        var tuple = queue.shift();
        var resolve = tuple.resolve;
        running++;
        resolve(free);
    };
    const wait = function () {
        return new Promise(function (resolve, reject) {
            queue.push({ resolve, reject });
            check();
        });
    };
    const wrap = function (fn, context) {
        return function () {
            const args = [].slice.apply(arguments);
            return wait()
                .then(function (done) {
                return fn.apply(context, args)
                    .then(function (ret) {
                    done();
                    return ret;
                }, function (error) {
                    done();
                    throw error;
                });
            });
        };
    };
    return wrap;
};
function errorClassFactory(name) {
    return class extends Error {
        constructor(...args) {
            super(...args);
            this.code = name;
            if (this.message) {
                this.message = name + ': ' + this.message;
            }
            else {
                this.message = name;
            }
        }
    };
}
exports.errorClassFactory = errorClassFactory;
function treeMap(mapper, tree, paths = []) {
    return Object.assign(Object.assign({}, mapper(tree, paths)), { children: tree.children.map((subnode, i) => {
            return treeMap(mapper, subnode, [...paths, i]);
        }) });
}
exports.treeMap = treeMap;
function treeFilter(predicate, tree, paths = []) {
    if (predicate(tree, paths)) {
        return tree;
    }
    const children = tree.children.map((subnode, i) => {
        return treeFilter(predicate, subnode, [...paths, i]);
    });
    const validChildren = children.filter((item) => item);
    return validChildren.length === 0 ? null : Object.assign(Object.assign({}, tree), { children: validChildren });
}
exports.treeFilter = treeFilter;
function treeSlice(max, tree) {
    let root = null;
    let count = 0;
    traverseTree((data, paths) => {
        if (++count > max) {
            return TraverseTreeResult.Stop;
        }
        if (paths.length === 0) {
            root = Object.assign(Object.assign({}, data), { children: [] });
        }
        else {
            const finalIndex = paths[paths.length - 1];
            const parent = paths.slice(0, -1).reduce((node, index) => {
                return node.children[index];
            }, root);
            parent.children[finalIndex] = Object.assign(Object.assign({}, data), { children: [] });
        }
        return TraverseTreeResult.Normal;
    }, tree);
    return root;
}
exports.treeSlice = treeSlice;
function forestSlice(max, forest) {
    const newTree = { children: forest };
    const result = treeSlice(max + 1, newTree);
    return result ? result.children : [];
}
exports.forestSlice = forestSlice;
function isTreeEqual(isNodeEqual, a, b) {
    const aChildren = a.children || [];
    const bChildren = b.children || [];
    const alen = aChildren.length;
    const blen = bChildren.length;
    if (alen !== blen) {
        return false;
    }
    if (!isNodeEqual(a, b)) {
        return false;
    }
    for (let i = 0; i < alen; i++) {
        if (!isTreeEqual(isNodeEqual, a.children[i], b.children[i])) {
            return false;
        }
    }
    return true;
}
exports.isTreeEqual = isTreeEqual;
function isForestEqual(isNodeEqual, a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0, len = a.length; i < len; i++) {
        if (!isTreeEqual(isNodeEqual, a[i], b[i])) {
            return false;
        }
    }
    return true;
}
exports.isForestEqual = isForestEqual;
function nodeCount(tree) {
    let count = 0;
    traverseTree(() => {
        count++;
        return TraverseTreeResult.Normal;
    }, tree);
    return count;
}
exports.nodeCount = nodeCount;
var TraverseTreeResult;
(function (TraverseTreeResult) {
    TraverseTreeResult[TraverseTreeResult["Normal"] = 0] = "Normal";
    TraverseTreeResult[TraverseTreeResult["Skip"] = 1] = "Skip";
    TraverseTreeResult[TraverseTreeResult["Stop"] = 2] = "Stop";
})(TraverseTreeResult = exports.TraverseTreeResult || (exports.TraverseTreeResult = {}));
function traverseTree(fn, node, paths = []) {
    const intent = fn(node, paths);
    if (intent !== TraverseTreeResult.Normal) {
        return intent;
    }
    const childCount = node.children ? node.children.length : 0;
    const children = node.children || [];
    for (let i = 0; i < childCount; i++) {
        if (traverseTree(fn, children[i], [...paths, i]) === TraverseTreeResult.Stop) {
            return TraverseTreeResult.Stop;
        }
    }
    return TraverseTreeResult.Normal;
}
exports.traverseTree = traverseTree;
function pathsInNode(predicate, root) {
    let result = null;
    traverseTree((node, paths) => {
        if (predicate(node, paths)) {
            result = paths;
            return TraverseTreeResult.Stop;
        }
        return TraverseTreeResult.Normal;
    }, root);
    return result ? result : null;
}
exports.pathsInNode = pathsInNode;
function ancestorsInNode(predicate, root) {
    const paths = pathsInNode(predicate, root);
    if (paths === null) {
        return null;
    }
    const ancestorPaths = paths.slice(0, -1);
    const keys = addInBetween('children', ancestorPaths);
    return ancestorPaths.map((_, index) => {
        const subKeys = keys.slice(0, index * 2 + 1);
        return exports.getIn(subKeys, root.children);
    });
}
exports.ancestorsInNode = ancestorsInNode;
function pathsInNodeList(predicate, nodes) {
    for (let i = 0, len = nodes.length; i < len; i++) {
        const paths = pathsInNode(predicate, nodes[i]);
        if (paths !== null) {
            return [i, ...paths];
        }
    }
    return null;
}
exports.pathsInNodeList = pathsInNodeList;
function ancestorsInNodesList(predicate, nodes) {
    for (let i = 0, len = nodes.length; i < len; i++) {
        const ancestors = ancestorsInNode(predicate, nodes[i]);
        if (ancestors !== null) {
            return [nodes[i], ...ancestors];
        }
    }
    return null;
}
exports.ancestorsInNodesList = ancestorsInNodesList;
function flattenTreeWithPaths(tree) {
    const result = [];
    traverseTree((node, paths) => {
        result.push({
            paths,
            node: exports.without(['children'], node),
        });
        return TraverseTreeResult.Normal;
    }, tree);
    return result;
}
exports.flattenTreeWithPaths = flattenTreeWithPaths;
function flatternTree(tree) {
    return flattenTreeWithPaths(tree).map(item => item.node);
}
exports.flatternTree = flatternTree;
function findNodeInTree(predicate, tree) {
    let result = null;
    traverseTree((node, paths) => {
        if (predicate(node, paths)) {
            result = node;
            return TraverseTreeResult.Stop;
        }
        return TraverseTreeResult.Normal;
    }, tree);
    return result;
}
exports.findNodeInTree = findNodeInTree;
function findNodeInForest(predicate, forest) {
    for (let i = 0, len = forest.length; i < len; i++) {
        const result = findNodeInTree(predicate, forest[i]);
        if (result) {
            return result;
        }
    }
    return null;
}
exports.findNodeInForest = findNodeInForest;
function toArray(list) {
    return Array.isArray(list) ? list : [list];
}
exports.toArray = toArray;
function nodeByOffset(params) {
    const { tree, isTargetQualified, isCandidateQualified, offset } = params;
    if (Math.floor(offset) !== offset) {
        throw new Error(`offset must be integer. It's now ${offset}`);
    }
    let ret = null;
    const trees = toArray(tree);
    const cache = [];
    const maxCache = 1 + Math.ceil(Math.abs(offset));
    // Note: if offset is negative, which means you're looking for some item ahead,
    // we can get it from cache. Otherwise, use offsetLeft as counter until we reach the item.
    // So `found` could only be tree if `offset` is a positive integer
    let offsetLeft = Math.max(0, offset);
    let found = false;
    for (let i = 0, len = trees.length; i < len; i++) {
        const traverseResult = traverseTree((node, paths) => {
            const qualified = isCandidateQualified(node, paths);
            if (!qualified) {
                return TraverseTreeResult.Normal;
            }
            if (offset < 0) {
                cache.push(node);
                if (cache.length > maxCache) {
                    cache.shift();
                }
            }
            if (offset > 0 && found) {
                offsetLeft -= 1;
                if (offsetLeft === 0) {
                    ret = node;
                    return TraverseTreeResult.Stop;
                }
            }
            if (isTargetQualified(node, paths)) {
                if (offset <= 0) {
                    const index = cache.length - 1 + offset;
                    ret = index >= 0 ? cache[index] : null;
                    return TraverseTreeResult.Stop;
                }
                else {
                    found = true;
                }
            }
            return TraverseTreeResult.Normal;
        }, trees[i]);
        if (traverseResult === TraverseTreeResult.Stop) {
            break;
        }
    }
    return ret;
}
exports.nodeByOffset = nodeByOffset;
function pointToFitRect(data) {
    const { bound, size, point } = data;
    const lBorder = bound.x;
    const rBorder = bound.x + bound.width;
    const tBorder = bound.y;
    const bBorder = bound.y + bound.height;
    const x = (() => {
        if (point.x + size.width <= rBorder) {
            return point.x;
        }
        if (point.x - size.width >= lBorder) {
            return point.x - size.width;
        }
        return rBorder - size.width;
    })();
    const y = (() => {
        if (point.y + size.height <= bBorder) {
            return point.y;
        }
        if (point.y - size.height >= tBorder) {
            return point.y - size.height;
        }
        return bBorder - size.height;
    })();
    return { x, y };
}
exports.pointToFitRect = pointToFitRect;
function addInBetween(item, list) {
    const result = [];
    for (let i = 0, len = list.length; i < len; i++) {
        if (i !== 0) {
            result.push(item);
        }
        result.push(list[i]);
    }
    return result;
}
exports.addInBetween = addInBetween;
function normalizeHtmlId(str) {
    return str.replace(/[^A-Za-z0-9_-]/g, '_');
}
exports.normalizeHtmlId = normalizeHtmlId;
exports.unique = (list, getKey) => {
    let cache = {};
    const result = list.reduce((prev, cur) => {
        const key = getKey(cur);
        if (!cache[key]) {
            cache[key] = true;
            prev.push(cur);
        }
        return prev;
    }, []);
    return result;
};
exports.uniqueStrings = (...list) => {
    return exports.unique(list, x => x);
};
function consecutive(c) {
    if (typeof c === 'boolean') {
        return {
            interval: 0,
            count: c ? 1 : 0
        };
    }
    return c;
}
exports.consecutive = consecutive;
const timeout = (duration) => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};
function withConsecutive(c, fn) {
    const { interval, count } = consecutive(c);
    let counter = count;
    const next = (pass) => {
        if (!pass)
            throw new Error('failed to run consecutive');
        if (counter-- <= 0)
            return Promise.resolve(true);
        return timeout(interval || 0).then(fn).then(next);
    };
    return fn()
        .then(next);
}
exports.withConsecutive = withConsecutive;
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            try {
                const text = readerEvent.target.result;
                resolve(text);
            }
            catch (e) {
                reject(e);
            }
        };
        reader.readAsText(file);
    });
}
exports.readFileAsText = readFileAsText;
function assertExhausted(_, msg) {
    throw new Error('switch case not exhausted' + (msg ? (': ' + msg) : ''));
}
exports.assertExhausted = assertExhausted;
function pad2digits(n) {
    if (n >= 0 && n < 10) {
        return '0' + n;
    }
    return '' + n;
}
exports.pad2digits = pad2digits;
function repeatStr(n, str) {
    let s = '';
    for (let i = 0; i < n; i++) {
        s += str;
    }
    return s;
}
exports.repeatStr = repeatStr;
function isMac() {
    const userAgent = window.navigator.userAgent;
    return !!/macintosh/i.test(userAgent) || (/mac os x/i.test(userAgent) && !/like mac os x/i.test(userAgent));
}
exports.isMac = isMac;
function resolvePath(path, basePath, relativePath) {
    const dirPath = path.dirname(basePath);
    relativePath = relativePath.replace(/\\/g, '/');
    if (relativePath.indexOf('/') === 0) {
        return path.normalize(relativePath).replace(/^(\/|\\)/, '');
    }
    else {
        return path.join(dirPath, relativePath);
    }
}
exports.resolvePath = resolvePath;
function countDown(options) {
    const { interval, timeout, onTick, onTimeout } = options;
    let past = 0;
    const timer = setInterval(() => {
        past += interval;
        try {
            onTick({ past, total: timeout });
        }
        catch (e) {
            console.warn(e);
        }
        if (past >= timeout) {
            clearInterval(timer);
            if (typeof onTimeout === 'function') {
                try {
                    onTimeout({ past, total: timeout });
                }
                catch (e) {
                    console.warn(e);
                }
            }
        }
    }, options.interval);
    return () => clearInterval(timer);
}
exports.countDown = countDown;
exports.withCountDown = (options) => {
    const { interval, timeout, onTick } = options;
    let past = 0;
    return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
            past += interval;
            try {
                onTick({ cancel, past, total: timeout });
            }
            catch (e) {
                console.error(e);
            }
            if (past >= timeout)
                clearInterval(timer);
        }, interval);
        const cancel = () => clearInterval(timer);
        const p = exports.delay(() => { }, timeout)
            .then(() => clearInterval(timer));
        resolve(p);
    });
};
function urlWithQueries(url, queries = {}) {
    const hasQuery = Object.keys(queries).length > 0;
    if (!hasQuery) {
        return url;
    }
    const queryStr = Object.keys(queries).map(key => { var _a; return `${encodeURIComponent(key)}=${encodeURIComponent((_a = queries[key]) === null || _a === void 0 ? void 0 : _a.toString())}`; }).join('&');
    return `${url}?${queryStr}`;
}
exports.urlWithQueries = urlWithQueries;
function throttlePromiseFunc(fn, interval) {
    if (interval <= 0) {
        throw new Error("Interval must be positive number");
    }
    let p = Promise.resolve();
    const generatedFunc = (...args) => {
        const ret = p.then(() => {
            console.log("in generatedFunc...", args);
            return fn(...args);
        });
        p = ret.then(() => exports.delay(() => { }, interval), () => exports.delay(() => { }, interval));
        return ret;
    };
    return generatedFunc;
}
exports.throttlePromiseFunc = throttlePromiseFunc;


/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

var _require = __webpack_require__(4),
    retry = _require.retry;

var TO_BE_REMOVED = false;

var log = function log(msg) {
  if (console && console.log) console.log(msg);
};

var transformError = function transformError(err) {
  if (err instanceof Error) {
    return {
      isError: true,
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  return err;
};

// Note: The whole idea of ipc promise is about transforming the callback style
// ipc communication API to a Promise style
//
// eg. Orignial:    `chrome.runtime.sendMessage({}, () => {})`
//     ipcPromise:  `ipc.ask({}).then(() => {})`
//
// The benifit is
// 1. You can chain this promise with others
// 2. Create kind of connected channels between two ipc ends
//
// This is a generic interface to define a ipc promise utility
// All you need to declare is 4 functions
//
// e.g.
// ```
// ipcPromise({
//   ask: function (uid, cmd, args) { ... },
//   answer: function (uid, err, data) { ... },
//   onAsk: function (fn) { ... },
//   onAnswer: function (fn) { ... },
// })
// ```
function ipcPromise(options) {
  var ask = options.ask;
  var answer = options.answer;
  var timeout = options.timeout;
  var onAnswer = options.onAnswer;
  var onAsk = options.onAsk;
  var userDestroy = options.destroy;
  var checkReady = options.checkReady || function () {
    return Promise.resolve(true);
  };

  var nid = 0;
  var askCache = {};
  var unhandledAsk = [];
  var markUnhandled = function markUnhandled(uid, cmd, args) {
    unhandledAsk.push({ uid: uid, cmd: cmd, args: args });
  };
  var handler = markUnhandled;

  var getNextNid = function getNextNid() {
    nid = (nid + 1) % 100000;
    return nid;
  };

  var runHandlers = function runHandlers(handlers, cmd, args, resolve, reject) {
    for (var i = 0, len = handlers.length; i < len; i++) {
      var res;

      try {
        res = handlers[i](cmd, args);
      } catch (e) {
        return reject(e);
      }

      if (res !== undefined) {
        return resolve(res);
      }
    }
    // Note: DO NOT resolve anything if all handlers return undefined
  };

  // both for ask and unhandledAsk
  timeout = timeout || -1;

  onAnswer(function (uid, err, data) {
    if (uid && askCache[uid] === TO_BE_REMOVED) {
      delete askCache[uid];
      return;
    }

    if (!uid || !askCache[uid]) {
      // log('ipcPromise: response uid invalid: ' + uid);
      return;
    }

    var resolve = askCache[uid][0];
    var reject = askCache[uid][1];

    delete askCache[uid];

    if (err) {
      reject(transformError(err));
    } else {
      resolve(data);
    }
  });

  onAsk(function (uid, cmd, args) {
    if (timeout > 0) {
      setTimeout(function () {
        var found = unhandledAsk && unhandledAsk.find(function (item) {
          return item.uid === uid;
        });

        if (!found) return;

        answer(uid, new Error('ipcPromise: answer timeout ' + timeout + ' for cmd "' + cmd + '", args "' + args + '"'));
      }, timeout);
    }

    if (handler === markUnhandled) {
      markUnhandled(uid, cmd, args);
      return;
    }

    return new Promise(function (resolve, reject) {
      runHandlers(handler, cmd, args, resolve, reject);
    }).then(function (data) {
      // note: handler doens't handle the cmd => return undefined, should wait for timeout
      if (data === undefined) return markUnhandled(uid, cmd, args);
      answer(uid, null, data);
    }, function (err) {
      answer(uid, transformError(err), null);
    });
  });

  var wrapAsk = function wrapAsk(cmd, args, timeoutToOverride) {
    var uid = 'ipcp_' + new Date() * 1 + '_' + getNextNid();
    var finalTimeout = timeoutToOverride || timeout;
    var timer;

    // Note: make it possible to disable timeout
    if (finalTimeout > 0) {
      timer = setTimeout(function () {
        var reject;

        if (askCache && askCache[uid]) {
          reject = askCache[uid][1];
          askCache[uid] = TO_BE_REMOVED;
          reject(new Error('ipcPromise: onAsk timeout ' + finalTimeout + ' for cmd "' + cmd + '", args "' + args + '"'));
        }
      }, finalTimeout);
    }

    return new Promise(function (resolve, reject) {
      askCache[uid] = [resolve, reject];

      Promise.resolve(ask(uid, cmd, args || [])).catch(function (e) {
        reject(e);
      });
    }).then(function (data) {
      if (timer) {
        clearTimeout(timer);
      }
      return data;
    }, function (e) {
      if (timer) {
        clearTimeout(timer);
      }
      throw e;
    });
  };

  var wrapOnAsk = function wrapOnAsk(fn) {
    if (Array.isArray(handler)) {
      handler.push(fn);
    } else {
      handler = [fn];
    }

    var ps = unhandledAsk.map(function (task) {
      return new Promise(function (resolve, reject) {
        runHandlers(handler, task.cmd, task.args, resolve, reject);
      }).then(function (data) {
        // note: handler doens't handle the cmd => return undefined, should wait for timeout
        if (data === undefined) return;
        answer(task.uid, null, data);
        return task.uid;
      }, function (err) {
        answer(task.uid, err, null);
        return task.uid;
      });
    });

    Promise.all(ps).then(function (uids) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = uids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var uid = _step.value;

          if (uid === undefined) continue;

          var index = unhandledAsk.findIndex(function (item) {
            return item.uid === uid;
          });

          unhandledAsk.splice(index, 1);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  };

  var destroy = function destroy(noReject) {
    userDestroy && userDestroy();

    ask = null;
    answer = null;
    onAnswer = null;
    onAsk = null;
    unhandledAsk = null;

    if (!noReject) {
      Object.keys(askCache).forEach(function (uid) {
        var tuple = askCache[uid];
        var reject = tuple[1];
        reject && reject(new Error('IPC Promise has been Destroyed.'));
        delete askCache[uid];
      });
    }
  };

  var waitForReady = function waitForReady(checkReady, fn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var makeSureReady = retry(checkReady, {
        shouldRetry: function shouldRetry() {
          return true;
        },
        retryInterval: 100,
        timeout: 5000
      });

      return makeSureReady().then(function () {
        return fn.apply(undefined, args);
      });
    };
  };

  return {
    ask: waitForReady(checkReady, wrapAsk),
    onAsk: wrapOnAsk,
    destroy: destroy
  };
}

ipcPromise.serialize = function (obj) {
  return {
    ask: function ask(cmd, args, timeout) {
      return obj.ask(cmd, JSON.stringify(args), timeout);
    },

    onAsk: function onAsk(fn) {
      return obj.onAsk(function (cmd, args) {
        return fn(cmd, JSON.parse(args));
      });
    },

    destroy: obj.destroy
  };
};

module.exports = ipcPromise;

/***/ }),

/***/ 369:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function consecutive(c) {
    if (typeof c === 'boolean') {
        return {
            interval: 0,
            count: c ? 1 : 0
        };
    }
    return c;
}
exports.consecutive = consecutive;
const timeout = (duration) => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};
function withConsecutive(c, fn) {
    const { interval, count } = consecutive(c);
    let counter = count;
    const next = (pass) => {
        if (!pass)
            throw new Error('failed to run consecutive');
        if (counter-- <= 0)
            return Promise.resolve(true);
        return timeout(interval).then(fn).then(next);
    };
    return fn()
        .then(next);
}
exports.withConsecutive = withConsecutive;


/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "until", function() { return until; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "partial", function() { return partial; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduceRight", function() { return reduceRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return compose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateIn", function() { return updateIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setIn", function() { return setIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIn", function() { return getIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pick", function() { return pick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uid", function() { return uid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitIntoTwo", function() { return splitIntoTwo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cn", function() { return cn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objMap", function() { return objMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatDate", function() { return formatDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "splitKeep", function() { return splitKeep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nameFactory", function() { return nameFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "composePromiseFn", function() { return composePromiseFn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseQuery", function() { return parseQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRegExp", function() { return toRegExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertScript", function() { return insertScript; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withTimeout", function() { return withTimeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "retry", function() { return retry; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dataURItoArrayBuffer", function() { return dataURItoArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dataURItoBlob", function() { return dataURItoBlob; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blobToDataURL", function() { return blobToDataURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blobToText", function() { return blobToText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arrayBufferToString", function() { return arrayBufferToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringToArrayBuffer", function() { return stringToArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomName", function() { return randomName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withFileExtension", function() { return withFileExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uniqueName", function() { return uniqueName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "and", function() { return and; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadCsv", function() { return loadCsv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadImage", function() { return loadImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureExtName", function() { return ensureExtName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateStandardName", function() { return validateStandardName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeFileName", function() { return sanitizeFileName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getScreenDpi", function() { return getScreenDpi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dpiFromFileName", function() { return dpiFromFileName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mockAPIWith", function() { return mockAPIWith; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindOnce", function() { return bindOnce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return bind; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// delay the call of a function and return a promise
var delay = function delay(fn, timeout) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, timeout);
  });
};

// Poll on whatever you want to check, and will time out after a specific duration
// `check` should return `{ pass: Boolean, result: Any }`
// `name` is for a meaningful error message
var until = function until(name, check) {
  var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var expire = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;
  var errorMsg = arguments[4];

  var start = new Date();
  var go = function go() {
    if (expire && new Date() - start >= expire) {
      var msg = errorMsg || 'until: ' + name + ' expired!';
      throw new Error(msg);
    }

    var _check = check(),
        pass = _check.pass,
        result = _check.result;

    if (pass) return Promise.resolve(result);
    return delay(go, interval);
  };

  return new Promise(function (resolve, reject) {
    try {
      resolve(go());
    } catch (e) {
      reject(e);
    }
  });
};

var range = function range(start, end) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var ret = [];

  for (var i = start; i < end; i += step) {
    ret.push(i);
  }

  return ret;
};

// create a curry version of the passed in function
var partial = function partial(fn) {
  var len = fn.length;
  var _arbitary = void 0;

  _arbitary = function arbitary(curArgs, leftArgCnt) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length >= leftArgCnt) {
        return fn.apply(null, curArgs.concat(args));
      }

      return _arbitary(curArgs.concat(args), leftArgCnt - args.length);
    };
  };

  return _arbitary([], len);
};

var reduceRight = function reduceRight(fn, initial, list) {
  var ret = initial;

  for (var i = list.length - 1; i >= 0; i--) {
    ret = fn(list[i], ret);
  }

  return ret;
};

// compose functions into one
var compose = function compose() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return reduceRight(function (cur, prev) {
    return function (x) {
      return cur(prev(x));
    };
  }, function (x) {
    return x;
  }, args);
};

var map = partial(function (fn, list) {
  var result = [];

  for (var i = 0, len = list.length; i < len; i++) {
    result.push(fn(list[i]));
  }

  return result;
});

var on = partial(function (key, fn, dict) {
  if (Array.isArray(dict)) {
    return [].concat(_toConsumableArray(dict.slice(0, key)), [fn(dict[key])], _toConsumableArray(dict.slice(key + 1)));
  }

  return _extends({}, dict, _defineProperty({}, key, fn(dict[key])));
});

// immutably update any part in an object
var updateIn = partial(function (keys, fn, obj) {
  var updater = compose.apply(null, keys.map(function (key) {
    return key === '[]' ? map : on(key);
  }));
  return updater(fn)(obj);
});

// immutably set any part in an object
// a restricted version of updateIn
var setIn = partial(function (keys, value, obj) {
  var updater = compose.apply(null, keys.map(function (key) {
    return key === '[]' ? map : on(key);
  }));
  return updater(function () {
    return value;
  })(obj);
});

// return part of the object with a few keys deep inside
var getIn = partial(function (keys, obj) {
  return keys.reduce(function (prev, key) {
    if (!prev) return prev;
    return prev[key];
  }, obj);
});

// return the passed in object with only certains keys
var pick = function pick(keys, obj) {
  return keys.reduce(function (prev, key) {
    if (obj[key] !== undefined) {
      prev[key] = obj[key];
    }
    return prev;
  }, {});
};

var uid = function uid() {
  return '' + new Date() * 1 + '.' + Math.floor(Math.random() * 10000000).toString(16);
};

var flatten = function flatten(list) {
  return [].concat.apply([], list);
};

var splitIntoTwo = function splitIntoTwo(pattern, str) {
  var index = str.indexOf(pattern);
  if (index === -1) return [str];

  return [str.substr(0, index), str.substr(index + 1)];
};

var cn = function cn() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return args.reduce(function (prev, cur) {
    if (typeof cur === 'string') {
      prev.push(cur);
    } else {
      Object.keys(cur).forEach(function (key) {
        if (cur[key]) {
          prev.push(key);
        }
      });
    }

    return prev;
  }, []).join(' ');
};

var objMap = function objMap(fn, obj) {
  return Object.keys(obj).reduce(function (prev, key, i) {
    prev[key] = fn(obj[key], key, i);
    return prev;
  }, {});
};

var formatDate = function formatDate(d) {
  var pad = function pad(n) {
    return n >= 10 ? '' + n : '0' + n;
  };
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(pad).join('-');
};

var splitKeep = function splitKeep(pattern, str) {
  var result = [];
  var startIndex = 0;
  var reg = void 0,
      match = void 0,
      lastMatchIndex = void 0;

  if (pattern instanceof RegExp) {
    reg = new RegExp(pattern, pattern.flags.indexOf('g') !== -1 ? pattern.flags : pattern.flags + 'g');
  } else if (typeof pattern === 'string') {
    reg = new RegExp(pattern, 'g');
  }

  // eslint-disable-next-line no-cond-assign
  while (match = reg.exec(str)) {
    if (lastMatchIndex === match.index) {
      break;
    }

    if (match.index > startIndex) {
      result.push(str.substring(startIndex, match.index));
    }

    result.push(match[0]);
    startIndex = match.index + match[0].length;
    lastMatchIndex = match.index;
  }

  if (startIndex < str.length) {
    result.push(str.substr(startIndex));
  }

  return result;
};

var nameFactory = function nameFactory() {
  var all = {};

  return function (str) {
    if (!all[str]) {
      all[str] = true;
      return str;
    }

    var n = 2;
    while (all[str + '-' + n]) {
      n++;
    }

    all[str + '-' + n] = true;
    return str + '-' + n;
  };
};

var composePromiseFn = function composePromiseFn() {
  for (var _len4 = arguments.length, list = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    list[_key4] = arguments[_key4];
  }

  return reduceRight(function (cur, prev) {
    return function (x) {
      return prev(x).then(cur);
    };
  }, function (x) {
    return Promise.resolve(x);
  }, list);
};

var parseQuery = function parseQuery(query) {
  return query.slice(1).split('&').reduce(function (prev, cur) {
    var index = cur.indexOf('=');
    var key = cur.substring(0, index);
    var val = cur.substring(index + 1);

    prev[key] = decodeURIComponent(val);
    return prev;
  }, {});
};

var toRegExp = function toRegExp(str) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$needEncode = _ref.needEncode,
      needEncode = _ref$needEncode === undefined ? false : _ref$needEncode,
      _ref$flag = _ref.flag,
      flag = _ref$flag === undefined ? '' : _ref$flag;

  return new RegExp(needEncode ? str.replace(/[[\](){}^$.*+?|]/g, '\\$&') : str, flag);
};

var insertScript = function insertScript(file) {
  var s = document.constructor.prototype.createElement.call(document, 'script');

  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);

  document.documentElement.appendChild(s);
  s.parentNode.removeChild(s);
};

var withTimeout = function withTimeout(timeout, fn) {
  return new Promise(function (resolve, reject) {
    var cancel = function cancel() {
      return clearTimeout(timer);
    };
    var timer = setTimeout(function () {
      reject(new Error('timeout'));
    }, timeout);

    Promise.resolve(fn(cancel)).then(function (data) {
      cancel();
      resolve(data);
    }, function (e) {
      cancel();
      reject(e);
    });
  });
};

var retry = function retry(fn, options) {
  return function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var _timeout$retryInterva = _extends({
      timeout: 5000,
      retryInterval: 1000,
      onFirstFail: function onFirstFail() {},
      onFinal: function onFinal() {},
      shouldRetry: function shouldRetry() {
        return false;
      }
    }, options),
        timeout = _timeout$retryInterva.timeout,
        onFirstFail = _timeout$retryInterva.onFirstFail,
        onFinal = _timeout$retryInterva.onFinal,
        shouldRetry = _timeout$retryInterva.shouldRetry,
        retryInterval = _timeout$retryInterva.retryInterval;

    var retryCount = 0;
    var lastError = null;
    var timerToClear = null;
    var done = false;

    var wrappedOnFinal = function wrappedOnFinal() {
      done = true;

      if (timerToClear) {
        clearTimeout(timerToClear);
      }

      return onFinal.apply(undefined, arguments);
    };

    var intervalMan = function () {
      var lastInterval = null;
      var intervalFactory = function () {
        switch (typeof retryInterval === 'undefined' ? 'undefined' : _typeof(retryInterval)) {
          case 'function':
            return retryInterval;

          case 'number':
            return function () {
              return retryInterval;
            };

          default:
            throw new Error('retryInterval must be either a number or a function');
        }
      }();

      return {
        getLastInterval: function getLastInterval() {
          return lastInterval;
        },
        getInterval: function getInterval() {
          var interval = intervalFactory(retryCount, lastInterval);
          lastInterval = interval;
          return interval;
        }
      };
    }();

    var onError = function onError(e, reject) {
      if (!shouldRetry(e, retryCount)) {
        wrappedOnFinal(e);

        if (reject) return reject(e);else throw e;
      }
      lastError = e;

      return new Promise(function (resolve, reject) {
        if (retryCount++ === 0) {
          onFirstFail(e);
          timerToClear = setTimeout(function () {
            wrappedOnFinal(lastError);
            reject(lastError);
          }, timeout);
        }

        if (done) return;

        delay(run, intervalMan.getInterval()).then(resolve, function (e) {
          return onError(e, reject);
        });
      });
    };

    var run = function run() {
      return new Promise(function (resolve) {
        resolve(fn.apply(undefined, args.concat([{
          retryCount: retryCount,
          retryInterval: intervalMan.getLastInterval()
        }])));
      }).catch(onError);
    };

    return run().then(function (result) {
      wrappedOnFinal(null, result);
      return result;
    });
  };
};

// refer to https://stackoverflow.com/questions/12168909/blob-from-dataurl
function dataURItoArrayBuffer(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(/^data:/.test(dataURI) ? dataURI.split(',')[1] : dataURI);

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return ab;
}

function dataURItoBlob(dataURI) {
  var ab = dataURItoArrayBuffer(dataURI);
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

function blobToDataURL(blob) {
  var withBase64Prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function (e) {
      var str = reader.result;
      if (withBase64Prefix) return resolve(str);

      var b64 = 'base64,';
      var i = str.indexOf(b64);
      var ret = str.substr(i + b64.length);

      resolve(ret);
    };
    reader.readAsDataURL(blob);
  });
}

function blobToText(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function (e) {
      var str = reader.result;
      resolve(str);
    };
    reader.readAsText(blob);
  });
}

function arrayBufferToString(buf) {
  var decoder = new TextDecoder('utf-8');
  return decoder.decode(new Uint8Array(buf));
  // return String.fromCharCode.apply(null, new Uint16Array(buf))
}

function stringToArrayBuffer(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

var randomName = function randomName() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

  if (length <= 0 || length > 100) throw new Error('randomName, length must be between 1 and 100');

  var randomChar = function randomChar() {
    var n = Math.floor(62 * Math.random());
    var code = void 0;

    if (n <= 9) {
      code = 48 + n;
    } else if (n <= 35) {
      code = 65 + n - 10;
    } else {
      code = 97 + n - 36;
    }

    return String.fromCharCode(code);
  };

  return range(0, length).map(randomChar).join('').toLowerCase();
};

var withFileExtension = function withFileExtension(origName, fn) {
  var reg = /\.\w+$/;
  var m = origName.match(reg);

  var extName = m ? m[0] : '';
  var baseName = m ? origName.replace(reg, '') : origName;
  var result = fn(baseName, function (name) {
    return name + extName;
  });

  if (!result) {
    throw new Error('withFileExtension: should not return null/undefined');
  }

  if (typeof result.then === 'function') {
    return result.then(function (name) {
      return name + extName;
    });
  }

  return result + extName;
};

var uniqueName = function uniqueName(name, options) {
  var opts = _extends({
    generate: function generate(old) {
      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var reg = /_\((\d+)\)$/;
      var m = old.match(reg);

      if (!m) return old + '_(' + step + ')';
      return old.replace(reg, function (_, n) {
        return '_(' + (parseInt(n, 10) + step) + ')';
      });
    },
    check: function check() {
      return Promise.resolve(true);
    }
  }, options || {});
  var generate = opts.generate,
      check = opts.check;


  return withFileExtension(name, function (baseName, getFullName) {
    var go = function go(fileName, step) {
      return check(getFullName(fileName)).then(function (pass) {
        if (pass) return fileName;
        return go(generate(fileName, step), step);
      });
    };

    return go(baseName, 1);
  });
};

var and = function and() {
  for (var _len6 = arguments.length, list = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    list[_key6] = arguments[_key6];
  }

  return list.reduce(function (prev, cur) {
    return prev && cur;
  }, true);
};

var loadCsv = function loadCsv(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('failed to load csv - ' + url);
    return res.text();
  });
};

var loadImage = function loadImage(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('failed to load image - ' + url);
    return res.blob();
  });
};

var ensureExtName = function ensureExtName(ext, name) {
  var extName = ext.indexOf('.') === 0 ? ext : '.' + ext;
  if (name.lastIndexOf(extName) + extName.length === name.length) return name;
  return name + extName;
};

var validateStandardName = function validateStandardName(name, isFileName) {
  if (!isFileName && !/^_|[a-zA-Z]/.test(name)) {
    throw new Error('must start with a letter or the underscore character.');
  }

  if (isFileName && !/^_|[a-zA-Z0-9]/.test(name)) {
    throw new Error('must start with alpha-numeric or the underscore character.');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error('can only contain alpha-numeric characters and underscores (A-z, 0-9, and _ )');
  }
};

var sanitizeFileName = function sanitizeFileName(fileName) {
  return withFileExtension(fileName, function (baseName) {
    return baseName.replace(/[\\/:*?<>|]/g, '_');
  });
};

var getScreenDpi = function getScreenDpi() {
  var DEFAULT_DPI = 96;
  var matchDpi = function matchDpi(dpi) {
    return window.matchMedia('(max-resolution: ' + dpi + 'dpi)').matches === true;
  };

  // We iteratively scan all possible media query matches.
  // We can't use binary search, because there are "many" correct answer in
  // problem space and we need the very first match.
  // To speed up computation we divide problem space into buckets.
  // We test each bucket's first element and if we found a match,
  // we make a full scan for previous bucket with including first match.
  // Still, we could use "divide-and-conquer" for such problems.
  // Due to common DPI values, it's not worth to implement such algorithm.

  var bucketSize = 24; // common divisor for 72, 96, 120, 144 etc.

  for (var i = bucketSize; i < 3000; i += bucketSize) {
    if (matchDpi(i)) {
      var start = i - bucketSize;
      var end = i;

      for (var k = start; k <= end; ++k) {
        if (matchDpi(k)) {
          return k;
        }
      }
    }
  }

  return DEFAULT_DPI; // default fallback
};

var dpiFromFileName = function dpiFromFileName(fileName) {
  var reg = /_dpi_(\d+)/i;
  var m = fileName.match(reg);
  return m ? parseInt(m[1], 10) : 0;
};

var mockAPIWith = function mockAPIWith(factory, mock) {
  var promiseFunctionKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var real = mock;
  var exported = objMap(function (val, key) {
    if (typeof val === 'function') {
      if (promiseFunctionKeys.indexOf(key) !== -1) {
        return function () {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return p.then(function () {
            var _real;

            return (_real = real)[key].apply(_real, args);
          });
        };
      } else {
        return function () {
          var _real3;

          for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
          }

          p.then(function () {
            var _real2;

            return (_real2 = real)[key].apply(_real2, args);
          });
          return (_real3 = real)[key].apply(_real3, args);
        };
      }
    } else {
      return val;
    }
  }, mock);

  var p = Promise.resolve(factory()).then(function (api) {
    real = api;
  });

  return exported;
};

var bindOnce = function bindOnce(target, eventName, fn) {
  for (var _len9 = arguments.length, rest = Array(_len9 > 3 ? _len9 - 3 : 0), _key9 = 3; _key9 < _len9; _key9++) {
    rest[_key9 - 3] = arguments[_key9];
  }

  var wrapped = function wrapped() {
    try {
      target.removeEventListener.apply(target, [eventName, wrapped].concat(rest));
    } catch (e) {}

    return fn.apply(undefined, arguments);
  };

  target.addEventListener.apply(target, [eventName, wrapped].concat(rest));
};

var bind = function bind(target, eventName, fn) {
  for (var _len10 = arguments.length, rest = Array(_len10 > 3 ? _len10 - 3 : 0), _key10 = 3; _key10 < _len10; _key10++) {
    rest[_key10 - 3] = arguments[_key10];
  }

  target.addEventListener.apply(target, [eventName, fn].concat(rest));
};

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ts_utils_1 = __webpack_require__(12);
const consecutive_1 = __webpack_require__(369);
var IpcStatus;
(function (IpcStatus) {
    IpcStatus[IpcStatus["Off"] = 0] = "Off";
    IpcStatus[IpcStatus["On"] = 1] = "On";
})(IpcStatus || (IpcStatus = {}));
class IpcCache {
    constructor() {
        this.cache = {};
    }
    has(tabId, cuid) {
        const item = this.cache[tabId];
        return !!item && (!cuid || item.cuid == cuid);
    }
    get(tabId, timeout = 2000, before = Infinity) {
        return ts_utils_1.until('ipc by tab id', () => {
            const ipcObj = this.cache[tabId];
            const enabled = ipcObj && ipcObj.status === 1;
            const ipc = ipcObj && ipcObj.ipc;
            return {
                pass: enabled && !!ipc && (before === Infinity || before > ipcObj.timestamp),
                result: ipc
            };
        }, 100, timeout);
    }
    domReadyGet(tabId, timeout = 60 * 1000, c = true) {
        return ts_utils_1.retry(() => {
            return this.get(tabId)
                .then(ipc => {
                // Note: must respond to DOM READY for multiple times in line,
                // before we can be sure that it's ready
                return consecutive_1.withConsecutive(c, () => {
                    return ipc.ask('DOM_READY', {}, 1000)
                        .then(() => true, () => false);
                })
                    .then(() => ipc);
            });
        }, {
            timeout,
            retryInterval: 1000,
            shouldRetry: (e) => true
        })();
    }
    set(tabId, ipc, cuid) {
        this.cache[tabId] = {
            ipc,
            cuid,
            status: 1,
            timestamp: new Date().getTime()
        };
    }
    setStatus(tabId, status, updateTimestamp = false) {
        const found = this.cache[tabId];
        if (!found)
            return false;
        found.status = status;
        if (updateTimestamp) {
            found.timestamp = new Date().getTime();
        }
        return true;
    }
    enable(tabId) {
        return this.setStatus(tabId, 1, true);
    }
    disable(tabId) {
        return this.setStatus(tabId, 0);
    }
    getCuid(tabId) {
        const found = this.cache[tabId];
        if (!found)
            return null;
        return found.cuid;
    }
    del(tabId) {
        delete this.cache[tabId];
    }
}
exports.IpcCache = IpcCache;
exports.getIpcCache = ts_utils_1.singletonGetter(() => new IpcCache);


/***/ }),

/***/ 89:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openBgWithCs", function() { return openBgWithCs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csInit", function() { return csInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bgInit", function() { return bgInit; });
/* harmony import */ var _ipc_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(183);
/* harmony import */ var _ipc_promise__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ipc_promise__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ipc_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62);
/* harmony import */ var _ipc_cache__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ipc_cache__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _web_extension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var _web_extension__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_web_extension__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _log__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_log__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };







var TIMEOUT = -1;

// Note: `cuid` is a kind of unique id so that you can create multiple
// ipc promise instances between the same two end points
var openBgWithCs = function openBgWithCs(cuid) {
  var wrap = function wrap(str) {
    return str + '_' + cuid;
  };

  // factory function to generate ipc promise instance for background
  // `tabId` is needed to identify which tab to send messages to
  var ipcBg = function ipcBg(tabId) {
    var bgListeners = [];

    // `sender` contains tab info. Background may need this to store the corresponding
    // relationship between tabId and ipc instance
    var addSender = function addSender(obj, sender) {
      if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return obj;

      obj.sender = sender;
      return obj;
    };

    _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      if (req.type === wrap('CS_ANSWER_BG') || req.type === wrap('CS_ASK_BG')) {
        sendResponse(true);
      }

      bgListeners.forEach(function (listener) {
        return listener(req, sender);
      });
      return true;
    });

    return _ipc_promise__WEBPACK_IMPORTED_MODULE_0___default()({
      timeout: TIMEOUT,
      ask: function ask(uid, cmd, args) {
        return _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.tabs.sendMessage(tabId, {
          type: wrap('BG_ASK_CS'),
          uid: uid,
          cmd: cmd,
          args: args
        });
      },
      onAnswer: function onAnswer(fn) {
        bgListeners.push(function (req, sender) {
          if (req.type !== wrap('CS_ANSWER_BG')) return;
          fn(req.uid, req.err, addSender(req.data, sender));
        });
      },
      onAsk: function onAsk(fn) {
        bgListeners.push(function (req, sender) {
          if (req.type !== wrap('CS_ASK_BG')) return;
          fn(req.uid, req.cmd, addSender(req.args, sender));
        });
      },
      answer: function answer(uid, err, data) {
        return _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.tabs.sendMessage(tabId, {
          type: wrap('BG_ANSWER_CS'),
          uid: uid,
          err: err,
          data: data
        });
      },
      destroy: function destroy() {
        bgListeners = [];
      }
    });
  };

  // factory function to generate ipc promise for content scripts
  var ipcCs = function ipcCs(checkReady) {
    var csListeners = [];

    _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      if (req.type === wrap('BG_ANSWER_CS') || req.type === wrap('BG_ASK_CS')) {
        sendResponse(true);
      }

      csListeners.forEach(function (listener) {
        return listener(req, sender);
      });
      return true;
    });

    return _ipc_promise__WEBPACK_IMPORTED_MODULE_0___default()({
      timeout: TIMEOUT,
      checkReady: checkReady,
      ask: function ask(uid, cmd, args) {
        // log('cs ask', uid, cmd, args)
        return _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.sendMessage({
          type: wrap('CS_ASK_BG'),
          uid: uid,
          cmd: cmd,
          args: args
        });
      },
      onAnswer: function onAnswer(fn) {
        csListeners.push(function (req, sender) {
          if (req.type !== wrap('BG_ANSWER_CS')) return;
          fn(req.uid, req.err, req.data);
        });
      },
      onAsk: function onAsk(fn) {
        csListeners.push(function (req, sender) {
          if (req.type !== wrap('BG_ASK_CS')) return;
          fn(req.uid, req.cmd, req.args);
        });
      },
      answer: function answer(uid, err, data) {
        return _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.sendMessage({
          type: wrap('CS_ANSWER_BG'),
          uid: uid,
          err: err,
          data: data
        });
      },
      destroy: function destroy() {
        csListeners = [];
      }
    });
  };

  return {
    ipcCs: ipcCs,
    ipcBg: ipcBg
  };
};

// Helper function to init ipc promise instance for content scripts
// The idea here is to send CONNECT message to background when initializing
var csInit = function csInit() {
  var noRecover = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var cuid = '' + Math.floor(Math.random() * 10000);

  if (noRecover) {
    _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.sendMessage({
      type: 'CONNECT',
      cuid: cuid
    });
    return openBgWithCs(cuid).ipcCs();
  }

  _log__WEBPACK_IMPORTED_MODULE_3___default()('sending Connect...');

  // Note: Ext.extension.getURL is available in content script, but not injected js
  // We use it here to detect whether it is loaded by content script or injected
  // Calling runtime.sendMessage in injected js will cause an uncatchable exception
  if (!_web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.extension.getURL) return;

  // try this process in case we're in none-src frame
  try {
    // let connected     = false
    // const checkReady  = () => {
    //   if (connected)  return Promise.resolve(true)
    //   return Promise.reject(new Error('cs not connected with bg yet'))
    // }
    var reconnect = function reconnect() {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["withTimeout"])(500, function () {
        return _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.sendMessage({
          type: 'RECONNECT'
        }).then(function (cuid) {
          _log__WEBPACK_IMPORTED_MODULE_3___default()('got existing cuid', cuid);
          if (cuid) return openBgWithCs(cuid).ipcCs();
          throw new Error('failed to reconnect');
        });
      });
    };
    var connectBg = function connectBg() {
      return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["withTimeout"])(1000, function () {
        return _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.sendMessage({
          type: 'CONNECT',
          cuid: cuid
        }).then(function (done) {
          if (done) return openBgWithCs(cuid).ipcCs();
          throw new Error('not done');
        });
      });
    };
    var tryConnect = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["retry"])(connectBg, {
      shouldRetry: function shouldRetry() {
        return true;
      },
      retryInterval: 0,
      timeout: 5000
    });

    // Note: Strategy here
    // 1. Try to recover connection with background (get the existing cuid)
    // 2. If cuid not found, try to create new connection (cuid) with background
    // 3. Both of these two steps above are async, but this api itself is synchronous,
    //    so we have to create a mock API and return it first
    return Object(_utils__WEBPACK_IMPORTED_MODULE_4__["mockAPIWith"])(function () {
      return reconnect().catch(function () {
        return tryConnect();
      }).catch(function (e) {
        _log__WEBPACK_IMPORTED_MODULE_3___default.a.error('Failed to create cs ipc');
        throw e;
      });
    }, {
      ask: function ask() {
        return Promise.reject(new Error('mock ask'));
      },
      onAsk: function onAsk() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _log__WEBPACK_IMPORTED_MODULE_3___default.a.apply(undefined, ['mock onAsk'].concat(args));
      },
      destroy: function destroy() {},
      secret: cuid
    }, ['ask']);
  } catch (e) {
    _log__WEBPACK_IMPORTED_MODULE_3___default.a.error(e.stack);
  }
};

// Helper function to init ipc promise instance for background
// it accepts a `fn` function to handle CONNECT message from content scripts
var bgInit = function bgInit(fn) {
  _web_extension__WEBPACK_IMPORTED_MODULE_2___default.a.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    switch (req.type) {
      case 'CONNECT':
        {
          if (req.cuid) {
            fn(sender.tab.id, req.cuid, openBgWithCs(req.cuid).ipcBg(sender.tab.id));
            sendResponse(true);
          }
          break;
        }

      case 'RECONNECT':
        {
          var cuid = Object(_ipc_cache__WEBPACK_IMPORTED_MODULE_1__["getIpcCache"])().getCuid(sender.tab.id);

          if (cuid) {
            Object(_ipc_cache__WEBPACK_IMPORTED_MODULE_1__["getIpcCache"])().enable(sender.tab.id);
          }

          sendResponse(cuid || null);
          break;
        }
    }

    return true;
  });
};

/***/ })

}]);