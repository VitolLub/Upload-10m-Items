;

if(typeof psPostPublishJsInitialized != 'undefined') {
    console.log('PostPublishJs is already present on the page. Reaching here implies JS is injected again. Ignoring this injection.');
}
else {
    var psPostPublishJsInitialized = true;
    //disable link-creation for cms in case fallback got initialized before context was created
    if(window.amznPs && window.amznPs.bootStrap) {
        window.amznPs.bootStrap.setLinkCreation(false);
    }

    (function(){

/*!
 * jQuery JavaScript Library v1.6.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Jun 30 14:16:56 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
    var document = window.document,
        navigator = window.navigator,
        location = window.location;
    var jQuery = (function() {

// Define a local copy of jQuery
        var jQuery = function( selector, context ) {
                // The jQuery object is actually just the init constructor 'enhanced'
                return new jQuery.fn.init( selector, context, rootjQuery );
            },

        // Map over jQuery in case of overwrite
            _jQuery = window.jQuery,

        // Map over the $ in case of overwrite
            _$ = window.$,

        // A central reference to the root jQuery(document)
            rootjQuery,

        // A simple way to check for HTML strings or ID strings
        // (both of which we optimize for)
            quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

        // Check if a string has a non-whitespace character in it
            rnotwhite = /\S/,

        // Used for trimming whitespace
            trimLeft = /^\s+/,
            trimRight = /\s+$/,

        // Check for digits
            rdigit = /\d/,

        // Match a standalone tag
            rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

        // JSON RegExp
            rvalidchars = /^[\],:{}\s]*$/,
            rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

        // Useragent RegExp
            rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

        // Matches dashed string for camelizing
            rdashAlpha = /-([a-z])/ig,

        // Used by jQuery.camelCase as callback to replace()
            fcamelCase = function( all, letter ) {
                return letter.toUpperCase();
            },

        // Keep a UserAgent string for use with jQuery.browser
            userAgent = navigator.userAgent,

        // For matching the engine and version of the browser
            browserMatch,

        // The deferred used on DOM ready
            readyList,

        // The ready event handler
            DOMContentLoaded,

        // Save a reference to some core methods
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            push = Array.prototype.push,
            slice = Array.prototype.slice,
            trim = String.prototype.trim,
            indexOf = Array.prototype.indexOf,

        // [[Class]] -> type pairs
            class2type = {};

        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            init: function( selector, context, rootjQuery ) {
                var match, elem, ret, doc;

                // Handle $(""), $(null), or $(undefined)
                if ( !selector ) {
                    return this;
                }

                // Handle $(DOMElement)
                if ( selector.nodeType ) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                }

                // The body element only exists once, optimize finding it
                if ( selector === "body" && !context && document.body ) {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }

                // Handle HTML strings
                if ( typeof selector === "string" ) {
                    // Are we dealing with HTML string or an ID?
                    if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                        // Assume that strings that start and end with <> are HTML and skip the regex check
                        match = [ null, selector, null ];

                    } else {
                        match = quickExpr.exec( selector );
                    }

                    // Verify a match, and that no context was specified for #id
                    if ( match && (match[1] || !context) ) {

                        // HANDLE: $(html) -> $(array)
                        if ( match[1] ) {
                            context = context instanceof jQuery ? context[0] : context;
                            doc = (context ? context.ownerDocument || context : document);

                            // If a single string is passed in and it's a single tag
                            // just do a createElement and skip the rest
                            ret = rsingleTag.exec( selector );

                            if ( ret ) {
                                if ( jQuery.isPlainObject( context ) ) {
                                    selector = [ document.createElement( ret[1] ) ];
                                    jQuery.fn.attr.call( selector, context, true );

                                } else {
                                    selector = [ doc.createElement( ret[1] ) ];
                                }

                            } else {
                                ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                                selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                            }

                            return jQuery.merge( this, selector );

                            // HANDLE: $("#id")
                        } else {
                            elem = document.getElementById( match[2] );

                            // Check parentNode to catch when Blackberry 4.6 returns
                            // nodes that are no longer in the document #6963
                            if ( elem && elem.parentNode ) {
                                // Handle the case where IE and Opera return items
                                // by name instead of ID
                                if ( elem.id !== match[2] ) {
                                    return rootjQuery.find( selector );
                                }

                                // Otherwise, we inject the element directly into the jQuery object
                                this.length = 1;
                                this[0] = elem;
                            }

                            this.context = document;
                            this.selector = selector;
                            return this;
                        }

                        // HANDLE: $(expr, $(...))
                    } else if ( !context || context.jquery ) {
                        return (context || rootjQuery).find( selector );

                        // HANDLE: $(expr, context)
                        // (which is just equivalent to: $(context).find(expr)
                    } else {
                        return this.constructor( context ).find( selector );
                    }

                    // HANDLE: $(function)
                    // Shortcut for document ready
                } else if ( jQuery.isFunction( selector ) ) {
                    return rootjQuery.ready( selector );
                }

                if (selector.selector !== undefined) {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return jQuery.makeArray( selector, this );
            },

            // Start with an empty selector
            selector: "",

            // The current version of jQuery being used
            jquery: "1.6.2",

            // The default length of a jQuery object is 0
            length: 0,

            // The number of elements contained in the matched element set
            size: function() {
                return this.length;
            },

            toArray: function() {
                return slice.call( this, 0 );
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function( num ) {
                return num == null ?

                    // Return a 'clean' array
                    this.toArray() :

                    // Return just the object
                    ( num < 0 ? this[ this.length + num ] : this[ num ] );
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function( elems, name, selector ) {
                // Build a new jQuery matched element set
                var ret = this.constructor();

                if ( jQuery.isArray( elems ) ) {
                    push.apply( ret, elems );

                } else {
                    jQuery.merge( ret, elems );
                }

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if ( name === "find" ) {
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                } else if ( name ) {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function( callback, args ) {
                return jQuery.each( this, callback, args );
            },

            ready: function( fn ) {
                // Attach the listeners
                jQuery.bindReady();

                // Add the callback
                readyList.done( fn );

                return this;
            },

            eq: function( i ) {
                return i === -1 ?
                    this.slice( i ) :
                    this.slice( i, +i + 1 );
            },

            first: function() {
                return this.eq( 0 );
            },

            last: function() {
                return this.eq( -1 );
            },

            slice: function() {
                return this.pushStack( slice.apply( this, arguments ),
                    "slice", slice.call(arguments).join(",") );
            },

            map: function( callback ) {
                return this.pushStack( jQuery.map(this, function( elem, i ) {
                    return callback.call( elem, i, elem );
                }));
            },

            end: function() {
                return this.prevObject || this.constructor(null);
            },

            // For internal use only.
            // Behaves like an Array's method, not like a jQuery method.
            push: push,
            sort: [].sort,
            splice: [].splice
        };

// Give the init function the jQuery prototype for later instantiation
        jQuery.fn.init.prototype = jQuery.fn;

        jQuery.extend = jQuery.fn.extend = function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if ( length === i ) {
                target = this;
                --i;
            }

            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy ) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                            if ( copyIsArray ) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];

                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = jQuery.extend( deep, clone, copy );

                            // Don't bring in undefined values
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        jQuery.extend({
            noConflict: function( deep ) {
                if ( window.$ === jQuery ) {
                    window.$ = _$;
                }

                if ( deep && window.jQuery === jQuery ) {
                    window.jQuery = _jQuery;
                }

                return jQuery;
            },

            // Is the DOM ready to be used? Set to true once it occurs.
            isReady: false,

            // A counter to track how many items to wait for before
            // the ready event fires. See #6781
            readyWait: 1,

            // Hold (or release) the ready event
            holdReady: function( hold ) {
                if ( hold ) {
                    jQuery.readyWait++;
                } else {
                    jQuery.ready( true );
                }
            },

            // Handle when the DOM is ready
            ready: function( wait ) {
                // Either a released hold or an DOMready/load event and not yet ready
                if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
                    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                    if ( !document.body ) {
                        return setTimeout( jQuery.ready, 1 );
                    }

                    // Remember that the DOM is ready
                    jQuery.isReady = true;

                    // If a normal DOM Ready event fired, decrement, and wait if need be
                    if ( wait !== true && --jQuery.readyWait > 0 ) {
                        return;
                    }

                    // If there are functions bound, to execute
                    readyList.resolveWith( document, [ jQuery ] );

                    // Trigger any bound ready events
                    if ( jQuery.fn.trigger ) {
                        jQuery( document ).trigger( "ready" ).unbind( "ready" );
                    }
                }
            },

            bindReady: function() {
                if ( readyList ) {
                    return;
                }

                readyList = jQuery._Deferred();

                // Catch cases where $(document).ready() is called after the
                // browser event has already occurred.
                if ( document.readyState === "complete" ) {
                    // Handle it asynchronously to allow scripts the opportunity to delay ready
                    return setTimeout( jQuery.ready, 1 );
                }

                // Mozilla, Opera and webkit nightlies currently support this event
                if ( document.addEventListener ) {
                    // Use the handy event callback
                    document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

                    // A fallback to window.onload, that will always work
                    window.addEventListener( "load", jQuery.ready, false );

                    // If IE event model is used
                } else if ( document.attachEvent ) {
                    // ensure firing before onload,
                    // maybe late but safe also for iframes
                    document.attachEvent( "onreadystatechange", DOMContentLoaded );

                    // A fallback to window.onload, that will always work
                    window.attachEvent( "onload", jQuery.ready );

                    // If IE and not a frame
                    // continually check to see if the document is ready
                    var toplevel = false;

                    try {
                        toplevel = window.frameElement == null;
                    } catch(e) {}

                    if ( document.documentElement.doScroll && toplevel ) {
                        doScrollCheck();
                    }
                }
            },

            // See test/unit/core.js for details concerning isFunction.
            // Since version 1.3, DOM methods and functions like alert
            // aren't supported. They return false on IE (#2968).
            isFunction: function( obj ) {
                return jQuery.type(obj) === "function";
            },

            isArray: Array.isArray || function( obj ) {
                return jQuery.type(obj) === "array";
            },

            // A crude way of determining if an object is a window
            isWindow: function( obj ) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },

            isNaN: function( obj ) {
                return obj == null || !rdigit.test( obj ) || isNaN( obj );
            },

            type: function( obj ) {
                return obj == null ?
                    String( obj ) :
                    class2type[ toString.call(obj) ] || "object";
            },

            isPlainObject: function( obj ) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                    return false;
                }

                // Not own constructor property must be Object
                if ( obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for ( key in obj ) {}

                return key === undefined || hasOwn.call( obj, key );
            },

            isEmptyObject: function( obj ) {
                for ( var name in obj ) {
                    return false;
                }
                return true;
            },

            error: function( msg ) {
                throw msg;
            },

            parseJSON: function( data ) {
                if ( typeof data !== "string" || !data ) {
                    return null;
                }

                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim( data );

                // Attempt to parse using the native JSON parser first
                if ( window.JSON && window.JSON.parse ) {
                    return window.JSON.parse( data );
                }

                // Make sure the incoming data is actual JSON
                // Logic borrowed from http://json.org/json2.js
                if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                    .replace( rvalidtokens, "]" )
                    .replace( rvalidbraces, "")) ) {

                    return (new Function( "return " + data ))();

                }
                jQuery.error( "Invalid JSON: " + data );
            },

            // Cross-browser xml parsing
            // (xml & tmp used internally)
            parseXML: function( data , xml , tmp ) {

                if ( window.DOMParser ) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString( data , "text/xml" );
                } else { // IE
                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( data );
                }

                tmp = xml.documentElement;

                if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
                    jQuery.error( "Invalid XML: " + data );
                }

                return xml;
            },

            noop: function() {},

            // Evaluates a script in a global context
            // Workarounds based on findings by Jim Driscoll
            // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
            globalEval: function( data ) {
                if ( data && rnotwhite.test( data ) ) {
                    // We use execScript on Internet Explorer
                    // We use an anonymous function so that context is window
                    // rather than jQuery in Firefox
                    ( window.execScript || function( data ) {
                        window[ "eval" ].call( window, data );
                    } )( data );
                }
            },

            // Converts a dashed string to camelCased string;
            // Used by both the css and data modules
            camelCase: function( string ) {
                return string.replace( rdashAlpha, fcamelCase );
            },

            nodeName: function( elem, name ) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
            },

            // args is for internal usage only
            each: function( object, callback, args ) {
                var name, i = 0,
                    length = object.length,
                    isObj = length === undefined || jQuery.isFunction( object );

                if ( args ) {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.apply( object[ name ], args ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.apply( object[ i++ ], args ) === false ) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if ( isObj ) {
                        for ( name in object ) {
                            if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                                break;
                            }
                        }
                    } else {
                        for ( ; i < length; ) {
                            if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                                break;
                            }
                        }
                    }
                }

                return object;
            },

            // Use native String.trim function wherever possible
            trim: trim ?
                function( text ) {
                    return text == null ?
                        "" :
                        trim.call( text );
                } :

                // Otherwise use our own trimming functionality
                function( text ) {
                    return text == null ?
                        "" :
                        text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
                },

            // results is for internal usage only
            makeArray: function( array, results ) {
                var ret = results || [];

                if ( array != null ) {
                    // The window, strings (and functions) also have 'length'
                    // The extra typeof function check is to prevent crashes
                    // in Safari 2 (See: #3039)
                    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                    var type = jQuery.type( array );

                    if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
                        push.call( ret, array );
                    } else {
                        jQuery.merge( ret, array );
                    }
                }

                return ret;
            },

            inArray: function( elem, array ) {

                if ( indexOf ) {
                    return indexOf.call( array, elem );
                }

                for ( var i = 0, length = array.length; i < length; i++ ) {
                    if ( array[ i ] === elem ) {
                        return i;
                    }
                }

                return -1;
            },

            merge: function( first, second ) {
                var i = first.length,
                    j = 0;

                if ( typeof second.length === "number" ) {
                    for ( var l = second.length; j < l; j++ ) {
                        first[ i++ ] = second[ j ];
                    }

                } else {
                    while ( second[j] !== undefined ) {
                        first[ i++ ] = second[ j++ ];
                    }
                }

                first.length = i;

                return first;
            },

            grep: function( elems, callback, inv ) {
                var ret = [], retVal;
                inv = !!inv;

                // Go through the array, only saving the items
                // that pass the validator function
                for ( var i = 0, length = elems.length; i < length; i++ ) {
                    retVal = !!callback( elems[ i ], i );
                    if ( inv !== retVal ) {
                        ret.push( elems[ i ] );
                    }
                }

                return ret;
            },

            // arg is for internal usage only
            map: function( elems, callback, arg ) {
                var value, key, ret = [],
                    i = 0,
                    length = elems.length,
                // jquery objects are treated as arrays
                    isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

                // Go through the array, translating each of the items to their
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback( elems[ i ], i, arg );

                        if ( value != null ) {
                            ret[ ret.length ] = value;
                        }
                    }

                    // Go through every key on the object,
                } else {
                    for ( key in elems ) {
                        value = callback( elems[ key ], key, arg );

                        if ( value != null ) {
                            ret[ ret.length ] = value;
                        }
                    }
                }

                // Flatten any nested arrays
                return ret.concat.apply( [], ret );
            },

            // A global GUID counter for objects
            guid: 1,

            // Bind a function to a context, optionally partially applying any
            // arguments.
            proxy: function( fn, context ) {
                if ( typeof context === "string" ) {
                    var tmp = fn[ context ];
                    context = fn;
                    fn = tmp;
                }

                // Quick check to determine if target is callable, in the spec
                // this throws a TypeError, but we will just return undefined.
                if ( !jQuery.isFunction( fn ) ) {
                    return undefined;
                }

                // Simulated bind
                var args = slice.call( arguments, 2 ),
                    proxy = function() {
                        return fn.apply( context, args.concat( slice.call( arguments ) ) );
                    };

                // Set the guid of unique handler to the same of original handler, so it can be removed
                proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

                return proxy;
            },

            // Mutifunctional method to get and set values to a collection
            // The value/s can optionally be executed if it's a function
            access: function( elems, key, value, exec, fn, pass ) {
                var length = elems.length;

                // Setting many attributes
                if ( typeof key === "object" ) {
                    for ( var k in key ) {
                        jQuery.access( elems, k, key[k], exec, fn, value );
                    }
                    return elems;
                }

                // Setting one attribute
                if ( value !== undefined ) {
                    // Optionally, function values get executed if exec is true
                    exec = !pass && exec && jQuery.isFunction(value);

                    for ( var i = 0; i < length; i++ ) {
                        fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
                    }

                    return elems;
                }

                // Getting an attribute
                return length ? fn( elems[0], key ) : undefined;
            },

            now: function() {
                return (new Date()).getTime();
            },

            // Use of jQuery.browser is frowned upon.
            // More details: http://docs.jquery.com/Utilities/jQuery.browser
            uaMatch: function( ua ) {
                ua = ua.toLowerCase();

                var match = rwebkit.exec( ua ) ||
                    ropera.exec( ua ) ||
                    rmsie.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
                    [];

                return { browser: match[1] || "", version: match[2] || "0" };
            },

            sub: function() {
                function jQuerySub( selector, context ) {
                    return new jQuerySub.fn.init( selector, context );
                }
                jQuery.extend( true, jQuerySub, this );
                jQuerySub.superclass = this;
                jQuerySub.fn = jQuerySub.prototype = this();
                jQuerySub.fn.constructor = jQuerySub;
                jQuerySub.sub = this.sub;
                jQuerySub.fn.init = function init( selector, context ) {
                    if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                        context = jQuerySub( context );
                    }

                    return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
                };
                jQuerySub.fn.init.prototype = jQuerySub.fn;
                var rootjQuerySub = jQuerySub(document);
                return jQuerySub;
            },

            browser: {}
        });

// Populate the class2type map
        jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });

        browserMatch = jQuery.uaMatch( userAgent );
        if ( browserMatch.browser ) {
            jQuery.browser[ browserMatch.browser ] = true;
            jQuery.browser.version = browserMatch.version;
        }

// Deprecated, use jQuery.browser.webkit instead
        if ( jQuery.browser.webkit ) {
            jQuery.browser.safari = true;
        }

// IE doesn't match non-breaking spaces with \s
        if ( rnotwhite.test( "\xA0" ) ) {
            trimLeft = /^[\s\xA0]+/;
            trimRight = /[\s\xA0]+$/;
        }

// All jQuery objects should point back to these
        rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
        if ( document.addEventListener ) {
            DOMContentLoaded = function() {
                document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                jQuery.ready();
            };

        } else if ( document.attachEvent ) {
            DOMContentLoaded = function() {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( document.readyState === "complete" ) {
                    document.detachEvent( "onreadystatechange", DOMContentLoaded );
                    jQuery.ready();
                }
            };
        }

// The DOM ready check for Internet Explorer
        function doScrollCheck() {
            if ( jQuery.isReady ) {
                return;
            }

            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch(e) {
                setTimeout( doScrollCheck, 1 );
                return;
            }

            // and execute any waiting functions
            jQuery.ready();
        }

        return jQuery;

    })();


    var // Promise methods
        promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
    // Static reference to slice
        sliceDeferred = [].slice;

    jQuery.extend({
        // Create a simple deferred (one callbacks list)
        _Deferred: function() {
            var // callbacks list
                callbacks = [],
            // stored [ context , args ]
                fired,
            // to avoid firing when already doing so
                firing,
            // flag to know if the deferred has been cancelled
                cancelled,
            // the deferred itself
                deferred  = {

                    // done( f1, f2, ...)
                    done: function() {
                        if ( !cancelled ) {
                            var args = arguments,
                                i,
                                length,
                                elem,
                                type,
                                _fired;
                            if ( fired ) {
                                _fired = fired;
                                fired = 0;
                            }
                            for ( i = 0, length = args.length; i < length; i++ ) {
                                elem = args[ i ];
                                type = jQuery.type( elem );
                                if ( type === "array" ) {
                                    deferred.done.apply( deferred, elem );
                                } else if ( type === "function" ) {
                                    callbacks.push( elem );
                                }
                            }
                            if ( _fired ) {
                                deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
                            }
                        }
                        return this;
                    },

                    // resolve with given context and args
                    resolveWith: function( context, args ) {
                        if ( !cancelled && !fired && !firing ) {
                            // make sure args are available (#8421)
                            args = args || [];
                            firing = 1;
                            try {
                                while( callbacks[ 0 ] ) {
                                    callbacks.shift().apply( context, args );
                                }
                            }
                            finally {
                                fired = [ context, args ];
                                firing = 0;
                            }
                        }
                        return this;
                    },

                    // resolve with this as context and given arguments
                    resolve: function() {
                        deferred.resolveWith( this, arguments );
                        return this;
                    },

                    // Has this deferred been resolved?
                    isResolved: function() {
                        return !!( firing || fired );
                    },

                    // Cancel
                    cancel: function() {
                        cancelled = 1;
                        callbacks = [];
                        return this;
                    }
                };

            return deferred;
        },

        // Full fledged deferred (two callbacks list)
        Deferred: function( func ) {
            var deferred = jQuery._Deferred(),
                failDeferred = jQuery._Deferred(),
                promise;
            // Add errorDeferred methods, then and promise
            jQuery.extend( deferred, {
                then: function( doneCallbacks, failCallbacks ) {
                    deferred.done( doneCallbacks ).fail( failCallbacks );
                    return this;
                },
                always: function() {
                    return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
                },
                fail: failDeferred.done,
                rejectWith: failDeferred.resolveWith,
                reject: failDeferred.resolve,
                isRejected: failDeferred.isResolved,
                pipe: function( fnDone, fnFail ) {
                    return jQuery.Deferred(function( newDefer ) {
                        jQuery.each( {
                            done: [ fnDone, "resolve" ],
                            fail: [ fnFail, "reject" ]
                        }, function( handler, data ) {
                            var fn = data[ 0 ],
                                action = data[ 1 ],
                                returned;
                            if ( jQuery.isFunction( fn ) ) {
                                deferred[ handler ](function() {
                                    returned = fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise().then( newDefer.resolve, newDefer.reject );
                                    } else {
                                        newDefer[ action ]( returned );
                                    }
                                });
                            } else {
                                deferred[ handler ]( newDefer[ action ] );
                            }
                        });
                    }).promise();
                },
                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function( obj ) {
                    if ( obj == null ) {
                        if ( promise ) {
                            return promise;
                        }
                        promise = obj = {};
                    }
                    var i = promiseMethods.length;
                    while( i-- ) {
                        obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
                    }
                    return obj;
                }
            });
            // Make sure only one callback list will be used
            deferred.done( failDeferred.cancel ).fail( deferred.cancel );
            // Unexpose cancel
            delete deferred.cancel;
            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }
            return deferred;
        },

        // Deferred helper
        when: function( firstParam ) {
            var args = arguments,
                i = 0,
                length = args.length,
                count = length,
                deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
                    firstParam :
                    jQuery.Deferred();
            function resolveFunc( i ) {
                return function( value ) {
                    args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
                    if ( !( --count ) ) {
                        // Strange bug in FF4:
                        // Values changed onto the arguments object sometimes end up as undefined values
                        // outside the $.when method. Cloning the object into a fresh array solves the issue
                        deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
                    }
                };
            }
            if ( length > 1 ) {
                for( ; i < length; i++ ) {
                    if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
                        args[ i ].promise().then( resolveFunc(i), deferred.reject );
                    } else {
                        --count;
                    }
                }
                if ( !count ) {
                    deferred.resolveWith( deferred, args );
                }
            } else if ( deferred !== firstParam ) {
                deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
            }
            return deferred.promise();
        }
    });



    jQuery.support = (function() {

        var div = document.createElement( "div" ),
            documentElement = document.documentElement,
            all,
            a,
            select,
            opt,
            input,
            marginDiv,
            support,
            fragment,
            body,
            testElementParent,
            testElement,
            testElementStyle,
            tds,
            events,
            eventName,
            i,
            isSupported;

        // Preliminary tests
        div.setAttribute("className", "t");
        div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

        all = div.getElementsByTagName( "*" );
        a = div.getElementsByTagName( "a" )[ 0 ];

        // Can't get basic test support
        if ( !all || !all.length || !a ) {
            return {};
        }

        // First batch of supports tests
        select = document.createElement( "select" );
        opt = select.appendChild( document.createElement("option") );
        input = div.getElementsByTagName( "input" )[ 0 ];

        support = {
            // IE strips leading whitespace when .innerHTML is used
            leadingWhitespace: ( div.firstChild.nodeType === 3 ),

            // Make sure that tbody elements aren't automatically inserted
            // IE will insert them into empty tables
            tbody: !div.getElementsByTagName( "tbody" ).length,

            // Make sure that link elements get serialized correctly by innerHTML
            // This requires a wrapper element in IE
            htmlSerialize: !!div.getElementsByTagName( "link" ).length,

            // Get the style information from getAttribute
            // (IE uses .cssText instead)
            style: /top/.test( a.getAttribute("style") ),

            // Make sure that URLs aren't manipulated
            // (IE normalizes it by default)
            hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

            // Make sure that element opacity exists
            // (IE uses filter instead)
            // Use a regex to work around a WebKit issue. See #5145
            opacity: /^0.55$/.test( a.style.opacity ),

            // Verify style float existence
            // (IE uses styleFloat instead of cssFloat)
            cssFloat: !!a.style.cssFloat,

            // Make sure that if no value is specified for a checkbox
            // that it defaults to "on".
            // (WebKit defaults to "" instead)
            checkOn: ( input.value === "on" ),

            // Make sure that a selected-by-default option has a working selected property.
            // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
            optSelected: opt.selected,

            // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
            getSetAttribute: div.className !== "t",

            // Will be defined later
            submitBubbles: true,
            changeBubbles: true,
            focusinBubbles: false,
            deleteExpando: true,
            noCloneEvent: true,
            inlineBlockNeedsLayout: false,
            shrinkWrapBlocks: false,
            reliableMarginRight: true
        };

        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode( true ).checked;

        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;

        // Test to see if it's possible to delete an expando from an element
        // Fails in Internet Explorer
        try {
            delete div.test;
        } catch( e ) {
            support.deleteExpando = false;
        }

        if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
            div.attachEvent( "onclick", function() {
                // Cloning a node shouldn't copy over any
                // bound event handlers (IE does this)
                support.noCloneEvent = false;
            });
            div.cloneNode( true ).fireEvent( "onclick" );
        }

        // Check if a radio maintains it's value
        // after being appended to the DOM
        input = document.createElement("input");
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";

        input.setAttribute("checked", "checked");
        div.appendChild( input );
        fragment = document.createDocumentFragment();
        fragment.appendChild( div.firstChild );

        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

        div.innerHTML = "";

        // Figure out if the W3C box model works as expected
        div.style.width = div.style.paddingLeft = "1px";

        body = document.getElementsByTagName( "body" )[ 0 ];
        // We use our own, invisible, body unless the body is already present
        // in which case we use a div (#9239)
        testElement = document.createElement( body ? "div" : "body" );
        testElementStyle = {
            visibility: "hidden",
            width: 0,
            height: 0,
            border: 0,
            margin: 0
        };
        if ( body ) {
            jQuery.extend( testElementStyle, {
                position: "absolute",
                left: -1000,
                top: -1000
            });
        }
        for ( i in testElementStyle ) {
            testElement.style[ i ] = testElementStyle[ i ];
        }
        testElement.appendChild( div );
        testElementParent = body || documentElement;
        testElementParent.insertBefore( testElement, testElementParent.firstChild );

        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;

        support.boxModel = div.offsetWidth === 2;

        if ( "zoom" in div.style ) {
            // Check if natively block-level elements act like inline-block
            // elements when setting their display to 'inline' and giving
            // them layout
            // (IE < 8 does this)
            div.style.display = "inline";
            div.style.zoom = 1;
            support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

            // Check if elements with layout shrink-wrap their children
            // (IE 6 does this)
            div.style.display = "";
            div.innerHTML = "<div style='width:4px;'></div>";
            support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
        }

        div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
        tds = div.getElementsByTagName( "td" );

        // Check if table cells still have offsetWidth/Height when they are set
        // to display:none and there are still other visible table cells in a
        // table row; if so, offsetWidth/Height are not reliable for use when
        // determining if an element has been hidden directly using
        // display:none (it is still safe to use offsets if a parent element is
        // hidden; don safety goggles and see bug #4512 for more information).
        // (only IE 8 fails this test)
        isSupported = ( tds[ 0 ].offsetHeight === 0 );

        tds[ 0 ].style.display = "";
        tds[ 1 ].style.display = "none";

        // Check if empty table cells still have offsetWidth/Height
        // (IE < 8 fail this test)
        support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
        div.innerHTML = "";

        // Check if div with explicit width and no margin-right incorrectly
        // gets computed margin-right based on width of container. For more
        // info see bug #3333
        // Fails in WebKit before Feb 2011 nightlies
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        if ( document.defaultView && document.defaultView.getComputedStyle ) {
            marginDiv = document.createElement( "div" );
            marginDiv.style.width = "0";
            marginDiv.style.marginRight = "0";
            div.appendChild( marginDiv );
            support.reliableMarginRight =
                ( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
        }

        // Remove the body element we added
        testElement.innerHTML = "";
        testElementParent.removeChild( testElement );

        // Technique from Juriy Zaytsev
        // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
        // We only care about the case where non-standard event systems
        // are used, namely in IE. Short-circuiting here helps us to
        // avoid an eval call (in setAttribute) which can cause CSP
        // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
        if ( div.attachEvent ) {
            for( i in {
                submit: 1,
                change: 1,
                focusin: 1
            } ) {
                eventName = "on" + i;
                isSupported = ( eventName in div );
                if ( !isSupported ) {
                    div.setAttribute( eventName, "return;" );
                    isSupported = ( typeof div[ eventName ] === "function" );
                }
                support[ i + "Bubbles" ] = isSupported;
            }
        }

        // Null connected elements to avoid leaks in IE
        testElement = fragment = select = opt = body = marginDiv = div = input = null;

        return support;
    })();

// Keep track of boxModel
    jQuery.boxModel = jQuery.support.boxModel;




    var rbrace = /^(?:\{.*\}|\[.*\])$/,
        rmultiDash = /([a-z])([A-Z])/g;

    jQuery.extend({
        cache: {},

        // Please use with caution
        uuid: 0,

        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            "applet": true
        },

        hasData: function( elem ) {
            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

            return !!elem && !isEmptyDataObject( elem );
        },

        data: function( elem, name, data, pvt /* Internal Use Only */ ) {
            if ( !jQuery.acceptData( elem ) ) {
                return;
            }

            var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
                isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
                cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
                id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

            // Avoid doing any more work than we need to when trying to get data on an
            // object that has no data at all
            if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
                return;
            }

            if ( !id ) {
                // Only DOM nodes need a new unique ID for each element since their data
                // ends up in the global cache
                if ( isNode ) {
                    elem[ jQuery.expando ] = id = ++jQuery.uuid;
                } else {
                    id = jQuery.expando;
                }
            }

            if ( !cache[ id ] ) {
                cache[ id ] = {};

                // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
                // metadata on plain JS objects when the object is serialized using
                // JSON.stringify
                if ( !isNode ) {
                    cache[ id ].toJSON = jQuery.noop;
                }
            }

            // An object can be passed to jQuery.data instead of a key/value pair; this gets
            // shallow copied over onto the existing cache
            if ( typeof name === "object" || typeof name === "function" ) {
                if ( pvt ) {
                    cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
                } else {
                    cache[ id ] = jQuery.extend(cache[ id ], name);
                }
            }

            thisCache = cache[ id ];

            // Internal jQuery data is stored in a separate object inside the object's data
            // cache in order to avoid key collisions between internal data and user-defined
            // data
            if ( pvt ) {
                if ( !thisCache[ internalKey ] ) {
                    thisCache[ internalKey ] = {};
                }

                thisCache = thisCache[ internalKey ];
            }

            if ( data !== undefined ) {
                thisCache[ jQuery.camelCase( name ) ] = data;
            }

            // TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
            // not attempt to inspect the internal events object using jQuery.data, as this
            // internal data object is undocumented and subject to change.
            if ( name === "events" && !thisCache[name] ) {
                return thisCache[ internalKey ] && thisCache[ internalKey ].events;
            }

            return getByName ?
                // Check for both converted-to-camel and non-converted data property names
                thisCache[ jQuery.camelCase( name ) ] || thisCache[ name ] :
                thisCache;
        },

        removeData: function( elem, name, pvt /* Internal Use Only */ ) {
            if ( !jQuery.acceptData( elem ) ) {
                return;
            }

            var internalKey = jQuery.expando, isNode = elem.nodeType,

            // See jQuery.data for more information
                cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
                id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

            // If there is already no cache entry for this object, there is no
            // purpose in continuing
            if ( !cache[ id ] ) {
                return;
            }

            if ( name ) {
                var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

                if ( thisCache ) {
                    delete thisCache[ name ];

                    // If there is no data left in the cache, we want to continue
                    // and let the cache object itself get destroyed
                    if ( !isEmptyDataObject(thisCache) ) {
                        return;
                    }
                }
            }

            // See jQuery.data for more information
            if ( pvt ) {
                delete cache[ id ][ internalKey ];

                // Don't destroy the parent cache unless the internal data object
                // had been the only thing left in it
                if ( !isEmptyDataObject(cache[ id ]) ) {
                    return;
                }
            }

            var internalCache = cache[ id ][ internalKey ];

            // Browsers that fail expando deletion also refuse to delete expandos on
            // the window, but it will allow it on all other JS objects; other browsers
            // don't care
            if ( jQuery.support.deleteExpando || cache != window ) {
                delete cache[ id ];
            } else {
                cache[ id ] = null;
            }

            // We destroyed the entire user cache at once because it's faster than
            // iterating through each key, but we need to continue to persist internal
            // data if it existed
            if ( internalCache ) {
                cache[ id ] = {};
                // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
                // metadata on plain JS objects when the object is serialized using
                // JSON.stringify
                if ( !isNode ) {
                    cache[ id ].toJSON = jQuery.noop;
                }

                cache[ id ][ internalKey ] = internalCache;

                // Otherwise, we need to eliminate the expando on the node to avoid
                // false lookups in the cache for entries that no longer exist
            } else if ( isNode ) {
                // IE does not allow us to delete expando properties from nodes,
                // nor does it have a removeAttribute function on Document nodes;
                // we must handle all of these cases
                if ( jQuery.support.deleteExpando ) {
                    delete elem[ jQuery.expando ];
                } else if ( elem.removeAttribute ) {
                    elem.removeAttribute( jQuery.expando );
                } else {
                    elem[ jQuery.expando ] = null;
                }
            }
        },

        // For internal use only.
        _data: function( elem, name, data ) {
            return jQuery.data( elem, name, data, true );
        },

        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            if ( elem.nodeName ) {
                var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

                if ( match ) {
                    return !(match === true || elem.getAttribute("classid") !== match);
                }
            }

            return true;
        }
    });

    jQuery.fn.extend({
        data: function( key, value ) {
            var data = null;

            if ( typeof key === "undefined" ) {
                if ( this.length ) {
                    data = jQuery.data( this[0] );

                    if ( this[0].nodeType === 1 ) {
                        var attr = this[0].attributes, name;
                        for ( var i = 0, l = attr.length; i < l; i++ ) {
                            name = attr[i].name;

                            if ( name.indexOf( "data-" ) === 0 ) {
                                name = jQuery.camelCase( name.substring(5) );

                                dataAttr( this[0], name, data[ name ] );
                            }
                        }
                    }
                }

                return data;

            } else if ( typeof key === "object" ) {
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }

            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";

            if ( value === undefined ) {
                data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

                // Try to fetch any internally stored data first
                if ( data === undefined && this.length ) {
                    data = jQuery.data( this[0], key );
                    data = dataAttr( this[0], key, data );
                }

                return data === undefined && parts[1] ?
                    this.data( parts[0] ) :
                    data;

            } else {
                return this.each(function() {
                    var $this = jQuery( this ),
                        args = [ parts[0], value ];

                    $this.triggerHandler( "setData" + parts[1] + "!", args );
                    jQuery.data( this, key, value );
                    $this.triggerHandler( "changeData" + parts[1] + "!", args );
                });
            }
        },

        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });

    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {
            var name = "data-" + key.replace( rmultiDash, "$1-$2" ).toLowerCase();

            data = elem.getAttribute( name );

            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                            data === "null" ? null :
                                !jQuery.isNaN( data ) ? parseFloat( data ) :
                                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                                        data;
                } catch( e ) {}

                // Make sure we set the data so it isn't changed later
                jQuery.data( elem, key, data );

            } else {
                data = undefined;
            }
        }

        return data;
    }

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
    function isEmptyDataObject( obj ) {
        for ( var name in obj ) {
            if ( name !== "toJSON" ) {
                return false;
            }
        }

        return true;
    }




    function handleQueueMarkDefer( elem, type, src ) {
        var deferDataKey = type + "defer",
            queueDataKey = type + "queue",
            markDataKey = type + "mark",
            defer = jQuery.data( elem, deferDataKey, undefined, true );
        if ( defer &&
            ( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
            ( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
            // Give room for hard-coded callbacks to fire first
            // and eventually mark/queue something else on the element
            setTimeout( function() {
                if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
                    !jQuery.data( elem, markDataKey, undefined, true ) ) {
                    jQuery.removeData( elem, deferDataKey, true );
                    defer.resolve();
                }
            }, 0 );
        }
    }

    jQuery.extend({

        _mark: function( elem, type ) {
            if ( elem ) {
                type = (type || "fx") + "mark";
                jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
            }
        },

        _unmark: function( force, elem, type ) {
            if ( force !== true ) {
                type = elem;
                elem = force;
                force = false;
            }
            if ( elem ) {
                type = type || "fx";
                var key = type + "mark",
                    count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
                if ( count ) {
                    jQuery.data( elem, key, count, true );
                } else {
                    jQuery.removeData( elem, key, true );
                    handleQueueMarkDefer( elem, type, "mark" );
                }
            }
        },

        queue: function( elem, type, data ) {
            if ( elem ) {
                type = (type || "fx") + "queue";
                var q = jQuery.data( elem, type, undefined, true );
                // Speed up dequeue by getting out quickly if this is just a lookup
                if ( data ) {
                    if ( !q || jQuery.isArray(data) ) {
                        q = jQuery.data( elem, type, jQuery.makeArray(data), true );
                    } else {
                        q.push( data );
                    }
                }
                return q || [];
            }
        },

        dequeue: function( elem, type ) {
            type = type || "fx";

            var queue = jQuery.queue( elem, type ),
                fn = queue.shift(),
                defer;

            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
            }

            if ( fn ) {
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    jQuery.dequeue(elem, type);
                });
            }

            if ( !queue.length ) {
                jQuery.removeData( elem, type + "queue", true );
                handleQueueMarkDefer( elem, type, "queue" );
            }
        }
    });

    jQuery.fn.extend({
        queue: function( type, data ) {
            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
            }

            if ( data === undefined ) {
                return jQuery.queue( this[0], type );
            }
            return this.each(function() {
                var queue = jQuery.queue( this, type, data );

                if ( type === "fx" && queue[0] !== "inprogress" ) {
                    jQuery.dequeue( this, type );
                }
            });
        },
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
            type = type || "fx";

            return this.queue( type, function() {
                var elem = this;
                setTimeout(function() {
                    jQuery.dequeue( elem, type );
                }, time );
            });
        },
        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, object ) {
            if ( typeof type !== "string" ) {
                object = type;
                type = undefined;
            }
            type = type || "fx";
            var defer = jQuery.Deferred(),
                elements = this,
                i = elements.length,
                count = 1,
                deferDataKey = type + "defer",
                queueDataKey = type + "queue",
                markDataKey = type + "mark",
                tmp;
            function resolve() {
                if ( !( --count ) ) {
                    defer.resolveWith( elements, [ elements ] );
                }
            }
            while( i-- ) {
                if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
                    ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
                        jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
                        jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
                    count++;
                    tmp.done( resolve );
                }
            }
            resolve();
            return defer.promise();
        }
    });




    var rclass = /[\n\t\r]/g,
        rspace = /\s+/,
        rreturn = /\r/g,
        rtype = /^(?:button|input)$/i,
        rfocusable = /^(?:button|input|object|select|textarea)$/i,
        rclickable = /^a(?:rea)?$/i,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        rinvalidChar = /\:|^on/,
        formHook, boolHook;

    jQuery.fn.extend({
        attr: function( name, value ) {
            return jQuery.access( this, name, value, true, jQuery.attr );
        },

        removeAttr: function( name ) {
            return this.each(function() {
                jQuery.removeAttr( this, name );
            });
        },

        prop: function( name, value ) {
            return jQuery.access( this, name, value, true, jQuery.prop );
        },

        removeProp: function( name ) {
            name = jQuery.propFix[ name ] || name;
            return this.each(function() {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[ name ] = undefined;
                    delete this[ name ];
                } catch( e ) {}
            });
        },

        addClass: function( value ) {
            var classNames, i, l, elem,
                setClass, c, cl;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).addClass( value.call(this, j, this.className) );
                });
            }

            if ( value && typeof value === "string" ) {
                classNames = value.split( rspace );

                for ( i = 0, l = this.length; i < l; i++ ) {
                    elem = this[ i ];

                    if ( elem.nodeType === 1 ) {
                        if ( !elem.className && classNames.length === 1 ) {
                            elem.className = value;

                        } else {
                            setClass = " " + elem.className + " ";

                            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                                if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
                                    setClass += classNames[ c ] + " ";
                                }
                            }
                            elem.className = jQuery.trim( setClass );
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function( value ) {
            var classNames, i, l, elem, className, c, cl;

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).removeClass( value.call(this, j, this.className) );
                });
            }

            if ( (value && typeof value === "string") || value === undefined ) {
                classNames = (value || "").split( rspace );

                for ( i = 0, l = this.length; i < l; i++ ) {
                    elem = this[ i ];

                    if ( elem.nodeType === 1 && elem.className ) {
                        if ( value ) {
                            className = (" " + elem.className + " ").replace( rclass, " " );
                            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                                className = className.replace(" " + classNames[ c ] + " ", " ");
                            }
                            elem.className = jQuery.trim( className );

                        } else {
                            elem.className = "";
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function( value, stateVal ) {
            var type = typeof value,
                isBool = typeof stateVal === "boolean";

            if ( jQuery.isFunction( value ) ) {
                return this.each(function( i ) {
                    jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
                });
            }

            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery( this ),
                        state = stateVal,
                        classNames = value.split( rspace );

                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space seperated list
                        state = isBool ? state : !self.hasClass( className );
                        self[ state ? "addClass" : "removeClass" ]( className );
                    }

                } else if ( type === "undefined" || type === "boolean" ) {
                    if ( this.className ) {
                        // store className if set
                        jQuery._data( this, "__className__", this.className );
                    }

                    // toggle whole className
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },

        hasClass: function( selector ) {
            var className = " " + selector + " ";
            for ( var i = 0, l = this.length; i < l; i++ ) {
                if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
                    return true;
                }
            }

            return false;
        },

        val: function( value ) {
            var hooks, ret,
                elem = this[0];

            if ( !arguments.length ) {
                if ( elem ) {
                    hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

                    if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                        return ret;
                    }

                    ret = elem.value;

                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }

                return undefined;
            }

            var isFunction = jQuery.isFunction( value );

            return this.each(function( i ) {
                var self = jQuery(this), val;

                if ( this.nodeType !== 1 ) {
                    return;
                }

                if ( isFunction ) {
                    val = value.call( this, i, self.val() );
                } else {
                    val = value;
                }

                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";
                } else if ( typeof val === "number" ) {
                    val += "";
                } else if ( jQuery.isArray( val ) ) {
                    val = jQuery.map(val, function ( value ) {
                        return value == null ? "" : value + "";
                    });
                }

                hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

                // If set returns undefined, fall back to normal setting
                if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                    this.value = val;
                }
            });
        }
    });

    jQuery.extend({
        valHooks: {
            option: {
                get: function( elem ) {
                    // attributes.value is undefined in Blackberry 4.7 but
                    // uses .value. See #6932
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text;
                }
            },
            select: {
                get: function( elem ) {
                    var value,
                        index = elem.selectedIndex,
                        values = [],
                        options = elem.options,
                        one = elem.type === "select-one";

                    // Nothing was selected
                    if ( index < 0 ) {
                        return null;
                    }

                    // Loop through all the selected options
                    for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
                        var option = options[ i ];

                        // Don't return options that are disabled or in a disabled optgroup
                        if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                            (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                            // Get the specific value for the option
                            value = jQuery( option ).val();

                            // We don't need an array for one selects
                            if ( one ) {
                                return value;
                            }

                            // Multi-Selects return an array
                            values.push( value );
                        }
                    }

                    // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                    if ( one && !values.length && options.length ) {
                        return jQuery( options[ index ] ).val();
                    }

                    return values;
                },

                set: function( elem, value ) {
                    var values = jQuery.makeArray( value );

                    jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                    });

                    if ( !values.length ) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },

        attrFn: {
            val: true,
            css: true,
            html: true,
            text: true,
            data: true,
            width: true,
            height: true,
            offset: true
        },

        attrFix: {
            // Always normalize to ensure hook usage
            tabindex: "tabIndex"
        },

        attr: function( elem, name, value, pass ) {
            var nType = elem.nodeType;

            // don't get/set attributes on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return undefined;
            }

            if ( pass && name in jQuery.attrFn ) {
                return jQuery( elem )[ name ]( value );
            }

            // Fallback to prop when attributes are not supported
            if ( !("getAttribute" in elem) ) {
                return jQuery.prop( elem, name, value );
            }

            var ret, hooks,
                notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            // Normalize the name if needed
            if ( notxml ) {
                name = jQuery.attrFix[ name ] || name;

                hooks = jQuery.attrHooks[ name ];

                if ( !hooks ) {
                    // Use boolHook for boolean attributes
                    if ( rboolean.test( name ) ) {

                        hooks = boolHook;

                        // Use formHook for forms and if the name contains certain characters
                    } else if ( formHook && name !== "className" &&
                        (jQuery.nodeName( elem, "form" ) || rinvalidChar.test( name )) ) {

                        hooks = formHook;
                    }
                }
            }

            if ( value !== undefined ) {

                if ( value === null ) {
                    jQuery.removeAttr( elem, name );
                    return undefined;

                } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    elem.setAttribute( name, "" + value );
                    return value;
                }

            } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {

                ret = elem.getAttribute( name );

                // Non-existent attributes return null, we normalize to undefined
                return ret === null ?
                    undefined :
                    ret;
            }
        },

        removeAttr: function( elem, name ) {
            var propName;
            if ( elem.nodeType === 1 ) {
                name = jQuery.attrFix[ name ] || name;

                if ( jQuery.support.getSetAttribute ) {
                    // Use removeAttribute in browsers that support it
                    elem.removeAttribute( name );
                } else {
                    jQuery.attr( elem, name, "" );
                    elem.removeAttributeNode( elem.getAttributeNode( name ) );
                }

                // Set corresponding property to false for boolean attributes
                if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
                    elem[ propName ] = false;
                }
            }
        },

        attrHooks: {
            type: {
                set: function( elem, value ) {
                    // We can't allow the type property to be changed (since it causes problems in IE)
                    if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                        jQuery.error( "type property can't be changed" );
                    } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to it's default in case type is set after value
                        // This is for element creation
                        var val = elem.value;
                        elem.setAttribute( "type", value );
                        if ( val ) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            },
            tabIndex: {
                get: function( elem ) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    var attributeNode = elem.getAttributeNode("tabIndex");

                    return attributeNode && attributeNode.specified ?
                        parseInt( attributeNode.value, 10 ) :
                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                            0 :
                            undefined;
                }
            },
            // Use the value property for back compat
            // Use the formHook for button elements in IE6/7 (#1954)
            value: {
                get: function( elem, name ) {
                    if ( formHook && jQuery.nodeName( elem, "button" ) ) {
                        return formHook.get( elem, name );
                    }
                    return name in elem ?
                        elem.value :
                        null;
                },
                set: function( elem, value, name ) {
                    if ( formHook && jQuery.nodeName( elem, "button" ) ) {
                        return formHook.set( elem, value, name );
                    }
                    // Does not return so that setAttribute is also used
                    elem.value = value;
                }
            }
        },

        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },

        prop: function( elem, name, value ) {
            var nType = elem.nodeType;

            // don't get/set properties on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return undefined;
            }

            var ret, hooks,
                notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

            if ( notxml ) {
                // Fix name and attach hooks
                name = jQuery.propFix[ name ] || name;
                hooks = jQuery.propHooks[ name ];
            }

            if ( value !== undefined ) {
                if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;

                } else {
                    return (elem[ name ] = value);
                }

            } else {
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== undefined ) {
                    return ret;

                } else {
                    return elem[ name ];
                }
            }
        },

        propHooks: {}
    });

// Hook for boolean attributes
    boolHook = {
        get: function( elem, name ) {
            // Align boolean attributes with corresponding properties
            return jQuery.prop( elem, name ) ?
                name.toLowerCase() :
                undefined;
        },
        set: function( elem, value, name ) {
            var propName;
            if ( value === false ) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr( elem, name );
            } else {
                // value is true since we know at this point it's type boolean and not false
                // Set boolean attributes to the same name and set the DOM property
                propName = jQuery.propFix[ name ] || name;
                if ( propName in elem ) {
                    // Only set the IDL specifically if it already exists on the element
                    elem[ propName ] = true;
                }

                elem.setAttribute( name, name.toLowerCase() );
            }
            return name;
        }
    };

// IE6/7 do not support getting/setting some attributes with get/setAttribute
    if ( !jQuery.support.getSetAttribute ) {

        // propFix is more comprehensive and contains all fixes
        jQuery.attrFix = jQuery.propFix;

        // Use this for any attribute on a form in IE6/7
        formHook = jQuery.attrHooks.name = jQuery.attrHooks.title = jQuery.valHooks.button = {
            get: function( elem, name ) {
                var ret;
                ret = elem.getAttributeNode( name );
                // Return undefined if nodeValue is empty string
                return ret && ret.nodeValue !== "" ?
                    ret.nodeValue :
                    undefined;
            },
            set: function( elem, value, name ) {
                // Check form objects in IE (multiple bugs related)
                // Only use nodeValue if the attribute node exists on the form
                var ret = elem.getAttributeNode( name );
                if ( ret ) {
                    ret.nodeValue = value;
                    return value;
                }
            }
        };

        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each([ "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                set: function( elem, value ) {
                    if ( value === "" ) {
                        elem.setAttribute( name, "auto" );
                        return value;
                    }
                }
            });
        });
    }


// Some attributes require a special call on IE
    if ( !jQuery.support.hrefNormalized ) {
        jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
                get: function( elem ) {
                    var ret = elem.getAttribute( name, 2 );
                    return ret === null ? undefined : ret;
                }
            });
        });
    }

    if ( !jQuery.support.style ) {
        jQuery.attrHooks.style = {
            get: function( elem ) {
                // Return undefined in the case of empty string
                // Normalize to lowercase since IE uppercases css property names
                return elem.style.cssText.toLowerCase() || undefined;
            },
            set: function( elem, value ) {
                return (elem.style.cssText = "" + value);
            }
        };
    }

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
    if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
            get: function( elem ) {
                var parent = elem.parentNode;

                if ( parent ) {
                    parent.selectedIndex;

                    // Make sure that it also works with optgroups, see #5701
                    if ( parent.parentNode ) {
                        parent.parentNode.selectedIndex;
                    }
                }
            }
        });
    }

// Radios and checkboxes getter/setter
    if ( !jQuery.support.checkOn ) {
        jQuery.each([ "radio", "checkbox" ], function() {
            jQuery.valHooks[ this ] = {
                get: function( elem ) {
                    // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                    return elem.getAttribute("value") === null ? "on" : elem.value;
                }
            };
        });
    }
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
            set: function( elem, value ) {
                if ( jQuery.isArray( value ) ) {
                    return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
                }
            }
        });
    });




    var rnamespaces = /\.(.*)$/,
        rformElems = /^(?:textarea|input|select)$/i,
        rperiod = /\./g,
        rspaces = / /g,
        rescape = /[^\w\s.|`]/g,
        fcleanup = function( nm ) {
            return nm.replace(rescape, "\\$&");
        };

    /*
     * A number of helper functions used for managing events.
     * Many of the ideas behind this code originated from
     * Dean Edwards' addEvent library.
     */
    jQuery.event = {

        // Bind an event to an element
        // Original by Dean Edwards
        add: function( elem, types, handler, data ) {
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            if ( handler === false ) {
                handler = returnFalse;
            } else if ( !handler ) {
                // Fixes bug #7229. Fix recommended by jdalton
                return;
            }

            var handleObjIn, handleObj;

            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
            }

            // Make sure that the function being executed has a unique ID
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }

            // Init the element's event structure
            var elemData = jQuery._data( elem );

            // If no elemData is found then we must be trying to bind to one of the
            // banned noData elements
            if ( !elemData ) {
                return;
            }

            var events = elemData.events,
                eventHandle = elemData.handle;

            if ( !events ) {
                elemData.events = events = {};
            }

            if ( !eventHandle ) {
                elemData.handle = eventHandle = function( e ) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.handle.apply( eventHandle.elem, arguments ) :
                        undefined;
                };
            }

            // Add elem as a property of the handle function
            // This is to prevent a memory leak with non-native events in IE.
            eventHandle.elem = elem;

            // Handle multiple events separated by a space
            // jQuery(...).bind("mouseover mouseout", fn);
            types = types.split(" ");

            var type, i = 0, namespaces;

            while ( (type = types[ i++ ]) ) {
                handleObj = handleObjIn ?
                    jQuery.extend({}, handleObjIn) :
                { handler: handler, data: data };

                // Namespaced event handlers
                if ( type.indexOf(".") > -1 ) {
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    handleObj.namespace = namespaces.slice(0).sort().join(".");

                } else {
                    namespaces = [];
                    handleObj.namespace = "";
                }

                handleObj.type = type;
                if ( !handleObj.guid ) {
                    handleObj.guid = handler.guid;
                }

                // Get the current list of functions bound to this event
                var handlers = events[ type ],
                    special = jQuery.event.special[ type ] || {};

                // Init the event handler queue
                if ( !handlers ) {
                    handlers = events[ type ] = [];

                    // Check for a special event handler
                    // Only use addEventListener/attachEvent if the special
                    // events handler returns false
                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                        // Bind the global event handler to the element
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle, false );

                        } else if ( elem.attachEvent ) {
                            elem.attachEvent( "on" + type, eventHandle );
                        }
                    }
                }

                if ( special.add ) {
                    special.add.call( elem, handleObj );

                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }

                // Add the function to the element's handler list
                handlers.push( handleObj );

                // Keep track of which events have been used, for event optimization
                jQuery.event.global[ type ] = true;
            }

            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },

        global: {},

        // Detach an event or set of events from an element
        remove: function( elem, types, handler, pos ) {
            // don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            if ( handler === false ) {
                handler = returnFalse;
            }

            var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
                elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
                events = elemData && elemData.events;

            if ( !elemData || !events ) {
                return;
            }

            // types is actually an event object here
            if ( types && types.type ) {
                handler = types.handler;
                types = types.type;
            }

            // Unbind all events for the element
            if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
                types = types || "";

                for ( type in events ) {
                    jQuery.event.remove( elem, type + types );
                }

                return;
            }

            // Handle multiple events separated by a space
            // jQuery(...).unbind("mouseover mouseout", fn);
            types = types.split(" ");

            while ( (type = types[ i++ ]) ) {
                origType = type;
                handleObj = null;
                all = type.indexOf(".") < 0;
                namespaces = [];

                if ( !all ) {
                    // Namespaced event handlers
                    namespaces = type.split(".");
                    type = namespaces.shift();

                    namespace = new RegExp("(^|\\.)" +
                        jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
                }

                eventType = events[ type ];

                if ( !eventType ) {
                    continue;
                }

                if ( !handler ) {
                    for ( j = 0; j < eventType.length; j++ ) {
                        handleObj = eventType[ j ];

                        if ( all || namespace.test( handleObj.namespace ) ) {
                            jQuery.event.remove( elem, origType, handleObj.handler, j );
                            eventType.splice( j--, 1 );
                        }
                    }

                    continue;
                }

                special = jQuery.event.special[ type ] || {};

                for ( j = pos || 0; j < eventType.length; j++ ) {
                    handleObj = eventType[ j ];

                    if ( handler.guid === handleObj.guid ) {
                        // remove the given handler for the given type
                        if ( all || namespace.test( handleObj.namespace ) ) {
                            if ( pos == null ) {
                                eventType.splice( j--, 1 );
                            }

                            if ( special.remove ) {
                                special.remove.call( elem, handleObj );
                            }
                        }

                        if ( pos != null ) {
                            break;
                        }
                    }
                }

                // remove generic event handler if no more handlers exist
                if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
                    if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
                        jQuery.removeEvent( elem, type, elemData.handle );
                    }

                    ret = null;
                    delete events[ type ];
                }
            }

            // Remove the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                var handle = elemData.handle;
                if ( handle ) {
                    handle.elem = null;
                }

                delete elemData.events;
                delete elemData.handle;

                if ( jQuery.isEmptyObject( elemData ) ) {
                    jQuery.removeData( elem, undefined, true );
                }
            }
        },

        // Events that are safe to short-circuit if no handlers are attached.
        // Native DOM events should not be added, they may have inline handlers.
        customEvent: {
            "getData": true,
            "setData": true,
            "changeData": true
        },

        trigger: function( event, data, elem, onlyHandlers ) {
            // Event object or event type
            var type = event.type || event,
                namespaces = [],
                exclusive;

            if ( type.indexOf("!") >= 0 ) {
                // Exclusive events trigger only for the exact event (no namespaces)
                type = type.slice(0, -1);
                exclusive = true;
            }

            if ( type.indexOf(".") >= 0 ) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }

            if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
                // No jQuery handlers for this event type, and it can't have inline handlers
                return;
            }

            // Caller can pass in an Event, Object, or just an event type string
            event = typeof event === "object" ?
                // jQuery.Event object
                event[ jQuery.expando ] ? event :
                    // Object literal
                    new jQuery.Event( type, event ) :
                // Just the event type (string)
                new jQuery.Event( type );

            event.type = type;
            event.exclusive = exclusive;
            event.namespace = namespaces.join(".");
            event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");

            // triggerHandler() and global events don't bubble or run the default action
            if ( onlyHandlers || !elem ) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Handle a global trigger
            if ( !elem ) {
                // TODO: Stop taunting the data cache; remove global events and always attach to document
                jQuery.each( jQuery.cache, function() {
                    // internalKey variable is just used to make it easier to find
                    // and potentially change this stuff later; currently it just
                    // points to jQuery.expando
                    var internalKey = jQuery.expando,
                        internalCache = this[ internalKey ];
                    if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
                        jQuery.event.trigger( event, data, internalCache.handle.elem );
                    }
                });
                return;
            }

            // Don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }

            // Clean up the event in case it is being reused
            event.result = undefined;
            event.target = elem;

            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data != null ? jQuery.makeArray( data ) : [];
            data.unshift( event );

            var cur = elem,
            // IE doesn't like method names with a colon (#3533, #8272)
                ontype = type.indexOf(":") < 0 ? "on" + type : "";

            // Fire event on the current element, then bubble up the DOM tree
            do {
                var handle = jQuery._data( cur, "handle" );

                event.currentTarget = cur;
                if ( handle ) {
                    handle.apply( cur, data );
                }

                // Trigger an inline bound script
                if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
                    event.result = false;
                    event.preventDefault();
                }

                // Bubble up to document, then to window
                cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
            } while ( cur && !event.isPropagationStopped() );

            // If nobody prevented the default action, do it now
            if ( !event.isDefaultPrevented() ) {
                var old,
                    special = jQuery.event.special[ type ] || {};

                if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
                    !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction)() check here because IE6/7 fails that test.
                    // IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
                    try {
                        if ( ontype && elem[ type ] ) {
                            // Don't re-trigger an onFOO event when we call its FOO() method
                            old = elem[ ontype ];

                            if ( old ) {
                                elem[ ontype ] = null;
                            }

                            jQuery.event.triggered = type;
                            elem[ type ]();
                        }
                    } catch ( ieError ) {}

                    if ( old ) {
                        elem[ ontype ] = old;
                    }

                    jQuery.event.triggered = undefined;
                }
            }

            return event.result;
        },

        handle: function( event ) {
            event = jQuery.event.fix( event || window.event );
            // Snapshot the handlers list since a called handler may add/remove events.
            var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
                run_all = !event.exclusive && !event.namespace,
                args = Array.prototype.slice.call( arguments, 0 );

            // Use the fix-ed Event rather than the (read-only) native event
            args[0] = event;
            event.currentTarget = this;

            for ( var j = 0, l = handlers.length; j < l; j++ ) {
                var handleObj = handlers[ j ];

                // Triggered event must 1) be non-exclusive and have no namespace, or
                // 2) have namespace(s) a subset or equal to those in the bound event.
                if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
                    // Pass in a reference to the handler function itself
                    // So that we can later remove it
                    event.handler = handleObj.handler;
                    event.data = handleObj.data;
                    event.handleObj = handleObj;

                    var ret = handleObj.handler.apply( this, args );

                    if ( ret !== undefined ) {
                        event.result = ret;
                        if ( ret === false ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }

                    if ( event.isImmediatePropagationStopped() ) {
                        break;
                    }
                }
            }
            return event.result;
        },

        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

        fix: function( event ) {
            if ( event[ jQuery.expando ] ) {
                return event;
            }

            // store a copy of the original event object
            // and "clone" to set read-only properties
            var originalEvent = event;
            event = jQuery.Event( originalEvent );

            for ( var i = this.props.length, prop; i; ) {
                prop = this.props[ --i ];
                event[ prop ] = originalEvent[ prop ];
            }

            // Fix target property, if necessary
            if ( !event.target ) {
                // Fixes #1925 where srcElement might not be defined either
                event.target = event.srcElement || document;
            }

            // check if target is a textnode (safari)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }

            // Add relatedTarget, if necessary
            if ( !event.relatedTarget && event.fromElement ) {
                event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
            }

            // Calculate pageX/Y if missing and clientX/Y available
            if ( event.pageX == null && event.clientX != null ) {
                var eventDocument = event.target.ownerDocument || document,
                    doc = eventDocument.documentElement,
                    body = eventDocument.body;

                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
            }

            // Add which for key events
            if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
                event.which = event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
            if ( !event.metaKey && event.ctrlKey ) {
                event.metaKey = event.ctrlKey;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !event.which && event.button !== undefined ) {
                event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
            }

            return event;
        },

        // Deprecated, use jQuery.guid instead
        guid: 1E8,

        // Deprecated, use jQuery.proxy instead
        proxy: jQuery.proxy,

        special: {
            ready: {
                // Make sure the ready event is setup
                setup: jQuery.bindReady,
                teardown: jQuery.noop
            },

            live: {
                add: function( handleObj ) {
                    jQuery.event.add( this,
                        liveConvert( handleObj.origType, handleObj.selector ),
                        jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
                },

                remove: function( handleObj ) {
                    jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
                }
            },

            beforeunload: {
                setup: function( data, namespaces, eventHandle ) {
                    // We only want to do this special case on windows
                    if ( jQuery.isWindow( this ) ) {
                        this.onbeforeunload = eventHandle;
                    }
                },

                teardown: function( namespaces, eventHandle ) {
                    if ( this.onbeforeunload === eventHandle ) {
                        this.onbeforeunload = null;
                    }
                }
            }
        }
    };

    jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
            if ( elem.removeEventListener ) {
                elem.removeEventListener( type, handle, false );
            }
        } :
        function( elem, type, handle ) {
            if ( elem.detachEvent ) {
                elem.detachEvent( "on" + type, handle );
            }
        };

    jQuery.Event = function( src, props ) {
        // Allow instantiation without the 'new' keyword
        if ( !this.preventDefault ) {
            return new jQuery.Event( src, props );
        }

        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;

            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
                src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

            // Event type
        } else {
            this.type = src;
        }

        // Put explicitly provided properties onto the event object
        if ( props ) {
            jQuery.extend( this, props );
        }

        // timeStamp is buggy for some events on Firefox(#3843)
        // So we won't rely on the native value
        this.timeStamp = jQuery.now();

        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };

    function returnFalse() {
        return false;
    }
    function returnTrue() {
        return true;
    }

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }

            // if preventDefault exists run it on the original event
            if ( e.preventDefault ) {
                e.preventDefault();

                // otherwise set the returnValue property of the original event to false (IE)
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;

            var e = this.originalEvent;
            if ( !e ) {
                return;
            }
            // if stopPropagation exists run it on the original event
            if ( e.stopPropagation ) {
                e.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event to true (IE)
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        },
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse
    };

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
    var withinElement = function( event ) {

            // Check if mouse(over|out) are still within the same parent element
            var related = event.relatedTarget,
                inside = false,
                eventType = event.type;

            event.type = event.data;

            if ( related !== this ) {

                if ( related ) {
                    inside = jQuery.contains( this, related );
                }

                if ( !inside ) {

                    jQuery.event.handle.apply( this, arguments );

                    event.type = eventType;
                }
            }
        },

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
        delegate = function( event ) {
            event.type = event.data;
            jQuery.event.handle.apply( this, arguments );
        };

// Create mouseenter and mouseleave events
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            setup: function( data ) {
                jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
            },
            teardown: function( data ) {
                jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
            }
        };
    });

// submit delegation
    if ( !jQuery.support.submitBubbles ) {

        jQuery.event.special.submit = {
            setup: function( data, namespaces ) {
                if ( !jQuery.nodeName( this, "form" ) ) {
                    jQuery.event.add(this, "click.specialSubmit", function( e ) {
                        var elem = e.target,
                            type = elem.type;

                        if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
                            trigger( "submit", this, arguments );
                        }
                    });

                    jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
                        var elem = e.target,
                            type = elem.type;

                        if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
                            trigger( "submit", this, arguments );
                        }
                    });

                } else {
                    return false;
                }
            },

            teardown: function( namespaces ) {
                jQuery.event.remove( this, ".specialSubmit" );
            }
        };

    }

// change delegation, happens here so we have bind.
    if ( !jQuery.support.changeBubbles ) {

        var changeFilters,

            getVal = function( elem ) {
                var type = elem.type, val = elem.value;

                if ( type === "radio" || type === "checkbox" ) {
                    val = elem.checked;

                } else if ( type === "select-multiple" ) {
                    val = elem.selectedIndex > -1 ?
                        jQuery.map( elem.options, function( elem ) {
                            return elem.selected;
                        }).join("-") :
                        "";

                } else if ( jQuery.nodeName( elem, "select" ) ) {
                    val = elem.selectedIndex;
                }

                return val;
            },

            testChange = function testChange( e ) {
                var elem = e.target, data, val;

                if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
                    return;
                }

                data = jQuery._data( elem, "_change_data" );
                val = getVal(elem);

                // the current data will be also retrieved by beforeactivate
                if ( e.type !== "focusout" || elem.type !== "radio" ) {
                    jQuery._data( elem, "_change_data", val );
                }

                if ( data === undefined || val === data ) {
                    return;
                }

                if ( data != null || val ) {
                    e.type = "change";
                    e.liveFired = undefined;
                    jQuery.event.trigger( e, arguments[1], elem );
                }
            };

        jQuery.event.special.change = {
            filters: {
                focusout: testChange,

                beforedeactivate: testChange,

                click: function( e ) {
                    var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

                    if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
                        testChange.call( this, e );
                    }
                },

                // Change has to be called before submit
                // Keydown will be called before keypress, which is used in submit-event delegation
                keydown: function( e ) {
                    var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

                    if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
                        (e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
                        type === "select-multiple" ) {
                        testChange.call( this, e );
                    }
                },

                // Beforeactivate happens also before the previous element is blurred
                // with this event you can't trigger a change event, but you can store
                // information
                beforeactivate: function( e ) {
                    var elem = e.target;
                    jQuery._data( elem, "_change_data", getVal(elem) );
                }
            },

            setup: function( data, namespaces ) {
                if ( this.type === "file" ) {
                    return false;
                }

                for ( var type in changeFilters ) {
                    jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
                }

                return rformElems.test( this.nodeName );
            },

            teardown: function( namespaces ) {
                jQuery.event.remove( this, ".specialChange" );

                return rformElems.test( this.nodeName );
            }
        };

        changeFilters = jQuery.event.special.change.filters;

        // Handle when the input is .focus()'d
        changeFilters.focus = changeFilters.beforeactivate;
    }

    function trigger( type, elem, args ) {
        // Piggyback on a donor event to simulate a different one.
        // Fake originalEvent to avoid donor's stopPropagation, but if the
        // simulated event prevents default then we do the same on the donor.
        // Don't pass args or remember liveFired; they apply to the donor event.
        var event = jQuery.extend( {}, args[ 0 ] );
        event.type = type;
        event.originalEvent = {};
        event.liveFired = undefined;
        jQuery.event.handle.call( elem, event );
        if ( event.isDefaultPrevented() ) {
            args[ 0 ].preventDefault();
        }
    }

// Create "bubbling" focus and blur events
    if ( !jQuery.support.focusinBubbles ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0;

            jQuery.event.special[ fix ] = {
                setup: function() {
                    if ( attaches++ === 0 ) {
                        document.addEventListener( orig, handler, true );
                    }
                },
                teardown: function() {
                    if ( --attaches === 0 ) {
                        document.removeEventListener( orig, handler, true );
                    }
                }
            };

            function handler( donor ) {
                // Donor event is always a native one; fix it and switch its type.
                // Let focusin/out handler cancel the donor focus/blur event.
                var e = jQuery.event.fix( donor );
                e.type = fix;
                e.originalEvent = {};
                jQuery.event.trigger( e, null, e.target );
                if ( e.isDefaultPrevented() ) {
                    donor.preventDefault();
                }
            }
        });
    }

    jQuery.each(["bind", "one"], function( i, name ) {
        jQuery.fn[ name ] = function( type, data, fn ) {
            var handler;

            // Handle object literals
            if ( typeof type === "object" ) {
                for ( var key in type ) {
                    this[ name ](key, data, type[key], fn);
                }
                return this;
            }

            if ( arguments.length === 2 || data === false ) {
                fn = data;
                data = undefined;
            }

            if ( name === "one" ) {
                handler = function( event ) {
                    jQuery( this ).unbind( event, handler );
                    return fn.apply( this, arguments );
                };
                handler.guid = fn.guid || jQuery.guid++;
            } else {
                handler = fn;
            }

            if ( type === "unload" && name !== "one" ) {
                this.one( type, data, fn );

            } else {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    jQuery.event.add( this[i], type, handler, data );
                }
            }

            return this;
        };
    });

    jQuery.fn.extend({
        unbind: function( type, fn ) {
            // Handle object literals
            if ( typeof type === "object" && !type.preventDefault ) {
                for ( var key in type ) {
                    this.unbind(key, type[key]);
                }

            } else {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    jQuery.event.remove( this[i], type, fn );
                }
            }

            return this;
        },

        delegate: function( selector, types, data, fn ) {
            return this.live( types, data, fn, selector );
        },

        undelegate: function( selector, types, fn ) {
            if ( arguments.length === 0 ) {
                return this.unbind( "live" );

            } else {
                return this.die( types, null, fn, selector );
            }
        },

        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },

        triggerHandler: function( type, data ) {
            if ( this[0] ) {
                return jQuery.event.trigger( type, data, this[0], true );
            }
        },

        toggle: function( fn ) {
            // Save reference to arguments for access in closure
            var args = arguments,
                guid = fn.guid || jQuery.guid++,
                i = 0,
                toggler = function( event ) {
                    // Figure out which function to execute
                    var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                    jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                    // Make sure that clicks stop
                    event.preventDefault();

                    // and execute the function
                    return args[ lastToggle ].apply( this, arguments ) || false;
                };

            // link all the functions, so any of them can unbind this click handler
            toggler.guid = guid;
            while ( i < args.length ) {
                args[ i++ ].guid = guid;
            }

            return this.click( toggler );
        },

        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        }
    });

    var liveMap = {
        focus: "focusin",
        blur: "focusout",
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };

    jQuery.each(["live", "die"], function( i, name ) {
        jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
            var type, i = 0, match, namespaces, preType,
                selector = origSelector || this.selector,
                context = origSelector ? this : jQuery( this.context );

            if ( typeof types === "object" && !types.preventDefault ) {
                for ( var key in types ) {
                    context[ name ]( key, data, types[key], selector );
                }

                return this;
            }

            if ( name === "die" && !types &&
                origSelector && origSelector.charAt(0) === "." ) {

                context.unbind( origSelector );

                return this;
            }

            if ( data === false || jQuery.isFunction( data ) ) {
                fn = data || returnFalse;
                data = undefined;
            }

            types = (types || "").split(" ");

            while ( (type = types[ i++ ]) != null ) {
                match = rnamespaces.exec( type );
                namespaces = "";

                if ( match )  {
                    namespaces = match[0];
                    type = type.replace( rnamespaces, "" );
                }

                if ( type === "hover" ) {
                    types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
                    continue;
                }

                preType = type;

                if ( liveMap[ type ] ) {
                    types.push( liveMap[ type ] + namespaces );
                    type = type + namespaces;

                } else {
                    type = (liveMap[ type ] || type) + namespaces;
                }

                if ( name === "live" ) {
                    // bind live handler
                    for ( var j = 0, l = context.length; j < l; j++ ) {
                        jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
                            { data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
                    }

                } else {
                    // unbind live handler
                    context.unbind( "live." + liveConvert( type, selector ), fn );
                }
            }

            return this;
        };
    });

    function liveHandler( event ) {
        var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
            elems = [],
            selectors = [],
            events = jQuery._data( this, "events" );

        // Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
        if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
            return;
        }

        if ( event.namespace ) {
            namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
        }

        event.liveFired = this;

        var live = events.live.slice(0);

        for ( j = 0; j < live.length; j++ ) {
            handleObj = live[j];

            if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
                selectors.push( handleObj.selector );

            } else {
                live.splice( j--, 1 );
            }
        }

        match = jQuery( event.target ).closest( selectors, event.currentTarget );

        for ( i = 0, l = match.length; i < l; i++ ) {
            close = match[i];

            for ( j = 0; j < live.length; j++ ) {
                handleObj = live[j];

                if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
                    elem = close.elem;
                    related = null;

                    // Those two events require additional checking
                    if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
                        event.type = handleObj.preType;
                        related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

                        // Make sure not to accidentally match a child element with the same selector
                        if ( related && jQuery.contains( elem, related ) ) {
                            related = elem;
                        }
                    }

                    if ( !related || related !== elem ) {
                        elems.push({ elem: elem, handleObj: handleObj, level: close.level });
                    }
                }
            }
        }

        for ( i = 0, l = elems.length; i < l; i++ ) {
            match = elems[i];

            if ( maxLevel && match.level > maxLevel ) {
                break;
            }

            event.currentTarget = match.elem;
            event.data = match.handleObj.data;
            event.handleObj = match.handleObj;

            ret = match.handleObj.origHandler.apply( match.elem, arguments );

            if ( ret === false || event.isPropagationStopped() ) {
                maxLevel = match.level;

                if ( ret === false ) {
                    stop = false;
                }
                if ( event.isImmediatePropagationStopped() ) {
                    break;
                }
            }
        }

        return stop;
    }

    function liveConvert( type, selector ) {
        return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
    }

    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error").split(" "), function( i, name ) {

        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            if ( fn == null ) {
                fn = data;
                data = null;
            }

            return arguments.length > 0 ?
                this.bind( name, data, fn ) :
                this.trigger( name );
        };

        if ( jQuery.attrFn ) {
            jQuery.attrFn[ name ] = true;
        }
    });



    /*!
     * Sizzle CSS Selector Engine
     *  Copyright 2011, The Dojo Foundation
     *  Released under the MIT, BSD, and GPL Licenses.
     *  More information: http://sizzlejs.com/
     */
    (function(){

        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
            done = 0,
            toString = Object.prototype.toString,
            hasDuplicate = false,
            baseHasDuplicate = true,
            rBackslash = /\\/g,
            rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
        [0, 0].sort(function() {
            baseHasDuplicate = false;
            return 0;
        });

        var Sizzle = function( selector, context, results, seed ) {
            results = results || [];
            context = context || document;

            var origContext = context;

            if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
                return [];
            }

            if ( !selector || typeof selector !== "string" ) {
                return results;
            }

            var m, set, checkSet, extra, ret, cur, pop, i,
                prune = true,
                contextXML = Sizzle.isXML( context ),
                parts = [],
                soFar = selector;

            // Reset the position of the chunker regexp (start from head)
            do {
                chunker.exec( "" );
                m = chunker.exec( soFar );

                if ( m ) {
                    soFar = m[3];

                    parts.push( m[1] );

                    if ( m[2] ) {
                        extra = m[3];
                        break;
                    }
                }
            } while ( m );

            if ( parts.length > 1 && origPOS.exec( selector ) ) {

                if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
                    set = posProcess( parts[0] + parts[1], context );

                } else {
                    set = Expr.relative[ parts[0] ] ?
                        [ context ] :
                        Sizzle( parts.shift(), context );

                    while ( parts.length ) {
                        selector = parts.shift();

                        if ( Expr.relative[ selector ] ) {
                            selector += parts.shift();
                        }

                        set = posProcess( selector, set );
                    }
                }

            } else {
                // Take a shortcut and set the context if the root selector is an ID
                // (but not if it'll be faster if the inner selector is an ID)
                if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                    Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

                    ret = Sizzle.find( parts.shift(), context, contextXML );
                    context = ret.expr ?
                        Sizzle.filter( ret.expr, ret.set )[0] :
                        ret.set[0];
                }

                if ( context ) {
                    ret = seed ?
                    { expr: parts.pop(), set: makeArray(seed) } :
                        Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

                    set = ret.expr ?
                        Sizzle.filter( ret.expr, ret.set ) :
                        ret.set;

                    if ( parts.length > 0 ) {
                        checkSet = makeArray( set );

                    } else {
                        prune = false;
                    }

                    while ( parts.length ) {
                        cur = parts.pop();
                        pop = cur;

                        if ( !Expr.relative[ cur ] ) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }

                        if ( pop == null ) {
                            pop = context;
                        }

                        Expr.relative[ cur ]( checkSet, pop, contextXML );
                    }

                } else {
                    checkSet = parts = [];
                }
            }

            if ( !checkSet ) {
                checkSet = set;
            }

            if ( !checkSet ) {
                Sizzle.error( cur || selector );
            }

            if ( toString.call(checkSet) === "[object Array]" ) {
                if ( !prune ) {
                    results.push.apply( results, checkSet );

                } else if ( context && context.nodeType === 1 ) {
                    for ( i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                            results.push( set[i] );
                        }
                    }

                } else {
                    for ( i = 0; checkSet[i] != null; i++ ) {
                        if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                            results.push( set[i] );
                        }
                    }
                }

            } else {
                makeArray( checkSet, results );
            }

            if ( extra ) {
                Sizzle( extra, origContext, results, seed );
                Sizzle.uniqueSort( results );
            }

            return results;
        };

        Sizzle.uniqueSort = function( results ) {
            if ( sortOrder ) {
                hasDuplicate = baseHasDuplicate;
                results.sort( sortOrder );

                if ( hasDuplicate ) {
                    for ( var i = 1; i < results.length; i++ ) {
                        if ( results[i] === results[ i - 1 ] ) {
                            results.splice( i--, 1 );
                        }
                    }
                }
            }

            return results;
        };

        Sizzle.matches = function( expr, set ) {
            return Sizzle( expr, null, null, set );
        };

        Sizzle.matchesSelector = function( node, expr ) {
            return Sizzle( expr, null, null, [node] ).length > 0;
        };

        Sizzle.find = function( expr, context, isXML ) {
            var set;

            if ( !expr ) {
                return [];
            }

            for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
                var match,
                    type = Expr.order[i];

                if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
                    var left = match[1];
                    match.splice( 1, 1 );

                    if ( left.substr( left.length - 1 ) !== "\\" ) {
                        match[1] = (match[1] || "").replace( rBackslash, "" );
                        set = Expr.find[ type ]( match, context, isXML );

                        if ( set != null ) {
                            expr = expr.replace( Expr.match[ type ], "" );
                            break;
                        }
                    }
                }
            }

            if ( !set ) {
                set = typeof context.getElementsByTagName !== "undefined" ?
                    context.getElementsByTagName( "*" ) :
                    [];
            }

            return { set: set, expr: expr };
        };

        Sizzle.filter = function( expr, set, inplace, not ) {
            var match, anyFound,
                old = expr,
                result = [],
                curLoop = set,
                isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

            while ( expr && set.length ) {
                for ( var type in Expr.filter ) {
                    if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                        var found, item,
                            filter = Expr.filter[ type ],
                            left = match[1];

                        anyFound = false;

                        match.splice(1,1);

                        if ( left.substr( left.length - 1 ) === "\\" ) {
                            continue;
                        }

                        if ( curLoop === result ) {
                            result = [];
                        }

                        if ( Expr.preFilter[ type ] ) {
                            match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                            if ( !match ) {
                                anyFound = found = true;

                            } else if ( match === true ) {
                                continue;
                            }
                        }

                        if ( match ) {
                            for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
                                if ( item ) {
                                    found = filter( item, match, i, curLoop );
                                    var pass = not ^ !!found;

                                    if ( inplace && found != null ) {
                                        if ( pass ) {
                                            anyFound = true;

                                        } else {
                                            curLoop[i] = false;
                                        }

                                    } else if ( pass ) {
                                        result.push( item );
                                        anyFound = true;
                                    }
                                }
                            }
                        }

                        if ( found !== undefined ) {
                            if ( !inplace ) {
                                curLoop = result;
                            }

                            expr = expr.replace( Expr.match[ type ], "" );

                            if ( !anyFound ) {
                                return [];
                            }

                            break;
                        }
                    }
                }

                // Improper expression
                if ( expr === old ) {
                    if ( anyFound == null ) {
                        Sizzle.error( expr );

                    } else {
                        break;
                    }
                }

                old = expr;
            }

            return curLoop;
        };

        Sizzle.error = function( msg ) {
            throw "Syntax error, unrecognized expression: " + msg;
        };

        var Expr = Sizzle.selectors = {
            order: [ "ID", "NAME", "TAG" ],

            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },

            leftMatch: {},

            attrMap: {
                "class": "className",
                "for": "htmlFor"
            },

            attrHandle: {
                href: function( elem ) {
                    return elem.getAttribute( "href" );
                },
                type: function( elem ) {
                    return elem.getAttribute( "type" );
                }
            },

            relative: {
                "+": function(checkSet, part){
                    var isPartStr = typeof part === "string",
                        isTag = isPartStr && !rNonWord.test( part ),
                        isPartStrNotTag = isPartStr && !isTag;

                    if ( isTag ) {
                        part = part.toLowerCase();
                    }

                    for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                        if ( (elem = checkSet[i]) ) {
                            while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                                elem || false :
                                elem === part;
                        }
                    }

                    if ( isPartStrNotTag ) {
                        Sizzle.filter( part, checkSet, true );
                    }
                },

                ">": function( checkSet, part ) {
                    var elem,
                        isPartStr = typeof part === "string",
                        i = 0,
                        l = checkSet.length;

                    if ( isPartStr && !rNonWord.test( part ) ) {
                        part = part.toLowerCase();

                        for ( ; i < l; i++ ) {
                            elem = checkSet[i];

                            if ( elem ) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                            }
                        }

                    } else {
                        for ( ; i < l; i++ ) {
                            elem = checkSet[i];

                            if ( elem ) {
                                checkSet[i] = isPartStr ?
                                    elem.parentNode :
                                    elem.parentNode === part;
                            }
                        }

                        if ( isPartStr ) {
                            Sizzle.filter( part, checkSet, true );
                        }
                    }
                },

                "": function(checkSet, part, isXML){
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if ( typeof part === "string" && !rNonWord.test( part ) ) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
                },

                "~": function( checkSet, part, isXML ) {
                    var nodeCheck,
                        doneName = done++,
                        checkFn = dirCheck;

                    if ( typeof part === "string" && !rNonWord.test( part ) ) {
                        part = part.toLowerCase();
                        nodeCheck = part;
                        checkFn = dirNodeCheck;
                    }

                    checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
                }
            },

            find: {
                ID: function( match, context, isXML ) {
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        return m && m.parentNode ? [m] : [];
                    }
                },

                NAME: function( match, context ) {
                    if ( typeof context.getElementsByName !== "undefined" ) {
                        var ret = [],
                            results = context.getElementsByName( match[1] );

                        for ( var i = 0, l = results.length; i < l; i++ ) {
                            if ( results[i].getAttribute("name") === match[1] ) {
                                ret.push( results[i] );
                            }
                        }

                        return ret.length === 0 ? null : ret;
                    }
                },

                TAG: function( match, context ) {
                    if ( typeof context.getElementsByTagName !== "undefined" ) {
                        return context.getElementsByTagName( match[1] );
                    }
                }
            },
            preFilter: {
                CLASS: function( match, curLoop, inplace, result, not, isXML ) {
                    match = " " + match[1].replace( rBackslash, "" ) + " ";

                    if ( isXML ) {
                        return match;
                    }

                    for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                        if ( elem ) {
                            if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                                if ( !inplace ) {
                                    result.push( elem );
                                }

                            } else if ( inplace ) {
                                curLoop[i] = false;
                            }
                        }
                    }

                    return false;
                },

                ID: function( match ) {
                    return match[1].replace( rBackslash, "" );
                },

                TAG: function( match, curLoop ) {
                    return match[1].replace( rBackslash, "" ).toLowerCase();
                },

                CHILD: function( match ) {
                    if ( match[1] === "nth" ) {
                        if ( !match[2] ) {
                            Sizzle.error( match[0] );
                        }

                        match[2] = match[2].replace(/^\+|\s*/g, '');

                        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                                !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                        // calculate the numbers (first)n+(last) including if they are negative
                        match[2] = (test[1] + (test[2] || 1)) - 0;
                        match[3] = test[3] - 0;
                    }
                    else if ( match[2] ) {
                        Sizzle.error( match[0] );
                    }

                    // TODO: Move to normal caching system
                    match[0] = done++;

                    return match;
                },

                ATTR: function( match, curLoop, inplace, result, not, isXML ) {
                    var name = match[1] = match[1].replace( rBackslash, "" );

                    if ( !isXML && Expr.attrMap[name] ) {
                        match[1] = Expr.attrMap[name];
                    }

                    // Handle if an un-quoted value was used
                    match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

                    if ( match[2] === "~=" ) {
                        match[4] = " " + match[4] + " ";
                    }

                    return match;
                },

                PSEUDO: function( match, curLoop, inplace, result, not ) {
                    if ( match[1] === "not" ) {
                        // If we're dealing with a complex expression, or a simple one
                        if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                            match[3] = Sizzle(match[3], null, null, curLoop);

                        } else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                            if ( !inplace ) {
                                result.push.apply( result, ret );
                            }

                            return false;
                        }

                    } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                        return true;
                    }

                    return match;
                },

                POS: function( match ) {
                    match.unshift( true );

                    return match;
                }
            },

            filters: {
                enabled: function( elem ) {
                    return elem.disabled === false && elem.type !== "hidden";
                },

                disabled: function( elem ) {
                    return elem.disabled === true;
                },

                checked: function( elem ) {
                    return elem.checked === true;
                },

                selected: function( elem ) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if ( elem.parentNode ) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                parent: function( elem ) {
                    return !!elem.firstChild;
                },

                empty: function( elem ) {
                    return !elem.firstChild;
                },

                has: function( elem, i, match ) {
                    return !!Sizzle( match[3], elem ).length;
                },

                header: function( elem ) {
                    return (/h\d/i).test( elem.nodeName );
                },

                text: function( elem ) {
                    var attr = elem.getAttribute( "type" ), type = elem.type;
                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
                    // use getAttribute instead to test this case
                    return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
                },

                radio: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
                },

                checkbox: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
                },

                file: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
                },

                password: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
                },

                submit: function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "submit" === elem.type;
                },

                image: function( elem ) {
                    return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
                },

                reset: function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" || name === "button") && "reset" === elem.type;
                },

                button: function( elem ) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && "button" === elem.type || name === "button";
                },

                input: function( elem ) {
                    return (/input|select|textarea|button/i).test( elem.nodeName );
                },

                focus: function( elem ) {
                    return elem === elem.ownerDocument.activeElement;
                }
            },
            setFilters: {
                first: function( elem, i ) {
                    return i === 0;
                },

                last: function( elem, i, match, array ) {
                    return i === array.length - 1;
                },

                even: function( elem, i ) {
                    return i % 2 === 0;
                },

                odd: function( elem, i ) {
                    return i % 2 === 1;
                },

                lt: function( elem, i, match ) {
                    return i < match[3] - 0;
                },

                gt: function( elem, i, match ) {
                    return i > match[3] - 0;
                },

                nth: function( elem, i, match ) {
                    return match[3] - 0 === i;
                },

                eq: function( elem, i, match ) {
                    return match[3] - 0 === i;
                }
            },
            filter: {
                PSEUDO: function( elem, match, i, array ) {
                    var name = match[1],
                        filter = Expr.filters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );

                    } else if ( name === "contains" ) {
                        return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

                    } else if ( name === "not" ) {
                        var not = match[3];

                        for ( var j = 0, l = not.length; j < l; j++ ) {
                            if ( not[j] === elem ) {
                                return false;
                            }
                        }

                        return true;

                    } else {
                        Sizzle.error( name );
                    }
                },

                CHILD: function( elem, match ) {
                    var type = match[1],
                        node = elem;

                    switch ( type ) {
                        case "only":
                        case "first":
                            while ( (node = node.previousSibling) )	 {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }

                            if ( type === "first" ) {
                                return true;
                            }

                            node = elem;

                        case "last":
                            while ( (node = node.nextSibling) )	 {
                                if ( node.nodeType === 1 ) {
                                    return false;
                                }
                            }

                            return true;

                        case "nth":
                            var first = match[2],
                                last = match[3];

                            if ( first === 1 && last === 0 ) {
                                return true;
                            }

                            var doneName = match[0],
                                parent = elem.parentNode;

                            if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
                                var count = 0;

                                for ( node = parent.firstChild; node; node = node.nextSibling ) {
                                    if ( node.nodeType === 1 ) {
                                        node.nodeIndex = ++count;
                                    }
                                }

                                parent.sizcache = doneName;
                            }

                            var diff = elem.nodeIndex - last;

                            if ( first === 0 ) {
                                return diff === 0;

                            } else {
                                return ( diff % first === 0 && diff / first >= 0 );
                            }
                    }
                },

                ID: function( elem, match ) {
                    return elem.nodeType === 1 && elem.getAttribute("id") === match;
                },

                TAG: function( elem, match ) {
                    return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
                },

                CLASS: function( elem, match ) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ")
                        .indexOf( match ) > -1;
                },

                ATTR: function( elem, match ) {
                    var name = match[1],
                        result = Expr.attrHandle[ name ] ?
                            Expr.attrHandle[ name ]( elem ) :
                            elem[ name ] != null ?
                                elem[ name ] :
                                elem.getAttribute( name ),
                        value = result + "",
                        type = match[2],
                        check = match[4];

                    return result == null ?
                        type === "!=" :
                        type === "=" ?
                            value === check :
                            type === "*=" ?
                                value.indexOf(check) >= 0 :
                                type === "~=" ?
                                    (" " + value + " ").indexOf(check) >= 0 :
                                    !check ?
                                        value && result !== false :
                                        type === "!=" ?
                                            value !== check :
                                            type === "^=" ?
                                                value.indexOf(check) === 0 :
                                                type === "$=" ?
                                                    value.substr(value.length - check.length) === check :
                                                    type === "|=" ?
                                                        value === check || value.substr(0, check.length + 1) === check + "-" :
                                                        false;
                },

                POS: function( elem, match, i, array ) {
                    var name = match[2],
                        filter = Expr.setFilters[ name ];

                    if ( filter ) {
                        return filter( elem, i, match, array );
                    }
                }
            }
        };

        var origPOS = Expr.match.POS,
            fescape = function(all, num){
                return "\\" + (num - 0 + 1);
            };

        for ( var type in Expr.match ) {
            Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
            Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
        }

        var makeArray = function( array, results ) {
            array = Array.prototype.slice.call( array, 0 );

            if ( results ) {
                results.push.apply( results, array );
                return results;
            }

            return array;
        };

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
        try {
            Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
        } catch( e ) {
            makeArray = function( array, results ) {
                var i = 0,
                    ret = results || [];

                if ( toString.call(array) === "[object Array]" ) {
                    Array.prototype.push.apply( ret, array );

                } else {
                    if ( typeof array.length === "number" ) {
                        for ( var l = array.length; i < l; i++ ) {
                            ret.push( array[i] );
                        }

                    } else {
                        for ( ; array[i]; i++ ) {
                            ret.push( array[i] );
                        }
                    }
                }

                return ret;
            };
        }

        var sortOrder, siblingCheck;

        if ( document.documentElement.compareDocumentPosition ) {
            sortOrder = function( a, b ) {
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;
                }

                if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
                    return a.compareDocumentPosition ? -1 : 1;
                }

                return a.compareDocumentPosition(b) & 4 ? -1 : 1;
            };

        } else {
            sortOrder = function( a, b ) {
                // The nodes are identical, we can exit early
                if ( a === b ) {
                    hasDuplicate = true;
                    return 0;

                    // Fallback to using sourceIndex (in IE) if it's available on both nodes
                } else if ( a.sourceIndex && b.sourceIndex ) {
                    return a.sourceIndex - b.sourceIndex;
                }

                var al, bl,
                    ap = [],
                    bp = [],
                    aup = a.parentNode,
                    bup = b.parentNode,
                    cur = aup;

                // If the nodes are siblings (or identical) we can do a quick check
                if ( aup === bup ) {
                    return siblingCheck( a, b );

                    // If no parents were found then the nodes are disconnected
                } else if ( !aup ) {
                    return -1;

                } else if ( !bup ) {
                    return 1;
                }

                // Otherwise they're somewhere else in the tree so we need
                // to build up a full list of the parentNodes for comparison
                while ( cur ) {
                    ap.unshift( cur );
                    cur = cur.parentNode;
                }

                cur = bup;

                while ( cur ) {
                    bp.unshift( cur );
                    cur = cur.parentNode;
                }

                al = ap.length;
                bl = bp.length;

                // Start walking down the tree looking for a discrepancy
                for ( var i = 0; i < al && i < bl; i++ ) {
                    if ( ap[i] !== bp[i] ) {
                        return siblingCheck( ap[i], bp[i] );
                    }
                }

                // We ended someplace up the tree so do a sibling check
                return i === al ?
                    siblingCheck( a, bp[i], -1 ) :
                    siblingCheck( ap[i], b, 1 );
            };

            siblingCheck = function( a, b, ret ) {
                if ( a === b ) {
                    return ret;
                }

                var cur = a.nextSibling;

                while ( cur ) {
                    if ( cur === b ) {
                        return -1;
                    }

                    cur = cur.nextSibling;
                }

                return 1;
            };
        }

// Utility function for retreiving the text value of an array of DOM nodes
        Sizzle.getText = function( elems ) {
            var ret = "", elem;

            for ( var i = 0; elems[i]; i++ ) {
                elem = elems[i];

                // Get the text from text nodes and CDATA nodes
                if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
                    ret += elem.nodeValue;

                    // Traverse everything else, except comment nodes
                } else if ( elem.nodeType !== 8 ) {
                    ret += Sizzle.getText( elem.childNodes );
                }
            }

            return ret;
        };

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
        (function(){
            // We're going to inject a fake input element with a specified name
            var form = document.createElement("div"),
                id = "script" + (new Date()).getTime(),
                root = document.documentElement;

            form.innerHTML = "<a name='" + id + "'/>";

            // Inject it into the root element, check its status, and remove it quickly
            root.insertBefore( form, root.firstChild );

            // The workaround has to do additional checks after a getElementById
            // Which slows things down for other browsers (hence the branching)
            if ( document.getElementById( id ) ) {
                Expr.find.ID = function( match, context, isXML ) {
                    if ( typeof context.getElementById !== "undefined" && !isXML ) {
                        var m = context.getElementById(match[1]);

                        return m ?
                            m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                                [m] :
                                undefined :
                            [];
                    }
                };

                Expr.filter.ID = function( elem, match ) {
                    var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

                    return elem.nodeType === 1 && node && node.nodeValue === match;
                };
            }

            root.removeChild( form );

            // release memory in IE
            root = form = null;
        })();

        (function(){
            // Check to see if the browser returns only elements
            // when doing getElementsByTagName("*")

            // Create a fake element
            var div = document.createElement("div");
            div.appendChild( document.createComment("") );

            // Make sure no comments are found
            if ( div.getElementsByTagName("*").length > 0 ) {
                Expr.find.TAG = function( match, context ) {
                    var results = context.getElementsByTagName( match[1] );

                    // Filter out possible comments
                    if ( match[1] === "*" ) {
                        var tmp = [];

                        for ( var i = 0; results[i]; i++ ) {
                            if ( results[i].nodeType === 1 ) {
                                tmp.push( results[i] );
                            }
                        }

                        results = tmp;
                    }

                    return results;
                };
            }

            // Check to see if an attribute returns normalized href attributes
            div.innerHTML = "<a href='#'></a>";

            if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
                div.firstChild.getAttribute("href") !== "#" ) {

                Expr.attrHandle.href = function( elem ) {
                    return elem.getAttribute( "href", 2 );
                };
            }

            // release memory in IE
            div = null;
        })();

        if ( document.querySelectorAll ) {
            (function(){
                var oldSizzle = Sizzle,
                    div = document.createElement("div"),
                    id = "__sizzle__";

                div.innerHTML = "<p class='TEST'></p>";

                // Safari can't handle uppercase or unicode characters when
                // in quirks mode.
                if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
                    return;
                }

                Sizzle = function( query, context, extra, seed ) {
                    context = context || document;

                    // Only use querySelectorAll on non-XML documents
                    // (ID selectors don't work in non-HTML documents)
                    if ( !seed && !Sizzle.isXML(context) ) {
                        // See if we find a selector to speed up
                        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

                        if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
                            // Speed-up: Sizzle("TAG")
                            if ( match[1] ) {
                                return makeArray( context.getElementsByTagName( query ), extra );

                                // Speed-up: Sizzle(".CLASS")
                            } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
                                return makeArray( context.getElementsByClassName( match[2] ), extra );
                            }
                        }

                        if ( context.nodeType === 9 ) {
                            // Speed-up: Sizzle("body")
                            // The body element only exists once, optimize finding it
                            if ( query === "body" && context.body ) {
                                return makeArray( [ context.body ], extra );

                                // Speed-up: Sizzle("#ID")
                            } else if ( match && match[3] ) {
                                var elem = context.getElementById( match[3] );

                                // Check parentNode to catch when Blackberry 4.6 returns
                                // nodes that are no longer in the document #6963
                                if ( elem && elem.parentNode ) {
                                    // Handle the case where IE and Opera return items
                                    // by name instead of ID
                                    if ( elem.id === match[3] ) {
                                        return makeArray( [ elem ], extra );
                                    }

                                } else {
                                    return makeArray( [], extra );
                                }
                            }

                            try {
                                return makeArray( context.querySelectorAll(query), extra );
                            } catch(qsaError) {}

                            // qSA works strangely on Element-rooted queries
                            // We can work around this by specifying an extra ID on the root
                            // and working up from there (Thanks to Andrew Dupont for the technique)
                            // IE 8 doesn't work on object elements
                        } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                            var oldContext = context,
                                old = context.getAttribute( "id" ),
                                nid = old || id,
                                hasParent = context.parentNode,
                                relativeHierarchySelector = /^\s*[+~]/.test( query );

                            if ( !old ) {
                                context.setAttribute( "id", nid );
                            } else {
                                nid = nid.replace( /'/g, "\\$&" );
                            }
                            if ( relativeHierarchySelector && hasParent ) {
                                context = context.parentNode;
                            }

                            try {
                                if ( !relativeHierarchySelector || hasParent ) {
                                    return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
                                }

                            } catch(pseudoError) {
                            } finally {
                                if ( !old ) {
                                    oldContext.removeAttribute( "id" );
                                }
                            }
                        }
                    }

                    return oldSizzle(query, context, extra, seed);
                };

                for ( var prop in oldSizzle ) {
                    Sizzle[ prop ] = oldSizzle[ prop ];
                }

                // release memory in IE
                div = null;
            })();
        }

        (function(){
            var html = document.documentElement,
                matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

            if ( matches ) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9 fails this)
                var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
                    pseudoWorks = false;

                try {
                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call( document.documentElement, "[test!='']:sizzle" );

                } catch( pseudoError ) {
                    pseudoWorks = true;
                }

                Sizzle.matchesSelector = function( node, expr ) {
                    // Make sure that attribute selectors are quoted
                    expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

                    if ( !Sizzle.isXML( node ) ) {
                        try {
                            if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                                var ret = matches.call( node, expr );

                                // IE 9's matchesSelector returns false on disconnected nodes
                                if ( ret || !disconnectedMatch ||
                                    // As well, disconnected nodes are said to be in a document
                                    // fragment in IE 9, so check for that
                                    node.document && node.document.nodeType !== 11 ) {
                                    return ret;
                                }
                            }
                        } catch(e) {}
                    }

                    return Sizzle(expr, null, null, [node]).length > 0;
                };
            }
        })();

        (function(){
            var div = document.createElement("div");

            div.innerHTML = "<div class='test e'></div><div class='test'></div>";

            // Opera can't find a second classname (in 9.6)
            // Also, make sure that getElementsByClassName actually exists
            if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
                return;
            }

            // Safari caches class attributes, doesn't catch changes (in 3.2)
            div.lastChild.className = "e";

            if ( div.getElementsByClassName("e").length === 1 ) {
                return;
            }

            Expr.order.splice(1, 0, "CLASS");
            Expr.find.CLASS = function( match, context, isXML ) {
                if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
                    return context.getElementsByClassName(match[1]);
                }
            };

            // release memory in IE
            div = null;
        })();

        function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];

                if ( elem ) {
                    var match = false;

                    elem = elem[dir];

                    while ( elem ) {
                        if ( elem.sizcache === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 && !isXML ){
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }

                        if ( elem.nodeName.toLowerCase() === cur ) {
                            match = elem;
                            break;
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
            for ( var i = 0, l = checkSet.length; i < l; i++ ) {
                var elem = checkSet[i];

                if ( elem ) {
                    var match = false;

                    elem = elem[dir];

                    while ( elem ) {
                        if ( elem.sizcache === doneName ) {
                            match = checkSet[elem.sizset];
                            break;
                        }

                        if ( elem.nodeType === 1 ) {
                            if ( !isXML ) {
                                elem.sizcache = doneName;
                                elem.sizset = i;
                            }

                            if ( typeof cur !== "string" ) {
                                if ( elem === cur ) {
                                    match = true;
                                    break;
                                }

                            } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                                match = elem;
                                break;
                            }
                        }

                        elem = elem[dir];
                    }

                    checkSet[i] = match;
                }
            }
        }

        if ( document.documentElement.contains ) {
            Sizzle.contains = function( a, b ) {
                return a !== b && (a.contains ? a.contains(b) : true);
            };

        } else if ( document.documentElement.compareDocumentPosition ) {
            Sizzle.contains = function( a, b ) {
                return !!(a.compareDocumentPosition(b) & 16);
            };

        } else {
            Sizzle.contains = function() {
                return false;
            };
        }

        Sizzle.isXML = function( elem ) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833) 
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        var posProcess = function( selector, context ) {
            var match,
                tmpSet = [],
                later = "",
                root = context.nodeType ? [context] : context;

            // Position selectors must be done after the filter
            // And so must :not(positional) so we move all PSEUDOs to the end
            while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
                later += match[0];
                selector = selector.replace( Expr.match.PSEUDO, "" );
            }

            selector = Expr.relative[selector] ? selector + "*" : selector;

            for ( var i = 0, l = root.length; i < l; i++ ) {
                Sizzle( selector, root[i], tmpSet );
            }

            return Sizzle.filter( later, tmpSet );
        };

// EXPOSE
        jQuery.find = Sizzle;
        jQuery.expr = Sizzle.selectors;
        jQuery.expr[":"] = jQuery.expr.filters;
        jQuery.unique = Sizzle.uniqueSort;
        jQuery.text = Sizzle.getText;
        jQuery.isXMLDoc = Sizzle.isXML;
        jQuery.contains = Sizzle.contains;


    })();


    var runtil = /Until$/,
        rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
        rmultiselector = /,/,
        isSimple = /^.[^:#\[\.,]*$/,
        slice = Array.prototype.slice,
        POS = jQuery.expr.match.POS,
    // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };

    jQuery.fn.extend({
        find: function( selector ) {
            var self = this,
                i, l;

            if ( typeof selector !== "string" ) {
                return jQuery( selector ).filter(function() {
                    for ( i = 0, l = self.length; i < l; i++ ) {
                        if ( jQuery.contains( self[ i ], this ) ) {
                            return true;
                        }
                    }
                });
            }

            var ret = this.pushStack( "", "find", selector ),
                length, n, r;

            for ( i = 0, l = this.length; i < l; i++ ) {
                length = ret.length;
                jQuery.find( selector, this[i], ret );

                if ( i > 0 ) {
                    // Make sure that the results are unique
                    for ( n = length; n < ret.length; n++ ) {
                        for ( r = 0; r < length; r++ ) {
                            if ( ret[r] === ret[n] ) {
                                ret.splice(n--, 1);
                                break;
                            }
                        }
                    }
                }
            }

            return ret;
        },

        has: function( target ) {
            var targets = jQuery( target );
            return this.filter(function() {
                for ( var i = 0, l = targets.length; i < l; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },

        not: function( selector ) {
            return this.pushStack( winnow(this, selector, false), "not", selector);
        },

        filter: function( selector ) {
            return this.pushStack( winnow(this, selector, true), "filter", selector );
        },

        is: function( selector ) {
            return !!selector && ( typeof selector === "string" ?
                jQuery.filter( selector, this ).length > 0 :
                this.filter( selector ).length > 0 );
        },

        closest: function( selectors, context ) {
            var ret = [], i, l, cur = this[0];

            // Array
            if ( jQuery.isArray( selectors ) ) {
                var match, selector,
                    matches = {},
                    level = 1;

                if ( cur && selectors.length ) {
                    for ( i = 0, l = selectors.length; i < l; i++ ) {
                        selector = selectors[i];

                        if ( !matches[ selector ] ) {
                            matches[ selector ] = POS.test( selector ) ?
                                jQuery( selector, context || this.context ) :
                                selector;
                        }
                    }

                    while ( cur && cur.ownerDocument && cur !== context ) {
                        for ( selector in matches ) {
                            match = matches[ selector ];

                            if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
                                ret.push({ selector: selector, elem: cur, level: level });
                            }
                        }

                        cur = cur.parentNode;
                        level++;
                    }
                }

                return ret;
            }

            // String
            var pos = POS.test( selectors ) || typeof selectors !== "string" ?
                jQuery( selectors, context || this.context ) :
                0;

            for ( i = 0, l = this.length; i < l; i++ ) {
                cur = this[i];

                while ( cur ) {
                    if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                        ret.push( cur );
                        break;

                    } else {
                        cur = cur.parentNode;
                        if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
                            break;
                        }
                    }
                }
            }

            ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

            return this.pushStack( ret, "closest", selectors );
        },

        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {
            if ( !elem || typeof elem === "string" ) {
                return jQuery.inArray( this[0],
                    // If it receives a string, the selector is used
                    // If it receives nothing, the siblings are used
                    elem ? jQuery( elem ) : this.parent().children() );
            }
            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this );
        },

        add: function( selector, context ) {
            var set = typeof selector === "string" ?
                    jQuery( selector, context ) :
                    jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                all = jQuery.merge( this.get(), set );

            return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
                all :
                jQuery.unique( all ) );
        },

        andSelf: function() {
            return this.add( this.prevObject );
        }
    });

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
    function isDisconnected( node ) {
        return !node || !node.parentNode || node.parentNode.nodeType === 11;
    }

    jQuery.each({
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return jQuery.nth( elem, 2, "nextSibling" );
        },
        prev: function( elem ) {
            return jQuery.nth( elem, 2, "previousSibling" );
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( elem.parentNode.firstChild, elem );
        },
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.makeArray( elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var ret = jQuery.map( this, fn, until ),
            // The variable 'args' was introduced in
            // https://github.com/jquery/jquery/commit/52a0238
            // to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
            // http://code.google.com/p/v8/issues/detail?id=1050
                args = slice.call(arguments);

            if ( !runtil.test( name ) ) {
                selector = until;
            }

            if ( selector && typeof selector === "string" ) {
                ret = jQuery.filter( selector, ret );
            }

            ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

            if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
                ret = ret.reverse();
            }

            return this.pushStack( ret, name, args.join(",") );
        };
    });

    jQuery.extend({
        filter: function( expr, elems, not ) {
            if ( not ) {
                expr = ":not(" + expr + ")";
            }

            return elems.length === 1 ?
                jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
                jQuery.find.matches(expr, elems);
        },

        dir: function( elem, dir, until ) {
            var matched = [],
                cur = elem[ dir ];

            while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
                if ( cur.nodeType === 1 ) {
                    matched.push( cur );
                }
                cur = cur[dir];
            }
            return matched;
        },

        nth: function( cur, result, dir, elem ) {
            result = result || 1;
            var num = 0;

            for ( ; cur; cur = cur[dir] ) {
                if ( cur.nodeType === 1 && ++num === result ) {
                    break;
                }
            }

            return cur;
        },

        sibling: function( n, elem ) {
            var r = [];

            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }

            return r;
        }
    });

// Implement the identical functionality for filter and not
    function winnow( elements, qualifier, keep ) {

        // Can't pass null or undefined to indexOf in Firefox 4
        // Set to 0 to skip string check
        qualifier = qualifier || 0;

        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep(elements, function( elem, i ) {
                var retVal = !!qualifier.call( elem, i, elem );
                return retVal === keep;
            });

        } else if ( qualifier.nodeType ) {
            return jQuery.grep(elements, function( elem, i ) {
                return (elem === qualifier) === keep;
            });

        } else if ( typeof qualifier === "string" ) {
            var filtered = jQuery.grep(elements, function( elem ) {
                return elem.nodeType === 1;
            });

            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter(qualifier, filtered, !keep);
            } else {
                qualifier = jQuery.filter( qualifier, filtered );
            }
        }

        return jQuery.grep(elements, function( elem, i ) {
            return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
        });
    }




    var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnocache = /<(?:script|object|embed|option|style)/i,
    // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /\/(java|ecma)script/i,
        rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            area: [ 1, "<map>", "</map>" ],
            _default: [ 0, "", "" ]
        };

    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
    if ( !jQuery.support.htmlSerialize ) {
        wrapMap._default = [ 1, "div<div>", "</div>" ];
    }

    jQuery.fn.extend({
        text: function( text ) {
            if ( jQuery.isFunction(text) ) {
                return this.each(function(i) {
                    var self = jQuery( this );

                    self.text( text.call(this, i, self.text()) );
                });
            }

            if ( typeof text !== "object" && text !== undefined ) {
                return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
            }

            return jQuery.text( this );
        },

        wrapAll: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapAll( html.call(this, i) );
                });
            }

            if ( this[0] ) {
                // The elements to wrap the target around
                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

                if ( this[0].parentNode ) {
                    wrap.insertBefore( this[0] );
                }

                wrap.map(function() {
                    var elem = this;

                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                        elem = elem.firstChild;
                    }

                    return elem;
                }).append( this );
            }

            return this;
        },

        wrapInner: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapInner( html.call(this, i) );
                });
            }

            return this.each(function() {
                var self = jQuery( this ),
                    contents = self.contents();

                if ( contents.length ) {
                    contents.wrapAll( html );

                } else {
                    self.append( html );
                }
            });
        },

        wrap: function( html ) {
            return this.each(function() {
                jQuery( this ).wrapAll( html );
            });
        },

        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        },

        append: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 ) {
                    this.appendChild( elem );
                }
            });
        },

        prepend: function() {
            return this.domManip(arguments, true, function( elem ) {
                if ( this.nodeType === 1 ) {
                    this.insertBefore( elem, this.firstChild );
                }
            });
        },

        before: function() {
            if ( this[0] && this[0].parentNode ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this );
                });
            } else if ( arguments.length ) {
                var set = jQuery(arguments[0]);
                set.push.apply( set, this.toArray() );
                return this.pushStack( set, "before", arguments );
            }
        },

        after: function() {
            if ( this[0] && this[0].parentNode ) {
                return this.domManip(arguments, false, function( elem ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                });
            } else if ( arguments.length ) {
                var set = this.pushStack( this, "after", arguments );
                set.push.apply( set, jQuery(arguments[0]).toArray() );
                return set;
            }
        },

        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
                if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                    if ( !keepData && elem.nodeType === 1 ) {
                        jQuery.cleanData( elem.getElementsByTagName("*") );
                        jQuery.cleanData( [ elem ] );
                    }

                    if ( elem.parentNode ) {
                        elem.parentNode.removeChild( elem );
                    }
                }
            }

            return this;
        },

        empty: function() {
            for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
                // Remove element nodes and prevent memory leaks
                if ( elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                }

                // Remove any remaining nodes
                while ( elem.firstChild ) {
                    elem.removeChild( elem.firstChild );
                }
            }

            return this;
        },

        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

            return this.map( function () {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            });
        },

        html: function( value ) {
            if ( value === undefined ) {
                return this[0] && this[0].nodeType === 1 ?
                    this[0].innerHTML.replace(rinlinejQuery, "") :
                    null;

                // See if we can take a shortcut and just use innerHTML
            } else if ( typeof value === "string" && !rnocache.test( value ) &&
                (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
                !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

                value = value.replace(rxhtmlTag, "<$1></$2>");

                try {
                    for ( var i = 0, l = this.length; i < l; i++ ) {
                        // Remove element nodes and prevent memory leaks
                        if ( this[i].nodeType === 1 ) {
                            jQuery.cleanData( this[i].getElementsByTagName("*") );
                            this[i].innerHTML = value;
                        }
                    }

                    // If using innerHTML throws an exception, use the fallback method
                } catch(e) {
                    this.empty().append( value );
                }

            } else if ( jQuery.isFunction( value ) ) {
                this.each(function(i){
                    var self = jQuery( this );

                    self.html( value.call(this, i, self.html()) );
                });

            } else {
                this.empty().append( value );
            }

            return this;
        },

        replaceWith: function( value ) {
            if ( this[0] && this[0].parentNode ) {
                // Make sure that the elements are removed from the DOM before they are inserted
                // this can help fix replacing a parent with child elements
                if ( jQuery.isFunction( value ) ) {
                    return this.each(function(i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith( value.call( this, i, old ) );
                    });
                }

                if ( typeof value !== "string" ) {
                    value = jQuery( value ).detach();
                }

                return this.each(function() {
                    var next = this.nextSibling,
                        parent = this.parentNode;

                    jQuery( this ).remove();

                    if ( next ) {
                        jQuery(next).before( value );
                    } else {
                        jQuery(parent).append( value );
                    }
                });
            } else {
                return this.length ?
                    this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
                    this;
            }
        },

        detach: function( selector ) {
            return this.remove( selector, true );
        },

        domManip: function( args, table, callback ) {
            var results, first, fragment, parent,
                value = args[0],
                scripts = [];

            // We can't cloneNode fragments that contain checked, in WebKit
            if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
                return this.each(function() {
                    jQuery(this).domManip( args, table, callback, true );
                });
            }

            if ( jQuery.isFunction(value) ) {
                return this.each(function(i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined);
                    self.domManip( args, table, callback );
                });
            }

            if ( this[0] ) {
                parent = value && value.parentNode;

                // If we're in a fragment, just use that instead of building a new one
                if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
                    results = { fragment: parent };

                } else {
                    results = jQuery.buildFragment( args, this, scripts );
                }

                fragment = results.fragment;

                if ( fragment.childNodes.length === 1 ) {
                    first = fragment = fragment.firstChild;
                } else {
                    first = fragment.firstChild;
                }

                if ( first ) {
                    table = table && jQuery.nodeName( first, "tr" );

                    for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
                        callback.call(
                            table ?
                                root(this[i], first) :
                                this[i],
                            // Make sure that we do not leak memory by inadvertently discarding
                            // the original fragment (which might have attached data) instead of
                            // using it; in addition, use the original fragment object for the last
                            // item instead of first because it can end up being emptied incorrectly
                            // in certain situations (Bug #8070).
                            // Fragments from the fragment cache must always be cloned and never used
                            // in place.
                            results.cacheable || (l > 1 && i < lastIndex) ?
                                jQuery.clone( fragment, true, true ) :
                                fragment
                        );
                    }
                }

                if ( scripts.length ) {
                    jQuery.each( scripts, evalScript );
                }
            }

            return this;
        }
    });

    function root( elem, cur ) {
        return jQuery.nodeName(elem, "table") ?
            (elem.getElementsByTagName("tbody")[0] ||
                elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
            elem;
    }

    function cloneCopyEvent( src, dest ) {

        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
            return;
        }

        var internalKey = jQuery.expando,
            oldData = jQuery.data( src ),
            curData = jQuery.data( dest, oldData );

        // Switch to use the internal data object, if it exists, for the next
        // stage of data copying
        if ( (oldData = oldData[ internalKey ]) ) {
            var events = oldData.events;
            curData = curData[ internalKey ] = jQuery.extend({}, oldData);

            if ( events ) {
                delete curData.handle;
                curData.events = {};

                for ( var type in events ) {
                    for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
                        jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
                    }
                }
            }
        }
    }

    function cloneFixAttributes( src, dest ) {
        var nodeName;

        // We do not need to do anything for non-Elements
        if ( dest.nodeType !== 1 ) {
            return;
        }

        // clearAttributes removes the attributes, which we don't want,
        // but also removes the attachEvent events, which we *do* want
        if ( dest.clearAttributes ) {
            dest.clearAttributes();
        }

        // mergeAttributes, in contrast, only merges back on the
        // original attributes, not the events
        if ( dest.mergeAttributes ) {
            dest.mergeAttributes( src );
        }

        nodeName = dest.nodeName.toLowerCase();

        // IE6-8 fail to clone children inside object elements that use
        // the proprietary classid attribute value (rather than the type
        // attribute) to identify the type of content to display
        if ( nodeName === "object" ) {
            dest.outerHTML = src.outerHTML;

        } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set
            if ( src.checked ) {
                dest.defaultChecked = dest.checked = src.checked;
            }

            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if ( dest.value !== src.value ) {
                dest.value = src.value;
            }

            // IE6-8 fails to return the selected option to the default selected
            // state when cloning options
        } else if ( nodeName === "option" ) {
            dest.selected = src.defaultSelected;

            // IE6-8 fails to set the defaultValue to the correct value when
            // cloning other types of input fields
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;
        }

        // Event data gets referenced instead of copied if the expando
        // gets copied too
        dest.removeAttribute( jQuery.expando );
    }

    jQuery.buildFragment = function( args, nodes, scripts ) {
        var fragment, cacheable, cacheresults, doc;

        // nodes may contain either an explicit document object,
        // a jQuery collection or context object.
        // If nodes[0] contains a valid object to assign to doc
        if ( nodes && nodes[0] ) {
            doc = nodes[0].ownerDocument || nodes[0];
        }

        // Ensure that an attr object doesn't incorrectly stand in as a document object
        // Chrome and Firefox seem to allow this to occur and will throw exception
        // Fixes #8950
        if ( !doc.createDocumentFragment ) {
            doc = document;
        }

        // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
        // Cloning options loses the selected state, so don't cache them
        // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
        // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
        if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
            args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

            cacheable = true;

            cacheresults = jQuery.fragments[ args[0] ];
            if ( cacheresults && cacheresults !== 1 ) {
                fragment = cacheresults;
            }
        }

        if ( !fragment ) {
            fragment = doc.createDocumentFragment();
            jQuery.clean( args, doc, fragment, scripts );
        }

        if ( cacheable ) {
            jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
        }

        return { fragment: fragment, cacheable: cacheable };
    };

    jQuery.fragments = {};

    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var ret = [],
                insert = jQuery( selector ),
                parent = this.length === 1 && this[0].parentNode;

            if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
                insert[ original ]( this[0] );
                return this;

            } else {
                for ( var i = 0, l = insert.length; i < l; i++ ) {
                    var elems = (i > 0 ? this.clone(true) : this).get();
                    jQuery( insert[i] )[ original ]( elems );
                    ret = ret.concat( elems );
                }

                return this.pushStack( ret, name, insert.selector );
            }
        };
    });

    function getAll( elem ) {
        if ( "getElementsByTagName" in elem ) {
            return elem.getElementsByTagName( "*" );

        } else if ( "querySelectorAll" in elem ) {
            return elem.querySelectorAll( "*" );

        } else {
            return [];
        }
    }

// Used in clean, fixes the defaultChecked property
    function fixDefaultChecked( elem ) {
        if ( elem.type === "checkbox" || elem.type === "radio" ) {
            elem.defaultChecked = elem.checked;
        }
    }
// Finds all inputs and passes them to fixDefaultChecked
    function findInputs( elem ) {
        if ( jQuery.nodeName( elem, "input" ) ) {
            fixDefaultChecked( elem );
        } else if ( "getElementsByTagName" in elem ) {
            jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
        }
    }

    jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var clone = elem.cloneNode(true),
                srcElements,
                destElements,
                i;

            if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
                // IE copies events bound via attachEvent when using cloneNode.
                // Calling detachEvent on the clone will also remove the events
                // from the original. In order to get around this, we use some
                // proprietary methods to clear the events. Thanks to MooTools
                // guys for this hotness.

                cloneFixAttributes( elem, clone );

                // Using Sizzle here is crazy slow, so we use getElementsByTagName
                // instead
                srcElements = getAll( elem );
                destElements = getAll( clone );

                // Weird iteration because IE will replace the length property
                // with an element if you are cloning the body and one of the
                // elements on the page has a name or id of "length"
                for ( i = 0; srcElements[i]; ++i ) {
                    cloneFixAttributes( srcElements[i], destElements[i] );
                }
            }

            // Copy the events from the original to the clone
            if ( dataAndEvents ) {
                cloneCopyEvent( elem, clone );

                if ( deepDataAndEvents ) {
                    srcElements = getAll( elem );
                    destElements = getAll( clone );

                    for ( i = 0; srcElements[i]; ++i ) {
                        cloneCopyEvent( srcElements[i], destElements[i] );
                    }
                }
            }

            srcElements = destElements = null;

            // Return the cloned set
            return clone;
        },

        clean: function( elems, context, fragment, scripts ) {
            var checkScriptType;

            context = context || document;

            // !context.createElement fails in IE with an error but returns typeof 'object'
            if ( typeof context.createElement === "undefined" ) {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            }

            var ret = [], j;

            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                if ( typeof elem === "number" ) {
                    elem += "";
                }

                if ( !elem ) {
                    continue;
                }

                // Convert html string into DOM nodes
                if ( typeof elem === "string" ) {
                    if ( !rhtml.test( elem ) ) {
                        elem = context.createTextNode( elem );
                    } else {
                        // Fix "XHTML"-style tags in all browsers
                        elem = elem.replace(rxhtmlTag, "<$1></$2>");

                        // Trim whitespace, otherwise indexOf won't work as expected
                        var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
                            wrap = wrapMap[ tag ] || wrapMap._default,
                            depth = wrap[0],
                            div = context.createElement("div");

                        // Go to html and back, then peel off extra wrappers
                        div.innerHTML = wrap[1] + elem + wrap[2];

                        // Move to the right depth
                        while ( depth-- ) {
                            div = div.lastChild;
                        }

                        // Remove IE's autoinserted <tbody> from table fragments
                        if ( !jQuery.support.tbody ) {

                            // String was a <table>, *may* have spurious <tbody>
                            var hasBody = rtbody.test(elem),
                                tbody = tag === "table" && !hasBody ?
                                    div.firstChild && div.firstChild.childNodes :

                                    // String was a bare <thead> or <tfoot>
                                    wrap[1] === "<table>" && !hasBody ?
                                        div.childNodes :
                                        [];

                            for ( j = tbody.length - 1; j >= 0 ; --j ) {
                                if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                    tbody[ j ].parentNode.removeChild( tbody[ j ] );
                                }
                            }
                        }

                        // IE completely kills leading whitespace when innerHTML is used
                        if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                            div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                        }

                        elem = div.childNodes;
                    }
                }

                // Resets defaultChecked for any radios and checkboxes
                // about to be appended to the DOM in IE 6/7 (#8060)
                var len;
                if ( !jQuery.support.appendChecked ) {
                    if ( elem[0] && typeof (len = elem.length) === "number" ) {
                        for ( j = 0; j < len; j++ ) {
                            findInputs( elem[j] );
                        }
                    } else {
                        findInputs( elem );
                    }
                }

                if ( elem.nodeType ) {
                    ret.push( elem );
                } else {
                    ret = jQuery.merge( ret, elem );
                }
            }

            if ( fragment ) {
                checkScriptType = function( elem ) {
                    return !elem.type || rscriptType.test( elem.type );
                };
                for ( i = 0; ret[i]; i++ ) {
                    if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
                        scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

                    } else {
                        if ( ret[i].nodeType === 1 ) {
                            var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

                            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                        }
                        fragment.appendChild( ret[i] );
                    }
                }
            }

            return ret;
        },

        cleanData: function( elems ) {
            var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
                deleteExpando = jQuery.support.deleteExpando;

            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                    continue;
                }

                id = elem[ jQuery.expando ];

                if ( id ) {
                    data = cache[ id ] && cache[ id ][ internalKey ];

                    if ( data && data.events ) {
                        for ( var type in data.events ) {
                            if ( special[ type ] ) {
                                jQuery.event.remove( elem, type );

                                // This is a shortcut to avoid jQuery.event.remove's overhead
                            } else {
                                jQuery.removeEvent( elem, type, data.handle );
                            }
                        }

                        // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                        if ( data.handle ) {
                            data.handle.elem = null;
                        }
                    }

                    if ( deleteExpando ) {
                        delete elem[ jQuery.expando ];

                    } else if ( elem.removeAttribute ) {
                        elem.removeAttribute( jQuery.expando );
                    }

                    delete cache[ id ];
                }
            }
        }
    });

    function evalScript( i, elem ) {
        if ( elem.src ) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            });
        } else {
            jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
        }

        if ( elem.parentNode ) {
            elem.parentNode.removeChild( elem );
        }
    }



    var ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity=([^)]*)/,
    // fixed for IE9, see #8346
        rupper = /([A-Z]|^ms)/g,
        rnumpx = /^-?\d+(?:px)?$/i,
        rnum = /^-?\d/,
        rrelNum = /^[+\-]=/,
        rrelNumFilter = /[^+\-\.\de]+/g,

        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssWidth = [ "Left", "Right" ],
        cssHeight = [ "Top", "Bottom" ],
        curCSS,

        getComputedStyle,
        currentStyle;

    jQuery.fn.css = function( name, value ) {
        // Setting 'undefined' is a no-op
        if ( arguments.length === 2 && value === undefined ) {
            return this;
        }

        return jQuery.access( this, name, value, true, function( elem, name, value ) {
            return value !== undefined ?
                jQuery.style( elem, name, value ) :
                jQuery.css( elem, name );
        });
    };

    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity", "opacity" );
                        return ret === "" ? "1" : ret;

                    } else {
                        return elem.style.opacity;
                    }
                }
            }
        },

        // Exclude the following css properties to add px
        cssNumber: {
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },

        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }

            // Make sure that we're working with the right name
            var ret, type, origName = jQuery.camelCase( name ),
                style = elem.style, hooks = jQuery.cssHooks[ origName ];

            name = jQuery.cssProps[ origName ] || origName;

            // Check if we're setting a value
            if ( value !== undefined ) {
                type = typeof value;

                // Make sure that NaN and null values aren't set. See: #7116
                if ( type === "number" && isNaN( value ) || value == null ) {
                    return;
                }

                // convert relative number strings (+= or -=) to relative numbers. #7345
                if ( type === "string" && rrelNum.test( value ) ) {
                    value = +value.replace( rrelNumFilter, "" ) + parseFloat( jQuery.css( elem, name ) );
                    // Fixes bug #9237
                    type = "number";
                }

                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                    value += "px";
                }

                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[ name ] = value;
                    } catch(e) {}
                }

            } else {
                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                    return ret;
                }

                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },

        css: function( elem, name, extra ) {
            var ret, hooks;

            // Make sure that we're working with the right name
            name = jQuery.camelCase( name );
            hooks = jQuery.cssHooks[ name ];
            name = jQuery.cssProps[ name ] || name;

            // cssFloat needs a special treatment
            if ( name === "cssFloat" ) {
                name = "float";
            }

            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
                return ret;

                // Otherwise, if a way to get the computed value exists, use that
            } else if ( curCSS ) {
                return curCSS( elem, name );
            }
        },

        // A method for quickly swapping in/out CSS properties to get correct calculations
        swap: function( elem, options, callback ) {
            var old = {};

            // Remember the old values, and insert the new ones
            for ( var name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }

            callback.call( elem );

            // Revert the old values
            for ( name in options ) {
                elem.style[ name ] = old[ name ];
            }
        }
    });

// DEPRECATED, Use jQuery.css() instead
    jQuery.curCSS = jQuery.css;

    jQuery.each(["height", "width"], function( i, name ) {
        jQuery.cssHooks[ name ] = {
            get: function( elem, computed, extra ) {
                var val;

                if ( computed ) {
                    if ( elem.offsetWidth !== 0 ) {
                        return getWH( elem, name, extra );
                    } else {
                        jQuery.swap( elem, cssShow, function() {
                            val = getWH( elem, name, extra );
                        });
                    }

                    return val;
                }
            },

            set: function( elem, value ) {
                if ( rnumpx.test( value ) ) {
                    // ignore negative width and height values #1599
                    value = parseFloat( value );

                    if ( value >= 0 ) {
                        return value + "px";
                    }

                } else {
                    return value;
                }
            }
        };
    });

    if ( !jQuery.support.opacity ) {
        jQuery.cssHooks.opacity = {
            get: function( elem, computed ) {
                // IE uses filters for opacity
                return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                    ( parseFloat( RegExp.$1 ) / 100 ) + "" :
                    computed ? "1" : "";
            },

            set: function( elem, value ) {
                var style = elem.style,
                    currentStyle = elem.currentStyle;

                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;

                // Set the alpha filter to set the opacity
                var opacity = jQuery.isNaN( value ) ?
                        "" :
                        "alpha(opacity=" + value * 100 + ")",
                    filter = currentStyle && currentStyle.filter || style.filter || "";

                style.filter = ralpha.test( filter ) ?
                    filter.replace( ralpha, opacity ) :
                    filter + " " + opacity;
            }
        };
    }

    jQuery(function() {
        // This hook cannot be added until DOM ready because the support test
        // for it is not run until after DOM ready
        if ( !jQuery.support.reliableMarginRight ) {
            jQuery.cssHooks.marginRight = {
                get: function( elem, computed ) {
                    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                    // Work around by temporarily setting element display to inline-block
                    var ret;
                    jQuery.swap( elem, { "display": "inline-block" }, function() {
                        if ( computed ) {
                            ret = curCSS( elem, "margin-right", "marginRight" );
                        } else {
                            ret = elem.style.marginRight;
                        }
                    });
                    return ret;
                }
            };
        }
    });

    if ( document.defaultView && document.defaultView.getComputedStyle ) {
        getComputedStyle = function( elem, name ) {
            var ret, defaultView, computedStyle;

            name = name.replace( rupper, "-$1" ).toLowerCase();

            if ( !(defaultView = elem.ownerDocument.defaultView) ) {
                return undefined;
            }

            if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
                ret = computedStyle.getPropertyValue( name );
                if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
                    ret = jQuery.style( elem, name );
                }
            }

            return ret;
        };
    }

    if ( document.documentElement.currentStyle ) {
        currentStyle = function( elem, name ) {
            var left,
                ret = elem.currentStyle && elem.currentStyle[ name ],
                rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
                style = elem.style;

            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
                // Remember the original values
                left = style.left;

                // Put in the new values to get a computed value out
                if ( rsLeft ) {
                    elem.runtimeStyle.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : (ret || 0);
                ret = style.pixelLeft + "px";

                // Revert the changed values
                style.left = left;
                if ( rsLeft ) {
                    elem.runtimeStyle.left = rsLeft;
                }
            }

            return ret === "" ? "auto" : ret;
        };
    }

    curCSS = getComputedStyle || currentStyle;

    function getWH( elem, name, extra ) {

        // Start with offset property
        var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            which = name === "width" ? cssWidth : cssHeight;

        if ( val > 0 ) {
            if ( extra !== "border" ) {
                jQuery.each( which, function() {
                    if ( !extra ) {
                        val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
                    }
                    if ( extra === "margin" ) {
                        val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
                    } else {
                        val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
                    }
                });
            }

            return val + "px";
        }

        // Fall back to computed then uncomputed css if necessary
        val = curCSS( elem, name, name );
        if ( val < 0 || val == null ) {
            val = elem.style[ name ] || 0;
        }
        // Normalize "", auto, and prepare for extra
        val = parseFloat( val ) || 0;

        // Add padding, border, margin
        if ( extra ) {
            jQuery.each( which, function() {
                val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
                if ( extra !== "padding" ) {
                    val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
                }
                if ( extra === "margin" ) {
                    val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
                }
            });
        }

        return val + "px";
    }

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            var width = elem.offsetWidth,
                height = elem.offsetHeight;

            return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
        };

        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    }




    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rhash = /#.*$/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rquery = /\?/,
        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        rselectTextarea = /^(?:select|textarea)/i,
        rspacesAjax = /\s+/,
        rts = /([?&])_=[^&]*/,
        rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

    // Keep a copy of the old load method
        _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
        prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
        transports = {},

    // Document location
        ajaxLocation,

    // Document location segments
        ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch( e ) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement( "a" );
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }

// Segment location into parts
    ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {

            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }

            if ( jQuery.isFunction( func ) ) {
                var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
                    i = 0,
                    length = dataTypes.length,
                    dataType,
                    list,
                    placeBefore;

                // For each dataType in the dataTypeExpression
                for(; i < length; i++ ) {
                    dataType = dataTypes[ i ];
                    // We control if we're asked to add before
                    // any existing element
                    placeBefore = /^\+/.test( dataType );
                    if ( placeBefore ) {
                        dataType = dataType.substr( 1 ) || "*";
                    }
                    list = structure[ dataType ] = structure[ dataType ] || [];
                    // then we add to the structure accordingly
                    list[ placeBefore ? "unshift" : "push" ]( func );
                }
            }
        };
    }

// Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
                                            dataType /* internal */, inspected /* internal */ ) {

        dataType = dataType || options.dataTypes[ 0 ];
        inspected = inspected || {};

        inspected[ dataType ] = true;

        var list = structure[ dataType ],
            i = 0,
            length = list ? list.length : 0,
            executeOnly = ( structure === prefilters ),
            selection;

        for(; i < length && ( executeOnly || !selection ); i++ ) {
            selection = list[ i ]( options, originalOptions, jqXHR );
            // If we got redirected to another dataType
            // we try there if executing only and not done already
            if ( typeof selection === "string" ) {
                if ( !executeOnly || inspected[ selection ] ) {
                    selection = undefined;
                } else {
                    options.dataTypes.unshift( selection );
                    selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jqXHR, selection, inspected );
                }
            }
        }
        // If we're only executing or nothing was selected
        // we try the catchall dataType if not done already
        if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
            selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jqXHR, "*", inspected );
        }
        // unnecessary when only executing (prefilters)
        // but it'll be ignored by the caller in that case
        return selection;
    }

    jQuery.fn.extend({
        load: function( url, params, callback ) {
            if ( typeof url !== "string" && _load ) {
                return _load.apply( this, arguments );

                // Don't do a request if no elements are being requested
            } else if ( !this.length ) {
                return this;
            }

            var off = url.indexOf( " " );
            if ( off >= 0 ) {
                var selector = url.slice( off, url.length );
                url = url.slice( 0, off );
            }

            // Default to a GET request
            var type = "GET";

            // If the second parameter was provided
            if ( params ) {
                // If it's a function
                if ( jQuery.isFunction( params ) ) {
                    // We assume that it's the callback
                    callback = params;
                    params = undefined;

                    // Otherwise, build a param string
                } else if ( typeof params === "object" ) {
                    params = jQuery.param( params, jQuery.ajaxSettings.traditional );
                    type = "POST";
                }
            }

            var self = this;

            // Request the remote document
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                // Complete callback (responseText is used internally)
                complete: function( jqXHR, status, responseText ) {
                    // Store the response as specified by the jqXHR object
                    responseText = jqXHR.responseText;
                    // If successful, inject the HTML into all the matched elements
                    if ( jqXHR.isResolved() ) {
                        // #4825: Get the actual response in case
                        // a dataFilter is present in ajaxSettings
                        jqXHR.done(function( r ) {
                            responseText = r;
                        });
                        // See if a selector was specified
                        self.html( selector ?
                            // Create a dummy div to hold the results
                            jQuery("<div>")
                                // inject the contents of the document in, removing the scripts
                                // to avoid any 'Permission Denied' errors in IE
                                .append(responseText.replace(rscript, ""))

                                // Locate the specified elements
                                .find(selector) :

                            // If not, just inject the full result
                            responseText );
                    }

                    if ( callback ) {
                        self.each( callback, [ responseText, status, jqXHR ] );
                    }
                }
            });

            return this;
        },

        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },

        serializeArray: function() {
            return this.map(function(){
                return this.elements ? jQuery.makeArray( this.elements ) : this;
            })
                .filter(function(){
                    return this.name && !this.disabled &&
                        ( this.checked || rselectTextarea.test( this.nodeName ) ||
                            rinput.test( this.type ) );
                })
                .map(function( i, elem ){
                    var val = jQuery( this ).val();

                    return val == null ?
                        null :
                        jQuery.isArray( val ) ?
                            jQuery.map( val, function( val, i ){
                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                            }) :
                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                }).get();
        }
    });

// Attach a bunch of functions for handling common AJAX events
    jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
        jQuery.fn[ o ] = function( f ){
            return this.bind( o, f );
        };
    });

    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            // shift arguments if data argument was omitted
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return jQuery.ajax({
                type: method,
                url: url,
                data: data,
                success: callback,
                dataType: type
            });
        };
    });

    jQuery.extend({

        getScript: function( url, callback ) {
            return jQuery.get( url, undefined, callback, "script" );
        },

        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        },

        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function ( target, settings ) {
            if ( !settings ) {
                // Only one parameter, we extend ajaxSettings
                settings = target;
                target = jQuery.extend( true, jQuery.ajaxSettings, settings );
            } else {
                // target was provided, we extend into it
                jQuery.extend( true, target, jQuery.ajaxSettings, settings );
            }
            // Flatten fields we don't want deep extended
            for( var field in { context: 1, url: 1 } ) {
                if ( field in settings ) {
                    target[ field ] = settings[ field ];
                } else if( field in jQuery.ajaxSettings ) {
                    target[ field ] = jQuery.ajaxSettings[ field ];
                }
            }
            return target;
        },

        ajaxSettings: {
            url: ajaxLocation,
            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
            global: true,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            /*
             timeout: 0,
             data: null,
             dataType: null,
             username: null,
             password: null,
             cache: null,
             traditional: false,
             headers: {},
             */

            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": "*/*"
            },

            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },

            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },

            // List of data converters
            // 1) key format is "source_type destination_type" (a single space in-between)
            // 2) the catchall symbol "*" can be used for source_type
            converters: {

                // Convert anything to text
                "* text": window.String,

                // Text to html (true = no transformation)
                "text html": true,

                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,

                // Parse text as xml
                "text xml": jQuery.parseXML
            }
        },

        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),

        // Main method
        ajax: function( url, options ) {

            // If url is an object, simulate pre-1.5 signature
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }

            // Force options to be an object
            options = options || {};

            var // Create the final options object
                s = jQuery.ajaxSetup( {}, options ),
            // Callbacks context
                callbackContext = s.context || s,
            // Context for global events
            // It's the callbackContext if one was provided in the options
            // and if it's a DOM node or a jQuery collection
                globalEventContext = callbackContext !== s &&
                    ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                    jQuery( callbackContext ) : jQuery.event,
            // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery._Deferred(),
            // Status-dependent callbacks
                statusCode = s.statusCode || {},
            // ifModified key
                ifModifiedKey,
            // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
            // Response headers
                responseHeadersString,
                responseHeaders,
            // transport
                transport,
            // timeout handle
                timeoutTimer,
            // Cross-domain detection vars
                parts,
            // The jqXHR state
                state = 0,
            // To know if global events are to be dispatched
                fireGlobals,
            // Loop variable
                i,
            // Fake xhr
                jqXHR = {

                    readyState: 0,

                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        if ( !state ) {
                            var lname = name.toLowerCase();
                            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                            requestHeaders[ name ] = value;
                        }
                        return this;
                    },

                    // Raw string
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },

                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( state === 2 ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() ];
                        }
                        return match === undefined ? null : match;
                    },

                    // Overrides response content-type header
                    overrideMimeType: function( type ) {
                        if ( !state ) {
                            s.mimeType = type;
                        }
                        return this;
                    },

                    // Cancel the request
                    abort: function( statusText ) {
                        statusText = statusText || "abort";
                        if ( transport ) {
                            transport.abort( statusText );
                        }
                        done( 0, statusText );
                        return this;
                    }
                };

            // Callback for when everything is done
            // It is defined here because jslint complains if it is declared
            // at the end of the function (which would be more logical and readable)
            function done( status, statusText, responses, headers ) {

                // Called once
                if ( state === 2 ) {
                    return;
                }

                // State is "done" now
                state = 2;

                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    clearTimeout( timeoutTimer );
                }

                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;

                // Cache response headers
                responseHeadersString = headers || "";

                // Set readyState
                jqXHR.readyState = status ? 4 : 0;

                var isSuccess,
                    success,
                    error,
                    response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
                    lastModified,
                    etag;

                // If successful, handle type chaining
                if ( status >= 200 && status < 300 || status === 304 ) {

                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {

                        if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
                            jQuery.lastModified[ ifModifiedKey ] = lastModified;
                        }
                        if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
                            jQuery.etag[ ifModifiedKey ] = etag;
                        }
                    }

                    // If not modified
                    if ( status === 304 ) {

                        statusText = "notmodified";
                        isSuccess = true;

                        // If we have data
                    } else {

                        try {
                            success = ajaxConvert( s, response );
                            statusText = "success";
                            isSuccess = true;
                        } catch(e) {
                            // We have a parsererror
                            statusText = "parsererror";
                            error = e;
                        }
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if( !statusText || status ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }

                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = statusText;

                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                }

                // Status-dependent callbacks
                jqXHR.statusCode( statusCode );
                statusCode = undefined;

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jqXHR, s, isSuccess ? success : error ] );
                }

                // Complete
                completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger( "ajaxStop" );
                    }
                }
            }

            // Attach deferreds
            deferred.promise( jqXHR );
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            jqXHR.complete = completeDeferred.done;

            // Status-dependent callbacks
            jqXHR.statusCode = function( map ) {
                if ( map ) {
                    var tmp;
                    if ( state < 2 ) {
                        for( tmp in map ) {
                            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                        }
                    } else {
                        tmp = map[ jqXHR.status ];
                        jqXHR.then( tmp, tmp );
                    }
                }
                return this;
            };

            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // We also use the url parameter if available
            s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

            // Extract dataTypes list
            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

            // Determine if a cross-domain request is in order
            if ( s.crossDomain == null ) {
                parts = rurl.exec( s.url.toLowerCase() );
                s.crossDomain = !!( parts &&
                    ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
                        ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
                    );
            }

            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }

            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

            // If request was aborted inside a prefiler, stop there
            if ( state === 2 ) {
                return false;
            }

            // We can fire global events as of now if asked to
            fireGlobals = s.global;

            // Uppercase the type
            s.type = s.type.toUpperCase();

            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );

            // Watch for a new set of requests
            if ( fireGlobals && jQuery.active++ === 0 ) {
                jQuery.event.trigger( "ajaxStart" );
            }

            // More options handling for requests with no content
            if ( !s.hasContent ) {

                // If data is available, append data to url
                if ( s.data ) {
                    s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                }

                // Get ifModifiedKey before adding the anti-cache parameter
                ifModifiedKey = s.url;

                // Add anti-cache in url if needed
                if ( s.cache === false ) {

                    var ts = jQuery.now(),
                    // try replacing _= if it is there
                        ret = s.url.replace( rts, "$1_=" + ts );

                    // if nothing was replaced, add timestamp to the end
                    s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
                }
            }

            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                jqXHR.setRequestHeader( "Content-Type", s.contentType );
            }

            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                ifModifiedKey = ifModifiedKey || s.url;
                if ( jQuery.lastModified[ ifModifiedKey ] ) {
                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
                }
                if ( jQuery.etag[ ifModifiedKey ] ) {
                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
                }
            }

            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                    s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
                    s.accepts[ "*" ]
            );

            // Check for headers option
            for ( i in s.headers ) {
                jqXHR.setRequestHeader( i, s.headers[ i ] );
            }

            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already
                jqXHR.abort();
                return false;

            }

            // Install callbacks on deferreds
            for ( i in { success: 1, error: 1, complete: 1 } ) {
                jqXHR[ i ]( s[ i ] );
            }

            // Get transport
            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

            // If no transport, we auto-abort
            if ( !transport ) {
                done( -1, "No Transport" );
            } else {
                jqXHR.readyState = 1;
                // Send global event
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                }
                // Timeout
                if ( s.async && s.timeout > 0 ) {
                    timeoutTimer = setTimeout( function(){
                        jqXHR.abort( "timeout" );
                    }, s.timeout );
                }

                try {
                    state = 1;
                    transport.send( requestHeaders, done );
                } catch (e) {
                    // Propagate exception as error if not done
                    if ( status < 2 ) {
                        done( -1, e );
                        // Simply rethrow otherwise
                    } else {
                        jQuery.error( e );
                    }
                }
            }

            return jqXHR;
        },

        // Serialize an array of form elements or a set of
        // key/values into a query string
        param: function( a, traditional ) {
            var s = [],
                add = function( key, value ) {
                    // If value is a function, invoke it and return its value
                    value = jQuery.isFunction( value ) ? value() : value;
                    s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
                };

            // Set traditional to true for jQuery <= 1.3.2 behavior.
            if ( traditional === undefined ) {
                traditional = jQuery.ajaxSettings.traditional;
            }

            // If an array was passed in, assume that it is an array of form elements.
            if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
                // Serialize the form elements
                jQuery.each( a, function() {
                    add( this.name, this.value );
                });

            } else {
                // If traditional, encode the "old" way (the way 1.3.2 or older
                // did it), otherwise encode params recursively.
                for ( var prefix in a ) {
                    buildParams( prefix, a[ prefix ], traditional, add );
                }
            }

            // Return the resulting serialization
            return s.join( "&" ).replace( r20, "+" );
        }
    });

    function buildParams( prefix, obj, traditional, add ) {
        if ( jQuery.isArray( obj ) ) {
            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if ( !traditional && obj != null && typeof obj === "object" ) {
            // Serialize object item.
            for ( var name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
    jQuery.extend({

        // Counter for holding the number of active queries
        active: 0,

        // Last-Modified header cache for next request
        lastModified: {},
        etag: {}

    });

    /* Handles responses to an ajax request:
     * - sets all responseXXX fields accordingly
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {

        var contents = s.contents,
            dataTypes = s.dataTypes,
            responseFields = s.responseFields,
            ct,
            type,
            finalDataType,
            firstDataType;

        // Fill responseXXX fields
        for( type in responseFields ) {
            if ( type in responses ) {
                jqXHR[ responseFields[type] ] = responses[ type ];
            }
        }

        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
            }
        }

        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }

        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }

        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }

// Chain conversions given the request and the original response
    function ajaxConvert( s, response ) {

        // Apply the dataFilter if provided
        if ( s.dataFilter ) {
            response = s.dataFilter( response, s.dataType );
        }

        var dataTypes = s.dataTypes,
            converters = {},
            i,
            key,
            length = dataTypes.length,
            tmp,
        // Current and previous dataTypes
            current = dataTypes[ 0 ],
            prev,
        // Conversion expression
            conversion,
        // Conversion function
            conv,
        // Conversion functions (transitive conversion)
            conv1,
            conv2;

        // For each dataType in the chain
        for( i = 1; i < length; i++ ) {

            // Create converters map
            // with lowercased keys
            if ( i === 1 ) {
                for( key in s.converters ) {
                    if( typeof key === "string" ) {
                        converters[ key.toLowerCase() ] = s.converters[ key ];
                    }
                }
            }

            // Get the dataTypes
            prev = current;
            current = dataTypes[ i ];

            // If current is auto dataType, update it to prev
            if( current === "*" ) {
                current = prev;
                // If no auto and dataTypes are actually different
            } else if ( prev !== "*" && prev !== current ) {

                // Get the converter
                conversion = prev + " " + current;
                conv = converters[ conversion ] || converters[ "* " + current ];

                // If there is no direct converter, search transitively
                if ( !conv ) {
                    conv2 = undefined;
                    for( conv1 in converters ) {
                        tmp = conv1.split( " " );
                        if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
                            conv2 = converters[ tmp[1] + " " + current ];
                            if ( conv2 ) {
                                conv1 = converters[ conv1 ];
                                if ( conv1 === true ) {
                                    conv = conv2;
                                } else if ( conv2 === true ) {
                                    conv = conv1;
                                }
                                break;
                            }
                        }
                    }
                }
                // If we found no converter, dispatch an error
                if ( !( conv || conv2 ) ) {
                    jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
                }
                // If found converter is not an equivalence
                if ( conv !== true ) {
                    // Convert with 1 or 2 converters accordingly
                    response = conv ? conv( response ) : conv2( conv1(response) );
                }
            }
        }
        return response;
    }




    var jsc = jQuery.now(),
        jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return jQuery.expando + "_" + ( jsc++ );
        }
    });

// Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

        var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
            ( typeof s.data === "string" );

        if ( s.dataTypes[ 0 ] === "jsonp" ||
            s.jsonp !== false && ( jsre.test( s.url ) ||
                inspectData && jsre.test( s.data ) ) ) {

            var responseContainer,
                jsonpCallback = s.jsonpCallback =
                    jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
                previous = window[ jsonpCallback ],
                url = s.url,
                data = s.data,
                replace = "$1" + jsonpCallback + "$2";

            if ( s.jsonp !== false ) {
                url = url.replace( jsre, replace );
                if ( s.url === url ) {
                    if ( inspectData ) {
                        data = data.replace( jsre, replace );
                    }
                    if ( s.data === data ) {
                        // Add callback manually
                        url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                    }
                }
            }

            s.url = url;
            s.data = data;

            // Install callback
            window[ jsonpCallback ] = function( response ) {
                responseContainer = [ response ];
            };

            // Clean-up function
            jqXHR.always(function() {
                // Set callback back to previous value
                window[ jsonpCallback ] = previous;
                // Call if it was a function and we have a response
                if ( responseContainer && jQuery.isFunction( previous ) ) {
                    window[ jsonpCallback ]( responseContainer[ 0 ] );
                }
            });

            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function() {
                if ( !responseContainer ) {
                    jQuery.error( jsonpCallback + " was not called" );
                }
                return responseContainer[ 0 ];
            };

            // force json dataType
            s.dataTypes[ 0 ] = "json";

            // Delegate to script
            return "script";
        }
    });




// Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    });

// Handle cache's special case and global
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });

// Bind script tag hack transport
    jQuery.ajaxTransport( "script", function(s) {

        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {

            var script,
                head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

            return {

                send: function( _, callback ) {

                    script = document.createElement( "script" );

                    script.async = "async";

                    if ( s.scriptCharset ) {
                        script.charset = s.scriptCharset;
                    }

                    script.src = s.url;

                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function( _, isAbort ) {

                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;

                            // Remove the script
                            if ( head && script.parentNode ) {
                                head.removeChild( script );
                            }

                            // Dereference the script
                            script = undefined;

                            // Callback if not abort
                            if ( !isAbort ) {
                                callback( 200, "success" );
                            }
                        }
                    };
                    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                    // This arises when a base node is used (#2709 and #4378).
                    head.insertBefore( script, head.firstChild );
                },

                abort: function() {
                    if ( script ) {
                        script.onload( 0, 1 );
                    }
                }
            };
        }
    });




    var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
        xhrOnUnloadAbort = window.ActiveXObject ? function() {
            // Abort all pending requests
            for ( var key in xhrCallbacks ) {
                xhrCallbacks[ key ]( 0, 1 );
            }
        } : false,
        xhrId = 0,
        xhrCallbacks;

// Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch( e ) {}
    }

    function createActiveXHR() {
        try {
            return new window.ActiveXObject( "Microsoft.XMLHTTP" );
        } catch( e ) {}
    }

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function() {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;

// Determine support properties
    (function( xhr ) {
        jQuery.extend( jQuery.support, {
            ajax: !!xhr,
            cors: !!xhr && ( "withCredentials" in xhr )
        });
    })( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
    if ( jQuery.support.ajax ) {

        jQuery.ajaxTransport(function( s ) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if ( !s.crossDomain || jQuery.support.cors ) {

                var callback;

                return {
                    send: function( headers, complete ) {

                        // Get a new xhr
                        var xhr = s.xhr(),
                            handle,
                            i;

                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if ( s.username ) {
                            xhr.open( s.type, s.url, s.async, s.username, s.password );
                        } else {
                            xhr.open( s.type, s.url, s.async );
                        }

                        // Apply custom fields if provided
                        if ( s.xhrFields ) {
                            for ( i in s.xhrFields ) {
                                xhr[ i ] = s.xhrFields[ i ];
                            }
                        }

                        // Override mime type if needed
                        if ( s.mimeType && xhr.overrideMimeType ) {
                            xhr.overrideMimeType( s.mimeType );
                        }

                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                            headers[ "X-Requested-With" ] = "XMLHttpRequest";
                        }

                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for ( i in headers ) {
                                xhr.setRequestHeader( i, headers[ i ] );
                            }
                        } catch( _ ) {}

                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send( ( s.hasContent && s.data ) || null );

                        // Listener
                        callback = function( _, isAbort ) {

                            var status,
                                statusText,
                                responseHeaders,
                                responses,
                                xml;

                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occured
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {

                                // Was never called and is aborted or complete
                                if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                    // Only called once
                                    callback = undefined;

                                    // Do not keep as active anymore
                                    if ( handle ) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if ( xhrOnUnloadAbort ) {
                                            delete xhrCallbacks[ handle ];
                                        }
                                    }

                                    // If it's an abort
                                    if ( isAbort ) {
                                        // Abort it manually if needed
                                        if ( xhr.readyState !== 4 ) {
                                            xhr.abort();
                                        }
                                    } else {
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
                                        responses = {};
                                        xml = xhr.responseXML;

                                        // Construct response list
                                        if ( xml && xml.documentElement /* #4958 */ ) {
                                            responses.xml = xml;
                                        }
                                        responses.text = xhr.responseText;

                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch( e ) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }

                                        // Filter status for non standard behaviors

                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if ( !status && s.isLocal && !s.crossDomain ) {
                                            status = responses.text ? 200 : 404;
                                            // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if ( status === 1223 ) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch( firefoxAccessException ) {
                                if ( !isAbort ) {
                                    complete( -1, firefoxAccessException );
                                }
                            }

                            // Call complete if needed
                            if ( responses ) {
                                complete( status, statusText, responses, responseHeaders );
                            }
                        };

                        // if we're in sync mode or it's in cache
                        // and has been retrieved directly (IE6 & IE7)
                        // we need to manually fire the callback
                        if ( !s.async || xhr.readyState === 4 ) {
                            callback();
                        } else {
                            handle = ++xhrId;
                            if ( xhrOnUnloadAbort ) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if ( !xhrCallbacks ) {
                                    xhrCallbacks = {};
                                    jQuery( window ).unload( xhrOnUnloadAbort );
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[ handle ] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },

                    abort: function() {
                        if ( callback ) {
                            callback(0,1);
                        }
                    }
                };
            }
        });
    }




    var elemdisplay = {},
        iframe, iframeDoc,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        timerId,
        fxAttrs = [
            // height animations
            [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
            // width animations
            [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
            // opacity animations
            [ "opacity" ]
        ],
        fxNow,
        requestAnimationFrame = window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame;

    jQuery.fn.extend({
        show: function( speed, easing, callback ) {
            var elem, display;

            if ( speed || speed === 0 ) {
                return this.animate( genFx("show", 3), speed, easing, callback);

            } else {
                for ( var i = 0, j = this.length; i < j; i++ ) {
                    elem = this[i];

                    if ( elem.style ) {
                        display = elem.style.display;

                        // Reset the inline display of this element to learn if it is
                        // being hidden by cascaded rules or not
                        if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
                            display = elem.style.display = "";
                        }

                        // Set elements which have been overridden with display: none
                        // in a stylesheet to whatever the default browser style is
                        // for such an element
                        if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
                            jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                        }
                    }
                }

                // Set the display of most of the elements in a second loop
                // to avoid the constant reflow
                for ( i = 0; i < j; i++ ) {
                    elem = this[i];

                    if ( elem.style ) {
                        display = elem.style.display;

                        if ( display === "" || display === "none" ) {
                            elem.style.display = jQuery._data(elem, "olddisplay") || "";
                        }
                    }
                }

                return this;
            }
        },

        hide: function( speed, easing, callback ) {
            if ( speed || speed === 0 ) {
                return this.animate( genFx("hide", 3), speed, easing, callback);

            } else {
                for ( var i = 0, j = this.length; i < j; i++ ) {
                    if ( this[i].style ) {
                        var display = jQuery.css( this[i], "display" );

                        if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
                            jQuery._data( this[i], "olddisplay", display );
                        }
                    }
                }

                // Set the display of the elements in a second loop
                // to avoid the constant reflow
                for ( i = 0; i < j; i++ ) {
                    if ( this[i].style ) {
                        this[i].style.display = "none";
                    }
                }

                return this;
            }
        },

        // Save the old toggle function
        _toggle: jQuery.fn.toggle,

        toggle: function( fn, fn2, callback ) {
            var bool = typeof fn === "boolean";

            if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
                this._toggle.apply( this, arguments );

            } else if ( fn == null || bool ) {
                this.each(function() {
                    var state = bool ? fn : jQuery(this).is(":hidden");
                    jQuery(this)[ state ? "show" : "hide" ]();
                });

            } else {
                this.animate(genFx("toggle", 3), fn, fn2, callback);
            }

            return this;
        },

        fadeTo: function( speed, to, easing, callback ) {
            return this.filter(":hidden").css("opacity", 0).show().end()
                .animate({opacity: to}, speed, easing, callback);
        },

        animate: function( prop, speed, easing, callback ) {
            var optall = jQuery.speed(speed, easing, callback);

            if ( jQuery.isEmptyObject( prop ) ) {
                return this.each( optall.complete, [ false ] );
            }

            // Do not change referenced properties as per-property easing will be lost
            prop = jQuery.extend( {}, prop );

            return this[ optall.queue === false ? "each" : "queue" ](function() {
                // XXX 'this' does not always have a nodeName when running the
                // test suite

                if ( optall.queue === false ) {
                    jQuery._mark( this );
                }

                var opt = jQuery.extend( {}, optall ),
                    isElement = this.nodeType === 1,
                    hidden = isElement && jQuery(this).is(":hidden"),
                    name, val, p,
                    display, e,
                    parts, start, end, unit;

                // will store per property easing and be used to determine when an animation is complete
                opt.animatedProperties = {};

                for ( p in prop ) {

                    // property name normalization
                    name = jQuery.camelCase( p );
                    if ( p !== name ) {
                        prop[ name ] = prop[ p ];
                        delete prop[ p ];
                    }

                    val = prop[ name ];

                    // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
                    if ( jQuery.isArray( val ) ) {
                        opt.animatedProperties[ name ] = val[ 1 ];
                        val = prop[ name ] = val[ 0 ];
                    } else {
                        opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
                    }

                    if ( val === "hide" && hidden || val === "show" && !hidden ) {
                        return opt.complete.call( this );
                    }

                    if ( isElement && ( name === "height" || name === "width" ) ) {
                        // Make sure that nothing sneaks out
                        // Record all 3 overflow attributes because IE does not
                        // change the overflow attribute when overflowX and
                        // overflowY are set to the same value
                        opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

                        // Set display property to inline-block for height/width
                        // animations on inline elements that are having width/height
                        // animated
                        if ( jQuery.css( this, "display" ) === "inline" &&
                            jQuery.css( this, "float" ) === "none" ) {
                            if ( !jQuery.support.inlineBlockNeedsLayout ) {
                                this.style.display = "inline-block";

                            } else {
                                display = defaultDisplay( this.nodeName );

                                // inline-level elements accept inline-block;
                                // block-level elements need to be inline with layout
                                if ( display === "inline" ) {
                                    this.style.display = "inline-block";

                                } else {
                                    this.style.display = "inline";
                                    this.style.zoom = 1;
                                }
                            }
                        }
                    }
                }

                if ( opt.overflow != null ) {
                    this.style.overflow = "hidden";
                }

                for ( p in prop ) {
                    e = new jQuery.fx( this, opt, p );
                    val = prop[ p ];

                    if ( rfxtypes.test(val) ) {
                        e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

                    } else {
                        parts = rfxnum.exec( val );
                        start = e.cur();

                        if ( parts ) {
                            end = parseFloat( parts[2] );
                            unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

                            // We need to compute starting value
                            if ( unit !== "px" ) {
                                jQuery.style( this, p, (end || 1) + unit);
                                start = ((end || 1) / e.cur()) * start;
                                jQuery.style( this, p, start + unit);
                            }

                            // If a +=/-= token was provided, we're doing a relative animation
                            if ( parts[1] ) {
                                end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
                            }

                            e.custom( start, end, unit );

                        } else {
                            e.custom( start, val, "" );
                        }
                    }
                }

                // For JS strict compliance
                return true;
            });
        },

        stop: function( clearQueue, gotoEnd ) {
            if ( clearQueue ) {
                this.queue([]);
            }

            this.each(function() {
                var timers = jQuery.timers,
                    i = timers.length;
                // clear marker counters if we know they won't be
                if ( !gotoEnd ) {
                    jQuery._unmark( true, this );
                }
                while ( i-- ) {
                    if ( timers[i].elem === this ) {
                        if (gotoEnd) {
                            // force the next step to be the last
                            timers[i](true);
                        }

                        timers.splice(i, 1);
                    }
                }
            });

            // start the next in the queue if the last step wasn't forced
            if ( !gotoEnd ) {
                this.dequeue();
            }

            return this;
        }

    });

// Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout( clearFxNow, 0 );
        return ( fxNow = jQuery.now() );
    }

    function clearFxNow() {
        fxNow = undefined;
    }

// Generate parameters to create a standard animation
    function genFx( type, num ) {
        var obj = {};

        jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
            obj[ this ] = type;
        });

        return obj;
    }

// Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show", 1),
        slideUp: genFx("hide", 1),
        slideToggle: genFx("toggle", 1),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });

    jQuery.extend({
        speed: function( speed, easing, fn ) {
            var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
                complete: fn || !fn && easing ||
                    jQuery.isFunction( speed ) && speed,
                duration: speed,
                easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
            };

            opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
                opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

            // Queueing
            opt.old = opt.complete;
            opt.complete = function( noUnmark ) {
                if ( jQuery.isFunction( opt.old ) ) {
                    opt.old.call( this );
                }

                if ( opt.queue !== false ) {
                    jQuery.dequeue( this );
                } else if ( noUnmark !== false ) {
                    jQuery._unmark( this );
                }
            };

            return opt;
        },

        easing: {
            linear: function( p, n, firstNum, diff ) {
                return firstNum + diff * p;
            },
            swing: function( p, n, firstNum, diff ) {
                return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
            }
        },

        timers: [],

        fx: function( elem, options, prop ) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;

            options.orig = options.orig || {};
        }

    });

    jQuery.fx.prototype = {
        // Simple function for setting a style value
        update: function() {
            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }

            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
        },

        // Get the current size
        cur: function() {
            if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
                return this.elem[ this.prop ];
            }

            var parsed,
                r = jQuery.css( this.elem, this.prop );
            // Empty strings, null, undefined and "auto" are converted to 0,
            // complex values such as "rotate(1rad)" are returned as is,
            // simple values such as "10px" are parsed to Float.
            return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
        },

        // Start an animation from one number to another
        custom: function( from, to, unit ) {
            var self = this,
                fx = jQuery.fx,
                raf;

            this.startTime = fxNow || createFxNow();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
            this.now = this.start;
            this.pos = this.state = 0;

            function t( gotoEnd ) {
                return self.step(gotoEnd);
            }

            t.elem = this.elem;

            if ( t() && jQuery.timers.push(t) && !timerId ) {
                // Use requestAnimationFrame instead of setInterval if available
                if ( requestAnimationFrame ) {
                    timerId = true;
                    raf = function() {
                        // When timerId gets set to null at any point, this stops
                        if ( timerId ) {
                            requestAnimationFrame( raf );
                            fx.tick();
                        }
                    };
                    requestAnimationFrame( raf );
                } else {
                    timerId = setInterval( fx.tick, fx.interval );
                }
            }
        },

        // Simple 'show' function
        show: function() {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
            this.options.show = true;

            // Begin the animation
            // Make sure that we start at a small width/height to avoid any
            // flash of content
            this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

            // Start by showing the element
            jQuery( this.elem ).show();
        },

        // Simple 'hide' function
        hide: function() {
            // Remember where we started, so that we can go back to it later
            this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
            this.options.hide = true;

            // Begin the animation
            this.custom(this.cur(), 0);
        },

        // Each step of an animation
        step: function( gotoEnd ) {
            var t = fxNow || createFxNow(),
                done = true,
                elem = this.elem,
                options = this.options,
                i, n;

            if ( gotoEnd || t >= options.duration + this.startTime ) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();

                options.animatedProperties[ this.prop ] = true;

                for ( i in options.animatedProperties ) {
                    if ( options.animatedProperties[i] !== true ) {
                        done = false;
                    }
                }

                if ( done ) {
                    // Reset the overflow
                    if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

                        jQuery.each( [ "", "X", "Y" ], function (index, value) {
                            elem.style[ "overflow" + value ] = options.overflow[index];
                        });
                    }

                    // Hide the element if the "hide" operation was done
                    if ( options.hide ) {
                        jQuery(elem).hide();
                    }

                    // Reset the properties, if the item has been hidden or shown
                    if ( options.hide || options.show ) {
                        for ( var p in options.animatedProperties ) {
                            jQuery.style( elem, p, options.orig[p] );
                        }
                    }

                    // Execute the complete function
                    options.complete.call( elem );
                }

                return false;

            } else {
                // classical easing cannot be used with an Infinity duration
                if ( options.duration == Infinity ) {
                    this.now = t;
                } else {
                    n = t - this.startTime;
                    this.state = n / options.duration;

                    // Perform the easing function, defaults to swing
                    this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
                    this.now = this.start + ((this.end - this.start) * this.pos);
                }
                // Perform the next step of the animation
                this.update();
            }

            return true;
        }
    };

    jQuery.extend( jQuery.fx, {
        tick: function() {
            for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
                if ( !timers[i]() ) {
                    timers.splice(i--, 1);
                }
            }

            if ( !timers.length ) {
                jQuery.fx.stop();
            }
        },

        interval: 13,

        stop: function() {
            clearInterval( timerId );
            timerId = null;
        },

        speeds: {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        },

        step: {
            opacity: function( fx ) {
                jQuery.style( fx.elem, "opacity", fx.now );
            },

            _default: function( fx ) {
                if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                    fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
                } else {
                    fx.elem[ fx.prop ] = fx.now;
                }
            }
        }
    });

    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }

// Try to restore the default display value of an element
    function defaultDisplay( nodeName ) {

        if ( !elemdisplay[ nodeName ] ) {

            var body = document.body,
                elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
                display = elem.css( "display" );

            elem.remove();

            // If the simple way fails,
            // get element's real default display by attaching it to a temp iframe
            if ( display === "none" || display === "" ) {
                // No iframe to use yet, so create it
                if ( !iframe ) {
                    iframe = document.createElement( "iframe" );
                    iframe.frameBorder = iframe.width = iframe.height = 0;
                }

                body.appendChild( iframe );

                // Create a cacheable copy of the iframe document on first call.
                // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
                // document to it; WebKit & Firefox won't allow reusing the iframe document.
                if ( !iframeDoc || !iframe.createElement ) {
                    iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
                    iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
                    iframeDoc.close();
                }

                elem = iframeDoc.createElement( nodeName );

                iframeDoc.body.appendChild( elem );

                display = jQuery.css( elem, "display" );

                body.removeChild( iframe );
            }

            // Store the correct default display
            elemdisplay[ nodeName ] = display;
        }

        return elemdisplay[ nodeName ];
    }




    var rtable = /^t(?:able|d|h)$/i,
        rroot = /^(?:body|html)$/i;

    if ( "getBoundingClientRect" in document.documentElement ) {
        jQuery.fn.offset = function( options ) {
            var elem = this[0], box;

            if ( options ) {
                return this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
            }

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            if ( elem === elem.ownerDocument.body ) {
                return jQuery.offset.bodyOffset( elem );
            }

            try {
                box = elem.getBoundingClientRect();
            } catch(e) {}

            var doc = elem.ownerDocument,
                docElem = doc.documentElement;

            // Make sure we're not dealing with a disconnected DOM node
            if ( !box || !jQuery.contains( docElem, elem ) ) {
                return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
            }

            var body = doc.body,
                win = getWindow(doc),
                clientTop  = docElem.clientTop  || body.clientTop  || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
                scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
                top  = box.top  + scrollTop  - clientTop,
                left = box.left + scrollLeft - clientLeft;

            return { top: top, left: left };
        };

    } else {
        jQuery.fn.offset = function( options ) {
            var elem = this[0];

            if ( options ) {
                return this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
            }

            if ( !elem || !elem.ownerDocument ) {
                return null;
            }

            if ( elem === elem.ownerDocument.body ) {
                return jQuery.offset.bodyOffset( elem );
            }

            jQuery.offset.initialize();

            var computedStyle,
                offsetParent = elem.offsetParent,
                prevOffsetParent = elem,
                doc = elem.ownerDocument,
                docElem = doc.documentElement,
                body = doc.body,
                defaultView = doc.defaultView,
                prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
                top = elem.offsetTop,
                left = elem.offsetLeft;

            while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
                if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                    break;
                }

                computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
                top  -= elem.scrollTop;
                left -= elem.scrollLeft;

                if ( elem === offsetParent ) {
                    top  += elem.offsetTop;
                    left += elem.offsetLeft;

                    if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
                        top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                        left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                    }

                    prevOffsetParent = offsetParent;
                    offsetParent = elem.offsetParent;
                }

                if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
                    top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                    left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                }

                prevComputedStyle = computedStyle;
            }

            if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
                top  += body.offsetTop;
                left += body.offsetLeft;
            }

            if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                top  += Math.max( docElem.scrollTop, body.scrollTop );
                left += Math.max( docElem.scrollLeft, body.scrollLeft );
            }

            return { top: top, left: left };
        };
    }

    jQuery.offset = {
        initialize: function() {
            var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
                html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

            container.innerHTML = html;
            body.insertBefore( container, body.firstChild );
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;

            this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
            this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

            checkDiv.style.position = "fixed";
            checkDiv.style.top = "20px";

            // safari subtracts parent border width here which is 5px
            this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
            checkDiv.style.position = checkDiv.style.top = "";

            innerDiv.style.overflow = "hidden";
            innerDiv.style.position = "relative";

            this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

            body.removeChild( container );
            jQuery.offset.initialize = jQuery.noop;
        },

        bodyOffset: function( body ) {
            var top = body.offsetTop,
                left = body.offsetLeft;

            jQuery.offset.initialize();

            if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
                top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
                left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
            }

            return { top: top, left: left };
        },

        setOffset: function( elem, options, i ) {
            var position = jQuery.css( elem, "position" );

            // set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }

            var curElem = jQuery( elem ),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css( elem, "top" ),
                curCSSLeft = jQuery.css( elem, "left" ),
                calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if ( calculatePosition ) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat( curCSSTop ) || 0;
                curLeft = parseFloat( curCSSLeft ) || 0;
            }

            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };


    jQuery.fn.extend({
        position: function() {
            if ( !this[0] ) {
                return null;
            }

            var elem = this[0],

            // Get *real* offsetParent
                offsetParent = this.offsetParent(),

            // Get correct offsets
                offset       = this.offset(),
                parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
            offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

            // Add offsetParent borders
            parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
            parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

            // Subtract the two offsets
            return {
                top:  offset.top  - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || document.body;
                while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent;
            });
        }
    });


// Create scrollLeft and scrollTop methods
    jQuery.each( ["Left", "Top"], function( i, name ) {
        var method = "scroll" + name;

        jQuery.fn[ method ] = function( val ) {
            var elem, win;

            if ( val === undefined ) {
                elem = this[ 0 ];

                if ( !elem ) {
                    return null;
                }

                win = getWindow( elem );

                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                    jQuery.support.boxModel && win.document.documentElement[ method ] ||
                        win.document.body[ method ] :
                    elem[ method ];
            }

            // Set the scroll offset
            return this.each(function() {
                win = getWindow( this );

                if ( win ) {
                    win.scrollTo(
                        !i ? val : jQuery( win ).scrollLeft(),
                        i ? val : jQuery( win ).scrollTop()
                    );

                } else {
                    this[ method ] = val;
                }
            });
        };
    });

    function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
    jQuery.each([ "Height", "Width" ], function( i, name ) {

        var type = name.toLowerCase();

        // innerHeight and innerWidth
        jQuery.fn[ "inner" + name ] = function() {
            var elem = this[0];
            return elem && elem.style ?
                parseFloat( jQuery.css( elem, type, "padding" ) ) :
                null;
        };

        // outerHeight and outerWidth
        jQuery.fn[ "outer" + name ] = function( margin ) {
            var elem = this[0];
            return elem && elem.style ?
                parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
                null;
        };

        jQuery.fn[ type ] = function( size ) {
            // Get window width or height
            var elem = this[0];
            if ( !elem ) {
                return size == null ? null : this;
            }

            if ( jQuery.isFunction( size ) ) {
                return this.each(function( i ) {
                    var self = jQuery( this );
                    self[ type ]( size.call( this, i, self[ type ]() ) );
                });
            }

            if ( jQuery.isWindow( elem ) ) {
                // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
                // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
                var docElemProp = elem.document.documentElement[ "client" + name ];
                return elem.document.compatMode === "CSS1Compat" && docElemProp ||
                    elem.document.body[ "client" + name ] || docElemProp;

                // Get document width or height
            } else if ( elem.nodeType === 9 ) {
                // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
                return Math.max(
                    elem.documentElement["client" + name],
                    elem.body["scroll" + name], elem.documentElement["scroll" + name],
                    elem.body["offset" + name], elem.documentElement["offset" + name]
                );

                // Get or set width or height on the element
            } else if ( size === undefined ) {
                var orig = jQuery.css( elem, type ),
                    ret = parseFloat( orig );

                return jQuery.isNaN( ret ) ? orig : ret;

                // Set the width or height on the element (default to pixels if value is unitless)
            } else {
                return this.css( type, typeof size === "string" ? size : size + "px" );
            }
        };

    });


// Expose jQuery to the global object
    window.jQuery = window.$ = jQuery;
})(window);

        amznpubstudio_jQuery = jQuery.noConflict(true);

/*!
 * jQuery UI 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.9m3",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(amznpubstudio_jQuery);
	/*!* jQuery UI Widget 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],g;a=a.split(".")[1];g=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][g]=function(f){return!!b.data(f,
a)};b[e]=b[e]||{};b[e][a]=function(f,i){arguments.length&&this._createWidget(f,i)};var h=new c;h.options=b.extend(true,{},h.options);b[e][a].prototype=b.extend(true,h,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:g,base:c.prototype},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",g=Array.prototype.slice.call(arguments,1),h=this;d=!e&&g.length?b.extend.apply(null,[true,d].concat(g)):d;if(e&&
d.charAt(0)==="_")return h;e?this.each(function(){var f=b.data(this,a),i=f&&b.isFunction(f[d])?f[d].apply(f,g):f;if(i!==f&&i!==j){h=i;return false}}):this.each(function(){var f=b.data(this,a);f?f.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=
b.extend(true,{},this.options,this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},_super:function(a){return this.base[a].apply(this,Array.prototype.slice.call(arguments,1))},_superApply:function(a,c){return this.base[a].apply(this,c)},destroy:function(){this.element.unbind("."+
this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,
c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var g;a;){g=b.event.props[--a];
c[g]=c.originalEvent[g]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(amznpubstudio_jQuery);

/*!
 * jQuery UI Mouse 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */


(function(c){c.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(b){return a._mouseDown(b)}).bind("click."+this.widgetName,function(b){if(a._preventClickEvent){a._preventClickEvent=false;b.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(a){a.originalEvent=a.originalEvent||{};if(!a.originalEvent.mouseHandled){this._mouseStarted&&
this._mouseUp(a);this._mouseDownEvent=a;var b=this,e=a.which==1,f=typeof this.options.cancel=="string"?c(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!e||f||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){b.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();
return true}}this._mouseMoveDelegate=function(d){return b._mouseMove(d)};this._mouseUpDelegate=function(d){return b._mouseUp(d)};c(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return a.originalEvent.mouseHandled=true}},_mouseMove:function(a){if(c.browser.msie&&!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);return a.preventDefault()}if(this._mouseDistanceMet(a)&&
this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){c(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);if(this._mouseStarted){this._mouseStarted=false;this._preventClickEvent=a.target==this._mouseDownEvent.target;this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-
a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(amznpubstudio_jQuery);

/*
 * jQuery UI Position 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function(c){c.ui=c.ui||{};var n=/left|center|right/,o=/top|center|bottom/,t=c.fn.position,u=c.fn.offset;c.fn.position=function(b){if(!b||!b.of)return t.apply(this,arguments);b=c.extend({},b);var a=c(b.of),d=a[0],g=(b.collision||"flip").split(" "),e=b.offset?b.offset.split(" "):[0,0],h,k,j;if(d.nodeType===9){h=a.width();k=a.height();j={top:0,left:0}}else if(d.setTimeout){h=a.width();k=a.height();j={top:a.scrollTop(),left:a.scrollLeft()}}else if(d.preventDefault){b.at="left top";h=k=0;j={top:b.of.pageY,
    left:b.of.pageX}}else{h=a.outerWidth();k=a.outerHeight();j=a.offset()}c.each(["my","at"],function(){var f=(b[this]||"").split(" ");if(f.length===1)f=n.test(f[0])?f.concat(["center"]):o.test(f[0])?["center"].concat(f):["center","center"];f[0]=n.test(f[0])?f[0]:"center";f[1]=o.test(f[1])?f[1]:"center";b[this]=f});if(g.length===1)g[1]=g[0];e[0]=parseInt(e[0],10)||0;if(e.length===1)e[1]=e[0];e[1]=parseInt(e[1],10)||0;if(b.at[0]==="right")j.left+=h;else if(b.at[0]==="center")j.left+=h/2;if(b.at[1]==="bottom")j.top+=
    k;else if(b.at[1]==="center")j.top+=k/2;j.left+=e[0];j.top+=e[1];return this.each(function(){var f=c(this),l=f.outerWidth(),m=f.outerHeight(),p=parseInt(c.curCSS(this,"marginLeft",true))||0,q=parseInt(c.curCSS(this,"marginTop",true))||0,v=l+p+parseInt(c.curCSS(this,"marginRight",true))||0,w=m+q+parseInt(c.curCSS(this,"marginBottom",true))||0,i=c.extend({},j),r;if(b.my[0]==="right")i.left-=l;else if(b.my[0]==="center")i.left-=l/2;if(b.my[1]==="bottom")i.top-=m;else if(b.my[1]==="center")i.top-=m/2;
    i.left=parseInt(i.left);i.top=parseInt(i.top);r={left:i.left-p,top:i.top-q};c.each(["left","top"],function(s,x){c.ui.position[g[s]]&&c.ui.position[g[s]][x](i,{targetWidth:h,targetHeight:k,elemWidth:l,elemHeight:m,collisionPosition:r,collisionWidth:v,collisionHeight:w,offset:e,my:b.my,at:b.at})});c.fn.bgiframe&&f.bgiframe();f.offset(c.extend(i,{using:b.using}))})};c.ui.position={fit:{left:function(b,a){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();b.left=d>0?
    b.left-d:Math.max(b.left-a.collisionPosition.left,b.left)},top:function(b,a){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();b.top=d>0?b.top-d:Math.max(b.top-a.collisionPosition.top,b.top)}},flip:{left:function(b,a){if(a.at[0]!=="center"){var d=c(window);d=a.collisionPosition.left+a.collisionWidth-d.width()-d.scrollLeft();var g=a.my[0]==="left"?-a.elemWidth:a.my[0]==="right"?a.elemWidth:0,e=a.at[0]==="left"?a.targetWidth:-a.targetWidth,h=-2*a.offset[0];b.left+=
    a.collisionPosition.left<0?g+e+h:d>0?g+e+h:0}},top:function(b,a){if(a.at[1]!=="center"){var d=c(window);d=a.collisionPosition.top+a.collisionHeight-d.height()-d.scrollTop();var g=a.my[1]==="top"?-a.elemHeight:a.my[1]==="bottom"?a.elemHeight:0,e=a.at[1]==="top"?a.targetHeight:-a.targetHeight,h=-2*a.offset[1];b.top+=a.collisionPosition.top<0?g+e+h:d>0?g+e+h:0}}}};if(!c.offset.setOffset){c.offset.setOffset=function(b,a){if(/static/.test(c.curCSS(b,"position")))b.style.position="relative";var d=c(b),
    g=d.offset(),e=parseInt(c.curCSS(b,"top",true),10)||0,h=parseInt(c.curCSS(b,"left",true),10)||0;g={top:a.top-g.top+e,left:a.left-g.left+h};"using"in a?a.using.call(b,g):d.css(g)};c.fn.offset=function(b){var a=this[0];if(!a||!a.ownerDocument)return null;if(b)return this.each(function(){c.offset.setOffset(this,b)});return u.call(this)}}})(amznpubstudio_jQuery);


/*
 * jQuery UI Button 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(a){var g,i=function(b){a(":ui-button",b.target.form).each(function(){var c=a(this).data("button");setTimeout(function(){c.refresh()},1)})},h=function(b){var c=b.name,d=b.form,e=a([]);if(c)e=d?a(d).find("[name='"+c+"']"):a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form});return e};a.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",
    i);if(typeof this.options.disabled!=="boolean")this.options.disabled=this.element.attr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var b=this,c=this.options,d=this.type==="checkbox"||this.type==="radio",e="ui-state-hover"+(!d?" ui-state-active":"");if(c.label===null)c.label=this.buttonElement.html();if(this.element.is(":disabled"))c.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",
    function(){if(!c.disabled){a(this).addClass("ui-state-hover");this===g&&a(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){c.disabled||a(this).removeClass(e)}).bind("focus.button",function(){a(this).addClass("ui-state-focus")}).bind("blur.button",function(){a(this).removeClass("ui-state-focus")});d&&this.element.bind("change.button",function(){b.refresh()});if(this.type==="checkbox")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).toggleClass("ui-state-active");
    b.buttonElement.attr("aria-pressed",b.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");b.buttonElement.attr("aria-pressed",true);var f=b.element[0];h(f).not(f).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed",false)});else{this.buttonElement.bind("mousedown.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");
    g=this;a(document).one("mouseup",function(){g=null})}).bind("mouseup.button",function(){if(c.disabled)return false;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(f){if(c.disabled)return false;if(f.keyCode==a.ui.keyCode.SPACE||f.keyCode==a.ui.keyCode.ENTER)a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(f){f.keyCode===a.ui.keyCode.SPACE&&a(this).click()})}this._setOption("disabled",
    c.disabled)},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type==="radio"){this.buttonElement=this.element.parents().last().find("label[for="+this.element.attr("id")+"]");this.element.addClass("ui-helper-hidden-accessible");var b=this.element.is(":checked");b&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",b)}else this.buttonElement=
    this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());this.hasTitle||
this.buttonElement.removeAttr("title");this._super("destroy")},_setOption:function(b,c){this._superApply("_setOption",arguments);if(b==="disabled")c?this.element.attr("disabled",true):this.element.removeAttr("disabled");this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b);if(this.type==="radio")h(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
    true):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false)});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false)},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var b=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
    c=a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,e=d.primary&&d.secondary;if(d.primary||d.secondary){b.addClass("ui-button-text-icon"+(e?"s":d.primary?"-primary":"-secondary"));d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>");d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>");if(!this.options.text){b.addClass(e?"ui-button-icons-only":"ui-button-icon-only").removeClass("ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary");
    this.hasTitle||b.attr("title",c)}}else b.addClass("ui-button-text-only")}}});a.widget("ui.buttonset",{_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c);this._superApply("_setOption",arguments)},refresh:function(){this.buttons=this.element.find(":button, :submit, :reset, :checkbox, :radio, a, :data(button)").filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":visible").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end().end()},
    destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");this._super("destroy")}})})(amznpubstudio_jQuery);

/*
 * jQuery UI Draggable 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false},_create:function(){if(this.options.helper==
"original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position="relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable")){this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy();return this}},_mouseCapture:function(a){var b=
this.options;if(this.helper||b.disabled||d(a.target).is(".ui-resizable-handle"))return false;this.handle=this._getHandle(a);if(!this.handle)return false;return true},_mouseStart:function(a){var b=this.options;this.helper=this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-
this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;this.originalPageY=a.pageY;b.cursorAt&&this._adjustOffsetFromHelper(b.cursorAt);b.containment&&this._setContainment();if(this._trigger("start",a)===false){this._clear();return false}this._cacheHelperProportions();
d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,true);return true},_mouseDrag:function(a,b){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");if(!b){b=this._uiHash();if(this._trigger("drag",a,b)===false){this._mouseUp({});return false}this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||
this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return false},_mouseStop:function(a){var b=false;if(d.ui.ddmanager&&!this.options.dropBehaviour)b=d.ui.ddmanager.drop(this,a);if(this.dropped){b=this.dropped;this.dropped=false}if(!this.element[0]||!this.element[0].parentNode)return false;if(this.options.revert=="invalid"&&!b||this.options.revert=="valid"&&b||this.options.revert===true||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,
b)){var c=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){c._trigger("stop",a)!==false&&c._clear()})}else this._trigger("stop",a)!==false&&this._clear();return false},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var b=!this.options.handle||!d(this.options.handle,this.element).length?true:false;d(this.options.handle,this.element).find("*").andSelf().each(function(){if(this==
a.target)b=true});return b},_createHelper:function(a){var b=this.options;a=d.isFunction(b.helper)?d(b.helper.apply(this.element[0],[a])):b.helper=="clone"?this.element.clone():this.element;a.parents("body").length||a.appendTo(b.appendTo=="parent"?this.element[0].parentNode:b.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){if(typeof a=="string")a=a.split(" ");if(d.isArray(a))a={left:+a[0],top:+a[1]||
0};if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();if(this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0])){a.left+=this.scrollParent.scrollLeft();a.top+=this.scrollParent.scrollTop()}if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-
(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment==
"parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&
a.containment.constructor!=Array){var b=d(a.containment)[0];if(b){a=d(a.containment).offset();var c=d(b).css("overflow")!="hidden";this.containment=[a.left+(parseInt(d(b).css("borderLeftWidth"),10)||0)+(parseInt(d(b).css("paddingLeft"),10)||0)-this.margins.left,a.top+(parseInt(d(b).css("borderTopWidth"),10)||0)+(parseInt(d(b).css("paddingTop"),10)||0)-this.margins.top,a.left+(c?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt(d(b).css("borderLeftWidth"),10)||0)-(parseInt(d(b).css("paddingRight"),
10)||0)-this.helperProportions.width-this.margins.left,a.top+(c?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt(d(b).css("borderTopWidth"),10)||0)-(parseInt(d(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}}else if(a.containment.constructor==Array)this.containment=a.containment},_convertPositionTo:function(a,b){if(!b)b=this.position;a=a=="absolute"?1:-1;var c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName);return{top:b.top+this.offset.relative.top*a+this.offset.parent.top*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop())*a),left:b.left+this.offset.relative.left*a+this.offset.parent.left*a-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():
f?0:c.scrollLeft())*a)}},_generatePosition:function(a){var b=this.options,c=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(c[0].tagName),e=a.pageX,g=a.pageY;if(this.originalPosition){if(this.containment){if(a.pageX-this.offset.click.left<this.containment[0])e=this.containment[0]+this.offset.click.left;if(a.pageY-this.offset.click.top<this.containment[1])g=this.containment[1]+
this.offset.click.top;if(a.pageX-this.offset.click.left>this.containment[2])e=this.containment[2]+this.offset.click.left;if(a.pageY-this.offset.click.top>this.containment[3])g=this.containment[3]+this.offset.click.top}if(b.grid){g=this.originalPageY+Math.round((g-this.originalPageY)/b.grid[1])*b.grid[1];g=this.containment?!(g-this.offset.click.top<this.containment[1]||g-this.offset.click.top>this.containment[3])?g:!(g-this.offset.click.top<this.containment[1])?g-b.grid[1]:g+b.grid[1]:g;e=this.originalPageX+
Math.round((e-this.originalPageX)/b.grid[0])*b.grid[0];e=this.containment?!(e-this.offset.click.left<this.containment[0]||e-this.offset.click.left>this.containment[2])?e:!(e-this.offset.click.left<this.containment[0])?e-b.grid[0]:e+b.grid[0]:e}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:c.scrollTop()),left:e-this.offset.click.left-
this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():f?0:c.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=false},_trigger:function(a,b,c){c=c||this._uiHash();d.ui.plugin.call(this,a,[b,c]);if(a=="drag")this.positionAbs=
this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,b,c)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"1.9m3"});d.ui.plugin.add("draggable","connectToSortable",{start:function(a,b){var c=d(this).data("draggable"),f=c.options,e=d.extend({},b,{item:c.element});c.sortables=[];d(f.connectToSortable).each(function(){var g=d.data(this,"sortable");
if(g&&!g.options.disabled){c.sortables.push({instance:g,shouldRevert:g.options.revert});g._refreshItems();g._trigger("activate",a,e)}})},stop:function(a,b){var c=d(this).data("draggable"),f=d.extend({},b,{item:c.element});d.each(c.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;c.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert)this.instance.options.revert=true;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;
c.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",a,f)}})},drag:function(a,b){var c=d(this).data("draggable"),f=this;d.each(c.sortables,function(){this.instance.positionAbs=c.positionAbs;this.instance.helperProportions=c.helperProportions;this.instance.offset.click=c.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver){this.instance.isOver=
1;this.instance.currentItem=d(f).clone().appendTo(this.instance.element).data("sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return b.helper[0]};a.target=this.instance.currentItem[0];this.instance._mouseCapture(a,true);this.instance._mouseStart(a,true,true);this.instance.offset.click.top=c.offset.click.top;this.instance.offset.click.left=c.offset.click.left;this.instance.offset.parent.left-=c.offset.parent.left-this.instance.offset.parent.left;
this.instance.offset.parent.top-=c.offset.parent.top-this.instance.offset.parent.top;c._trigger("toSortable",a);c.dropped=this.instance.element;c.currentItem=c.element;this.instance.fromOutside=c}this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",a,this.instance._uiHash(this.instance));this.instance._mouseStop(a,true);this.instance.options.helper=
this.instance.options._helper;this.instance.currentItem.remove();this.instance.placeholder&&this.instance.placeholder.remove();c._trigger("fromSortable",a);c.dropped=false}})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),b=d(this).data("draggable").options;if(a.css("cursor"))b._cursor=a.css("cursor");a.css("cursor",b.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","iframeFix",{start:function(){var a=
d(this).data("draggable").options;d(a.iframeFix===true?"iframe":a.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")})},stop:function(){d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)})}});d.ui.plugin.add("draggable","opacity",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;
if(a.css("opacity"))b._opacity=a.css("opacity");a.css("opacity",b.opacity)},stop:function(a,b){a=d(this).data("draggable").options;a._opacity&&d(b.helper).css("opacity",a._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");if(a.scrollParent[0]!=document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var b=d(this).data("draggable"),c=b.options,f=false;if(b.scrollParent[0]!=document&&b.scrollParent[0].tagName!=
"HTML"){if(!c.axis||c.axis!="x")if(b.overflowOffset.top+b.scrollParent[0].offsetHeight-a.pageY<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop+c.scrollSpeed;else if(a.pageY-b.overflowOffset.top<c.scrollSensitivity)b.scrollParent[0].scrollTop=f=b.scrollParent[0].scrollTop-c.scrollSpeed;if(!c.axis||c.axis!="y")if(b.overflowOffset.left+b.scrollParent[0].offsetWidth-a.pageX<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft+c.scrollSpeed;else if(a.pageX-
b.overflowOffset.left<c.scrollSensitivity)b.scrollParent[0].scrollLeft=f=b.scrollParent[0].scrollLeft-c.scrollSpeed}else{if(!c.axis||c.axis!="x")if(a.pageY-d(document).scrollTop()<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()-c.scrollSpeed);else if(d(window).height()-(a.pageY-d(document).scrollTop())<c.scrollSensitivity)f=d(document).scrollTop(d(document).scrollTop()+c.scrollSpeed);if(!c.axis||c.axis!="y")if(a.pageX-d(document).scrollLeft()<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()-
c.scrollSpeed);else if(d(window).width()-(a.pageX-d(document).scrollLeft())<c.scrollSensitivity)f=d(document).scrollLeft(d(document).scrollLeft()+c.scrollSpeed)}f!==false&&d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(b,a)}});d.ui.plugin.add("draggable","snap",{start:function(){var a=d(this).data("draggable"),b=a.options;a.snapElements=[];d(b.snap.constructor!=String?b.snap.items||":data(draggable)":b.snap).each(function(){var c=d(this),f=c.offset();this!=a.element[0]&&a.snapElements.push({item:this,
width:c.outerWidth(),height:c.outerHeight(),top:f.top,left:f.left})})},drag:function(a,b){for(var c=d(this).data("draggable"),f=c.options,e=f.snapTolerance,g=b.offset.left,n=g+c.helperProportions.width,m=b.offset.top,o=m+c.helperProportions.height,h=c.snapElements.length-1;h>=0;h--){var i=c.snapElements[h].left,k=i+c.snapElements[h].width,j=c.snapElements[h].top,l=j+c.snapElements[h].height;if(i-e<g&&g<k+e&&j-e<m&&m<l+e||i-e<g&&g<k+e&&j-e<o&&o<l+e||i-e<n&&n<k+e&&j-e<m&&m<l+e||i-e<n&&n<k+e&&j-e<o&&
o<l+e){if(f.snapMode!="inner"){var p=Math.abs(j-o)<=e,q=Math.abs(l-m)<=e,r=Math.abs(i-n)<=e,s=Math.abs(k-g)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j-c.helperProportions.height,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:l,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i-c.helperProportions.width}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k}).left-c.margins.left}var t=
p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(j-m)<=e;q=Math.abs(l-o)<=e;r=Math.abs(i-g)<=e;s=Math.abs(k-n)<=e;if(p)b.position.top=c._convertPositionTo("relative",{top:j,left:0}).top-c.margins.top;if(q)b.position.top=c._convertPositionTo("relative",{top:l-c.helperProportions.height,left:0}).top-c.margins.top;if(r)b.position.left=c._convertPositionTo("relative",{top:0,left:i}).left-c.margins.left;if(s)b.position.left=c._convertPositionTo("relative",{top:0,left:k-c.helperProportions.width}).left-c.margins.left}if(!c.snapElements[h].snapping&&
(p||q||r||s||t))c.options.snap.snap&&c.options.snap.snap.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=p||q||r||s||t}else{c.snapElements[h].snapping&&c.options.snap.release&&c.options.snap.release.call(c.element,a,d.extend(c._uiHash(),{snapItem:c.snapElements[h].item}));c.snapElements[h].snapping=false}}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options;a=d.makeArray(d(a.stack)).sort(function(c,f){return(parseInt(d(c).css("zIndex"),
10)||0)-(parseInt(d(f).css("zIndex"),10)||0)});if(a.length){var b=parseInt(a[0].style.zIndex)||0;d(a).each(function(c){this.style.zIndex=b+c});this[0].style.zIndex=b+a.length}}});d.ui.plugin.add("draggable","zIndex",{start:function(a,b){a=d(b.helper);b=d(this).data("draggable").options;if(a.css("zIndex"))b._zIndex=a.css("zIndex");a.css("zIndex",b.zIndex)},stop:function(a,b){a=d(this).data("draggable").options;a._zIndex&&d(b.helper).css("zIndex",a._zIndex)}})})(amznpubstudio_jQuery);
/*
 * jQuery UI Resizable 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(e){e.widget("ui.resizable",e.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:false,animate:false,animateDuration:"slow",animateEasing:"swing",aspectRatio:false,autoHide:false,containment:false,ghost:false,grid:false,handles:"e,s,se",helper:false,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1E3},_create:function(){var b=this,a=this.options;this.element.addClass("ui-resizable");e.extend(this,{_aspectRatio:!!a.aspectRatio,aspectRatio:a.aspectRatio,originalElement:this.element,
    _proportionallyResizeElements:[],_helper:a.helper||a.ghost||a.animate?a.helper||"ui-resizable-helper":null});if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)){/relative/.test(this.element.css("position"))&&e.browser.opera&&this.element.css({position:"relative",top:"auto",left:"auto"});this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),
    top:this.element.css("top"),left:this.element.css("left")}));this.element=this.element.parent().data("resizable",this.element.data("resizable"));this.elementIsWrapper=true;this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")});this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0});this.originalResizeStyle=
    this.originalElement.css("resize");this.originalElement.css("resize","none");this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"}));this.originalElement.css({margin:this.originalElement.css("margin")});this._proportionallyResize()}this.handles=a.handles||(!e(".ui-resizable-handle",this.element).length?"e,s,se":{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",
    nw:".ui-resizable-nw"});if(this.handles.constructor==String){if(this.handles=="all")this.handles="n,e,s,w,se,sw,ne,nw";var c=this.handles.split(",");this.handles={};for(var d=0;d<c.length;d++){var f=e.trim(c[d]),g=e('<div class="ui-resizable-handle '+("ui-resizable-"+f)+'"></div>');/sw|se|ne|nw/.test(f)&&g.css({zIndex:++a.zIndex});"se"==f&&g.addClass("ui-icon ui-icon-gripsmall-diagonal-se");this.handles[f]=".ui-resizable-"+f;this.element.append(g)}}this._renderAxis=function(h){h=h||this.element;for(var i in this.handles){if(this.handles[i].constructor==
    String)this.handles[i]=e(this.handles[i],this.element).show();if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var j=e(this.handles[i],this.element),k=0;k=/sw|ne|nw|se|n|s/.test(i)?j.outerHeight():j.outerWidth();j=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join("");h.css(j,k);this._proportionallyResize()}e(this.handles[i])}};this._renderAxis(this.element);this._handles=e(".ui-resizable-handle",this.element).disableSelection();
    this._handles.mouseover(function(){if(!b.resizing){if(this.className)var h=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=h&&h[1]?h[1]:"se"}});if(a.autoHide){this._handles.hide();e(this.element).addClass("ui-resizable-autohide").hover(function(){e(this).removeClass("ui-resizable-autohide");b._handles.show()},function(){if(!b.resizing){e(this).addClass("ui-resizable-autohide");b._handles.hide()}})}this._mouseInit()},destroy:function(){this._mouseDestroy();var b=function(c){e(c).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};
    if(this.elementIsWrapper){b(this.element);var a=this.element;a.after(this.originalElement.css({position:a.css("position"),width:a.outerWidth(),height:a.outerHeight(),top:a.css("top"),left:a.css("left")})).remove()}this.originalElement.css("resize",this.originalResizeStyle);b(this.originalElement);return this},_mouseCapture:function(b){var a=false;for(var c in this.handles)if(e(this.handles[c])[0]==b.target)a=true;return!this.options.disabled&&a},_mouseStart:function(b){var a=this.options,c=this.element.position(),
    d=this.element;this.resizing=true;this.documentScroll={top:e(document).scrollTop(),left:e(document).scrollLeft()};if(d.is(".ui-draggable")||/absolute/.test(d.css("position")))d.css({position:"absolute",top:c.top,left:c.left});e.browser.opera&&/relative/.test(d.css("position"))&&d.css({position:"relative",top:"auto",left:"auto"});this._renderProxy();c=m(this.helper.css("left"));var f=m(this.helper.css("top"));if(a.containment){c+=e(a.containment).scrollLeft()||0;f+=e(a.containment).scrollTop()||0}this.offset=
    this.helper.offset();this.position={left:c,top:f};this.size=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalSize=this._helper?{width:d.outerWidth(),height:d.outerHeight()}:{width:d.width(),height:d.height()};this.originalPosition={left:c,top:f};this.sizeDiff={width:d.outerWidth()-d.width(),height:d.outerHeight()-d.height()};this.originalMousePosition={left:b.pageX,top:b.pageY};this.aspectRatio=typeof a.aspectRatio=="number"?a.aspectRatio:
    this.originalSize.width/this.originalSize.height||1;a=e(".ui-resizable-"+this.axis).css("cursor");e("body").css("cursor",a=="auto"?this.axis+"-resize":a);d.addClass("ui-resizable-resizing");this._propagate("start",b);return true},_mouseDrag:function(b){var a=this.helper,c=this.originalMousePosition,d=this._change[this.axis];if(!d)return false;c=d.apply(this,[b,b.pageX-c.left||0,b.pageY-c.top||0]);if(this._aspectRatio||b.shiftKey)c=this._updateRatio(c,b);c=this._respectSize(c,b);this._propagate("resize",
    b);a.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"});!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize();this._updateCache(c);this._trigger("resize",b,this.ui());return false},_mouseStop:function(b){this.resizing=false;var a=this.options,c=this;if(this._helper){var d=this._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName);d=f&&e.ui.hasScroll(d[0],"left")?0:c.sizeDiff.height;
    f={width:c.size.width-(f?0:c.sizeDiff.width),height:c.size.height-d};d=parseInt(c.element.css("left"),10)+(c.position.left-c.originalPosition.left)||null;var g=parseInt(c.element.css("top"),10)+(c.position.top-c.originalPosition.top)||null;a.animate||this.element.css(e.extend(f,{top:g,left:d}));c.helper.height(c.size.height);c.helper.width(c.size.width);this._helper&&!a.animate&&this._proportionallyResize()}e("body").css("cursor","auto");this.element.removeClass("ui-resizable-resizing");this._propagate("stop",
    b);this._helper&&this.helper.remove();return false},_updateCache:function(b){this.offset=this.helper.offset();if(l(b.left))this.position.left=b.left;if(l(b.top))this.position.top=b.top;if(l(b.height))this.size.height=b.height;if(l(b.width))this.size.width=b.width},_updateRatio:function(b){var a=this.position,c=this.size,d=this.axis;if(b.height)b.width=c.height*this.aspectRatio;else if(b.width)b.height=c.width/this.aspectRatio;if(d=="sw"){b.left=a.left+(c.width-b.width);b.top=null}if(d=="nw"){b.top=
    a.top+(c.height-b.height);b.left=a.left+(c.width-b.width)}return b},_respectSize:function(b){var a=this.options,c=this.axis,d=l(b.width)&&a.maxWidth&&a.maxWidth<b.width,f=l(b.height)&&a.maxHeight&&a.maxHeight<b.height,g=l(b.width)&&a.minWidth&&a.minWidth>b.width,h=l(b.height)&&a.minHeight&&a.minHeight>b.height;if(g)b.width=a.minWidth;if(h)b.height=a.minHeight;if(d)b.width=a.maxWidth;if(f)b.height=a.maxHeight;var i=this.originalPosition.left+this.originalSize.width,j=this.position.top+this.size.height,
    k=/sw|nw|w/.test(c);c=/nw|ne|n/.test(c);if(g&&k)b.left=i-a.minWidth;if(d&&k)b.left=i-a.maxWidth;if(h&&c)b.top=j-a.minHeight;if(f&&c)b.top=j-a.maxHeight;if((a=!b.width&&!b.height)&&!b.left&&b.top)b.top=null;else if(a&&!b.top&&b.left)b.left=null;return b},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var b=this.helper||this.element,a=0;a<this._proportionallyResizeElements.length;a++){var c=this._proportionallyResizeElements[a];if(!this.borderDif){var d=[c.css("borderTopWidth"),
    c.css("borderRightWidth"),c.css("borderBottomWidth"),c.css("borderLeftWidth")],f=[c.css("paddingTop"),c.css("paddingRight"),c.css("paddingBottom"),c.css("paddingLeft")];this.borderDif=e.map(d,function(g,h){g=parseInt(g,10)||0;h=parseInt(f[h],10)||0;return g+h})}e.browser.msie&&(e(b).is(":hidden")||e(b).parents(":hidden").length)||c.css({height:b.height()-this.borderDif[0]-this.borderDif[2]||0,width:b.width()-this.borderDif[1]-this.borderDif[3]||0})}},_renderProxy:function(){var b=this.options;this.elementOffset=
    this.element.offset();if(this._helper){this.helper=this.helper||e('<div style="overflow:hidden;"></div>');var a=e.browser.msie&&e.browser.version<7,c=a?1:0;a=a?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+a,height:this.element.outerHeight()+a,position:"absolute",left:this.elementOffset.left-c+"px",top:this.elementOffset.top-c+"px",zIndex:++b.zIndex});this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(b,a){return{width:this.originalSize.width+
    a}},w:function(b,a){return{left:this.originalPosition.left+a,width:this.originalSize.width-a}},n:function(b,a,c){return{top:this.originalPosition.top+c,height:this.originalSize.height-c}},s:function(b,a,c){return{height:this.originalSize.height+c}},se:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,a,c]))},sw:function(b,a,c){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,a,c]))},ne:function(b,a,c){return e.extend(this._change.n.apply(this,
    arguments),this._change.e.apply(this,[b,a,c]))},nw:function(b,a,c){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,a,c]))}},_propagate:function(b,a){e.ui.plugin.call(this,b,[a,this.ui()]);b!="resize"&&this._trigger(b,a,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}});e.extend(e.ui.resizable,
    {version:"1.9m3"});e.ui.plugin.add("resizable","alsoResize",{start:function(){var b=e(this).data("resizable").options,a=function(c){e(c).each(function(){var d=e(this);d.data("resizable-alsoresize",{width:parseInt(d.width(),10),height:parseInt(d.height(),10),left:parseInt(d.css("left"),10),top:parseInt(d.css("top"),10),position:d.css("position")})})};if(typeof b.alsoResize=="object"&&!b.alsoResize.parentNode)if(b.alsoResize.length){b.alsoResize=b.alsoResize[0];a(b.alsoResize)}else e.each(b.alsoResize,
    function(c){a(c)});else a(b.alsoResize)},resize:function(b,a){var c=e(this).data("resizable");b=c.options;var d=c.originalSize,f=c.originalPosition,g={height:c.size.height-d.height||0,width:c.size.width-d.width||0,top:c.position.top-f.top||0,left:c.position.left-f.left||0},h=function(i,j){e(i).each(function(){var k=e(this),q=e(this).data("resizable-alsoresize"),p={},r=j&&j.length?j:k.parents(a.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(n,o){if((n=
    (q[o]||0)+(g[o]||0))&&n>=0)p[o]=n||null});if(e.browser.opera&&/relative/.test(k.css("position"))){c._revertToRelativePosition=true;k.css({position:"absolute",top:"auto",left:"auto"})}k.css(p)})};typeof b.alsoResize=="object"&&!b.alsoResize.nodeType?e.each(b.alsoResize,function(i,j){h(i,j)}):h(b.alsoResize)},stop:function(){var b=e(this).data("resizable"),a=b.options,c=function(d){e(d).each(function(){var f=e(this);f.css({position:f.data("resizable-alsoresize").position})})};if(b._revertToRelativePosition){b._revertToRelativePosition=
    false;typeof a.alsoResize=="object"&&!a.alsoResize.nodeType?e.each(a.alsoResize,function(d){c(d)}):c(a.alsoResize)}e(this).removeData("resizable-alsoresize")}});e.ui.plugin.add("resizable","animate",{stop:function(b){var a=e(this).data("resizable"),c=a.options,d=a._proportionallyResizeElements,f=d.length&&/textarea/i.test(d[0].nodeName),g=f&&e.ui.hasScroll(d[0],"left")?0:a.sizeDiff.height;f={width:a.size.width-(f?0:a.sizeDiff.width),height:a.size.height-g};g=parseInt(a.element.css("left"),10)+(a.position.left-
    a.originalPosition.left)||null;var h=parseInt(a.element.css("top"),10)+(a.position.top-a.originalPosition.top)||null;a.element.animate(e.extend(f,h&&g?{top:h,left:g}:{}),{duration:c.animateDuration,easing:c.animateEasing,step:function(){var i={width:parseInt(a.element.css("width"),10),height:parseInt(a.element.css("height"),10),top:parseInt(a.element.css("top"),10),left:parseInt(a.element.css("left"),10)};d&&d.length&&e(d[0]).css({width:i.width,height:i.height});a._updateCache(i);a._propagate("resize",
    b)}})}});e.ui.plugin.add("resizable","containment",{start:function(){var b=e(this).data("resizable"),a=b.element,c=b.options.containment;if(a=c instanceof e?c.get(0):/parent/.test(c)?a.parent().get(0):c){b.containerElement=e(a);if(/document/.test(c)||c==document){b.containerOffset={left:0,top:0};b.containerPosition={left:0,top:0};b.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}}else{var d=e(a),f=[];e(["Top",
    "Right","Left","Bottom"]).each(function(i,j){f[i]=m(d.css("padding"+j))});b.containerOffset=d.offset();b.containerPosition=d.position();b.containerSize={height:d.innerHeight()-f[3],width:d.innerWidth()-f[1]};c=b.containerOffset;var g=b.containerSize.height,h=b.containerSize.width;h=e.ui.hasScroll(a,"left")?a.scrollWidth:h;g=e.ui.hasScroll(a)?a.scrollHeight:g;b.parentData={element:a,left:c.left,top:c.top,width:h,height:g}}}},resize:function(b){var a=e(this).data("resizable"),c=a.options,d=a.containerOffset,
    f=a.position;b=a._aspectRatio||b.shiftKey;var g={top:0,left:0},h=a.containerElement;if(h[0]!=document&&/static/.test(h.css("position")))g=d;if(f.left<(a._helper?d.left:0)){a.size.width+=a._helper?a.position.left-d.left:a.position.left-g.left;if(b)a.size.height=a.size.width/c.aspectRatio;a.position.left=c.helper?d.left:0}if(f.top<(a._helper?d.top:0)){a.size.height+=a._helper?a.position.top-d.top:a.position.top;if(b)a.size.width=a.size.height*c.aspectRatio;a.position.top=a._helper?d.top:0}a.offset.left=
    a.parentData.left+a.position.left;a.offset.top=a.parentData.top+a.position.top;c=Math.abs((a._helper?a.offset.left-g.left:a.offset.left-g.left)+a.sizeDiff.width);d=Math.abs((a._helper?a.offset.top-g.top:a.offset.top-d.top)+a.sizeDiff.height);f=a.containerElement.get(0)==a.element.parent().get(0);g=/relative|absolute/.test(a.containerElement.css("position"));if(f&&g)c-=a.parentData.left;if(c+a.size.width>=a.parentData.width){a.size.width=a.parentData.width-c;if(b)a.size.height=a.size.width/a.aspectRatio}if(d+
    a.size.height>=a.parentData.height){a.size.height=a.parentData.height-d;if(b)a.size.width=a.size.height*a.aspectRatio}},stop:function(){var b=e(this).data("resizable"),a=b.options,c=b.containerOffset,d=b.containerPosition,f=b.containerElement,g=e(b.helper),h=g.offset(),i=g.outerWidth()-b.sizeDiff.width;g=g.outerHeight()-b.sizeDiff.height;b._helper&&!a.animate&&/relative/.test(f.css("position"))&&e(this).css({left:h.left-d.left-c.left,width:i,height:g});b._helper&&!a.animate&&/static/.test(f.css("position"))&&
e(this).css({left:h.left-d.left-c.left,width:i,height:g})}});e.ui.plugin.add("resizable","ghost",{start:function(){var b=e(this).data("resizable"),a=b.options,c=b.size;b.ghost=b.originalElement.clone();b.ghost.css({opacity:0.25,display:"block",position:"relative",height:c.height,width:c.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof a.ghost=="string"?a.ghost:"");b.ghost.appendTo(b.helper)},resize:function(){var b=e(this).data("resizable");b.ghost&&b.ghost.css({position:"relative",
    height:b.size.height,width:b.size.width})},stop:function(){var b=e(this).data("resizable");b.ghost&&b.helper&&b.helper.get(0).removeChild(b.ghost.get(0))}});e.ui.plugin.add("resizable","grid",{resize:function(){var b=e(this).data("resizable"),a=b.options,c=b.size,d=b.originalSize,f=b.originalPosition,g=b.axis;a.grid=typeof a.grid=="number"?[a.grid,a.grid]:a.grid;var h=Math.round((c.width-d.width)/(a.grid[0]||1))*(a.grid[0]||1);a=Math.round((c.height-d.height)/(a.grid[1]||1))*(a.grid[1]||1);if(/^(se|s|e)$/.test(g)){b.size.width=
    d.width+h;b.size.height=d.height+a}else if(/^(ne)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}else{if(/^(sw)$/.test(g)){b.size.width=d.width+h;b.size.height=d.height+a}else{b.size.width=d.width+h;b.size.height=d.height+a;b.position.top=f.top-a}b.position.left=f.left-h}}});var m=function(b){return parseInt(b,10)||0},l=function(b){return!isNaN(parseInt(b,10))}})(amznpubstudio_jQuery);

/*
 * jQuery UI Dialog 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function(c,j){var k={buttons:true,height:true,maxHeight:true,maxWidth:true,minHeight:true,minWidth:true,width:true},l={maxHeight:true,maxWidth:true,minHeight:true,minWidth:true};c.widget("ui.dialog",{options:{autoOpen:true,buttons:{},closeOnEscape:true,closeText:"close",dialogClass:"",draggable:true,hide:null,height:"auto",maxHeight:false,maxWidth:false,minHeight:150,minWidth:150,modal:false,position:{my:"center",at:"center",of:window,collision:"fit",using:function(a){var b=c(this).css(a).offset().top;
    b<0&&c(this).css("top",a.top-b)}},resizable:true,show:null,stack:true,title:"",width:300,zIndex:1E3},_create:function(){this.originalTitle=this.element.attr("title");if(typeof this.originalTitle!=="string")this.originalTitle="";this.options.title=this.options.title||this.originalTitle;var a=this,b=a.options,d=b.title||"&#160;",e=c.ui.dialog.getTitleId(a.element),g=(a.uiDialog=c("<div></div>")).appendTo(document.body).hide().addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b.dialogClass).css({zIndex:b.zIndex}).attr("tabIndex",
    -1).css("outline",0).keydown(function(i){if(b.closeOnEscape&&i.keyCode&&i.keyCode===c.ui.keyCode.ESCAPE){a.close(i);i.preventDefault()}}).attr({role:"dialog","aria-labelledby":e}).mousedown(function(i){a.moveToTop(false,i)});a.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g);var f=(a.uiDialogTitlebar=c("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),h=c('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role",
    "button").hover(function(){h.addClass("ui-state-hover")},function(){h.removeClass("ui-state-hover")}).focus(function(){h.addClass("ui-state-focus")}).blur(function(){h.removeClass("ui-state-focus")}).click(function(i){a.close(i);return false}).appendTo(f);(a.uiDialogTitlebarCloseText=c("<span></span>")).addClass("ui-icon ui-icon-closethick").text(b.closeText).appendTo(h);c("<span></span>").addClass("ui-dialog-title").attr("id",e).html(d).prependTo(f);if(c.isFunction(b.beforeclose)&&!c.isFunction(b.beforeClose))b.beforeClose=
    b.beforeclose;f.find("*").add(f).disableSelection();b.draggable&&c.fn.draggable&&a._makeDraggable();b.resizable&&c.fn.resizable&&a._makeResizable();a._createButtons(b.buttons);a._isOpen=false;c.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;a.overlay&&a.overlay.destroy();a.uiDialog.hide();a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body");a.uiDialog.remove();a.originalTitle&&
a.element.attr("title",a.originalTitle);return a},widget:function(){return this.uiDialog},close:function(a){var b=this,d;if(false!==b._trigger("beforeClose",a)){b.overlay&&b.overlay.destroy();b.uiDialog.unbind("keypress.ui-dialog");b._isOpen=false;if(b.options.hide)b.uiDialog.hide(b.options.hide,function(){b._trigger("close",a)});else{b.uiDialog.hide();b._trigger("close",a)}c.ui.dialog.overlay.resize();if(b.options.modal){d=0;c(".ui-dialog").each(function(){if(this!==b.uiDialog[0])d=Math.max(d,c(this).css("z-index"))});
    c.ui.dialog.maxZ=d}return b}},isOpen:function(){return this._isOpen},moveToTop:function(a,b){var d=this,e=d.options;if(e.modal&&!a||!e.stack&&!e.modal)return d._trigger("focus",b);if(e.zIndex>c.ui.dialog.maxZ)c.ui.dialog.maxZ=e.zIndex;if(d.overlay){c.ui.dialog.maxZ+=1;d.overlay.$el.css("z-index",c.ui.dialog.overlay.maxZ=c.ui.dialog.maxZ)}a={scrollTop:d.element.attr("scrollTop"),scrollLeft:d.element.attr("scrollLeft")};c.ui.dialog.maxZ+=1;d.uiDialog.css("z-index",c.ui.dialog.maxZ);d.element.attr(a);
    d._trigger("focus",b);return d},open:function(){if(!this._isOpen){var a=this,b=a.options,d=a.uiDialog;a.overlay=b.modal?new c.ui.dialog.overlay(a):null;a._size();a._position(b.position);d.show(b.show);a.moveToTop(true);b.modal&&d.bind("keypress.ui-dialog",function(e){if(e.keyCode===c.ui.keyCode.TAB){var g=c(":tabbable",this),f=g.filter(":first");g=g.filter(":last");if(e.target===g[0]&&!e.shiftKey){f.focus(1);return false}else if(e.target===f[0]&&e.shiftKey){g.focus(1);return false}}});c(a.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus();
    a._isOpen=true;a._trigger("open");return a}},_createButtons:function(a){var b=this,d=false,e=c("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=c("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);b.uiDialog.find(".ui-dialog-buttonpane").remove();typeof a==="object"&&a!==null&&c.each(a,function(){return!(d=true)});if(d){c.each(a,function(f,h){h=c.isFunction(h)?{click:h,text:f}:h;f=c('<button type="button"></button>').attr(h,true).unbind("click").click(function(){h.click.apply(b.element[0],
    arguments)}).appendTo(g);c.fn.button&&f.button()});e.appendTo(b.uiDialog)}},_makeDraggable:function(){function a(f){return{position:f.position,offset:f.offset}}var b=this,d=b.options,e=c(document),g;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(f,h){g=d.height==="auto"?"auto":c(this).height();c(this).height(c(this).height()).addClass("ui-dialog-dragging");b._trigger("dragStart",f,a(h))},drag:function(f,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          h){b._trigger("drag",f,a(h))},stop:function(f,h){d.position=[h.position.left-e.scrollLeft(),h.position.top-e.scrollTop()];c(this).removeClass("ui-dialog-dragging").height(g);b._trigger("dragStop",f,a(h));c.ui.dialog.overlay.resize()}})},_makeResizable:function(a){function b(f){return{originalPosition:f.originalPosition,originalSize:f.originalSize,position:f.position,size:f.size}}a=a===j?this.options.resizable:a;var d=this,e=d.options,g=d.uiDialog.css("position");a=typeof a==="string"?a:"n,e,s,w,se,sw,ne,nw";
    d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:a,start:function(f,h){c(this).addClass("ui-dialog-resizing");d._trigger("resizeStart",f,b(h))},resize:function(f,h){d._trigger("resize",f,b(h))},stop:function(f,h){c(this).removeClass("ui-dialog-resizing");e.height=c(this).height();e.width=c(this).width();d._trigger("resizeStop",f,b(h));c.ui.dialog.overlay.resize()}}).css("position",
        g).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(a){var b=[],d=[0,0],e;if(a){if(typeof a==="string"||typeof a==="object"&&"0"in a){b=a.split?a.split(" "):[a[0],a[1]];if(b.length===1)b[1]=b[0];c.each(["left","top"],function(g,f){if(+b[g]===b[g]){d[g]=b[g];b[g]=f}});a={my:b.join(" "),at:b.join(" "),offset:d.join(" ")}}a=c.extend({},c.ui.dialog.prototype.options.position,
    a)}else a=c.ui.dialog.prototype.options.position;(e=this.uiDialog.is(":visible"))||this.uiDialog.show();this.uiDialog.css({top:0,left:0}).position(a);e||this.uiDialog.hide()},_setOptions:function(a){var b=this,d={},e=false;c.each(a,function(g,f){b._setOption(g,f);if(g in k)e=true;if(g in l)d[g]=f});e&&this._size();this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",d)},_setOption:function(a,b){var d=this,e=d.uiDialog;switch(a){case "beforeclose":a="beforeClose";break;case "buttons":d._createButtons(b);
    break;case "closeText":d.uiDialogTitlebarCloseText.text(""+b);break;case "dialogClass":e.removeClass(d.options.dialogClass).addClass("ui-dialog ui-widget ui-widget-content ui-corner-all "+b);break;case "disabled":b?e.addClass("ui-dialog-disabled"):e.removeClass("ui-dialog-disabled");break;case "draggable":var g=e.is(":data(draggable)");g&&!b&&e.draggable("destroy");!g&&b&&d._makeDraggable();break;case "position":d._position(b);break;case "resizable":(g=e.is(":data(resizable)"))&&!b&&e.resizable("destroy");
    g&&typeof b==="string"&&e.resizable("option","handles",b);!g&&b!==false&&d._makeResizable(b);break;case "title":c(".ui-dialog-title",d.uiDialogTitlebar).html(""+(b||"&#160;"));break}c.Widget.prototype._setOption.apply(d,arguments)},_size:function(){var a=this.options,b,d;this.element.show().css({width:"auto",minHeight:0,height:0});if(a.minWidth>a.width)a.width=a.minWidth;b=this.uiDialog.css({height:"auto",width:a.width}).height();d=Math.max(0,a.minHeight-b);if(a.height==="auto")if(c.support.minHeight)this.element.css({minHeight:d,
    height:"auto"});else{this.uiDialog.show();a=this.element.css("height","auto").height();this.uiDialog.hide();this.element.height(Math.max(a,d))}else this.element.height(Math.max(a.height-b,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}});c.extend(c.ui.dialog,{version:"1.9m3",uuid:0,maxZ:0,getTitleId:function(a){a=a.attr("id");if(!a){this.uuid+=1;a=this.uuid}return"ui-dialog-title-"+a},overlay:function(a){this.$el=c.ui.dialog.overlay.create(a)}});
    c.extend(c.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:c.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),create:function(a){if(this.instances.length===0){setTimeout(function(){c.ui.dialog.overlay.instances.length&&c(document).bind(c.ui.dialog.overlay.events,function(d){if(c(d.target).zIndex()<c.ui.dialog.overlay.maxZ)return false})},1);c(document).bind("keydown.dialog-overlay",function(d){if(a.options.closeOnEscape&&
        d.keyCode&&d.keyCode===c.ui.keyCode.ESCAPE){a.close(d);d.preventDefault()}});c(window).bind("resize.dialog-overlay",c.ui.dialog.overlay.resize)}var b=(this.oldInstances.pop()||c("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});c.fn.bgiframe&&b.bgiframe();this.instances.push(b);return b},destroy:function(a){this.oldInstances.push(this.instances.splice(c.inArray(a,this.instances),1)[0]);this.instances.length===0&&c([document,window]).unbind(".dialog-overlay");
        a.remove();var b=0;c.each(this.instances,function(){b=Math.max(b,this.css("z-index"))});this.maxZ=b},height:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);b=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight);return a<b?c(window).height()+"px":a+"px"}else return c(document).height()+"px"},width:function(){var a,b;if(c.browser.msie&&c.browser.version<7){a=Math.max(document.documentElement.scrollWidth,
        document.body.scrollWidth);b=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth);return a<b?c(window).width()+"px":a+"px"}else return c(document).width()+"px"},resize:function(){var a=c([]);c.each(c.ui.dialog.overlay.instances,function(){a=a.add(this)});a.css({width:0,height:0}).css({width:c.ui.dialog.overlay.width(),height:c.ui.dialog.overlay.height()})}});c.extend(c.ui.dialog.overlay.prototype,{destroy:function(){c.ui.dialog.overlay.destroy(this.$el)}})})(amznpubstudio_jQuery);


/*
 * jQuery UI Menu 1.9m3
 *
 * Copyright 2010, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Menu
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(c){var i=0;c.widget("ui.menu",{_create:function(){var a=this;this.menuId=this.element.attr("id")||"ui-menu-"+i++;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({id:this.menuId,role:"listbox"}).bind("click.menu",function(b){if(a.options.disabled)return false;if(c(b.target).closest(".ui-menu-item a").length){b.preventDefault();a.select(b)}}).bind("mouseover.menu",function(b){if(!a.options.disabled){var d=c(b.target).closest(".ui-menu-item");d.length&&d.parent()[0]===
    a.element[0]&&a.activate(b,d)}}).bind("mouseout.menu",function(b){if(!a.options.disabled){var d=c(b.target).closest(".ui-menu-item");d.length&&d.parent()[0]===a.element[0]&&a.deactivate(b)}});this.refresh();if(!this.options.input)this.options.input=this.element.attr("tabIndex",0);this.options.input.bind("keydown.menu",function(b){if(!a.options.disabled)switch(b.keyCode){case c.ui.keyCode.PAGE_UP:a.previousPage();b.preventDefault();b.stopImmediatePropagation();break;case c.ui.keyCode.PAGE_DOWN:a.nextPage();
    b.preventDefault();b.stopImmediatePropagation();break;case c.ui.keyCode.UP:a.previous();b.preventDefault();b.stopImmediatePropagation();break;case c.ui.keyCode.DOWN:a.next();b.preventDefault();b.stopImmediatePropagation();break;case c.ui.keyCode.ENTER:a.select();b.preventDefault();b.stopImmediatePropagation();break}})},destroy:function(){c.Widget.prototype.destroy.apply(this,arguments);this.element.removeClass("ui-menu ui-widget ui-widget-content ui-corner-all").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-activedescendant");
    this.element.children(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").children("a").removeClass("ui-corner-all").removeAttr("tabIndex").unbind(".menu")},refresh:function(){this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem").children("a").addClass("ui-corner-all").attr("tabIndex",-1)},activate:function(a,b){var d=this;this.deactivate();if(this._hasScroll()){var e=parseFloat(c.curCSS(this.element[0],"borderTopWidth",true))||0,f=parseFloat(c.curCSS(this.element[0],
    "paddingTop",true))||0;e=b.offset().top-this.element.offset().top-e-f;f=this.element.attr("scrollTop");var g=this.element.height(),h=b.height();if(e<0)this.element.attr("scrollTop",f+e);else e+h>g&&this.element.attr("scrollTop",f+e-g+h)}this.active=b.first().children("a").addClass("ui-state-hover").attr("id",function(k,j){return d.itemId=j||d.menuId+"-activedescendant"}).end();this.element.removeAttr("aria-activedescenant").attr("aria-activedescenant",d.itemId);this._trigger("focus",a,{item:b})},
    deactivate:function(a){if(this.active){var b=this;this.active.children("a").removeClass("ui-state-hover");c("#"+b.menuId+"-activedescendant").removeAttr("id");this.element.removeAttr("aria-activedescenant");this._trigger("blur",a);this.active=null}},next:function(a){this._move("next",".ui-menu-item","first",a)},previous:function(a){this._move("prev",".ui-menu-item","last",a)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},
    _move:function(a,b,d,e){if(this.active){a=this.active[a+"All"](".ui-menu-item").eq(0);a.length?this.activate(e,a):this.activate(e,this.element.children(b)[d]())}else this.activate(e,this.element.children(b)[d]())},nextPage:function(a){if(this._hasScroll())if(!this.active||this.last())this.activate(a,this.element.children(".ui-menu-item").first());else{var b=this.active.offset().top,d=this.element.height(),e;this.active.nextAll(".ui-menu-item").each(function(){e=c(this);return c(this).offset().top-
        b-d<0});this.activate(a,e)}else this.activate(a,this.element.children(".ui-menu-item")[!this.active||this.last()?"first":"last"]())},previousPage:function(a){if(this._hasScroll())if(!this.active||this.first())this.activate(a,this.element.children(".ui-menu-item").last());else{var b=this.active.offset().top,d=this.element.height(),e;this.active.prevAll(".ui-menu-item").each(function(){e=c(this);return c(this).offset().top-b+d>0});this.activate(a,e)}else this.activate(a,this.element.children(".ui-menu-item")[!this.active||
        this.first()?":last":":first"]())},_hasScroll:function(){return this.element.height()<this.element.attr("scrollHeight")},select:function(a){this._trigger("select",a,{item:this.active})}})})(amznpubstudio_jQuery);

/*
 * jQuery UI Button 1.9m3
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(a){var g,i=function(b){a(":ui-button",b.target.form).each(function(){var c=a(this).data("button");setTimeout(function(){c.refresh()},1)})},h=function(b){var c=b.name,d=b.form,e=a([]);if(c)e=d?a(d).find("[name='"+c+"']"):a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form});return e};a.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",
    i);if(typeof this.options.disabled!=="boolean")this.options.disabled=this.element.attr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var b=this,c=this.options,d=this.type==="checkbox"||this.type==="radio",e="ui-state-hover"+(!d?" ui-state-active":"");if(c.label===null)c.label=this.buttonElement.html();if(this.element.is(":disabled"))c.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",
    function(){if(!c.disabled){a(this).addClass("ui-state-hover");this===g&&a(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){c.disabled||a(this).removeClass(e)}).bind("focus.button",function(){a(this).addClass("ui-state-focus")}).bind("blur.button",function(){a(this).removeClass("ui-state-focus")});d&&this.element.bind("change.button",function(){b.refresh()});if(this.type==="checkbox")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).toggleClass("ui-state-active");
    b.buttonElement.attr("aria-pressed",b.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");b.buttonElement.attr("aria-pressed",true);var f=b.element[0];h(f).not(f).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed",false)});else{this.buttonElement.bind("mousedown.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");
    g=this;a(document).one("mouseup",function(){g=null})}).bind("mouseup.button",function(){if(c.disabled)return false;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(f){if(c.disabled)return false;if(f.keyCode==a.ui.keyCode.SPACE||f.keyCode==a.ui.keyCode.ENTER)a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(f){f.keyCode===a.ui.keyCode.SPACE&&a(this).click()})}this._setOption("disabled",
    c.disabled)},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type==="radio"){this.buttonElement=this.element.parents().last().find("label[for="+this.element.attr("id")+"]");this.element.addClass("ui-helper-hidden-accessible");var b=this.element.is(":checked");b&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",b)}else this.buttonElement=
    this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());this.hasTitle||
this.buttonElement.removeAttr("title");this._super("destroy")},_setOption:function(b,c){this._superApply("_setOption",arguments);if(b==="disabled")c?this.element.attr("disabled",true):this.element.removeAttr("disabled");this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b);if(this.type==="radio")h(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
    true):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false)});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false)},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var b=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
    c=a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,e=d.primary&&d.secondary;if(d.primary||d.secondary){b.addClass("ui-button-text-icon"+(e?"s":d.primary?"-primary":"-secondary"));d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>");d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>");if(!this.options.text){b.addClass(e?"ui-button-icons-only":"ui-button-icon-only").removeClass("ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary");
    this.hasTitle||b.attr("title",c)}}else b.addClass("ui-button-text-only")}}});a.widget("ui.buttonset",{_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c);this._superApply("_setOption",arguments)},refresh:function(){this.buttons=this.element.find(":button, :submit, :reset, :checkbox, :radio, a, :data(button)").filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":visible").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end().end()},
    destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");this._super("destroy")}})})(amznpubstudio_jQuery);

(function($){$.jGrowl=function(m,o){if($('#jGrowl').size()==0)
$('<div id="jGrowl"></div>').addClass((o&&o.position)?o.position:$.jGrowl.defaults.position).appendTo('body');$('#jGrowl').jGrowl(m,o);};$.fn.jGrowl=function(m,o){if($.isFunction(this.each)){var args=arguments;return this.each(function(){var self=this;if($(this).data('jGrowl.instance')==undefined){$(this).data('jGrowl.instance',$.extend(new $.fn.jGrowl(),{notifications:[],element:null,interval:null}));$(this).data('jGrowl.instance').startup(this);}
if($.isFunction($(this).data('jGrowl.instance')[m])){$(this).data('jGrowl.instance')[m].apply($(this).data('jGrowl.instance'),$.makeArray(args).slice(1));}else{$(this).data('jGrowl.instance').create(m,o);}});};};$.extend($.fn.jGrowl.prototype,{defaults:{pool:0,header:'',group:'',sticky:false,position:'top-right',glue:'after',theme:'default',themeState:'highlight',corners:'10px',check:250,life:3000,closeDuration:'normal',openDuration:'normal',easing:'swing',closer:true,closeTemplate:'&times;',closerTemplate:'<div>[ close all ]</div>',log:function(e,m,o){},beforeOpen:function(e,m,o){},afterOpen:function(e,m,o){},open:function(e,m,o){},beforeClose:function(e,m,o){},close:function(e,m,o){},animateOpen:{opacity:'show'},animateClose:{opacity:'hide'}},notifications:[],element:null,interval:null,create:function(message,o){var o=$.extend({},this.defaults,o);if(typeof o.speed!=='undefined'){o.openDuration=o.speed;o.closeDuration=o.speed;}
this.notifications.push({message:message,options:o});o.log.apply(this.element,[this.element,message,o]);},render:function(notification){var self=this;var message=notification.message;var o=notification.options;var notification=$('<div class="jGrowl-notification '+o.themeState+' ui-corner-all'+
((o.group!=undefined&&o.group!='')?' '+o.group:'')+'">'+'<div class="jGrowl-close">'+o.closeTemplate+'</div>'+'<div class="jGrowl-header">'+o.header+'</div>'+'<div class="jGrowl-message">'+message+'</div></div>').data("jGrowl",o).addClass(o.theme).children('div.jGrowl-close').bind("click.jGrowl",function(){$(this).parent().trigger('jGrowl.close');}).parent();$(notification).bind("mouseover.jGrowl",function(){$('div.jGrowl-notification',self.element).data("jGrowl.pause",true);}).bind("mouseout.jGrowl",function(){$('div.jGrowl-notification',self.element).data("jGrowl.pause",false);}).bind('jGrowl.beforeOpen',function(){if(o.beforeOpen.apply(notification,[notification,message,o,self.element])!=false){$(this).trigger('jGrowl.open');}}).bind('jGrowl.open',function(){if(o.open.apply(notification,[notification,message,o,self.element])!=false){if(o.glue=='after'){$('div.jGrowl-notification:last',self.element).after(notification);}else{$('div.jGrowl-notification:first',self.element).before(notification);}
$(this).animate(o.animateOpen,o.openDuration,o.easing,function(){if($.browser.msie&&(parseInt($(this).css('opacity'),10)===1||parseInt($(this).css('opacity'),10)===0))
this.style.removeAttribute('filter');if($(this).data("jGrowl")!=null)
$(this).data("jGrowl").created=new Date();$(this).trigger('jGrowl.afterOpen');});}}).bind('jGrowl.afterOpen',function(){o.afterOpen.apply(notification,[notification,message,o,self.element]);}).bind('jGrowl.beforeClose',function(){if(o.beforeClose.apply(notification,[notification,message,o,self.element])!=false)
$(this).trigger('jGrowl.close');}).bind('jGrowl.close',function(){$(this).data('jGrowl.pause',true);$(this).animate(o.animateClose,o.closeDuration,o.easing,function(){if($.isFunction(o.close)){if(o.close.apply(notification,[notification,message,o,self.element])!==false)
$(this).remove();}else{$(this).remove();}});}).trigger('jGrowl.beforeOpen');if(o.corners!=''&&$.fn.corner!=undefined)$(notification).corner(o.corners);if($('div.jGrowl-notification:parent',self.element).size()>1&&$('div.jGrowl-closer',self.element).size()==0&&this.defaults.closer!=false){$(this.defaults.closerTemplate).addClass('jGrowl-closer '+ this.defaults.themeState +' ui-corner-all').addClass(this.defaults.theme).appendTo(self.element).animate(this.defaults.animateOpen,this.defaults.speed,this.defaults.easing).bind("click.jGrowl",function(){$(this).siblings().trigger("jGrowl.beforeClose");if($.isFunction(self.defaults.closer)){self.defaults.closer.apply($(this).parent()[0],[$(this).parent()[0]]);}});};},update:function(){$(this.element).find('div.jGrowl-notification:parent').each(function(){if($(this).data("jGrowl")!=undefined&&$(this).data("jGrowl").created!=undefined&&($(this).data("jGrowl").created.getTime()+parseInt($(this).data("jGrowl").life))<(new Date()).getTime()&&$(this).data("jGrowl").sticky!=true&&($(this).data("jGrowl.pause")==undefined||$(this).data("jGrowl.pause")!=true)){$(this).trigger('jGrowl.beforeClose');}});if(this.notifications.length>0&&(this.defaults.pool==0||$(this.element).find('div.jGrowl-notification:parent').size()<this.defaults.pool))
this.render(this.notifications.shift());if($(this.element).find('div.jGrowl-notification:parent').size()<2){$(this.element).find('div.jGrowl-closer').animate(this.defaults.animateClose,this.defaults.speed,this.defaults.easing,function(){$(this).remove();});}},startup:function(e){this.element=$(e).addClass('jGrowl').append('<div class="jGrowl-notification"></div>');this.interval=setInterval(function(){$(e).data('jGrowl.instance').update();},parseInt(this.defaults.check));if($.browser.msie&&parseInt($.browser.version)<7&&!window["XMLHttpRequest"]){$(this.element).addClass('ie6');}},shutdown:function(){$(this.element).removeClass('jGrowl').find('div.jGrowl-notification').remove();clearInterval(this.interval);},close:function(){$(this.element).find('div.jGrowl-notification').each(function(){$(this).trigger('jGrowl.beforeClose');});}});$.jGrowl.defaults=$.fn.jGrowl.prototype.defaults;})(amznpubstudio_jQuery);
        var $ = amznpubstudio_jQuery;

var linkCodes = {
    'textLink' : 'ptl',
    'textPopover': 'ptp',
    'textPopoverFb' : 'ptf',
    'textPopoverTwitter' : 'ptt',
    'textAuto' : 'pta',
    'shopNow' : 'pis',
    'imagePopover' : 'pip',
    'imagePopoverFb' : 'pif',
    'imagePopoverTwitter' : 'pit',
    'imageAuto' : 'pia'
};
;
var config = {
    'stage': 'prod',
    'locale': 'US',
    'retailTLD': 'com',
    'marketplaceConfig': {
        'amazon': {
            'id': '1',
            'name': 'amazon',
            'alias': 'Amazon.com',
            'obfId': 'ATVPDKIKX0DER',
            'retailWebsite': 'https://pre-prod.amazon.com',
            'productReviewsPage': '/product-reviews/',
            'completionServiceHost': 'https://completion.amazon.com'
        }
    },
    'retailWebsite': 'https://amazon.com',
    'widgetServerHost': 'https://ws-na.amazon-adsystem.com',
    'impressionHost': 'https://ir-na.amazon-adsystem.com',
    'analyticsHost': 'https://ir-na.amazon-adsystem.com',
    'completionServiceHost': 'https://completion.amazon.com',
    'acLandingUrl': 'https://affiliate-program.amazon.com',
    'cloudfrontUrl': 'https://ps-us.amazon-adsystem.com',
    'psServiceHost': 'https://aps.amazon.com',
    'loadScriptsFromCf': false,
    'useMinifiedScripts': false,
    'shareFeedbackEmailId': 'publisherstudio-feedback@amazon.com',
    'conditionsOfUseLinkText': 'Participation Requirements',
    'prefsCacheBustingParam': 1,
    'sprite1': 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/ps-spr-1.png',
    'sprite2': 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/ps-spr-2.png',
    'swfUrl' : 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/Clipboard_US.swf',
    'oldSprite1' : 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/ps-spr-1-old.png',
    'oldSprite2' : 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/ps-spr-2-old.png',
    'searchSprite' : 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/search-sprite.png',
    'indicatorImage' : 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/indicator.gif',
    'adServingSprite' : 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/ps-js-spr-en.png',
    'fallbackAsinImage': 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/no-image-no-ciu.gif',
    'cloneCursorImage': 'https://dnd1av4y9k5gc.cloudfront.net/images/bookmarklet/image-clone-cursor.cur',
    'enableConsoleLogging': true,
    'shortCodeDomain':['/*facebook.com/*','/*twitter.com/*','/*reddit.com/*','/*linkedin.com/*','/*plus.google.com/*'],
    'prefsCb': 1
};


// Constants used to determine type of landing page
if(!window.amznPs) {
    window.amznPs = {};
}
window.amznPs.landingPageTypeConfigData = {
    'searchPage': 'SEARCH',
    'categoryPage': 'CATEGORY',
    'gatewayPage': 'GATEWAY',
    'asinPage': 'ASIN'
};

;
var constants = (function() {
    var psServiceHost = config.psServiceHost,
        locale = config.locale ? config.locale :  '__locale__',
        wsHost = config.widgetServerHost,
        prefsCacheBuster = (new Date().getTime()/config.prefsCb).toFixed(0);

    var wsUrlPattern = wsHost + '/widgets/q?' + 'TemplateId=PubStudio' + '&ServiceVersion=20070822' +
        '&MarketPlace=' + locale + '&Operation=__operation__' + '&InstanceId=__instance__id__&dataType=json';

    return {
        'all' : 'assoc-pubstudio-all',
        'searchInAllCategories' : 'ps-search-in-all-cat',
        'searchForAProduct' : 'ps-search-product',
        'go' : 'assoc-pubstudio-go',
        'searchInCategory' : 'ps-search-in-cat',
        'searchSuggestiojnInCategory' : 'ps-search-sugg-in-cat',
        'searchSuggestion' : 'ps-search-suggestion',
        'transientSearchErrorMsg' : 'ps-transient-search-err-msg',
        'noSearchResultMsg' : 'ps-no-search-result-msg',
        'searchResultsForTermInCategory' : 'ps-search-results-in-cat',
        'popOverTextSelectionError' : 'ps-popover-txt-sel-err',
        'alreadyALinkError' : 'ps-link-textlink-err',
        'networkError' : 'ps-network-err',
        'categoryError': 'ps-category-error',
        'multipleTextNodesError' : 'ps-multiple-text-node-err',
        'editButtonTooltip' : 'ps-edit',
        'deleteButtonTooltip' : 'ps-delete',
        'closeAll' : 'ps-close-all',

        'loginExpired' : 'ps-login-expired',

        'addSettingsSuccessMessage' : 'ps-settings-save-success',
        'addSettingsFailureMessage' : 'ps-settings-update-failed',
        'getSettingsFailureMessage' : 'ps-settings-get-fail', //need to add to string-translator

        'whiteListImageSuccessMessage' : 'ps-image-restore-success',
        'whiteListImageFailureMessage' : 'ps-image-restore-failed',
        'blackListImageSuccessMessage' : 'ps-image-ignore-success',
        'blackListImageFailureMessage' : 'ps-image-ignore-failed',

        'noSearchResultMessage' : 'ps-no-search-result-msg',
        'longSearchString' : 'ps-long-search-str',
        'transientSearchErrorMessage' : 'ps-transient-search-err-msg',
        'defaultSearchPlaceholder' : 'ps-search-product',
        'paginationMessage' : 'ps-image-x-of-y',

        'saveInProgressMessage' : 'ps-save-in-progress',
        'updateInProgressMessage' : 'ps-update-in-progress',
        'deleteInProgressMessage' : 'ps-delete-in-progress',

        'addHotspotSuccessMessage' :  'ps-pin-success',
        'addHotspotFailureMessage' :  'ps-pin-failed',
        'deleteHotspotSuccessMessage' :  'ps-pin-delete-success',
        'deleteHotspotFailureMessage' :  'ps-pin-delete-failed',
        'editHotspotSuccessMessage' :  'ps-hotspot-success',
        'editHotspotFailureMessage' :  'ps-hotspot-failed',
        'addTextlinkSuccessMessage' : 'ps-textlink-success',
        'addTextlinkFailureMessage' : 'ps-textlink-failed',
        'deleteTextlinkSuccessMessage' : 'ps-textlink-delete-success',
        'deleteTextlinkFailureMessage' : 'ps-textlink-delete-failed',
        'editTextlinkSuccessMessage' :  'ps-textlink-update-success',
        'editTextlinkFailureMessage' : 'ps-textlink-update-failed',

        'autoLinkCloneClickMsg' : 'assoc-psadmin-auto-clone-click',

        //ad-serving popover strings
        'shopNow' : 'assoc-ps-shop-now',
        'shopAtAmazon' : 'ps-shop-at-amazon',
        'buyAtAmazon' : 'ps-buy-it-from-amazon',

        'completionServiceUrlPattern' : config.completionServiceHost + '/search/complete?method=completion' +
            '&q=__TERM__' +
            '&search-alias=__SEARCHALIAS__' +
            '&client=client-associates-search' +
            '&mkt=' + '__MARKETPLACE_ID__',

        'widgetServerUrlForStrings' : wsUrlPattern.replace('__operation__', 'GetStrings').replace('__instance__id__', 'amznps'),
        'widgetServerUrlForCategories' : wsUrlPattern.replace('__operation__', 'GetCategories').replace('__instance__id__', 'amznps'),
        'widgetServerUrlForItem' : wsUrlPattern.replace('__operation__', 'GetDetails').replace('__instance__id__', 'amznps') + "&ItemId=__ASIN_STRING__",
        'widgetServerUrlForSearch' : wsUrlPattern.replace('__operation__', 'ItemSearch') + '&Keywords=__keywords__' +
            '&SearchIndex=__searchindex__' + '&multipageStart=__multipagestart__' + '&multipageCount=__multipagecount__',

        'productLinkUrlPattern' : wsHost +'/widgets/q?ServiceVersion=20070822&Operation=GetAdHtml&ID=OneJS&OneJS=1&source=ps'+
            '&ref=__REF_TAG__&ad_type=product_link&tracking_id=__TAG__&marketplace=amazon&region=US&placement=0062024035&asins='+'__ASIN__'+
            '&show_border=true&link_opens_in_new_window=true&MarketPlace=__MARKETPLACE__&price_color=BF3E3E&title_color=0066C0&bg_color=FFFFFF&linkId=__LINK_ID__',

        'productImageUrlPattern' : wsHost + '/widgets/q?' +
            '_encoding=UTF8&ASIN=' + '__ASIN__' + '&Format=_SL250_&ID=AsinImage&MarketPlace=' +
            '__MARKETPLACE__' + '&ServiceVersion=20070822&WS=1',

        'pingUrl' : psServiceHost + '/services/checkSessionAndReturnStores?reqId=__req__id__&locale=' + locale,
        'loginUrl' : psServiceHost + '/services/login?reqId=__req__id__&locale=' + locale,
        'logoutUrl' : psServiceHost + '/services/logout?locale=' + locale,
        'checkAuthorizationUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__?reqId=__req__id__&locale=' + locale,

        'impressionsUrl' : config.impressionHost + '/e/ir',
        'analyticsUrl' : config.analyticsHost + '/s/wa',

        'addLinkUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__' +
            '/prefs/__page__id__/hotspots/add?reqId=__req__id__&locale=' + locale + '&json=__json__&url=__url__',
        'deleteLinkUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__' +
            '/prefs/__page__id__/hotspots/__hotspot__id__/delete?reqId=__req__id__&locale=' + locale,
        'getSettingsUrl' : psServiceHost + '/services/json/getSettings?storeId=__store__id__&domainId=__domain__id__&locale=' +
            locale,
        'updateSettingsUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__' +
            '/settings/update?reqId=__req__id__&locale=' + locale + '&json=__json__',
        'blackListImgUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__' +
            '/settings/blacklists/add?reqId=__req__id__&locale=' + locale + '&url=__url__',
        'whiteListImgUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__' +
            '/settings/blacklists/delete?reqId=__req__id__&locale=' + locale + '&url=__url__',
        'getPrefsFromCfUrl' : config.cloudfrontUrl + '/prefs/__domain__id__/'
            + '__page__hash__' + '.json?_cb=' + prefsCacheBuster,
        'getPrefsFromDbUrl' : psServiceHost + '/services/json/stores/__store__id__/domains/__domain__id__/prefs/__page__hash__' +
            '?reqId=__req__id__&locale=' + locale,
        'getShortUrl' : psServiceHost + '/services/getShortUrl?longUrl=__long__url__',

        'maxCategoryDepth': 4,
        'categoryTreeUrlPattern': psServiceHost + '/services/getBrowseNode?nodeId=__NODE_ID__&marketplaceId=__MARKETPLACE_ID__'
    };
})();


//
// Module to toggle between console or in-memory logging. We use console logging
// in dev envs (when available) and just keep the output in memory as a string in
// prod. The in-memory log dump is useful for diagnostics.
//

var logger = function() {
    var logContent = '';
    var log;

    var dumpLog = function() {
        return logContent;
    };

    var debugLog = function(msg) {
        logContent += (msg + "\n");
    };

    var init = function(enable) {
        var consoleLoggerPresent = false;

        if((typeof config != 'undefined' && config.enableConsoleLogging) || enable) {
            try {
                if (typeof console != "undefined" && typeof console.log != "undefined") {
                    consoleLoggerPresent = true;
                    log = function () { console.log.apply(console, arguments); };

                    //this should throw an error and get caught if we have any issue in flipping to the console log function
                    //typically happens in chrome
                    log("Checking logger functionality");
                } else {
                    log = debugLog;
                }
            } catch (e) {
                //nothing to do, let the default impl get used
                log = debugLog;
                //if this fails then we really have a problem!
                var msg = "Error setting console log. Falling back to debugLog function";
                if(consoleLoggerPresent) {
                    console.log(msg);
                }
                log(msg);
            }
        } else {
            log = debugLog;
        }
    };

    init();
    return {
        'init': init,
        'log': log,
        'dumpLog': dumpLog,
        'debugLog': debugLog
    };
}();

function amzn_ps_bm_metrics(config, constants) {
    var extId = window.amznPsBmId || 'default';
    var commonQueryParams = 'source=bk&t=__TAG__&bm-id=' + extId;

    this.impressionUrl = constants.impressionsUrl+'?' + commonQueryParams;
    this.analyticsUrl = constants.analyticsUrl + '?' + commonQueryParams;
    var op = config.stage === 'prod' ? 'OP':'TOP';
    this.foresterUrl = '//fls-' +"NA"+ '.amazon.com/1/publisher-studio/1/' + op + '/';
}

amzn_ps_bm_metrics.prototype.send = function(payload) {
    var self = this;
    payload['tag'] = bootstrap.tag;
    new Image().src=this.foresterUrl + encodeURIComponent(JSON.stringify(payload));
};


amzn_ps_bm_metrics.prototype.createImgPixel = function(url, id, linkid) {
    var self = this;
    url = url+ '&linkId=' + linkid + '&_cb=' + new Date().getTime();
    var btstrpTag = bootstrap.tag;
    var tag = typeof btstrpTag == "function" ? btstrpTag() : btstrpTag;
    url=url.replace('__TAG__', tag);
    return '<img src="' + url + '" id="amznPsBmPixel_'+ id +
        '" width="0" height="0" border="0" alt="" style="border:none !important; margin:0px !important; padding:0px !important; height:0px !important; width:0px !important;">';
};

// FIXME: this is a lot of redundant code - clean up

amzn_ps_bm_metrics.prototype.createTLPixel = function(id, linkid) {
    var self = this;

    var url = self.impressionUrl + '&l=' + linkCodes.textLink;
    return self.createImgPixel(url, id, linkid);
};

amzn_ps_bm_metrics.prototype.createILPixel = function(id, linkid) {
    var self = this;

    var url = self.impressionUrl + '&l=' + linkCodes.imageLink;
    return self.createImgPixel(url, id, linkid);
};

amzn_ps_bm_metrics.prototype.createPLPixel = function(id, linkid) {
    var self = this;

    var url = self.impressionUrl + '&l=' + linkCodes.productLink;
    return self.createImgPixel(url, id, linkid);
};

amzn_ps_bm_metrics.prototype.createIPLPixel = function(id, linkid) {
    var self = this;

    var url = self.impressionUrl + '&l=' + linkCodes.imageOnlyProductLink;
    return self.createImgPixel(url, id, linkid);
};

amzn_ps_bm_metrics.prototype.init = function() {
    var self = this;

    //IR call indicating bookmarklet-JS was fetched
};
        var metrics = new amzn_ps_bm_metrics(config, constants);

var utils = {
    'findXPath': function(elem) {
        var typeOfNode = "", classOfNode="";
        var sib;
        for (var segs = []; elem && elem.nodeType == 1; elem = elem.parentNode) {
            if (classOfNode == "" && elem.hasAttribute('class')) {
                typeOfNode = elem.localName;
                classOfNode = elem.getAttribute('class');
            }
            if (elem.hasAttribute('id')) {
                segs.unshift('id("' + elem.getAttribute('id') + '")');
                return segs.join('/')
            }
            else {
                var i;
                for (i = 1, sib = elem.previousSibling; sib; sib = sib.previousSibling)
                    if (sib.localName == elem.localName) i++;
                segs.unshift(elem.localName.toLowerCase() + '[' + i + ']')
            }
        }
        return segs.length ? '/' + segs.join('/') : null
    },

    'hash' : function (url) {
        var urlHash = 0;
        for (var i = 0; i < url.length; i++) {
            var c = url.charCodeAt(i);
            urlHash = ((urlHash << 5) - urlHash) + c;
            urlHash = urlHash & urlHash;
        }
        return Math.abs(urlHash);
    },

    'browserMessages' : function(){
        var actions = {
            'userAction' : function(request) {
                metrics.send({'action':'runApp'});
            },
            'postAuthorize' : function (request) {
                bootstrap.postAuthorize(request);
            },
            //needed in case the service call fails with 401(unauthorized) code
            'postLogout' : function (request) {
                bootstrap.postLogout(true);
            },
            'appStatus':function(request){
                bootstrap.setLinkCreation(request.value);
            }
        };
        var listen = function (request, sender, sendResponse) {
            var _call = request.method;
            if (_call && ( typeof actions[_call] == 'function')) {
                actions[_call](request);
            }
        };
        return{
            actions: actions,
            listen: listen
        };
    }
};

/*
    LinkID - JS implementation
    >> @author vignesha
    >> defines an unscoped AmznLinkID object - encapsulating all the core functionality related to linkid
    >> @usage var linkID = AmznLinkID.get(dataAsJson, stage[optional]); 
    >> default value for stage is test and will not record the id to forester; only 'prod' is recorded
    >> depends on CrytoJS (packaged within)
*/

;

var AmznLinkID = AmznLinkID || (function () {

    "use strict";
    
    var CryptoJS; // library looks for CryptoJS defined on the page. Setting it to null forces it to use the instance from this file.
    
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if(j%4)for(var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if(65535<a.length)for(g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<
32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,
2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},
g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if(b){for(var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);
b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,
g)).finalize(a)}}});var k=m.algo={};return m}(Math);
(function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for(var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(g,k){for(var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),
c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,
d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,
C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/
4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for(b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);
    
    var Link = function (input, stage) {
        
        stage = stage || 'test';

        if (typeof input.tag !== 'string') {
            throw new Error('Invalid Tag');
        }
        
        // all the clubbing to make JSLint happy
        
        var lc = input.linkCode,
            tc = input.toolCreation,
            mkt = parseInt(input.marketplaceId, 10),
            data = {},
            region,
            op,
            foresterUrl,
            key,
            id,
            payload;
        
        if (typeof lc !== 'string' || (lc.length < 2) || (lc.length > 3)) {
            throw new Error('Invalid LinkCode');
        }
        
        if (typeof tc !== 'string' || (tc.match(/^(AC|SS|Pubstudio|Feeds|PAAPI)$/i) === null)) {
            throw new Error('Invalid ToolCreation');
        }
        
        if (isNaN(mkt)) {
            throw new Error('Invalid Marketplace');
        }
        
        if (stage === 'prod') {
            op = 'OP';
            // have to store linkid data in the region where the program belongs
            switch (mkt) {
            case 1: //amazon.com
            case 4861: //endless.com
            case 91960: //amazonsupply.com
            case 51350: //wireless.amazon.com
            case 157860: //myhabit.com
            case 223310: //local.amazon.com
            case 7: //amazon.ca
            case 526970: //amazon.com.br
                region = 'na';
                break;
            case 3: //amazon.co.uk
            case 35291: //javari.co.uk
            case 106631: //local.amazon.co.uk
            case 4: //amazon.de
            case 35331: //javari.de
            case 78931: //buyvip.de
            case 5: //amazon.fr
            case 35341: //javari.fr
            case 44551: //amazon.es
            case 44571: //amazon.in
            case 35691: //amazon.it
                region = 'eu';
                break;
            case 6: //amazon.jp
            case 41092: //javari.jp
                region = 'fe';
                break;
            case 3240: //amazon.cn
                region = 'cn';
                break;
            default:
                throw new Error('Invalid Marketplace ID');
            }
        } else {
            op = 'TOP';
            region = 'gamma-na';
        }
        
        foresterUrl = 'https://fls-' + region + '.amazon.com/1/assoc-links/1/' + op + '/';
        
        // clone the data
        for (key in input) {
            if (input.hasOwnProperty(key)) {
                data[key] = input[key];
            }
        }

        data.createTime = new Date().getTime();

        // defensive coding - for impossible condition where md5 computation throws an error
        try {
            id = CryptoJS.MD5(JSON.stringify(data)).toString();
        } catch(e) {
            // md5('crypto md5 creation failed') with first and last char replaced with 'z'
            id = 'z7b5638deb81af5805803e8dc94cfdez';
        }

        this.linkId = id;
        
        payload = { linkId: id, trackingParams: data, '_v':1 };
        
        // call forester and record the data
        (new Image()).src = foresterUrl + encodeURIComponent(JSON.stringify(payload));

        this.get = function () {
            return this.linkId;
        };
    },
        // primitive object as interface
        LinkID = {};
        
    LinkID.get = function (data, stage) {
        return new Link(data, stage).get();
    };
    return LinkID;
    
}());

/**
 * Created by misanand on 5/7/14.
 */
/****Browser specific*************/
function amzn_ps_bm_browser() {
    DOCUMENT = document;
    var interfaceMembers = ['getPlatformConfigs','setPlatformConfigs','addLocalPlatformConfig','init']; // these member function that should be implemented across all browsers
    this.getInterfaceMembers = function(){
        return interfaceMembers;
    };
    this.name = 'chrome';
}

amzn_ps_bm_browser.prototype.getPlatformConfigs = function (key,callback){
    chrome.storage.sync.get(key,function(obj){
        var configs = null;
        if(key !== null){
            var configs = obj[key];
            if(typeof(configs) === 'string'){
                configs = JSON.parse(configs);
            }else configs = [];
        }
        else{
            if(obj){
                configs = {};
                for(var index in obj){
                    configs[index] = JSON.parse(obj[index]);
                }
            }
        }
        callback(configs);
    });
};

//change it to setConfigs, used to store non-platform data as well.
amzn_ps_bm_browser.prototype.setPlatformConfigs = function(key,data) {
    var obj = {};
    obj[key] = data;
    chrome.storage.sync.set(obj);
};

amzn_ps_bm_browser.prototype.addLocalPlatformConfig = function(key,data) {
    var self = this;
    self.getPlatformConfigs(key,function (configs) {
        configs.push(data);
        configs = JSON.stringify(configs);
        self.setPlatformConfigs(key,configs);
    });
};

amzn_ps_bm_browser.prototype.sendMessage = function(data, cb) {
    if(!cb) {
        cb = function(response){}
    }
    chrome.runtime.sendMessage(data, cb);
};

amzn_ps_bm_browser.prototype.initPlatformConfigs = function() {
    if(bStrap.platform == "fallback") {
        window.amznPs.link.deAttachTextLinkEventToCompose();
        window.amznPs.link.deAttachTextLinkEventToHtml();
    }
};

amzn_ps_bm_browser.prototype.onUrlChange = function(data) {
    // Dummy impl to maintain the interface. Not needed in Chrome.
};


amzn_ps_bm_browser.prototype.init = function(utilites){

    var interfaceMembers = this.getInterfaceMembers();
    for(var _inst in interfaceMembers)
        if(typeof(this[interfaceMembers[_inst]] ) != 'function') {
            //window.amznPs.logger.log('Browser interface not implemented, some extension api may break');
        }

    chrome.runtime.onMessage.addListener(utilites.browserMessages().listen);
};

        var browser = new amzn_ps_bm_browser();

var notifications = function() {

    var reusableNotifications = {};
    var newFeature = "autobot";

    var createUniqueErrorMsg = function(id, header, message) {
        var msgWrapper = "<div class='amznpubstudio-message-icon-wrapper'><div class='amznpubstudio-message-icon amznpubstudio-message-error'></div></div>" + message;

        var existingNotification = reusableNotifications[id];
        if(existingNotification == undefined) {
            $.jGrowl(msgWrapper, {
                header: header,
                glue: 'before',
                position: 'top-right',
                sticky: true,
                theme: 'error',
                open: function(e, m, o) {
                    reusableNotifications[id] = e;
                },
                close: function(e, m, o) {
                    delete reusableNotifications[id];
                }
            });
        } else {
            $(".jGrowl-message", existingNotification).html(msgWrapper);
        }
    };

    var createUniqueWarningMsg = function(header, message) {
        var msgWrapper = "<div class='amznpubstudio-message-icon-wrapper'><div class='amznpubstudio-message-icon amznpubstudio-message-warning'></div></div>" + message;

        var id = message;
        var existingNotification = reusableNotifications[id];
        if(existingNotification == undefined) {
            $.jGrowl(msgWrapper, {
                header: header,
                glue: 'before',
                position: 'top-right',
                life: 5000,
                theme: 'warning',
                open: function(e, m, o) {
                    reusableNotifications[id] = e;
                },
                close: function(e, m, o) {
                    delete reusableNotifications[id];
                }
            });
        } else {
            $(".jGrowl-message", existingNotification).html(msgWrapper);
        }
    };

    var remove = function(id) {
        $(reusableNotifications[id]).remove();
        delete reusableNotifications[id];
    };

    var showSuccessNotification = function(message) {
        var msgWrapper = "<div class='amznpubstudio-message-icon-wrapper'><div class='amznpubstudio-message-icon amznpubstudio-message-success'></div></div>" + message;

        $.jGrowl(msgWrapper, {
            glue: 'before',
            position: 'top-right',
            life: 3000,
            theme: 'success'
        });
    };

    var showErrorNotification = function(id, message) {
        if(!id) id = message;
        createUniqueErrorMsg(id, "", message);
    };

    var showWarningNotification = function(message) {
        createUniqueWarningMsg("", message);
    };

    var showNewFeatureNotification = function(){
        if(bootstrap.authorized() && settings.fetched()) {
            var feat = newFeature;
            var featureCookie = 'amzn-ps-Notify-' + feat;
            var ps = settings.pubSettings();
            if(ps && ps[feat] == 'unset' && bootstrap.getData(featureCookie) != 'false') {
                var str = function(id) { return strings.get('assoc-ps-newfeat-' + id); };

                var msg = '<div style="padding-top: 10px;">'
                    + "<div class='amznpubstudio-message-icon amznpubstudio-message-info'></div>"
                    + "<div>" + str(feat + '-msg') + "</div><br/>"
                    + '<div class="amzn-nf-buttonbar">'
                    + '<div>'
                    + '<button id="amzn-nf-enable">' + str('enable') + '</button> '
                    + '<button id="amzn-nf-select">' + str('select') + '</button>'
                    + '</div>'
                    + '<ul>'
                    + '<li><a id="amzn-nf-remind" href="#">' + str('remind') + '</a></li>'
                    + '<li><a id="amzn-nf-forget" href="#">' + str('forget') + '</a></li>'
                    + '</ul>'
                    + '</div>'
                    + '</div>';

                $.jGrowl(msg, {
                    header: str(feat + '-title'),
                    glue: 'before',
                    position: 'top-right',
                    sticky: true,
                    theme: 'info',
                    open: function(e, m, o) {
                        e.find( "#amzn-nf-enable" )
                            .button()
                            .click(function() {
                                var s = {};
                                s[feat] = 'on';
                                settings.update(s);
                                e.trigger('jGrowl.close');
                            })
                            .next()
                            .button({
                                text: false,
                                icons: {
                                    primary: "ui-icon-triangle-1-s"
                                }
                            })
                            .click(function() {
                                var menu = $( this ).parent().next().css({width:100}).show().position({
                                    my: "right top",
                                    at: "right bottom",
                                    of: this
                                });
                                $( document ).one( "click", function() {
                                    menu.hide();
                                });
                                return false;
                            })
                            .parent()
                            .buttonset()
                            .next()
                            .hide()
                            .menu();

                        e.find('#amzn-nf-forget')
                            .click(function() {
                                bootstrap.setData(featureCookie,'false',365);
                                e.trigger('jGrowl.close');
                            });

                        e.find('#amzn-nf-remind')
                            .click(function() {
                                bootstrap.setData(featureCookie,'false',1);
                                e.trigger('jGrowl.close');
                            });
                    }
                });
            }
        }
    };

    return {
        'remove': remove,
        'showSuccessNotification': showSuccessNotification,
        'showErrorNotification': showErrorNotification,
        'showWarningNotification': showWarningNotification,
        'showNewFeatureNotification': showNewFeatureNotification
    };
}();


/**
 * Created by misanand on 5/7/14.
 */

function amzn_ps_bm_xhr() {

}

amzn_ps_bm_xhr.prototype.makeXHR = function(request) {
    $.ajax({
        url: request.url,
        timeout: request.timeout,
        method:request.methodType,
        dataType:request.dataType,
        cache: request.cache,
        success: (function(req) {
            return (function(resp) {
                req.successCBArgs.push(resp);
                req.successCB.apply(undefined,req.successCBArgs);
            })
        })(request),
        error: (function(req) {
            return (function(jqXHR, textStatus, errorThrown) {
                req.failureCBArgs.push(jqXHR);req.failureCBArgs.push(textStatus);req.failureCBArgs.push(errorThrown);
                req.failureCB.apply(undefined,req.failureCBArgs);
            })
        })(request)
    });
};

var xhr = new amzn_ps_bm_xhr();

var strings = function(){
    var stringSet = {"ps-textlink-failed":"Text link addition failed, please try again.","assoc-ps-shop-now":"Shop now","ps-settings-update-failed":"Settings update failed.","ps-pin-delete-success":"Image pin deleted successfully.","ps-textlink-delete-success":"Text link deleted successfully.","ps-pin-delete-failed":"Image pin deletion failed, please try again.","assoc-pubstudio-minimize-toolbar":"Minimize toolbar","ps-bk-select-link-title":"Choose other link types","assoc-ps-newfeat-enable":"Enable now!","ps-hotspot-success":"Image pin updated successfully.","ps-failed-to-parse-stringset":"Failed to parse string set.","ps-sign-in-diff-user":"Sign in as different user.","ps-bk-image-link-fail-notification":"Image-tagging failed. Please try again after selecting the image you wish to link","assoc-ps-newfeat-autobot-title":"New feature launched","ps-bk-text-link-edit-success-notification":"Text Link edited successfully","ps-bk-text-link-success-notification":"Text Link created successfully","assoc-pubstudio-signing-in":"Signing In","ps-image-tagging-settings":"Image Tagging Settings","ps-bk-product-link-edit-success-notification":"Text and Image link edited successfully","ps-bk-image-only-link-del-success-notification":"Image deleted successfully","assoc-ps-newfeat-select":"Select","ps-transient-search-err-msg":"Sorry, your search is taking more time than expected. Please try again","ps-buy-it-from-javari":"Buy it from Javari","assoc-pubstudio-all":"All","assoc-pubstudio-signin":"Sign In","ps-settings-save-success":"Settings saved successfully","ps-image-ignore-failed":"Failed to ignore image. Please try again.","ps-multiple-text-node-err":"Text link creation failed as selected text spans across multiple paragraphs.","ps-save":"Save","ps-update-in-progress":"Update in progress","ps-edit":"Edit","assoc-pubstudio-page-mode":"Page Mode","ps-no-search-result-msg":"Sorry, we are not able to find any result matching with your keyword. Please change the keyword and try again.","ps-search-results-in-cat":"Search results for {key} in {cat]","ps-bk-amzn-pub-studio-title":"Amazon Publisher Studio","ps-image-restore-failed":"Image restoration failed. Please try again.","assoc-pubstudio-pin-to-bottom":"Pin to Bottom","ps-image-restore-success":"Image successfully restored.","ps-link-textlink-err":"Text link creation failed as parts of selected text already contain a link. Please select an alternate text and try again.","assoc-pubstudio-tag":"Tag","assoc-pubstudio-untagged":"Untagged","assoc-pubstudio-signed-out":"You have been signed out.","ps-bk-image-only-link-title":"Add a new product image","ps-bk-text-link":"Add Link","ps-pin-success":"Image pinned successfully.","ps-shop-at-javari":"Shop at Javari","ps-height-range":"Height range (pixels)","assoc-pubstudio-conditions-of-use":"Conditions of use","ps-textlink-update-failed":"Text link updation failed, please try again.","assoc-pubstudio-signed-in":"You have been signed in","ps-bk-text-link-fail-notification":"Text-linking failed. Please try again after selecting the text you wish to link","ps-save-in-progress":"Save in progress","ps-cancel":"Cancel","ps-search-in-all-cat":"Search in all categories","ps-bk-edit-link-button":"Edit","ps-bk-image-already-linked-notification":"Image-tagging failed. The image you are trying to link is already linked to a page","assoc-pubstudio-theatre-mode":"Theatre Mode","ps-delete-in-progress":"Delete in progress","ps-pin-failed":"Image pinning failed, please try again.","ps-internal-error":"Looks like the server is down. We are working on it, please try logging in after some time.","ps-long-search-str":"Search term is more than 100 characters. Please change keywords and try again.","ps-search-in-cat":"Search in {cat}","ps-bk-product-link":"Text And Image","ps-bk-copy-to-clipboard-title":"Copy to clipboard","ps-bk-image-link-title":"Tag an existing image","assoc-pubstudio-settings":"Settings","ps-change-user":"Change User","ps-bk-copy-overlay-heading":"Get Link","ps-search-product":"Search for a product","assoc-ps-privacy":"Privacy","ps-auth-failed":"The server encountered an error while processing your request.","ps-search-sugg-in-cat":"Search {sugg} in {cat}","ps-bk-copy-success-msg":"copied","assoc-psadmin-auto-clone-click":"Automatically tagged image and cannot be edited manually.","ps-shop-at-amazon":"Shop at Amazon","assoc-ps-newfeat-remind":"Remind me later","ps-bk-image-link-edit-success-notification":"Image Link edited successfully","assoc-ps-newfeat-forget":"Not now","ps-bk-product-link-title":"Add a text and image link","ps-conditions-of-use-msg":"Please use Publisher Studio responsibly. For example, do not add Special Links to an image of a celebrity that violates that person's rights, such as by implying an endorsement or other association. ","ps-width-range":"Width range (pixels)","ps-close-all":"close all","ps-working-on-it":"Looks like server is down. We are working on it, please try after sometime.","ps-bk-text-link-del-success-notification":"Text Link deleted successfully","ps-bk-delete-link-button":"Delete","ps-popover-txt-sel-err":"Text link creation failed as the selected text is part of an existing ads. Please select an alternate text and try again.","assoc-ps-privacy-disclaimer":"This ad was placed by the owner of this website, which is a participant in Amazon Services LLC\u2019s Associates Program, an affiliate advertising program.","ps-pin-to-top":"Pin to top","ps-unauthorized-domain":"The account you are using is not authorized to access this domain.","ps-login-expired":"Login Session Expired","ps-image-x-of-y":"Image {x} of {y}","ps-server-down":"Looks like server is down.","ps-bk-image-link-del-success-notification":"Image Link deleted successfully","assoc-pubstudio-ignored":"Ignored","ps-image-ignore-success":"Image successfully ignored.","ps-privacy-notice":"Privacy Notice","assoc-pubstudio-tagged":"Tagged","ps-bk-select-link":"Select Link","assoc-pubstudio-help":"Help","ps-close":"Close","ps-failed-to-connect-server":"Failed to connect to server. <br>Retrying({seconds})","assoc-pubstudio-share-feedback":"Feedback","ps-bk-image-link":"Tag Image","ps-bk-product-link-del-success-notification":"Text and Image Link deleted successfully","ps-delete":"Delete","assoc-pubstudio-go":"Go","ps-bk-image-only-link":"Add Image","ps-sign-in-timeout":"Your sign in attempt took too long. Please try again.","assoc-pubstudio-image":"Image","ps-buy-it-from-amazon":"Buy it from Amazon","assoc-pubstudio-reveal-toolbar":"Reveal toolbar","ps-participation-req":"See the Participation Requirements for more information.","ps-range":"Range","ps-retry":"Retry","ps-continue":"Continue","ps-bk-product-link-success-notification":"Text and Image link created successfully","ps-bk-text-link-title":"Add a text link","ps-accessing-diff-domain":"You are currently logged in as {email}. You are accessing a new domain.","ps-bk-image-link-success-notification":"Image Link created successfully","ps-bk-image-only-link-success-notification":"Image only link created successfully","ps-textlink-update-success":"Text link updated successfully.","ps-bk-create-link-button":"Create Link","ps-bk-feedback-button-title":"Share feedback","ps-non-associate":"The e-mail address you are using is not linked to an Associates account.","ps-bk-feedback-button":"Feedback","assoc-pubstudio-ignore-image":"Ignore Image","assoc-ps-privacy-info":"Privacy Information","ps-bk-copy-to-clipboard":"Copy to Clipboard","ps-image-restore":"Restore Image","assoc-ps-newfeat-autobot-msg":"Automatically add \"Shop Now\" on images that you have already linked to Amazon.","ps-login-expired-msg":"You can click Sign In from the toolbar to continue with your operation","ps-bk-copy-overlay-desc":"Get affiliate link for the product chosen.","ps-unauthorized-store":"The account you are using is not authorized to access this store.","ps-textlink-delete-failed":"Text link deletion failed, please try again.","ps-textlink-success":"Text link added successfully. ","ps-image-tagging-settings-msg":"You may limit image tagging to a specific size range. This is useful to omit images that do not meet your criteria, such as small interface elements and large backgrounds. Use slider bars below to set your allowable sizes.","assoc-psadmin-auto-clone":"Automatically tagged image and cannot be edited manually. ","assoc-pubstudio-sign-out":"Sign Out","ps-bk-image-only-link-edit-success-notification":"Image edited successfully","ps-search-suggestion":"Search {sugg}","ps-hotspot-failed":"Image pin updation failed, please try again.","ps-failed-to-get-stringset":"Failed to retrieve string set.","ps-settings-get-fail":"Failed to retrieve settings","ps-image-ignore-failed":"Failed to ignore image","ps-image-ignore-success":"Image successfully ignored","ps-network-err": "Search failed. Please check your network connection or turn off any ad blocking plugin.", "ps-bk-link-gateway": "Amazon Home", "ps-bk-link-search": "Search Results", "ps-bk-link-category": "Category", "ps-bk-link-product": "Product", "ps-bk-link-to-category": "Link To Category", "ps-bk-category-show": "Show", "ps-bk-link-to": "Link To ", "ps-bk-link-to-direct": "Direct Link To:", "ps-category-error": "Error occurred while getting categories",
        'fetched':function(){return true;}};

    var get = function(stringId) {
        var retVal = null;
        if (stringSet){
            if (stringSet[stringId]) {
                return stringSet[stringId];
            }
            else {
                logger.log("There is no string defined for the key : " + stringId);
            }
        }
        else {
            logger.log("Stringset is not yet loaded.");
        }

        if (retVal == null) {
            retVal = "<<" + stringId + ">>";
            logger.log("Returning default string.");
        }

        return retVal;
    };

    stringSet.get = get;
    return stringSet;

}();


var viewUtils = {
    'getWindowDimensions' : function(_window) {
        var container = window; // container defaults to main window
        if(typeof(_window) != "undefined") container = _window; // incase user wants dimensions of argument window
        var res={};
        if('innerHeight' in container) {
            res.height=container.innerHeight;
            res.width=container.innerWidth;
        }
        else {
            res.height=_window.document.documentElement.clientHeight||_window.document.body.clientHeight;
            res.width=_window.document.documentElement.clientWidth||_window.document.body.clientWidth;
        }
        return res;
    },

    'getWindowScroll' : function(_window) {
        var container = window; // container defaults to main window
        if(typeof(_window) != "undefined") container = _window; // incase user wants scroll of argument window
        var res={};
        if('pageYOffset' in container) {
            res.yOffset=container.pageYOffset;
            res.xOffset=container.pageXOffset;
        }
        else {
            res.yOffset=_window.document.documentElement.scrollTop||_window.document.body.scrollTop;
            res.xOffset=_window.document.documentElement.scrollLeft||_window.document.body.scrollLeft;
        }
        return res;
    },

    //positions obj1 wrt obj2 with the offsets, does not work if any of obj1, or obj2 is hidden
    'position' : function(obj1, obj2, offset) {

        if(offset==undefined) {
            offset = {'top': 0, 'left': 0};
        }

        if(obj2.is(':visible') || obj2.hasClass('amzn-theatre-img')) {
            var positionCss = obj2.css('position').toLowerCase();
            if(positionCss=='absolute') {
                obj1.css('position', 'absolute');
            }
            else if(positionCss=='fixed') {
                obj1.css('position', 'fixed');
            }
            else {
                obj1.css('position', 'relative');
            }

            var left = obj1.css('left');
            var top = obj1.css('top');
            if(left=='auto') {
                left = 0;
            }
            if(top=='auto') {
                top = 0;
            }

            var left = parseFloat(left) + obj2.offset().left - obj1.offset().left + offset.left;
            var top = parseFloat(top) + obj2.offset().top - obj1.offset().top + offset.top;

            obj1.css({
                "left": left,
                "top": top
            });
            return obj1;
        }
        else {
            return null;
        }
    },

    'findAdPosition' : function(img, location) {
        var leftPos =  parseInt(img.css('padding-left')) + parseInt(img.css('width'));

        var topPos;
        if(location && location == 'top') {
            topPos = parseInt(img.css('padding-top')) + 4;
        }
        else {
            topPos = parseInt(img.css('padding-top')) + parseInt(img.css('height')) - 30;
        }

        return {'top':topPos, 'left':leftPos};
    },

    'checkIfInvalidParent' : function(curPar) {
        var self = this;

        var parLevelsAnchorCheck = self.parLevelsAnchorCheck;
        while(parLevelsAnchorCheck>0 && curPar.length>0) {
            var nodeName=curPar.get(0).nodeName.toUpperCase();
            if(nodeName=='A' || nodeName=='SCRIPT') {
                return true;
            }
            parLevelsAnchorCheck--;
            curPar=curPar.parent();
        }

        return false;
    },

    'replaceTextWithSpan' : function(text, textNode, startIndex) {
        var content = textNode.text();

        if(startIndex>0) {
            $(document.createTextNode(content.substring(0,startIndex))).insertBefore(textNode);
        }
        var newTag = $("<span/>").addClass("amzntextpin amznpsTempTextSpan").text(text).insertBefore(textNode);
        if(startIndex+text.length<content.length) {
            $(document.createTextNode(content.substring(startIndex+text.length))).insertBefore(textNode);
        }
        $(textNode).remove();
        return newTag;
    },

    'isComplex' : function(obj, depth, maxDepth, maxChildren) {
        var self=this;

        if(depth==maxDepth) {
            return true;
        }
        var childCount=obj.get(0).childElementCount;
        if(childCount>maxChildren) {
            return true;
        }
        var children=obj.children();
        for(var i=0;i<childCount;i++) {
            var res=self.isComplex($(children[i]), depth+1, maxDepth, maxChildren);
            if(res) {
                return true;
            }
        }
        return false;
    },

    //can be used to remove both span and anchor from text
    'removeLinkFromText' : function(link) {
        if(link.length>0) {
            var text = "";
            var prevSib = $(link.get(0).previousSibling);
            if( prevSib.length>0 && prevSib.get(0).nodeType == 3) {
                text += prevSib.text();
                prevSib.remove();
            }
            text += link.text();
            var nextSib = $(link.get(0).nextSibling);
            if( nextSib.length>0 && nextSib.get(0).nodeType == 3) {
                text += nextSib.text();
                nextSib.remove();
            }
            $(document.createTextNode(text)).insertBefore(link);
            link.remove();
        }
    },

    //used in edit flow. creates span in place of link and just hides the link which can be deleted later
    'replaceLinkWithSpan' : function(link) {
        var self=this;

        var text = link.text();
        var newTag = $("<span/>").addClass("amzntextpin amznpsTempTextSpan").text(text).insertBefore(link);
        $(link).addClass('amzn-hide-important');
        return newTag;
    },

    'truncateDomainFromUrl' : function(src) {
        var startIndex = 0;
        var truncatedSrc = $('<a>').attr('href', src).get(0).pathname;
        truncatedSrc += src.substring(src.indexOf(truncatedSrc) + truncatedSrc.length, src.length);

        //remove all the slashes in the beginning of the string
        truncatedSrc = truncatedSrc.replace(/^\/*/g, '');

        return truncatedSrc;
    },

    'truncateCssFromUrl' : function(src) {
        var host=window.location.host;
        host=host.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i),"");
        host=host.replace(new RegExp(/^www\./i),"");

        if(src) {
            src=src.replace(/"/g,"").replace(/url\(|\)$/ig, "");
        }
        var index;
        if(src && src.length>0) {
            index=src.indexOf(host);
            if(index == -1) {
                return src;
            }
            else {
                var subDomain=src.substring(0,index);
                subDomain=subDomain.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i),"");
                subDomain=subDomain.replace(new RegExp(/^www\./i),"");
                if(subDomain.length==0 && src[index+host.length]=='/') {
                    return src.substring(index + host.length);
                }
                return src;
            }
        }
        return '';
    },

    'getSrc' : function(img) {
        var src = img.attr("src");
        src = (src && src.length>0) ? src : img.css('background-image');
        return this.truncateCssFromUrl(src);
    },

    //img tag with no src - yes,
    'isValidSource' : function(obj) {
        var src = obj.attr('src');
        src = (src && src.length>0) ? src : this.truncateCssFromUrl(obj.css('background-image'));
        if(src!=undefined && src!='' && src!='none') {
            return src.lastIndexOf('.')!=-1 && src.indexOf('ps-spr-1.png')==-1
                && src.indexOf('ps-spr-2.png')==-1
                && src.indexOf('ps-spr-1-jp.png')==-1
                && src.indexOf('ps-spr-2-jp.png')==-1;
        }
        return (obj.get(0).nodeName.toLowerCase() == "img" && src == undefined);
    }
};
//use amzn-desktop-popover-asin-ASIN and amzn-mobile-popover-asin-ASIN as the id here

function Popover (linkCodes, $Str, config, console, fallbackAsinImage, sprite) {

    var mediaCentralImageScale = "_SL115_";

    // dynamically set by View module during its initialization
    // had to do this, since popover depends on View and vice versa
    // TODO: break this cyclic dependency
    var viewCloseAdUnit = function(){};

    var localeParams = {
        "amazon" : {
            "buyText" : "Buy it from Amazon",
            "shopText" : "Shop at Amazon",
            "logoPosition" : "-144px -32px"
        }
    };

    var getScaledImageUrl = function(largeImageUrl) {
        var extIndex=largeImageUrl.lastIndexOf('.')+1;
        var ext=largeImageUrl.substring(extIndex);
        return largeImageUrl.substring(0,extIndex) + mediaCentralImageScale + "." + ext;
    };

    var closeAd = function(el) {
        var adUnit = el.hasClass('amzn-popover-container') ? el : el.parents('.amzn-popover-container');
        console.log('hiding popover after it is clicked');
        viewCloseAdUnit(adUnit);
    };

    var defaultAdClickHandler = function(url) {
        return (function(e) {
            window.open(url);
            closeAd($(this));

            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    };

    var showBuyButton = function(landingPageUrl, cont) {

        $("<div/>",{
            css: {
                "backgroundImage":'url("' + sprite + '")'
            },
            click: defaultAdClickHandler(landingPageUrl)
        }).addClass("amzn-popover-item amzn-popover-shop-now-icon").appendTo(cont);
    };

    var showAmazonLogo = function(landingPageUrl, marketPlace, shopFromText, cont) {
        $("<div/>", {
            css: {
                "backgroundImage":'url("' + sprite + '")',
                "backgroundPosition": localeParams[marketPlace].logoPosition
            },
            title: shopFromText,
            click: defaultAdClickHandler(landingPageUrl)
        }).addClass('amzn-popover-item amzn-popover-logo').appendTo(cont);
    };

    var createAdContainer = function(adId, classname, url) {
        //ad container
        return $("<div/>", {
            id:adId,
            click: defaultAdClickHandler(url)
        })
            .addClass('amzn-pending-popover-hide-important')
            .addClass(classname)
            .addClass('amzn-popover-item amzn-popover-container')
            .hide();
    };

    var createAdImage = function(curResult, landingPageUrl, popover, cb, cbArgs) {
        //product image cover
        var imageCover = $("<div/>", {
            css: {
                "borderRadius": "5px"
            }
        }).addClass('amzn-popover-item amzn-popover-image-cover').appendTo(popover);

        var src = getScaledImageUrl(curResult.LargeImageUrl);
        //product image
        var image = $("<img/>", {
            css: {
                "borderRadius": "5px"
            },
            src: src,
            title: curResult.Title,
            click: defaultAdClickHandler(landingPageUrl)
        }).addClass('amzn-popover-item')
            .appendTo(imageCover);

        //we show the pop-over only once the image has finished loading
        //so load the image and add a handler on complete
        var tempImg = new Image();
        tempImg.onload = getImgOnloadHandler(popover, image, cb, cbArgs);

        tempImg.onerror = (function(image) {
            return function() {
                var tempImageUrl = fallbackAsinImage;
                curResult.ThumbImageUrl = tempImageUrl;
                curResult.LargeImageUrl = tempImageUrl;

                var scaledImageUrl = getScaledImageUrl(tempImageUrl);

                image.attr('src', scaledImageUrl);
                image.css({
                    "margin": '-1px 0px 0px -1px'
                });
                var _tempImg = new Image();
                _tempImg.onload = getImgOnloadHandler(popover, image, cb, cbArgs);
                _tempImg.src=tempImageUrl;
            }
        })(image);

        tempImg.src=src;

        return imageCover;
    };

    var getImgOnloadHandler = function(popover, image, cb, cbArgs) {
        return function() {
            var height = this.height;
            var width = this.width;
            //adjust whitespace based on image form factor
            if(width<115) {
                image.css("marginLeft", (115-width)/2);
            }
            if(height<115) {
                image.css("marginTop", (115-height)/2);
            }
            popover.removeClass('amzn-pending-popover-hide-important');
            cb(cbArgs);
        }
    };

//TODO need to move titleMaxWidth somewhere else
    var showTitle = function(originalTitle, landingPageUrl, cont, titleMaxWidth) {
        var titleText = originalTitle;
        var body = $("body");
        var titletempDiv = $("<div/>").addClass('amzn-popover-title-temp')
            .css('width', titleMaxWidth).appendTo(body).text(titleText);

        //truncation logic to make sure the title fits into the available space
        //create a temp div and keep removing text till it does not overflow
        var oldLength = titleText.length;
        var newLength;
        while (titletempDiv.outerHeight() > 30) {
            //try truncating by spaces (if available)
            titleText = titleText.replace(/\s(\S)*$/, '');

            newLength = titleText.length;
            if(newLength>=oldLength) {
                break;
            }
            else {
                titleText=titleText+'...';
                oldLength=titleText.length;
                titletempDiv.text(titleText);
            }
        }

        titletempDiv.remove();

        //title
        $("<div/>",{
            title: originalTitle,
            click: defaultAdClickHandler(landingPageUrl)
        }).addClass("amzn-popover-item amzn-popover-asin-image-title").appendTo(cont).text(titleText);
    };

    var showPrice = function(price, cont) {
        if(price && price!='') {
            $("<span/>", {
            }).addClass('amzn-popover-item amzn-popover-asin-price').appendTo(cont).text(price);
        }
    };

    var showRatings = function(ratingVal, landingPageUrl, cont) {

        //white stars
        var whiteStars = $("<span/>", {
            css: {
                "backgroundImage": 'url("' + sprite + '")',
                "cursor": 'pointer'
            },
            click: defaultAdClickHandler(landingPageUrl)
        }).addClass('amzn-popover-item amzn-popover-rating-outer').appendTo(cont);

        var val = parseFloat(ratingVal);
        val = val.toString()=="NaN"?0:val;
        var size = Math.max(0, (Math.min(5, val))) * 13;

        //colored stars
        $("<span/>", {
            css: {
                "width": size,
                "backgroundImage": 'url("' + sprite + '")'
            }
        }).addClass('amzn-popover-item amzn-popover-rating-inner').appendTo(whiteStars);
    };

    var showNumberOfReviews = function(numOfReviews, landingPageUrl, cont) {

        var reviews = parseFloat(numOfReviews);
        reviews = reviews.toString()=="NaN"?0:numOfReviews;
        $("<span/>", {
            click: defaultAdClickHandler(landingPageUrl)
        }).addClass('amzn-popover-item amzn-total-reviews').appendTo(cont).text("("+reviews+")");

    };

    var createSocialButton = function(name, shareUrl, cont) {
        var classes = "amzn-social-button amzn-popover-item amzn-pop-over-" + name;

        $("<div/>",{
            css: {
                "backgroundImage": 'url("' + sprite + '")'
            },
            click: (function(url) {
                return (function(e) {
                    window.open(url,'sharer','width=626,height=436');
                    closeAd($(this));
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            })(shareUrl)
        }).addClass(classes).appendTo(cont);
    };

    var createButtonSeparator = function(cont) {
        $("<div/>",{
            css: {
                "backgroundImage":'url("' + sprite + '")'
            }
        }).addClass("amzn-popover-item amzn-ad-button-separator").appendTo(cont);
    };

    var createPopover = function(curResult, landingPageUrls, strings, cb, cbArgs, agent) {
        try {
            var productUrl = landingPageUrls.productUrl, reviewsUrl = landingPageUrls.reviewsUrl,
                fbUrl = landingPageUrls.fbUrl, twitterUrl= landingPageUrls.twitterUrl,
                retailUrl = landingPageUrls.retailUrl;
            var shopFromText = strings.shopFromText, buyFromText = strings.buyFromText;

            var id = 'amzn-' + agent + '-popover-asin-'+curResult.ASIN, classname = 'amzn-popover-asin-'+curResult.ASIN;
            var popover = createAdContainer(id, classname, productUrl);
            if(agent==='mobile') popover.addClass('amzn-mobile-popover-container');

            //Popover image
            createAdImage(curResult, productUrl, popover, cb, cbArgs);

            //contains title, privacy, price, rating, reviews, logo, fb, twitter, shop-now
            var result = $("<div/>").addClass('amzn-popover-item amzn-popover-asin-data').appendTo(popover);

            //contains title, price, rating, reviews, logo, fb, twitter, shop-now
            var details = $("<div/>").addClass('amzn-popover-item amzn-popover-asin-details').appendTo(result);

            if(agent==='desktop') {
                showTitle(curResult.Title, productUrl, details, 200);
                //contains rating stars and rating points
                var reviews = $("<div/>").addClass('amzn-popover-item amzn-popover-reviews-cont').appendTo(details);
                showPrice(curResult.Price, reviews);
                showRatings(curResult.Rating, reviewsUrl, reviews);
                showNumberOfReviews(curResult.TotalReviews, reviewsUrl, reviews);
                var viewerActions = $("<div/>").addClass('amzn-popover-item amzn-popover-viewer-actions').appendTo(details);
                showAmazonLogo(retailUrl, curResult.Marketplace, shopFromText, viewerActions);
                createButtonSeparator(viewerActions);
                createSocialButton('fbshare', 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(fbUrl), viewerActions);
                createSocialButton('tweet',
                        'https://twitter.com/share?url='+encodeURIComponent(twitterUrl) + '&text=' + encodeURIComponent(buyFromText),
                    viewerActions);
            }
            else if(agent==='mobile') {
                showAmazonLogo(retailUrl, curResult.Marketplace, shopFromText, details);
                showTitle(curResult.Title, productUrl, details, 170);
                //contains rating stars and rating points
                var reviews = $("<div/>").addClass('amzn-popover-item amzn-popover-reviews-cont').appendTo(details);
                showRatings(curResult.Rating, reviewsUrl, reviews);
                showNumberOfReviews(curResult.TotalReviews, reviewsUrl, reviews);
                var viewerActions = $("<div/>").addClass('amzn-popover-item amzn-popover-viewer-actions').appendTo(details);
                showPrice(curResult.Price, viewerActions);
            }
            showBuyButton(productUrl, viewerActions);
        } catch (ex) {
            console.log("error in creating desktop popover - " + ex.message);
            throw ex;
        }

        return popover;
    };

    //returns a map of popovers
    var createAdUnit = function(curResult, adObj, cb, cbArgs) {
        try {

            var linkId = adObj.linkId;
            var tag = adObj.tag ? adObj.tag : $Ctx.tag;

            if(linkId == undefined || linkId == "") {
                linkId = "NA";
            }

            var linkCode = (adObj.source == 'auto')? linkCodes['imageAuto'] : linkCodes['imagePopover'];

            var popUpLandingPageParams = "tag="+ tag +"&linkCode=" + linkCode + "&linkId=" + linkId;
            var marketplace = adObj.mktplace || 'amazon';
            var mktCfg = config.marketplaceConfig[marketplace];
            var productUrl = curResult.DetailPageURL+ "?" + popUpLandingPageParams,
                fbUrl = curResult.DetailPageURL+ "?" + "tag="+tag+"&linkCode="+ linkCodes['imagePopoverFb'],
                twitterUrl = curResult.DetailPageURL+ "?" + "tag="+tag+"&linkCode="+ linkCodes['imagePopoverTwitter'],
                reviewsUrl = mktCfg.retailWebsite +
                    mktCfg.productReviewsPage + curResult.ASIN +
                    "?" + popUpLandingPageParams,
                retailUrl = mktCfg.retailWebsite
                    + "?" + popUpLandingPageParams,
                buyFromText = $Str ? $Str['ps-buy-it-from-amazon'] : localeParams[marketplace].buyText,
                shopFromText = $Str ? $Str['ps-shop-at-amazon'] : localeParams[marketplace].shopText;

            var landingPageUrls = {'productUrl':productUrl, 'reviewsUrl':reviewsUrl,
                    'fbUrl':fbUrl, 'twitterUrl':twitterUrl, 'retailUrl':retailUrl},
                strings = {'shopFromText':shopFromText, 'buyFromText':buyFromText};

            curResult.Title = $.trim(curResult.Title);

            var amznpinboard = $("#amznpinboard");
            var popoverMap = {};
            popoverMap.desktop = createPopover(curResult, landingPageUrls, strings, cb, cbArgs, 'desktop');
            popoverMap.desktop.appendTo(amznpinboard);

            //build the mobile version of the popover only for touch-agents.
            //Also adding width check in case user-agent regex does not catch it
            //TODO move 700 value in config
            var device = $Ctx.device;
            if(viewUtils.getWindowDimensions().width < 700
                || device == 'mobile'
                || device == 'tablet'
                || ('ontouchstart' in window)) {
                popoverMap.mobile = createPopover(curResult, landingPageUrls, strings, cb, cbArgs, 'mobile');
                popoverMap.mobile.appendTo(amznpinboard);
            }

            return popoverMap;
        } catch (ex) {
            console.log("Error during popover creation - " + ex.message);
        }
    };

    return {
        createAdUnit : createAdUnit,
        setViewCloseAdUnit : function(fn) {
            viewCloseAdUnit = fn;
        }
    };

}
        var popover = Popover(linkCodes, strings, config, logger, config.fallbackAsinImage, config.adServingSprite);

        var $timing = {};
        $timing.t0 = new Date().getTime();

/**
 * Automatic linking specific file
 * >> core of automatic linking in publisher studio
 * >> instance is created by bootstrap code after checking "autobot" status flag in settings object
 * >> not globally accessible, attached to bootstrap obj.
 */
;

function AutoBot($Cfg, $Utils, console) {

    // constants (private static final)
    var TLD_REGEXP = $Cfg.retailTLD;

    var REG_EX = {};
    REG_EX.product  = new RegExp("^(?:https?:)?//(?:(?:(?:www)|(?:pre-prod)|(?:development))\\.)?amazon\\.(?:" + TLD_REGEXP + ")/(?:(?:gp/(?:(?:product)|(?:offer-listing)))|(?:(?:[^/]+/)?dp(?:/[^/]+)?))/(\\w{10})", "i");
    REG_EX.asin     = new RegExp("^(https?:)?//(www\\.)?amazon\\.(" + TLD_REGEXP + ")/(exec/obidos|o)/ASIN\\d?/(\\w{10})/(ref=[\\w]+/)?([^/?]+)", "i");
    REG_EX.redirect = new RegExp("^(https?:)?//(www\\.)?amazon\\.(" + TLD_REGEXP + ")/(exec/obidos|o)/redirect/?\\?([^/?]+)", "i");
    REG_EX.isbn     = new RegExp("^(https?:)?//(www\\.)?amazon\\.(" + TLD_REGEXP + ")/(exec/obidos|o)/ISBN=(\\w{10})/(ref=[\\w]+/)?([^/?]+)", "i");

    var HOTSPOT_TEMPLATE = {
        "id":"__ID__",
        "type":"IMAGE",
        "pinLocation": {"x":"50", "y":"50", "imgSrc":"__IMG_SRC__"},
        "linkId":"__PS_AUTO__",
        "asin":"__ASIN__",
        "linkLocation":null,
        "source":"auto",
        'mktplace':'amazon'
    };

    var MIN_SIZE_TO_FILTER = 50;

    var _linkCount = 0;

    var getLinkCountPublic = function () {
        return _linkCount;
    };

    /* public */
    var processPublic = function (img, cb) {
        try {
            if(filter(img)) {
                var linkDetails = checkAmazonLink(img);
                if(linkDetails.asin) {
                    console.log("AutoBot - found a match, creating hotspot", img, linkDetails.asin, linkDetails.tag);
                    createHotSpot(img, linkDetails, cb);
                    //img.addClass('amzn-auto-link');
                    _linkCount++ ;
                }
            }
        } catch (ex) {
            console.log("AutoBot - error processing image", ex);
        }
    };

    var filter = function (img) {
        var dim = MIN_SIZE_TO_FILTER;
        return ((img.prop("tagName") == 'IMG') && img.attr('src') && img.height() >= dim && img.width() >= dim);
    };

    var checkAmazonLink = function (img) {
        var parentAnchor = img.closest('a[href*="amazon."]');
        var asin, tag=null;
        if(parentAnchor.length == 1) {
            var href = parentAnchor.attr('href');
            var hrefQuery = parentAnchor.get(0).search;   //gives the query parameters
            var tagMatch = hrefQuery.match(/tag=([^&]+)/);
            if(tagMatch) {
                tag = tagMatch[1];
                var results;
                if(results = href.match(REG_EX.product)) {
                    asin = results[1];
                } else if(results = href.match(REG_EX.asin)) {
                    asin = results[5];
                } else if(results = href.match(REG_EX.redirect)) {
                    var queryParams = results[5];
                    var am;
                    if(am = queryParams.match("path=ASIN/(\\w{10})")) {
                        asin = am[1];
                    }
                } else if(results = href.match(REG_EX.isbn)) {
                    asin = results[5];
                }
            }
        }

        if(asin) {
            // link-enhancer handshake
            parentAnchor.addClass('amzn-pp-ignore'); // this class will be checked by the link-enhancer script to ignore
            //for some reason jQuery().removeAmazonPopoverTrigger works and amznJQ.jQuery().removeAmazonPopoverTrigger does not
            if(parentAnchor.hasClass('amzn-pp-active') && window.amznJQ && window.amznJQ.jQuery) {
                var paprime = window.amznJQ.jQuery(parentAnchor.get(0));
                if(typeof paprime.removeAmazonPopoverTrigger === 'function') {
                    paprime.removeAmazonPopoverTrigger();
                }
            }
        }

        return {'asin':asin, 'tag':tag};
    };

    var createHotSpot = function (img, linkDetails, cb) {
        var asin = linkDetails.asin;
        var tag = linkDetails.tag;
        var src = viewUtils.getSrc(img);

        var hotspot = $.extend(true, {}, HOTSPOT_TEMPLATE);

        hotspot.id = $Ctx.pageId + '_' + new Date().getTime() + Math.floor((Math.random() * 1000) + 1);
        hotspot.pinLocation.imgSrc = src;
        hotspot.asin = asin;
        hotspot.tag = tag;
        hotspot.linkId = generateLinkId(src, asin);

        cb(hotspot);
    };

    var generateLinkId = function (src, asin) {
        var linkId = "NA";
        //auto-ps - 7
        //e339e16647c6 - 12
        //urlHash - 8
        //imgSrchash - 5
        try {
            var domainId = $Ctx.domainId.replace(/\./g,''); // required for GM domainIds
            var domainIdParts = domainId.split('-');

            linkId = "auto-ps"
                + domainIdParts[domainIdParts.length - 1].substr(0,12) // last component of domainId UUID
                + $Ctx.pageId.toString(16).substr(0,8) // urlHash
                + Math.abs($Utils.hash(src)).toString(16).substr(0,5); // imgSrcHash

        } catch (ex) {
            console.log("AutoBot - error in linkId generation", ex);
        }
        return linkId;
    };

    // expose public members
    return {
        process : processPublic,
        getLinkCount : getLinkCountPublic
    };
}


        var autoBot = AutoBot(config, utils, logger);

/*
 note  : shopNow renders on images which are
 1)  manually tagged
 2)  have asin-href on them and are greater than 130X130
 : for asin-href images which are less than 130X130, add a mouseenter listener to show the popover
 */

var View = function(linkCodes, popover, settings, autoBot,
                    getPrefsUrl, getPrefsSuccessCb, wsGetDetailsUrl, wsGetDetailsCb,
                    usePathNameForImages, domNodeRemovedSupport, prefsCache, console, irHost, sprite, fallbackImg) {

    var pageMonitorsEnabled = false,
        rebuildAdsTime = 1000,
        rebuildAdsTimer = null,
        repositionTime = 200,
        repositionTimer = null,
        fadeAdUnitTime = 400,
        showAdUnitTimer = null,
        imgBatchSize = 150,
        textBatchSize = 100,
        serviceTimeout = 5000,
        minImgSizeForAutoShopNow = 130,
        imgAds = {},//this is a map(keyed on asin) of map(of ads) {asin: {hotspotId: {}}}
        textAds = {}, //same as above
        asinData = {},
        isAutoBotOn = false,
        onlyAutobot = undefined,
        activeAdUnit = null,
        permanentDisable = undefined;

    if(typeof DOCUMENT === 'undefined') DOCUMENT = document;

    //todo - create a separate metrics-intrumentation module
    var logAdImpression = function(linkCode, linkId) {
        if(linkId == undefined || linkId === "") {
            linkId = "NA";
        }

        var baseUrl = irHost + "/e/ir?";
        var waImgSrc = baseUrl
            + "locale=" + $Ctx.locale
            + "&l=" + linkCode
            + "&t=" + $Ctx.tag
            + "&linkId=" + linkId
            + "&psPageId=" + $Ctx.pageId
            + "&_cb=" + (new Date().getTime()) + Math.floor(Math.random()*10000);

        var waImg = new Image();
        waImg.src = waImgSrc;
    };

    var logImgAdWaPixel = function(ad) {
        var baseUrl = irHost + "/s/wa?src=ps-shopnow";
        var waImgSrc = baseUrl
            + "&locale=" + $Ctx.locale
            + "&s=" + $Ctx.storeId
            + "&d=" + $Ctx.domainId
            + "&isauto=" + ((ad.source == 'auto')? 'y':'n')
            + "&linkId=" + ad.linkId
            + "&psPageId=" + $Ctx.pageId
            + "&_cb=" + (new Date().getTime()) + Math.floor(Math.random()*10000);

        var waImg = new Image();
        waImg.src = waImgSrc;
    };

    var pageMonitor = function() {
        clearTimeout(rebuildAdsTimer);
        rebuildAdsTimer = setTimeout(function() {
            try {
                rebuildAds(false, false);
            } catch (e) {
                console.log("Error in rebuildAds - " + e.message);
            }
        }, rebuildAdsTime);
    };

    var disablePageMonitors = function() {
        if(pageMonitorsEnabled) {
            $(window).unbind('resize', pageMonitor);
            $(window).unbind('scroll', pageMonitor);
            $(DOCUMENT).unbind('click', pageMonitor);
            pageMonitorsEnabled = false;
        }
    };

    var initPageMonitors = function(){
        if(pageMonitorsEnabled){
            return;
        }
        console.log('initializing page monitors');
        pageMonitorsEnabled = true;
        $(window).bind('resize', pageMonitor);
        $(DOCUMENT).bind('click', pageMonitor);
        $(window).bind('scroll', pageMonitor);
    };

    var scanImages = function(rescan, asinMap){
        console.log('running scan images');
        var t1 = new Date();
        var selector = '';
        if(rescan){
            console.log('running rescan');
            selector = "img:visible";
            if(!onlyAutobot) {
                // autobot supports only img tags
                selector += ", span:visible, div:visible, a:visible, li:visible, article:visible";
            }
        }
        else {
            selector = "img:not(.amzn_view_checked):visible";
            if(!onlyAutobot) {
                selector += ", span:not(.amzn_view_checked):visible, " +
                    "div:not(.amzn_view_checked):visible, a:not(.amzn_view_checked):visible, " +
                    "li:not(.amzn_view_checked):visible, article:not(.amzn_view_checked):visible";
            }
        }

        var imgList = $(selector);
        var len = imgList.length;
        if(len == 0) {
            console.log("No new images found");
            var t2 = new Date();
            console.log("scanImages - scan time: " + (t2-t1));
            return {'pendingScanBatchSize': 0};
        }

        var images = {};
        var size = len<imgBatchSize ? len : imgBatchSize;
        for(var i=0; i<size && i<len; i++) {
            var img = $(imgList[i]);
            var src = viewUtils.getSrc(img);
            if(usePathNameForImages) {
                src = viewUtils.truncateDomainFromUrl(src);
            }

            if(!viewUtils.isValidSource(img)) {
                size++;
                img.addClass('amzn_view_checked');
            }
            else {
                img.addClass('amzn_view_checked');
                if(src && src.length>0) {
                    if(images[src] == undefined) {
                        images[src] = [];
                    }
                    images[src].push(img);
                }

                if(isAutoBotOn) {
                    autoBot.process(img, storeAd);
                }
            }
        }

        if(size>len) size = len;
        var pendingScan = (len - size >  0);

        var count = 0;
        //check if you need timeout here as well
        for(var asin in imgAds) {
            var data = imgAds[asin];
            for(var adId in data) {
                var ad = data[adId];
                if(ad.pinLocation == undefined) {
                    console.log("Invalid pinLocation - " + ad);
                    continue;
                }
                var src = ad.pinLocation.imgSrc;

                //TODO check only for techradar
                if(usePathNameForImages) {
                    src = viewUtils.truncateDomainFromUrl(src);
                }

                var srcImgs = images[src];

                if(srcImgs != undefined) {
                    if(!asinData[asin]) asinMap[asin] = "1";
                    count++;

                    $.each(srcImgs, function() {
                        var img = $(this);
                        renderAd(ad, img);
                    });
                }
            }
        }

        var t2 = new Date();
        console.log("scanImages - scan time: " + (t2-t1));
        return {'pendingScan': pendingScan};
    };

    var filterFunc = function(i, el) {
        var node = $(el); var parent = node.parent(); var parName = parent.get(0).nodeName.toUpperCase();
        node.addClass('amzn_text_view_checked');
        parent.addClass('amzn_text_view_checked');

        if(this.nodeType == 3 && node.text().length>2 &&
            !parent.hasClass('amzn-popover-item') &&
            parName!= "A" && parName!='SCRIPT'){
            parent.addClass('amzn-taggable-text');
            return true;
        }
    };
    var markTextNodes = function(rescan) {
        var selector = ":not(iframe, script, noscript, button, .amzn-popover-item, .amzn-admin-item";
        selector += rescan ? ')' : ', .amzn_text_view_checked)';

        var els, len;
        if($(DOCUMENT.body).hasClass('amzn_text_view_checked')) {
            els = $(DOCUMENT.body).find(selector);
            len = els.length;
            els = els.slice(0, textBatchSize).contents().filter(filterFunc);
        }
        else {
            els = $(DOCUMENT.body).find(selector).andSelf();
            len = els.length;
            els = els.slice(0, textBatchSize).contents().filter(filterFunc);
        }
        var pendingScan = (len>textBatchSize);
        return {'nodes':els, 'pendingScan':pendingScan};
    };

    var scanText = function(rescan, asinMap) {
        console.log('running scanText');

        var t1 = new Date();
        var txtMap = markTextNodes(rescan);
        var nodes = txtMap.nodes;

        if(nodes.length == 0) {
            console.log("No new text-nodes found");
            var t2 = new Date();
            console.log("scanImages - scan time: " + (t2-t1));
            return {'pendingScan': txtMap.pendingScan};
        }

        for(var asin in textAds) {
            var data = textAds[asin];
            for(var adId in data) {
                var ad = data[adId];
                if(replaceTextWithLink(ad)) {
                    if(!asinData[asin]) asinMap[asin] = '1';
                }
            }
        }

        return {'pendingScan': txtMap.pendingScan};
    };

    var repositionImgAds = function() {
        var adLocation = settings['shopnow_pos'];

        function reposition(elems) {
            var len = elems.length;
            var size = imgBatchSize<len ? imgBatchSize : len;
            for(var i=0;i<size;i++) {
                var pixel = adPixels[i];
                var img = $(pixel.siblings('.'+pixel.attr('id')));
                var ad = pixel.children()[0];
                viewUtils.position(pixel, img);
                var pos = viewUtils.findAdPosition(img, adLocation);
                ad.css({
                    'top':pos.top,
                    'left':pos.left
                });
            }
            if(size<len) {
                elems = elems.splice(0, size);
                clearTimeout(repositionTimer);
                repositionTimer = setTimeout(reposition(elems), repositionTime);
            }
        }

        var adPixels = $('.amzn-image-pixel');
        reposition(adPixels);
    };

    //todo - pending.
    // Separate out the rebuild flow for image and text. Currently rebuild will run for both text and image even if one of them is pending

    //reposition is always passed as false, can change it in pageMonitors if it is needed
    var rebuildAds = function(reposition, rescan) {
        console.log('rebuilding ads');

        var asinMap = {};
        var res1 = scanImages(rescan, asinMap);
        var res2=null;
        if(onlyAutobot) {
            // skipping text scanning if only autobot
            res2 = {'pendingScan':false};
        } else {
            res2 = scanText(rescan, asinMap);
        }

        //fetch asin-data
        var numOfBatch = 0;
        var batchCount = 0;
        var MAX_BATCH_SIZE = 10;
        var asins = [];
        asins[0] = [];
        for(var asin in asinMap) {
            if(batchCount < MAX_BATCH_SIZE) {
                asins[numOfBatch].push(asin);
                batchCount++;
            } else {
                batchCount = 0;
                numOfBatch++;

                asins[numOfBatch] = [];
                asins[numOfBatch].push(asin);
                batchCount++;
            }
        }
        console.log("total number of asins to query: " + (batchCount + numOfBatch * MAX_BATCH_SIZE));
        var delayCounter = 1;
        for(var batchIndex = 0; batchIndex <= numOfBatch; batchIndex++) {
            setTimeout(function(currentBatch){
                return (function() {
                    loadAsinData(currentBatch);
                });
            }(asins[batchIndex]), delayCounter*200);

            delayCounter++;
        }

        if(res1.pendingScan  || res2.pendingScan) {
            clearTimeout(rebuildAdsTimer);
            rebuildAdsTimer = setTimeout(function(reposition){
                return (function() {
                    rebuildAds(reposition, false);
                });
            }(reposition), 100);
        }

        if(reposition) {
            repositionImgAds();
        }
    };

    var storeAndBuildAds = function(response) {
        console.log('entered storeAndBuildAds');

        $timing.cfPrefReturn = new Date().getTime();
        //remove all old pixels, links, dom-attrs, and events etc.
        disableView();
        isAutoBotOn = settings['autobot'] === 'on';
        var data=[];
        if(response && response.hotspots && response.hotspots.length) {
            data=response.hotspots;
            console.log("storing ads");
            for(var i = 0; i < data.length; i++) {
                storeAd(data[i]);
            }
            onlyAutobot = false;
        }
        else if(isAutoBotOn) {
            onlyAutobot = true;
        }
        else {
            console.log("No ads found - Skipping ad creation");
            return;
        }

        if(typeof UserMetrics != 'undefined') (new UserMetrics(irHost, console, autoBot, imgAds, textAds)).recordAsync();
        if(data.length>0 || isAutoBotOn) {
            if('ontouchstart' in window) {
                console.log('touch agent detected, attaching touchend listener to DOCUMENT, needed to close popover');
                $(DOCUMENT).bind('touchend scroll', touchEventsListener);
            }
            rebuildAds(false,true); //scan for new images & start asin fetch
            initPageMonitors();
        }
    };

    var fetchPrefs = function() {
        console.log('fetching prefs from - ' + getPrefsUrl);

        var failureCb = function(jqXHR, textStatus, errorThrown) {
            console.log("fetchPrefs failed with jqXHR: " + jqXHR + ", textStatus: " + textStatus + ", error: " + errorThrown);
        };
        xhr.makeXHR({'url':getPrefsUrl, 'timeout':serviceTimeout, 'cache':prefsCache, 'type':'get',
            'successCB':getPrefsSuccessCb, 'failureCB':failureCb, 'successCBArgs':[], 'failureCBArgs':[]});
    };

    var createAdUnitBoard = function() {
        var pinBoard = $("div#amznpinboard");
        if ( pinBoard.length == 0 ) {
            $("<div/>",{
                "css": {
                    "position":"absolute",
                    "top":0,
                    "left":0,
                    "overflow":"visible",
                    "zIndex":2147483647,
                    "outline": 'none' // required to override this style added by glo.msn
                },
                "id": "amznpinboard"
            }).insertBefore(DOCUMENT.body.firstChild);
        }
    };

    var getElementByXpath = function(path) {
        if(typeof XPathEvaluator == 'undefined') {
            return null;
        }
        else {
            var evaluator = new XPathEvaluator();
            var result = evaluator.evaluate(path, DOCUMENT.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return result.singleNodeValue;
        }
    };
    var findTextNode = function(parentNode, startIndex) {
        var textNode=null;
        var curLength=0;
        if(parentNode.length>0) {
            for(var i=0; i<parentNode.get(0).childNodes.length; i++) {
                var node = $(parentNode.get(0).childNodes[i]);
                var temp = node.text();
                if(node.get(0).nodeType == 3) {
                    var parTag=node.parent();
                    if(parTag.get(0).nodeName.toUpperCase()!='A' && !parTag.hasClass('amzntextpin')) {
                        if(temp.length > 0  && curLength + temp.length > startIndex && curLength <= startIndex) {
                            textNode = node;
                            break;
                        }
                        else {
                            curLength += temp.length;
                        }
                    }
                }
                else {
                    curLength += temp.length;
                }
                if(curLength > startIndex) {
                    break;
                }
            }
        }
        var ret=[];
        ret[0]=curLength;
        ret[1]=textNode;
        return ret;
    };
    var replaceTextWithLink = function(ad) {
        console.log('entered replaceTextWithLink');

        var linkLocation = ad.linkLocation;
        if(linkLocation == undefined) {
            console.log("Invalid ad - " + ad);
            return;
        }
        var xpath = linkLocation.xpath;
        var text = $.trim(unescape(linkLocation.text));
        var startIndex = parseInt(linkLocation.startIndex);
        var context = $.trim(unescape(linkLocation.context));
        var parentNode = $(getElementByXpath(unescape(xpath)));

        var curLength=null, textNode=null;

        //get the textNode containing the text and the index of the text in it
        if(parentNode.length>0 && !parentNode.hasClass('amzn-popover-item')) {
            var curPar = parentNode;

            if(!viewUtils.checkIfInvalidParent(curPar)) {
                var res = findTextNode(parentNode, startIndex);
                curLength=res[0];
                textNode=res[1];
            }
        }

        if(textNode!=null && textNode.length>0) {
            startIndex -= curLength;
            var content = textNode.text();

            if(parentNode.text().toLowerCase().indexOf(context.toLowerCase()) != -1) {
                //if the text to be tagged is present at the correct index in the textNode
                if(text.toLowerCase() == content.substring(startIndex,startIndex + text.length).toLowerCase()) {
                    renderLink(ad, startIndex, textNode, text);
                    console.log("link rendered using xpath and index");
                    return true;
                }

                //if the text to be tagged is not present at the correct index but within the same textnode
                //refer to the context
                else {
                    startIndex=parentNode.text().toLowerCase().indexOf(context.toLowerCase()) +
                        context.toLowerCase().indexOf(text.toLowerCase());
                    var res = findTextNode(parentNode, startIndex);
                    curLength=res[0];
                    textNode=res[1];
                    if(textNode!=null && textNode.length>0) {
                        startIndex -= curLength;
                        content = textNode.text();
                        if(text.toLowerCase() == content.substring(startIndex,startIndex + text.length).toLowerCase()) {
                            renderLink(ad, startIndex, textNode, text);
                            console.log("link rendered using only xpath");
                            return true;
                        }
                    }
                }
            }
        }

        searchTextInAllNodes(ad, $('.amzn-taggable-text'));
        return false;
    };

    //run this async
    var searchTextInAllNodes = function(ad, nodes) {
        var len = nodes.length;
        if(len==0) {
            return;
        }

        var linkLocation = ad.linkLocation;
        var text = $.trim(unescape(linkLocation.text));
        var context = $.trim(unescape(linkLocation.context));

        var len = len<textBatchSize ? len:textBatchSize;

        for(var i=0; i <len ; i++){
            var parentNode=$(nodes[i]).parent();
            var parText=parentNode.text();

            if(parText.toLowerCase().indexOf(context.toLowerCase()) != -1) {
                if(!viewUtils.checkIfInvalidParent(parentNode)) {
                    var startIndex=parText.toLowerCase().indexOf(context.toLowerCase()) +
                        context.toLowerCase().indexOf(text.toLowerCase());
                    var res = findTextNode(parentNode, startIndex);
                    startIndex-=res[0];
                    var textNode=res[1];
                    if(textNode!=null && textNode.length>0) {
                        var content=textNode.text();
                        if(text.toLowerCase() == content.substring(startIndex,startIndex + text.length).toLowerCase()) {
                            renderLink(ad, startIndex, textNode, text);
                            console.log("link rendered after looking at entire DOCUMENT");
                            loadAsinData([ad.asin]);
                        }
                    }
                }
            }
        }

        nodes.splice(0, len);
        setTimeout(function(ad, nodes){
            return (function() {
                searchTextInAllNodes(ad, nodes);
            });
        } (ad, nodes), 100);
    };

    var removeOrphanImgAds = function(e) {
        var removedImg = $(e.target);
        if(removedImg.hasClass('amzn-tagged-image') &&
            !removedImg.hasClass('amzn_il_btn_pixel') && !removedImg.hasClass('amzn-image-ad-pixel') &&
            !removedImg.hasClass('amzn-admin-item') && !removedImg.hasClass('amzn-popover-item')) {

            var pixelId = removedImg.attr('amznIAPixelId');
            if(pixelId!=undefined && pixelId!=null && pixelId.length>0) {
                var imagePixel = $('div#'+pixelId);
                console.log('removing pixel ' + imagePixel +' for the image '+ removedImg);
            }
        }
    };

    var renderShopNow = function(img, imagePixel) {
        var pos = viewUtils.findAdPosition(img, settings['shopnow_pos']);

        var shopNowParent=$("<div/>")
            .css({
                'margin': '0px 0px 0px -80px',
                'display':'inline-block',
                "top": pos['top'],
                "left": pos['left']
            })
            .addClass('amzn-item amzn-shop-now-parent-icon')
            .appendTo(imagePixel);

        //shopNow-icon
        $("<div/>")
            .attr('style', 'top:0px !important; left:0px !important; margin:0px !important; display:inline-block !important')
            .css({
                "backgroundImage":'url("' + sprite + '")'
            })
            .addClass('amzn-item amzn-shop-now-icon amzn-admin-item')
            .appendTo(shopNowParent);

        return shopNowParent;
    };

    var getDetailsCb = function(data) {
        console.log("Get Asin Details callback called: ", data);
        if(data) {
            if(data.results && data.results.length > 0 ) {
                for(var i=0; i< data.results.length; i++) {
                    var asin= data.results[i].ASIN;
                    asinData[asin] = data.results[i];
                    if(!asinData[asin].LargeImageUrl) {
                        asinData[asin].LargeImageUrl = fallbackImg;
                    }
                    createAdsForAsin(asin);
                }
            }
        }
    };

    //todo - 1) add retries and 2) if few asin-details do not get fetched, need to add it to next batch
    var loadAsinData = function(asins) {
        console.log('entered loadAsinData');

        if(asins == undefined || asins.length == 0) {
            console.log("Ignoring empty asin list");
            return;
        }

        var asinsString = "";
        var mktAsinsString = {};

        //needs to be a list of supported MarketPlaces, today only amazon is supported
        var marketplace = "amazon";
        for(var i = 0; i < asins.length; i++) {
            var asin = asins[i];
            if(asinData[asin]) {
                console.log("Skipping asin: " + asins + " with pending request");
                asins.splice(i,1);
            }
            else {
                asinData[asin] = "REQUEST_PENDING";
                if (!mktAsinsString[marketplace]) {
                    mktAsinsString[marketplace] = {};
                    mktAsinsString[marketplace]["asinsString"] = "";
                }
                if(mktAsinsString[marketplace]["asinsString"]=="") {
                    mktAsinsString[marketplace]["asinsString"] += asin;
                }
                else {
                    mktAsinsString[marketplace]["asinsString"] += "," + asin;
                }
            }
        }

        for(var key in mktAsinsString) {
            console.log("Key is " + key);
            if (mktAsinsString[key]["asinsString"] != "") {
                console.log("Fetching data for asins - " + mktAsinsString[key]["asinsString"]);
                var url = wsGetDetailsUrl.replace("__ASIN_STRING__",mktAsinsString[key]["asinsString"]);
                if (key != "amazon") {
                    url = url + "&m=" + key;
                }

                var failureCb = function(jqXHR, textStatus, errorThrown){
                    //need to retry here
                    console.log("Get details failed for asin: " + asinsString);
                    console.log("textStatus: " + textStatus + ", error: " + errorThrown);
                };
                xhr.makeXHR({'url':url, 'timeout':serviceTimeout, 'dataType':'json', 'cache':true, 'type':'get',
                    'successCB':wsGetDetailsCb, 'failureCB':failureCb, 'successCBArgs':[], 'failureCBArgs':[asinsString]});
            }
        }
    };

    var createAdsForAsin = function(asin) {
        var imgAdsMap = imgAds[asin], textAdsMap = textAds[asin], data = asinData[asin];
        if(imgAdsMap) {
            for(var id in imgAdsMap) {
                var adObj = imgAdsMap[id];
                asinData[asin].Marketplace = 'amazon';
                var adEls = $('.'+adObj.id);
                var shopNowPixelsList = adEls.filter('.amzn-image-ad-pixel');
                var adUnitList = $('div#amznpinboard div.amzn-popover-asin-' + adObj.asin), adUnitMap;
                if(adUnitList.length === 0) {
                    adUnitMap = popover.createAdUnit(data, adObj, toggleAdVisibility, shopNowPixelsList);
                    attachMouseEventsToAdUnit(adUnitMap);
                }
                else {
                    adUnitMap = {'desktop':adUnitList.filter(':not(.amzn-mobile-popover-container)'),
                        'mobile':adUnitList.filter('.amzn-mobile-popover-container')};
                    toggleAdVisibility(shopNowPixelsList);
                }

                var images = adEls.filter('.amzn-no-shop-now-image.amzn-tagged-image'),
                    shopNowEls = shopNowPixelsList.find('.amzn-shop-now-parent-icon');

                //attach mouse-events to all the shopNow icons
                attachMouseEventsToShopNow(shopNowEls, adUnitMap, adObj);
                attachMouseEventsToImg(images, adUnitMap, adObj);
            }
        }

        if(textAdsMap) {
            for(var id in textAdsMap) {
                var adObj = textAdsMap[id], links = $('.'+adObj.id);
                var tag = adObj.tag ? adObj.tag : $Ctx.tag;
                var landingPageUrl = data.DetailPageURL+"?tag="+ tag +
                    "&linkCode=" + linkCodes['textLink'] +
                    "&linkId=" + adObj.linkId;

                links.attr('href', landingPageUrl)
                    .attr('target', '_blank');
                attachMouseEventsToTl(links, adObj);
                links.removeClass('amznps-incomplete-link');
            }
        }
    };

    var switchAdUnitItems = function(obj) {
        return obj.addClass('amzn-switched-popover');
    };

    var restoreAdUnitItems = function(obj) {
        return obj.removeClass('amzn-switched-popover');
    };

    var truncateImageInAdUnit = function(obj) {
        return obj.addClass('amzn-mobile-popover-container-without-image');
    };

    var addImageInAdUnit = function(obj) {
        return obj.removeClass('amzn-mobile-popover-container-without-image');
    };

    var closeAdUnit = function(unit, sync) {
        clearTimeout(showAdUnitTimer);
        var closeAd = function () {
            unit.hide();
            $("div#amzn-edit-remove-cover", unit).remove();
            $('div.amzn-popover-item.amzn-popover-container.amzn-popover-cover').remove();
            restoreAdUnitItems(unit);
            addImageInAdUnit(unit);
        };
        if(sync) {
            closeAd();
        }
        else {
            showAdUnitTimer = setTimeout(function() {
                unit.stop().animate({
                    "opacity": 0
                }, function() {
                    closeAd();
                });
            }, fadeAdUnitTime);
        }
    };

    //creates ad-unit as well as edit-delete-admin-palette in case admin is enabled
    var attachMouseEventsToAdUnit = function(adUnits) {
        var attachEvent = function(unit) {
            if(unit && unit.length>0) {
                unit.mouseenter(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    clearTimeout(showAdUnitTimer);
                    unit.stop().animate({
                        "opacity": 0.95
                    });
                    return false;
                });

                unit.mouseleave(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeAdUnit(unit);
                    return false;
                });
            }
        };
        attachEvent(adUnits.desktop);
        attachEvent(adUnits.mobile);
    };

    var createPopoverLayer = function() {
        return $('<div/>').addClass('amzn-popover-item amzn-popover-container amzn-popover-cover')
            .hide().appendTo($('div#amznpinboard'));
    };

    //dup code, move to utils
    var findOptimalBoxPosition = function(el, boxWidth, boxHeight) {
        var adTop, adLeft;
        var res=viewUtils.getWindowDimensions();
        var winHt=res.height, winWt=res.width;
        var winScroll=viewUtils.getWindowScroll();
        var winScrollY=winScroll.yOffset, winScrollX=winScroll.xOffset;

        if(el.offset().left < winWt/2 + winScrollX) {
            adLeft = el.offset().left + el.width() + 1 ;
        }
        else {
            adLeft = el.offset().left - boxWidth - 1;
        }
        if(el.offset().top < winHt/2 + winScrollY) {
            adTop = el.offset().top + el.height() + 1;
        }
        else {
            adTop = el.offset().top - boxHeight - 1;
        }

        var positions={};
        positions.top=adTop;
        positions.left=adLeft;
        return positions;
    };

    //function needs re-work
    //returns popover and cover after positioning. used for both shop-now and image based popovers
    var showAdUnit = function(imageShopNow, img, adUnitMap, adObj) {
        var popoverMap = adUnitMap;
        var positionedPopover = null, type='desktop',
            res = viewUtils.getWindowDimensions(),
            winScroll = viewUtils.getWindowScroll(),
            imageShopNowLeft=0,
            shopNowWidth=76;

        if(imageShopNow && imageShopNow.length > 0) {
            imageShopNowLeft=imageShopNow.offset().left;
            shopNowWidth=imageShopNow.width();
        }

        var winWt=res.width,
            winScrollX=winScroll.xOffset;

        var mobilePopover = popoverMap.mobile,
            desktopPopover = popoverMap.desktop;
        desktopPopover.show();

        var desktopShopNow = desktopPopover.find('div.amzn-popover-shop-now-icon'),
            desktopPopoverLeft = desktopPopover.offset().left;
        //distance between popover's start and shop-now button on it
        var desktopPopoverDiffX = desktopShopNow.offset().left - desktopPopoverLeft;

        //if the popover is getting cut from the right
        //shifting shopNow or changing popover will not help
        //do nothing
        var desktopOriginalDiff;
        var desktopSwitchedDiff;
        if(!imageShopNow || imageShopNow.length <= 0) {
            // there is no shopNow, render the popover in oldStyle
            var positions = findOptimalBoxPosition(img, desktopPopover.width(), desktopPopover.height());
            var adTop= (img.offset().top - positions.top > 0)? positions.top + img.height() / 2 : positions.top - img.height() / 2;
            var adLeft= (img.offset().left - positions.left > 0)? positions.left + img.width() / 2 : positions.left - img.width() / 2;

            //calculate the position wrt to the parent
            var amznimgplate=$("div#amznpinboard");
            adLeft=adLeft-amznimgplate.offset().left;
            adTop=adTop-amznimgplate.offset().top;

            desktopPopover.css({
                "left": adLeft,
                "top": adTop
            });

            positionedPopover = desktopPopover;
        } else {
            desktopOriginalDiff = desktopPopoverDiffX - (imageShopNowLeft-winScrollX);
            desktopSwitchedDiff = desktopPopoverDiffX - (winScrollX+winWt-imageShopNowLeft-shopNowWidth);
            if(desktopOriginalDiff <= 0) {
                //return the original bigger popover
                positionedPopover = desktopPopover;
            }
            else if(desktopSwitchedDiff <= 0) {
                //bigger popover gets cut from the left, try to see if the switched bigger popover fits
                //checked that there is enough space in the right of the button to render bigger ad-unit after switching

                //execution comes here means shifting shopNow to left helps

                //return switched bigger popover
                positionedPopover = switchAdUnitItems(desktopPopover);
            }
        }

        //if popover could not be achieved from desktop version
        if(!positionedPopover && mobilePopover.length>0) {
            type='mobile';

            //hide the desktopPopover, since it cannot be displayed
            desktopPopover.hide();
            mobilePopover.show();

            var mobileShopNow = mobilePopover.find('div.amzn-popover-shop-now-icon'),
                mobilePopoverLeft = mobilePopover.offset().left;
            //distance between popover's start and shop-now button on it
            var mobilePopoverDiffX = mobileShopNow.offset().left - mobilePopoverLeft;

            //pixels of ad which get cut by left boundary
            var originalDiff = mobilePopoverDiffX - (imageShopNowLeft-winScrollX);
            //pixels of switched ad which get cut by right  boundary
            var switchedDiff = mobilePopoverDiffX - (winScrollX+winWt-imageShopNowLeft-shopNowWidth);

            //check if smaller original-popover gets cut from the left
            if(originalDiff <= 0) {
                //return the original smaller popover
                positionedPopover = mobilePopover;
            }
            else if(switchedDiff <= 0) {
                //return the switched smaller popover
                positionedPopover = switchAdUnitItems(mobilePopover);
            }
            else {
                //none of the popover fits, show the one where more area is visible
                positionedPopover = originalDiff <= switchedDiff ? mobilePopover:switchAdUnitItems(mobilePopover);
                //also truncate the image from the popover
                positionedPopover = truncateImageInAdUnit(positionedPopover);
            }
        }

        if(!positionedPopover) {
            positionedPopover = desktopOriginalDiff <= desktopSwitchedDiff ? desktopPopover:switchAdUnitItems(desktopPopover);
            type = 'desktop';
        }

        positionedPopover.css('opacity', 0);
        var popoverCover = $('<div/>');

        if(imageShopNow && imageShopNow.length > 0) {
            var popoverShopNow = positionedPopover.find('div.amzn-popover-shop-now-icon');

            var top = parseFloat(positionedPopover.css('top'));
            var left = parseFloat(positionedPopover.css('left'));
            top = top.toString()=="NaN"?0:top;
            left = left.toString()=="NaN"?0:left;
            var leftDiff = imageShopNow.offset().left-popoverShopNow.offset().left;
            var topDiff = imageShopNow.offset().top-popoverShopNow.offset().top;
            positionedPopover.css({
                'top': top+topDiff,
                'left': left+leftDiff
            });

            //needed to make popover non-clickable unless it is ready
            //needed specifically for firefox in android
            popoverCover = createPopoverLayer();
            if(type=='mobile') {
                popoverCover.addClass('amzn-mobile-popover-container');
            }
            popoverCover.css({
                'top': top+topDiff,
                'left': left+leftDiff,
                'height': positionedPopover.height()
            });
            popoverCover.show();
        }

        activeAdUnit = positionedPopover;
        if(('ontouchstart' in window) && $.browser.firefox) {
            console.log('firefox touch agent detected, not doing the animation since it flickers');
            positionedPopover.stop().css('opacity', '0.95');
            popoverCover.remove();
        }
        else {
            positionedPopover.stop().animate({
                "opacity": 0.95
            }, fadeAdUnitTime, function (cover) {
                return (function () {
                    //make the popover click-able after animation is complete
                    cover.remove();
                })
            }(popoverCover));
            if(adObj.source != 'auto') {
                if(typeof admin != 'undefined') admin.openAdminPaletteForIl(positionedPopover, img, adObj, imageShopNow);
            }
        }
    };

    var attachMouseEventsToShopNow = function(shopNowList, adUnitMap, adObj) {
        if(!adUnitMap) return;

        var mousenterEventName='';
        if('ontouchstart' in window) {
            mousenterEventName='touchend';
        }
        else{
            mousenterEventName='mouseenter';

            shopNowList.mouseleave(function(e) {
                console.log('shop-now mouseleave triggered');
                e = e || window.event; e.stopPropagation(); e.preventDefault(); return false;
            });

            shopNowList.click(function(e) {
                console.log('shop-now click triggered');
                e = e || window.event; e.stopPropagation(); e.preventDefault(); return false;
            });
        }

        shopNowList.bind(mousenterEventName,
            function(e) {
                try {
                    console.log('shop-now ' + mousenterEventName + ' triggered');
                    e = e || window.event; e.stopPropagation(); e.preventDefault();
                    logAdImpression(linkCodes.imagePopover, adObj.linkId);
                    var pixel = $(this).parent();
                    var image = $('.amzn-il-pixel-id-'+pixel.attr('id'));
                    showAdUnit($(this), image, adUnitMap, adObj);
                    return false;
                }
                catch (ex) {
                    console.log("Error in shopNow/mouseenter - " + ex.message);
                }
                return false;
            });
    };

    var imgPopoverMouseListener = function(e){
        try {
            var adUnitMap = e.data.adUnitMap, adObj = e.data.adObj;
            console.log('img mouseenter triggered');
            logAdImpression(linkCodes.imageAuto, adObj.linkId);
            showAdUnit(null, $(this), adUnitMap, adObj);
        }
        catch (ex) {
            console.log("Error in image/mouseenter - " + ex.message);
        }
        return false;
    };

    //feature not supported only in touch-devices
    //imgList can be a list of els
    var attachMouseEventsToImg = function(imgList, adUnitMap, adObj) {
        if(('ontouchstart' in window) || !adUnitMap) return;

        imgList.bind('mouseenter',{'adUnitMap':adUnitMap, 'adObj':adObj},
            imgPopoverMouseListener);
    };

    //el can be an element or a list of elements whose visibility is to be toggled
    var toggleAdVisibility = function(el) {
        if(el) el.removeClass('amzn-hide-important');
    };

    var renderAd = function(ad, img) {
        console.log('entered renderAd function');

        if($timing.firstRender === undefined) {
            $timing.firstRender = new Date().getTime();
        }

        if(ad.source == 'auto' && img.hasClass('amzn-tagged-image')) {
            // shouldn't disturb the already existing pin
            console.log('not creating shop-now since image already has one and the current one is automatic');
            return;
        }
        else if(img.hasClass('amzn-auto-link')) {
            // if manual hotspot comes in; replace the auto created one
            console.log('removing old automatic shop-now from the image to add the manual one');
            deleteAd(ad, true);
        }
        else if(img.hasClass('amzn-tagged-image')) {
            //image is already tagged and this is the second manual tag - not supported
            console.log('cannot tag an already tagged image. Reaching here implies that this image has more than 1 manual ads');
            return;
        }
        //not needed now because create-link button is replaced with clone now
        /*else {
            console.log('removing create-link button from the image');
            if(typeof admin != 'undefined') admin.removeOrphanILBtns({'target':img});
        }*/

        var linkId = ad.linkId;
        if(linkId == undefined || linkId === "") {
            linkId = 'NA';
            ad.linkId = 'NA';
        }
        var data = asinData[ad.asin];
        var asinDataAvailable = (data != undefined && data != "REQUEST_PENDING");
        var imgSrc=viewUtils.getSrc(img);
        var imgPar=img.parent();

        img.addClass(ad.id); //needed to query all images for an ad while delete
        img.attr('amzn-ps-adId', ad.id); //needed for edit-link
        img.attr('amzn-ps-asin', ad.asin);

        var noShopNow = false;
        img.addClass('amzn-tagged-image');
        if(ad.source === 'auto') {
            img.addClass('amzn-auto-link');
            noShopNow = (img.width() < minImgSizeForAutoShopNow || img.height() < minImgSizeForAutoShopNow);
        }

        if(!noShopNow) {
            var imgPixelId = img.attr('amznIAPixelId');
            var imgPixel =  $('#'+imgPixelId);
            if(!imgPixelId || !imgPixel.length) {
                imgPixelId = new Date().getTime() +'' + Math.ceil(Math.random()*10000000);
                img.attr('amznIAPixelId', imgPixelId);
                img.addClass('amzn-il-pixel-id-'+ imgPixelId);
                imgPixel = $('<div>').attr('id', imgPixelId)
                    .attr('style', 'margin:0px !important; display:inline-block')
                    .css({
                        "left": 0,
                        "top": 0
                    }).addClass('amzn-admin-item amzn-image-ad-pixel ' + ad.id)
                    .addClass('amzn-zero-opacity-important') //remove it after positioning
                    .appendTo(img.parent());
                viewUtils.position(imgPixel, img);
                imgPixel.removeClass('amzn-zero-opacity-important');
            }

            imgPixel.addClass('amzn-hide-important');   //need to remove this class after popover-image is fetched
            var shopNow = renderShopNow(img, imgPixel);

            var cb = toggleAdVisibility, cbArgs = imgPixel, _event = attachMouseEventsToShopNow, $el = shopNow;
        }
        else {
            img.addClass('amzn-no-shop-now-image');
            var _event = attachMouseEventsToImg, $el = img;
        }

        if(asinDataAvailable) {
            var adUnitList = $('div#amznpinboard div.amzn-popover-asin-' + ad.asin), adUnitMap;
            if(adUnitList.length === 0) {
                adUnitMap = popover.createAdUnit(data, ad, cb, cbArgs);
                attachMouseEventsToAdUnit(adUnitMap);
            }
            else {
                adUnitMap = {'desktop':adUnitList.filter(':not(.amzn-mobile-popover-container)'),
                    'mobile':adUnitList.filter('.amzn-mobile-popover-container')};
                toggleAdVisibility(imgPixel);
            }
            _event($el, adUnitMap, ad);
        }

        img.addClass('amzn-tagged-image amzn-pp-ignore');
        logImgAdWaPixel(ad);

        if(domNodeRemovedSupport && !imgPar.hasClass('amzn-ad-img-par')) {
            imgPar.addClass('amzn-ad-img-par');
            imgPar.bind('DOMNodeRemoved', removeOrphanImgAds);
        }
    };

    var attachMouseEventsToTl = function (links, ad) {
        if(!('ontouchstart' in window)) {
            links.mouseenter(function(e) {

                if(typeof admin != 'undefined') admin.openAdminPaletteForTl($(this), ad, {'x':e.clientX, 'y':e.clientY});

                e.stopPropagation();
                e.preventDefault();
                return false;
            });
        }
        else {
            console.log("touch agent detected, hence not adding mouse events on textlinks");
        }
    };

    var completeLink = function(link, ad) {
        var linkCode = linkCodes['textLink'];
        var asin = ad.asin;
        var data = asinData[asin];
        var linkId = ad.linkId;
        if(linkId == undefined || linkId == "") {
            linkId = 'NA';
            ad.linkId = 'NA';
        }

        link.attr('rel', 'nofollow').addClass("amzntextpin " + ad.id);

        var asinDataAvailable = (data != undefined && data != "REQUEST_PENDING");
        if(!asinDataAvailable) {
            console.log("Creating hidden link - ad: " + ad.id);
            link.addClass("amznps-incomplete-link");
        }
        else {
            var linkIdParam = "&linkId=" + linkId;
            var tag = ad.tag ? ad.tag : $Ctx.tag;
            var landingPageUrl = data.DetailPageURL+"?tag="+tag+
                "&linkCode=" + linkCode + linkIdParam;
            link.attr({'href': landingPageUrl, 'target': '_blank'});
            attachMouseEventsToTl(link, ad);
        }

        logAdImpression(linkCode, linkId);
    };

    var renderLink = function(ad, startIndex, textNode, text) {
        if($timing.firstRender === undefined) {
            $timing.firstRender = new Date().getTime();
        }

        var content = textNode.text();

        if(startIndex>0) {
            $(DOCUMENT.createTextNode(content.substring(0,startIndex))).insertBefore(textNode);
        }

        var id = ad.id;

        var textLink = $("<a/>").text(text).insertBefore(textNode);

        if(startIndex+text.length<content.length) {
            $(DOCUMENT.createTextNode(content.substring(startIndex+text.length))).insertBefore(textNode);
        }
        textNode.remove();

        completeLink(textLink, ad);
    };

    var storeAsinData = function(asinDetails) {
        asinData[asinDetails.ASIN] = asinDetails;
    };

    var storeAd = function(ad) {
        var asin = ad.asin;
        if(asin != undefined && asin != "" ) {
            ad.mktplace = 'amazon';
            var type = ad.type.toLowerCase();
            var obj = type==='text' ? textAds : imgAds;

            if(obj[asin] == undefined) {
                obj[asin] = {};
            }
            console.log('storing adType - ' + type + ' with id ' + ad.id);
            obj[asin][ad.id] = ad;
        }
    };

    var deleteAd = function(ad, edit) {
        var asin = ad.asin, id = ad.id, type = ad.type.toLowerCase();
        if(asin != undefined && asin != "" ) {
            var obj = type==='text' ? textAds : imgAds;
            delete obj[asin][id];
            console.log('deleted adType - ' + type + ' with id ' + id);
        }

        if(type === 'text') {
            var textEls = $('.'+id);
            for(var i=0;i<textEls.length;i++) viewUtils.removeLinkFromText($(textEls[i]));
        }
        else {
            var adEls = $('.'+id);
            var pixels = adEls.filter('.amzn-image-ad-pixel'),
                images = adEls.filter('.amzn-no-shop-now-image, .amzn-tagged-image');

            images.removeClass('amzn-auto-link').removeClass('amzn-tagged-image').removeClass('amzn-no-shop-now-image')
                .unbind('mouseenter', imgPopoverMouseListener).removeAttr('amzn-ps-adId').removeAttr('amzn-ps-asin');
            if(!edit){
                //pixel will be reused if it is edit flow
                pixels.remove();
                var pixelId = images.attr('amznIAPixelId');
                images.removeAttr('amznIAPixelId').removeClass(id).removeClass('amzn-il-pixel-id-'+ pixelId);
            }
            else{
                pixels.find('.amzn-shop-now-parent-icon').remove();
            }
        }
    };

    var disableView = function(permanent){
        permanentDisable=permanent;

        //unbind touch-agent events
        $(DOCUMENT).unbind('touchend scroll', touchEventsListener);
        //remove all ads, disableRebuild
        disablePageMonitors();
        $('.amzn-ad-img-par').unbind('DOMNodeRemoved', removeOrphanImgAds);
        $('.amzn_view_checked').removeClass('amzn_view_checked');   //remove mark from checked-images
        $('.amzn_text_view_checked').removeClass('amzn_text_view_checked'); //remove mark from checked-text-elements

        var deleteAllAds = function(obj){
            for(var asin in obj) {
                for(var id in obj[asin]) deleteAd(obj[asin][id]);
            }
        };
        deleteAllAds(imgAds);
        deleteAllAds(textAds);
        $('div.amzn-popover-container').remove();
    };

    var touchEventsListener = function(e) {
        console.log('DOCUMENT touched');
        var targetElement = $(e.target);
        if(targetElement.hasClass('amzn-shop-now-icon') || targetElement.hasClass('amzn-shop-now-parent-icon') ) {
            console.log('shop-now element touched, so ignoring DOCUMENT touchend');
        }
        else if(targetElement.hasClass('amzn-popover-item')) {
            console.log('popover element touched, so ignoring DOCUMENT touchend');
        }
        else {
            if(activeAdUnit && activeAdUnit.css('display') && activeAdUnit.css('display')!='none') {
                console.log('started timer to remove popover');
                closeAdUnit(activeAdUnit);
            }
        }
    };

    var getAdObj = function(asin, adId, type) {
        if(type){
            if(type=='text') return textAds[asin][adId];
            if(type=='image') return imgAds[asin][adId];
        }
        return (textAds[asin][adId] || imgAds[asin][adId]);
    };

    var init = function(){
        if(permanentDisable){
            console.log('Cannot init view since it is permanently disabled.');
            return;
        }

        createAdUnitBoard();
        fetchPrefs();
        popover.setViewCloseAdUnit(closeAdUnit);
    };

    return {
        init : init,
        storeAsinData : storeAsinData,
        storeAndBuildAds : storeAndBuildAds,
        getDetailsCb : getDetailsCb,
        storeAd : storeAd,
        deleteAd : deleteAd,
        completeLink : completeLink,
        renderAd : renderAd,
        disable : disableView,
        closeAdUnit : closeAdUnit,
        getAdObj : getAdObj
    };
};
        var view ; //will be initialized by bootstrap

//will be shared by extension pre-publish and post-publish

var linkingUtils = {

    'editDeleteBoxWidth' : 90,
    'editDeleteBoxHeight' : 32,
    'createLinkBoxWidth' : 90,
    'createLinkBoxHeight' : 32,
    'parLevelsAnchorCheck' : 5,
    'textSelectionTimer' : null,

    'closeAdminTools' : function() {
        $("div#amznps_create_link_wrapper").remove();
        $("div#amzn_ps_bm_actions_container").remove();
        $("div#amznps_adminimgtools").remove();
    },

    'selectionWatcher' : function(getSel, sel, cb, cbArgs) {
        clearTimeout(this.textSelectionTimer);
        if(sel && sel.toString().length>1) {
            this.textSelectionTimer = setTimeout(function() {
                var curSelection = getSel();
                try {
                    if(sel == curSelection.toString()) {
                        cb(cbArgs);
                    }
                }
                catch(e) {
                    logger.log('error in selectionWatcher - '+ e.message);
                }
            }, 300);
        }
    },

    //tread carefully coz its a minefield.

    //logic inside the function
    //if anchor/focus is not a text-node => div or some other html element
        //if anchor/focus contains the correct text-node
        //if anchor/focus are neighbouring html elements [sibling]

    //if anchor/focus is a text-node
        //if anchor/focus is a direct sibling
        //if anchor/focus is not a direct sibling => anchor/focus's parent is a direct sibling

    //Would become easy if we allow linking whatever is highlighted irrespective of validations by getting the
    // Range object, extracting all contents from it and appending them inside an anchor
    'findValidTextNode' : function(curSelection, showNoError) {
        function showError(errorMsg) {
            if(showNoError) logger.log(errorMsg);
            else {
                curSelection.removeAllRanges();
                logger.log(errorMsg);
                notifications.showWarningNotification(errorMsg);
            }
            return null;
        }

        if(!curSelection  ||  (!curSelection.anchorNode ) || (!curSelection.focusNode) ) {
            return showError('selection object not even initialized');
        }

        var startIndex, parentNode, textNode, context;
        var anchorNode = curSelection.anchorNode, focusNode = curSelection.focusNode,
            text=curSelection.toString(), anchorOffset=curSelection.anchorOffset, focusOffset=curSelection.focusOffset;
        var $anchorNode=$(anchorNode), $focusNode=$(focusNode);

        //prevent linking if the node belongs to the pop-over
        if($anchorNode.parent().hasClass('amzn-popover-item') ||
            $focusNode.parent().hasClass('amzn-popover-item')) {
            return showError(strings.get(constants.popOverTextSelectionError));
        }

        //private functions used here */
        function buildTextMap($node, _localStart, _globalStart){
            var nodeTxt=$node.text();
            var parTxt=$($node.parent()).text();
            if(!_localStart)_localStart=nodeTxt.indexOf(text);
            if(!_globalStart)_globalStart=parTxt.indexOf(nodeTxt) + _localStart;
            return {'text':text, 'textNode':$node, 'localStart':_localStart,
                'startIndex':_globalStart, 'context':parTxt.substring(_globalStart-15, _globalStart+text.length+15)};
        }
        function getNextTextNode(el){
            if(!el)return null;
            if(el.nodeType==3)return el;
            var children = el.childNodes;
            for(var i=0;i<children.length;i++){
                var res = getNextTextNode(children[i]);
                if(res)return res;
            }
            return getNextTextNode(el.nextSibling);
        }
        function getPreviousTextNode(el){
            if(!el)return null;
            if(el.nodeType==3)return el;
            var children = el.childNodes;
            for(var i=children.length-1;i>=0;i--){
                var res = getNextTextNode(children[i]);
                if(res)return res;
            }
            return getPreviousTextNode(el.previousSibling);
        }
        function validateAndCreateMap(node){
            node = $(node);
            if(node && node.text().toLowerCase().indexOf(text.toLowerCase())!=-1) return buildTextMap(node);
            else return null;
        }

        if(anchorNode==focusNode) {   //anchorNode and offsetNode are the same
            if(anchorOffset > focusOffset) {  //swap the offsets (right to left selection)
                anchorNode=focusNode;focusNode=curSelection.anchorNode;
                $anchorNode=$(anchorNode);$focusNode=$(focusNode);
                anchorOffset=focusOffset;focusOffset=curSelection.anchorOffset-1;
            }
        }

        // if anchor is correct
        if($anchorNode.text().substring(anchorOffset,anchorOffset + text.length).toLowerCase() == text.toLowerCase()
            && anchorNode.nodeType==3) {
            return buildTextMap($anchorNode, anchorOffset);
        }
        // if focus is correct and anchor is wrong
        else if($focusNode.text().substring(focusOffset-text.length,focusOffset).toLowerCase() == text.toLowerCase()
            && focusNode.nodeType==3) {
            return buildTextMap($focusNode, focusOffset-text.length);
        }
        // if both anchor and focus are wrong
        else {
            var res = validateAndCreateMap(getNextTextNode(anchorNode.nextSibling));
            if(!res) res = validateAndCreateMap(getPreviousTextNode(focusNode.previousSibling));
            if(!res && anchorNode.nodeType!=3) res = validateAndCreateMap(getNextTextNode(anchorNode.childNodes[0]));
            if(!res && anchorNode.nodeType==3) res = validateAndCreateMap(getNextTextNode(anchorNode.parentNode.nextSibling));
            if(!res && focusNode.nodeType!=3){
                var childNodes = focusNode.childNodes;
                res = validateAndCreateMap(getPreviousTextNode(childNodes[childNodes.length-1]));
            }
            if(!res && focusNode.nodeType==3) res = validateAndCreateMap(getPreviousTextNode(focusNode.parentNode.previousSibling));

            if(res)return res;
            return showError(strings.get(constants.multipleTextNodesError));
        }
    },

    'getBoxPosition' : function(map) {
        var win = map.win;
        if(!win) win = window;
        var res=viewUtils.getWindowDimensions(win);
        var winHt=res.height, winWt = res.width;
        var winScroll=viewUtils.getWindowScroll(win);
        var winScrollY=winScroll.yOffset, winScrollX=winScroll.xOffset;

        var offset={'top':0, 'left':0};
        var ifr = map.ifr;
        if(ifr && ifr.length>0) {
            offset=ifr.offset();
            offset.left-= 2*winScrollX;
            offset.top-= 2*winScrollY;
        }
        var left =map.left  + (map.width - map.boxWidth)/2;
        left = Math.max(left,0);
        left = Math.min(left,winWt + winScrollX -map.boxWidth/2);
        var top = map.top + map.height + 2;
        if (top - winScrollY >  winHt - map.boxHeight)
            top = map.top -2 - map.boxHeight ;
        left += offset.left + winScrollX;
        top += offset.top + winScrollY;
        return {left:left,top:top};
    },

    'removeCreateLinkBox': function() {
        $("div#amznps_create_link_wrapper").remove();
    },

    'removeEditDeleteBox' : function() {
        $("div#amzn_ps_bm_actions_container").remove();
    },

    'openCreateLinkBox' : function(map, tag, postPublishData) {
        if(!bootstrap.isLinkingEnabled()) return;

        var self = this;
        self.closeAdminTools();

        map.boxHeight = linkingUtils.createLinkBoxHeight;
        map.boxWidth = linkingUtils.createLinkBoxWidth;

        var posObj = self.getBoxPosition(map);
        logger.log('opening create link button');

        var $wrapper = $("<div/>", {
            id: "amznps_create_link_wrapper",
            css: {
                "left":posObj.left,
                "top":posObj.top
            },
            click: function(e) {
                var searchBoxNode = {'left':posObj.left,'top':posObj.top,'cookie':false,'linkType':map.linkType};
                searchbox.buildSearchBox({'node':searchBoxNode,'searchTerm':map.searchTerm, 'editData':postPublishData});
                self.removeCreateLinkBox();

                e.preventDefault();
                e.stopPropagation();
                return false;
            },
            mouseup: function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }).appendTo($('body'));

        var $logo = $("<span/>",{
            css:{
                "background": 'url("' + config.sprite1 + '")' + ' 450px -225px repeat-x transparent'
            }
        }).addClass("amznps_ed_link_logo").appendTo($wrapper);

        var $link = $("<a/>",{
            href:"#",
            text: strings.get('ps-bk-create-link-button')
        }).addClass("amznps_create_link_btn").appendTo($wrapper);

        var $close = $("<div/>",{
            css: {
                "background": 'url("' + config.sprite1 + '")' + ' -278px -145px repeat-x transparent'
            },
            title: strings.get('ps-close'),
            click: function(e) {
                self.removeCreateLinkBox();
            }
        }).addClass("amznps_create_link_close").appendTo($wrapper);
    },

    'createImgLinkBtn' : function(pixelEl) {
        var $wrapper = $("<div/>", {
            mouseup: function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }).addClass('amznps_create_image_link_wrapper').appendTo(pixelEl);

        var $logo = $("<span/>",{
            css:{
                "background": 'url("' + config.sprite1 + '")' + ' 450px -225px repeat-x transparent'
            }
        }).addClass('amznps_ed_link_logo').appendTo($wrapper);

        var $link = $("<a/>",{
            href:"#",
            text: strings.get('ps-bk-create-link-button')
        }).addClass("amznps_create_link_btn").appendTo($wrapper);

        var $close = $("<div/>",{
            css: {
                "background": 'url("' + config.sprite2 + '")' + ' -278px -145px repeat-x transparent'
            },
            title: strings.get('ps-close'),
            click: function(e) {
                self.removeCreateLinkBox();
            }
        }).addClass("amznps_create_link_close").appendTo($wrapper);

        return $wrapper;
    },

    'openEditDeleteBox' : function(map, tag, deleteCb, deleteCbArgs, postPublishData) {
        if(!bootstrap.isLinkingEnabled()) return;

        var self = this;

        self.closeAdminTools(); // removing all the search option instead of above

        map.boxWidth = self.editDeleteBoxWidth;
        map.boxHeight = self.editDeleteBoxHeight;
        map.width = 20; map.height = 10;
        var positionCss = self.getBoxPosition(map);

        var actionsCont = $('<div/>', {
            id: "amzn_ps_bm_actions_container",
            css: {
                "left":positionCss.left,
                "top":positionCss.top
            },
            click: function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            },
            mouseup: function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }).appendTo($('body'));

        var $logo = $("<span/>",{
            css:{
                "background": 'url("' + config.sprite1 + '")' + ' 450px -225px repeat-x transparent'
            }
        }).addClass('amznps_ed_link_logo').appendTo(actionsCont);

        var $close = $("<div/>",{
            id: "amznps_ed_link_close",
            css: {
                "background": 'url("' + config.sprite1 + '")' + ' -278px -145px  repeat-x transparent'
            },
            title: strings.get('ps-close'),
            click: function(e) {
                self.removeEditDeleteBox();
            }
        }).appendTo(actionsCont);

        $('<div/>', {
            text: strings.get('ps-bk-edit-link-button'),
            click: (function(left, top) {
                return (function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var searchBoxPosition = {'left':left,'top':top,'cookie':false,linkType:map.type};
                    var editData = postPublishData ? postPublishData : {'type':map.type, 'link':map.link};
                    var searchObj = {node:searchBoxPosition,searchTerm:map.searchTerm,
                        editData:editData};
                    searchbox.buildSearchBox(searchObj);

                    self.removeEditDeleteBox();
                    return false;
                });
            })(positionCss.left, positionCss.top)
        }).addClass('amzn_ps_bm_action_pallette_buttons')
            .appendTo(actionsCont);

        $('<div/>', {
            text: strings.get('ps-bk-delete-link-button'),
            click: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(deleteCbArgs) {
                    deleteCb(deleteCbArgs);
                }
                else {
                    deleteCb(map.link, map.type,false,map.body);
                }
                self.removeEditDeleteBox();
                return false;
            }
        }).addClass('amzn_ps_bm_action_pallette_buttons')
            .appendTo(actionsCont);

        return actionsCont;
    },

    'checkIfAnchorParent' : function(curPar) {
        var self = this;

        var parLevelsAnchorCheck = self.parLevelsAnchorCheck;
        while(parLevelsAnchorCheck>0 && curPar.length>0) {
            var nodeName=curPar.get(0).nodeName.toUpperCase();
            if(nodeName=='A' || nodeName=='SCRIPT') {
                return true;
            }
            parLevelsAnchorCheck--;
            curPar=curPar.parent();
        }

        return false;
    },

    //gives the position of the textnode selected
    'getTextPosition' : function(text, $textNode, startIndex,win) {
        var self=this;

        var content = $textNode.text();
        var $preNode = null;
        var $postNode = null;
        if(startIndex>0) {
            $preNode = $(DOCUMENT.createTextNode(content.substring(0,startIndex))).insertBefore($textNode);
        }
        var $_tagNode = $("<span/>", { // a temp span to get position of textnode
            css: {
                "float": "none"
            }
        }).text(text).insertBefore($textNode);
        if(startIndex+text.length<content.length) {
            $postNode = $(DOCUMENT.createTextNode(content.substring(startIndex+text.length))).insertBefore($textNode);
        }
        var nodeText = $textNode.text;
        $textNode.remove();
        var position = {'left':$_tagNode.offset().left ,'top':$_tagNode.offset().top,'width':$_tagNode.width(),'height':$_tagNode.height()};
        $textNode.insertBefore($_tagNode);
        $_tagNode.remove();
        if ($preNode != null) $preNode.remove();
        if ($postNode != null) $postNode.remove();
        position['textNode'] = $textNode;
        var range = win.document.createRange();
        range.selectNodeContents($textNode.get(0));
        range.setStart($textNode.get(0),startIndex);
        range.setEnd($textNode.get(0),startIndex+text.length);
        var sel = win.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return position;
    },

    getWindowSelection : function(iframe) {
        var win = null;
        var doc = null;
        var text = "";

        try {
            win = iframe.contentWindow;
            doc = iframe.contentDocument || win.document;
        }
        catch(e) {
            return text;
        }

        if (win.getSelection) {
            if(win.getSelection())
                text = win.getSelection().toString();
        } else if (doc.selection && doc.selection.type != "Control") {
            text = doc.selection.createRange().text;
        }
        return text;
    },

    'keyDown' : function(ele){

        var keyboardEvent = DOCUMENT.createEvent("KeyboardEvent");

        var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        keyboardEvent[initMethod](
            "keydown", // event type : keydown, keyup, keypress
            true, // bubbles
            true, // cancelable
            null, // viewArg: should be window
            false, // ctrlKeyArg
            false, // altKeyArg
            false, // shiftKeyArg
            false, // metaKeyArg
            40, // keyCodeArg : unsigned long the virtual key code, else 0
            0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
        );
        ele.dispatchEvent(keyboardEvent);

    }
};


var settings = function() {

    var getUrl, updateUrl, resetUrl, blackListUrl, whiteListUrl,
        serviceTimeout = 5000,
        retryCount = 0, maxRetryCount = 2,
        updateFailedMsg = {'id':'settingsUpdateFailed', 'msg':strings.get(constants.addSettingsFailureMessage)},
        getFailedMsg = {'id':'settingsGetFailed', 'msg':strings.get(constants.getSettingsFailureMessage)},
        ignoreImageFailedMsg = {'id':'ignoreImageFailed', 'msg':strings.get(constants.blackListImageFailureMessage)},
        restoreImageFailedMsg = {'id':'restoreImageFailed', 'msg':strings.get(constants.whiteListImageFailureMessage)};

    var fetched = false;
    var pubSettings = {};
    var blImgUrls = {};

    var get = function() {
        $.ajax(getUrl, {
            dataType:"json",
            timeout: (serviceTimeout + retryCount * 500),
            success: function(data) {
                notifications.remove(getFailedMsg.id);
                retryCount = 0;
                logger.log("Settings: ", data);
                pubSettings=data;
                var blackListedImages = data.blacklist;
                if(blackListedImages!=undefined) {
                    for(var i=0;i<blackListedImages.length;i++) {
                        blImgUrls[blackListedImages[i]]=true;
                    }
                }
                fetched = true;
                if(typeof admin!='undefined') admin.initAdminMode();
                if(typeof bootstrap != 'undefined'&& typeof bootstrap.initView != 'undefined') bootstrap.initView();
                notifications.showNewFeatureNotification();
            },
            error : function(){
                logger.log('get settings failed');
                retryCount++;
                if(retryCount > maxRetryCount) {
                    logger.log("Too many errors while fetching settings - giving up");
                }
                else {
                    logger.log("Failed to fetch settings - Retrying : " + retryCount);
                    if(retryCount > 2) {
                        notifications.showErrorNotification(getFailedMsg.id, getFailedMsg.msg);
                    }
                    setTimeout(function() {
                        get();
                    }, 1000);
                }
            }
        });
    };

    var update = function(obj) {
        var newSettings = pubSettings;
        for(var key in obj) {
            newSettings[key] = obj[key];
        }
        var url = updateUrl.replace("__json__", encodeURIComponent(JSON.stringify(newSettings)));

        $.ajax(url, {
            'dataType': 'json',
            'timeout': (serviceTimeout + retryCount * 500),
            success: function(data) {
                if(data.error=='401') {
                    bootstrap.postLogout();
                    return;
                }

                notifications.remove(updateFailedMsg.id);
                logger.log("update value response: "+data);
                pubSettings=data;
                notifications.showSuccessNotification(strings.get(constants.addSettingsSuccessMessage));
            },
            error: function() {
                logger.log('error while saving settings');
                notifications.showErrorNotification(updateFailedMsg.id, updateFailedMsg.msg);
            }
        });
    };

    var blackListImage = function(imgUrl) {
        var url = blackListUrl.replace('__url__', imgUrl);

        $.ajax(url, {
            'dataType': 'json',
            'timeout': (serviceTimeout + retryCount * 500),
            success: function(data) {
                if(data.error=='401') {
                    bootstrap.postLogout();
                    return;
                }

                notifications.remove(ignoreImageFailedMsg.id);
                logger.log("update value response: "+data);
                blImgUrls[imgUrl] = true;
                pubSettings.blacklist = blImgUrls;
                notifications.showSuccessNotification(strings.get(constants.blackListImageSuccessMessage));
            },
            error: function() {
                logger.log('error while saving settings');
                notifications.showErrorNotification(updateFailedMsg.id, updateFailedMsg.msg);
            }
        });
    };

    var whiteListImage = function(imgUrl) {
        var url = whiteListUrl.replace('__url__', imgUrl);

        $.ajax(url, {
            'dataType': 'json',
            'timeout': (serviceTimeout + retryCount * 500),
            success: function(data) {
                if(data.error=='401') {
                    bootstrap.postLogout();
                    return;
                }

                notifications.remove(restoreImageFailedMsg.id);
                logger.log("update value response: "+data);
                blImgUrls[imgUrl] = undefined;
                pubSettings.blacklist = blImgUrls;
                notifications.showSuccessNotification(strings.get(constants.whiteListImageSuccessMessage));
            },
            error: function() {
                logger.log('error while saving settings');
                notifications.showErrorNotification(updateFailedMsg.id, updateFailedMsg.msg);
            }
        });
    };

    var reloadUrls = function(){
        var storeId = $Ctx.storeId, domainId = $Ctx.domainId;
        getUrl = constants.getSettingsUrl.replace('__store__id__', storeId).replace('__domain__id__', domainId);
        if(typeof bootstrap != 'undefined') {
            var reqId = bootstrap.reqId();
            updateUrl = constants.updateSettingsUrl.replace('__req__id__', reqId).replace('__store__id__', storeId).replace('__domain__id__', domainId);
            whiteListUrl = constants.whiteListImgUrl.replace('__req__id__', reqId).replace('__store__id__', storeId).replace('__domain__id__', domainId);
            blackListUrl = constants.blackListImgUrl.replace('__req__id__', reqId).replace('__store__id__', storeId).replace('__domain__id__', domainId);
        }
    };

    var init = function(){
        get();
    };

    return {
        'init':init,
        'fetched': function(val){if(val){fetched=val;} return fetched;},
        'pubSettings': function(val){if(val){pubSettings=val;} return pubSettings;},
        'blImgUrls': function(val){if(val){blImgUrls=val;} return blImgUrls;},
        'update': update,
        'blackListImage': blackListImage,
        'whiteListImage': whiteListImage,
        'reloadUrls': reloadUrls
    }
}();

//search-widget code
function amzn_ps_bm_search () {
    this.searchCache = {};
    this.searchCompletionCache = {};
    this.latestSearchInstanceId = "";
    this.latestSearchCompletionTerm;
    this.searchCategoryMap = {};
    this.searchTimeout = 10000;
    this.numberOfSearchResult = 10;
    this.marketplaceCount = 0;
    this.editHotSpot = {};
    this.pageCount = 1;
    this.latestSearchAlias = "amazon:amazon:aps";
}

amzn_ps_bm_search.prototype.attachEventsToCloseSearchBox = function($container) {
    var self = this;
    

    $container.unbind('click', self.closeSearchBox);
    $container.bind('click', function(){
        if(!$('amznps_adminimgtools').hasClass('amzn-drag-in-progress')) self.closeSearchBox();
    });
};

amzn_ps_bm_search.prototype.closeSearchBox = function() {

    logger.log('removing highlighted text and search-box');
    linkingUtils.closeAdminTools();
};

//el is the map of textNode-el, and localStart in case of text-link and image-el in case of image-link
//here type is the type of selection - 'text', 'image', or 'none'
amzn_ps_bm_search.prototype.updateEditHotspot = function(type, el, pageNum, text, mode) {
    var self = this;

    self.editHotSpot.type = type;
    self.editHotSpot.el = el; // in case of html mode, this stores selection coords
    self.editHotSpot.start = pageNum;
    self.editHotSpot.searchTerm = text;
    self.editHotSpot.text = text;
    self.editHotSpot.mode = mode;
};

var amznPsSuggestionKeyupBehaviour = function(o) {
    
    var searchInp = $("input#amznps-twotabsearchtextbox");
    var selectedSuggestion =  $("div.amznps_search_suggestion_hover");
    var exec = { // enter key
        13 : function(){
            if(selectedSuggestion.length == 0) {
                o.self.editHotSpot.start = 0;
                o.self.search(o.currentValue, o.editData,o.defaultLinkType);
            } else {
                o.self.editHotSpot.start = 0;
                selectedSuggestion.click();
            }
        },
        27 : function() { // esc key
            o.suggestionCont.css("display","none");
            o.self.editHotSpot.start = 0;
            o.self.search(o.currentValue, o.editData,o.defaultLinkType);
        },
        40 : function() { // down key
            var _cur = null;
            if(selectedSuggestion.length == 0) _cur = $("#amznPubstudioSearchSuggestion_0");
            else _cur = selectedSuggestion.next();
            if(_cur.length > 0) {
                _cur.addClass("amznps_search_suggestion_hover");
                selectedSuggestion.removeClass("amznps_search_suggestion_hover");
                var selectedText = o.self.getTextFromSuggDiv(_cur);
                searchInp.val(selectedText);
            }
        },
        38 : function(){ // up key
            if(selectedSuggestion.length > 0) {
                var prev = selectedSuggestion.prev();
                if(prev.length > 0) {
                    selectedSuggestion.removeClass("amznps_search_suggestion_hover");
                    prev.addClass("amznps_search_suggestion_hover");
                    var selectedText =  o.self.getTextFromSuggDiv(prev);
                    searchInp.val(selectedText);
                }
            }
        },
        39 : function() { // right key
            if(selectedSuggestion.length == 0) {
                var obj = $("#amznPubstudioSearchSuggestion_0");
                var regex = new RegExp("^"+o.currentValue,"i");
                var firstSugg = o.self.getTextFromSuggDiv(obj);
                if(firstSugg.match(regex)) { //If current value is prefix of first suggestion then only do this
                    searchInp.val(firstSugg);
                }
            }
        }
    };
    var navigate = function() {
        if( typeof exec[o.keyCode] !== 'undefined' ) exec[o.keyCode]();
        else defaultAction();
    };
    var defaultAction = function() {
        if( typeof exec[o.keyCode] === 'function' ) return;
        if($.trim(o.currentValue) == "") {
            clearTimeout(o.self.amznPubstudioSearchSuggTimeout);
            o.self.amznPubstudioPreviousText = "";
            o.suggestionCont.css("display","none");
            o.self.latestSearchCompletionTerm = "";
        } else if (o.self.amznPubstudioPreviousText != o.currentValue) {
            if(selectedSuggestion.length > 0) {
                selectedSuggestion.removeClass("amznps_search_suggestion_hover");
            }
            o.self.amznPubstudioPreviousText = o.currentValue;
            if ( o.self.amznPubstudioSearchSuggTimeout ) {
                clearTimeout(o.self.amznPubstudioSearchSuggTimeout);
            }
            o.self.amznPubstudioSearchSuggTimeout = setTimeout(function(self,currentValue, editData,defaultLinkType) {
                return (function() {
                    self.fetchSuggestions(currentValue, editData,defaultLinkType);
                });
            }(o.self,o.currentValue, o.editData,o.defaultLinkType), 250);
        }
    };
    var call = { 'navigate' : navigate, 'defaultAction' : defaultAction};
    if(o.execute) call[o.execute]();
};

var amznPsResultKeyUpBehaviour = function(o) {
    
    var selectedProduct =  $("div.amzn_hovered");
    var exec = { // enter key
        13 : function(){
            if(selectedProduct.length == 0) {
                o.self.editHotSpot.start = 0;
                o.self.search(o.currentValue,o.editData,o.defaultLinkType);
            } else { //enter pressed after selecting the product
                selectedProduct.click();
            }
        },
        27 : function() { // esc key
            o.self.closeSearchBox();
        },
        40 : function() { // down key
            var _cur = $("div.amznps-search-result").removeClass("amzn_hovered").first();
            if( selectedProduct.length > 0) {
                var _next = selectedProduct.next() ;
                _cur = _next.hasClass('amznps-search-result') > 0 ? _next : _cur;
            }
            _cur.addClass("amzn_hovered");
            o.self.scrollToView(_cur);
        },
        38 : function(){ // up key
            var _cur = $("div.amznps-search-result").removeClass("amzn_hovered").last();
            if(selectedProduct.length > 0) {
                var _prev = selectedProduct.prev();
                _cur =  _prev.hasClass('amznps-search-result') ? _prev : _cur;
            }
            _cur.addClass("amzn_hovered");
            o.self.scrollToView(_cur);
        },
        27: function() { // esc key
            $("#amznps_adminimgtools").remove();
        }
    };
    var navigate = function() {
        if( typeof exec[o.keyCode] !== 'undefined' ) exec[o.keyCode]();
    };
    var search = function() {
        o.self.search(o.currentValue,o.editData,o.defaultLinkType);
    };
    var call = { 'navigate' : navigate, 'search' : search};
    if(o.execute) call[o.execute]();
};

amzn_ps_bm_search.prototype.createInputBox = function(searchInSuggCont, defaultText, editData,defaultLinkType) {
    var self = this;
    

    var input = $("<input/>",{
        id: "amznps-twotabsearchtextbox",
        type: "text",
        autocomplete: "off",
        name: "amznps-field-keywords",
        value: "",
        title: strings.get(constants.defaultSearchPlaceholder),
        keydown: function(e){
            self.toggleLabel($(this));
        },
        paste: function(e){
            self.toggleLabel($(this));
            e.stopPropagation();
            e.preventDefault();
            return false;
        },
        change: function(e){
            self.toggleLabel($(this));
        },
        focusin:  function(e) {
            try {
                $(this).prev('span').css('color', '#ccc');
                $("#amznps-nav-search-in").removeClass("focus");
                $("#amznps-nav-search-in").addClass("active");
                self.isFocusOnInput = true;
            } catch (e) {
                logger.log("Error in search - " + e.message);
            }
        },
        focusout: function(e) {
            try {
                $(this).prev('span').css('color', '#999');
                $("#amznps-nav-search-in").removeClass("active");
                self.isFocusOnInput = false;
            } catch (e) {
                logger.log("Error in search - " + e.message);
            }
        },
        keyup : (function(editData,defaultLinkType) {
            return (function(e) {
                try {
                    var currentValue = $(this).val().toLowerCase();
                    if(currentValue.length > 100) {
                        self.showSearchResultMessage(self.longSearchString);
                        return;
                    }
                    self.toggleLabel($(this));

                    var code = e.keyCode ? e.keyCode : e.which;
                    var suggestionCont = $("div#amznps-srch_sggst");
                    var _command = {
                        self : self,
                        keyCode: code,
                        suggestionCont : suggestionCont,
                        currentValue : currentValue,
                        defaultText : defaultText,
                        editData : editData,
                        defaultLinkType : defaultLinkType,
                        execute : suggestionCont.css("display") !== "none" ? 'navigate' : 'defaultAction'
                    };
                    amznPsSuggestionKeyupBehaviour(_command);
                    _command.execute = suggestionCont.css("display") === "none" ? 'navigate' : null;
                    amznPsResultKeyUpBehaviour(_command);
                } catch (e) {
                    logger.log("Error in keyboard-input processing - " + e.message);
                }
            });
        })(editData,defaultLinkType)
    }).val(defaultText).appendTo(searchInSuggCont);

    return input;
};
amzn_ps_bm_search.prototype.buildSearchBox = function(searchObj) {
    if(!bootstrap.isLinkingEnabled()) {
        return;
    }

    var self = this;
    
    self.pageCount = 1;
    var node = searchObj.node;
    var editData = searchObj.editData;
    var callback = searchObj.callback;
    $("div#amznps_adminimgtools").remove();

    var defaultText = searchObj.searchTerm;
    var res=viewUtils.getWindowDimensions();
    var winHt=res.height, winWt=res.width;
    var winScroll=viewUtils.getWindowScroll();
    var winScrollY=winScroll.yOffset, winScrollX=winScroll.xOffset;
    node = node || {'left':30,'top':30,'cookie':false,linkType:'select'};
    var defaultLinkType = node.linkType;
    var left = isNaN(node.left) ?30: node.left ;
    var top = isNaN(node.top) ? 30 :node.top-10;
    /*
    if(typeof(editData) == 'undefined' || !editData.isPostPublish) {
        left -= winScrollX;
        top -= winScrollY;
    }*/
    top=Math.max(30,top-50);
    var toolContainerWidth = 356; // adding here instead of css to find left & top positions of toolContainer
    var toolContainerHeight = 510;

    //also check if the container gets cut from right
    if( !node.cookie ) {
        if( left - toolContainerWidth  >= 0) {
            left -= toolContainerWidth ;
        }
        else {
            left += 102;
        }
    }
    logger.log('opening search box');
    var toolContainer = $("<div/>", {
        id: "amznps_adminimgtools",
        'class':'amznps_searchbox',
        css: {
            "left": left,
            "top": top,
            "position": 'fixed !important',
            "width":toolContainerWidth
        },
        click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        keyup: function(e){
            e.stopImmediatePropagation();
        },
        keydown: function(e){
            e.stopImmediatePropagation();
        }
    }).appendTo($(DOCUMENT.body));

    var $dragWrapper = $('<div></div>', {
        id: 'amzn-drag-handler',
        click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        mouseenter: function(e){
            toolContainer.draggable('enable');
            e.preventDefault();
            e.stopPropagation();
            return false;
        },
        mouseleave: function(e){
            toolContainer.draggable('disable');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }).appendTo(toolContainer);

    var close = $("<div/>",{
        id: "amzn-search-close-btn",
        css: {
            "background": 'url("' + config.sprite1 + '")' + ' -301px -166px repeat-x transparent'
        },
        title: strings.get('ps-close'),
        click: function(e) {
            try {
                self.closeSearchBox();
                e.stopPropagation();
                e.preventDefault();
                return false;
            } catch (ex) {

            }
        }
    }).appendTo(toolContainer);

    toolContainer.draggable({addClasses:false,containment:"window",scroll:false,
        start: function(){
            $('div#amznps_adminimgtools').addClass('amzn-drag-in-progress');
        },
        stop: function() {
            var el = $("div#amznps_adminimgtools");
            bootstrap.setData('amzn_search_box_left',parseInt(el.css('left')), 20*365);
            bootstrap.setData('amzn_search_box_top',parseInt(el.css('top')), 20*365);
            setTimeout((function(el){
                return (function(){
                    el.removeClass('amzn-drag-in-progress');
                });
            })(el), 300);
        }
    });

    if(editData && editData.isPostPublish) {
        toolContainer.draggable('option','axis','x');
    }

    toolContainer.draggable('disable');
    var searchNav =  $("<span/>",{
        id: "amznps-nav-search-in",
        mouseenter: function() {
            $(this).addClass("active");
        },
        mouseleave: function() {
            //If focus is not in text box then remove the class active
            if(!self.isFocusOnInput) {
                $(this).removeClass("active");
            }
        }
    }).addClass("amznps-nav-sprite amznps-nav-facade-active").appendTo(toolContainer);

    $("<span/>",{
        id: "amznps-nav-search-in-content",
        text: strings.get(constants.all)
    }).appendTo(searchNav);

    $("<span/>", {
            css: {
                'backgroundImage': 'url("'+ config.searchSprite +  '")'
            }
        }
    ).addClass("amznps-nav-sprite amznps-nav-down-arrow").appendTo(searchNav);

    var categoryDropDown = $("<select/>",{
        id: "amznps-searchDropdownBox",
        title: strings.get(constants.searchInAllCategories),
        change: (function(editData,defaultLinkType) {
            return (function(e) {
                try {
                    self.resetSelectedCategory();

                    var input = $("input#amznps-twotabsearchtextbox");
                    var currentSearchTerm = input.val();
                    self.editHotSpot.start = 0;
                    self.pageCount = 1;
                    self.search(currentSearchTerm, editData,defaultLinkType);

                } catch (ex) {
                    logger.log("Error in search - " + ex.message);
                }

                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        })(editData,defaultLinkType),
        click: function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }).addClass("searchSelect").appendTo(searchNav);

    // Adding special case, so even if we don't have list of categories, it will show All as default
    // Search Alias is of the form <marketplace>:<browseNode>:<searchIndex>
    if(!self.searchCategoryMap['amazon:amazon:aps']) {
        for(var marketplace in config.marketplaceConfig) break;
        self.searchCategoryMap['amazon:amazon:aps'] = {
            "text":config.marketplaceConfig[marketplace].alias,
            "searchIndex":"All"};
    }

    var prevCategoryMktplace = "";
    var indent = "";
    var category = "";
    for(var searchAlias in self.searchCategoryMap) {
        // First category in the map refers to all categories in that marketplace.
        // We show customized category name to represent the marketplace.

        if (prevCategoryMktplace != "" &&
            prevCategoryMktplace == self.getMktplaceFromCategory(searchAlias)) {
            //category = "&nbsp;&nbsp;&nbsp;&nbsp;" + self.searchCategoryMap[searchAlias].text;
            category = "&nbsp;&nbsp;&nbsp;&nbsp;" + self.searchCategoryMap[searchAlias].text;
            categoryDropDown.append('<option value="'+searchAlias+'" title="' +
                strings.get(constants.searchInCategory).replace("{cat}", self.searchCategoryMap[searchAlias].text) +
                '">'+category+'</option>');
        }
        else {
            var marketplace = self.getMktplaceFromCategory(searchAlias);
            var marketplaceAlias = config.marketplaceConfig[marketplace].alias;
            categoryDropDown.append('<option value="'+searchAlias+'" title="' +
                strings.get(constants.searchInCategory).replace("{cat}", marketplaceAlias) +
                '">'+marketplaceAlias+'</option>');
        }

        prevCategoryMktplace = self.getMktplaceFromCategory(searchAlias);
    }

    var searchNavOuter = $("<div/>",{
        id: "amznps-nav-searchfield-outer"
    }).addClass("amznps-nav-sprite").appendTo(toolContainer);

    var searchNavInner = $("<div/>",{
        id: "amznps-nav-searchfield-inner"
    }).addClass("amznps-nav-sprite").appendTo(searchNavOuter);


    var searchFieldWidth = $("<div/>",{
        id: "amznps-nav-searchfield-width"
    }).appendTo(searchNavInner);

    var searchInSuggCont = $("<div/>",{
        id: "amznps-nav-iss-attach"
    }).appendTo(searchFieldWidth);

    var input = self.createInputBox(searchInSuggCont, defaultText, editData,defaultLinkType);

    self.amznPubstudioPreviousText = defaultText;

    var placeholderLabel = $('<label>',{
        "id": "amznps_placeholder_label"
    }).addClass('amznps_placeholder');
    input.wrap(placeholderLabel);

    var placeholderSpan = $('<span>',{
        id: "amznps_placeholder_span"
    });
    placeholderSpan.text(strings.get(constants.searchForAProduct));
    placeholderSpan.insertBefore(input);

    self.toggleLabel(input);
    if(input.length>0 && input.closest('body').length && !self.ie) {
        input.focus().val('').val(defaultText);
    }
    else {
        clearTimeout(self.searchInputBoxTimeout);

        self.searchInputBoxTimeout = setTimeout((function (defaultText) {
            return (function() {
                input.focus().val('').val(defaultText);
            });
        })(defaultText), 1000);
    }

    $("<div/>",{
        id: "amznps-srch_sggst"
    }).appendTo(searchInSuggCont);

    var searchSubmitButton = $("<div/>", {
        css: {
            'backgroundImage': 'url("'+ config.searchSprite +  '")'
        }
    })
        .addClass("amzn-admin-item amznps-nav-submit-button amznps-nav-sprite").appendTo(toolContainer);

    var searchBtn = $("<input/>",{
        type: "submit",
        title: strings.get(constants.go),
        value: strings.get(constants.go),
        click: (function(editData,defaultLinkType) {
            return (function(e) {
                self.editHotSpot.start = 0;
                self.search($("input#amznps-twotabsearchtextbox").val(), editData,defaultLinkType);
            });
        })(editData,defaultLinkType)
    }).addClass("amznps-nav-submit-input").appendTo(searchSubmitButton);
    if(editData && editData.isPostPublish) {
        searchBtn.css({
            'margin': '-1px'
        });
    }

    self.buildAdditionalLinksSection(toolContainer, editData);

    var resultsArea = $("<div/>",{
        id: "amznps_search_resultsarea",
        css: {
          "display": "none"
        }
    }).appendTo(toolContainer);

    var categoryArea = $("<div/>",{
        id: "amznps_category_resultsarea",
        css: {
            "display": "none"
        }
    }).appendTo(toolContainer);
    var categoryResults = $('<div></div>',{
        id: 'amznps_category_container'
    }).addClass('amznps-category-results').appendTo(categoryArea);

    var navigationPane = $("<div/>",{
        id: "amznps_searchNavigationPane",
        css: {
          "display": "none"
        }
    }).appendTo(toolContainer);

    /*var catNavPane = $("<div/>",{
        id: "amznps_categoryNavigationPane",
        css: {
            "display": "none"
        }
    }).appendTo(toolContainer);
    var catNavPaneButton = $("<button/>",{
        id: "amznps_addCategoryLinkBtn",
        disabled: true,
        text: strings.get('ps-bk-link-to-category'),
        click: function(e) {
            window.amznPs.categoryBox.processLinkToCategory(editData);
            return;
        }
    }).addClass('amznps-add-link-btn').appendTo(catNavPane);*/

    if(self.editHotSpot.type == "TEXT" || (input.val() != undefined && $.trim(input.val()) != "" )) {
        if (self.amznPubstudioSearchSuggTimeout) {
            clearTimeout(self.amznPubstudioSearchTimeout);
        }

        self.amznPubstudioSearchTimeout = setTimeout((function(editData,defaultLinkType) {
            return (function() {
                self.editHotSpot.start = 0;
                self.search(input.val(), editData,defaultLinkType);
            });
        })(editData,defaultLinkType), 100);
    }

    self.resetSelectedCategory(strings.get(constants.all));
    if(callback) callback();
};

amzn_ps_bm_search.prototype.buildAdditionalLinksSection = function(toolContainer, editData) {
    var isPostPublish = typeof(editData) !== 'undefined' ? editData.isPostPublish : false;
    if(isPostPublish) {
        return;
    }

    var self = this;

    var curResult = {
        Marketplace: self.getMktplaceFromCategory(self.latestSearchAlias),
        editHotSpot: self.editHotSpot
    };

    var additionalLinks = $("<div/>",{
        id: "amznps_additional_links",
        css: {
            "display": "none"
        }
    }).appendTo(toolContainer);

    var additionalLinkTextIcon = $('<div></div>',{
        css:{
            "background-image": 'url("' + config.sprite1 + '")'
        }
    }).addClass('amznps_additional_links_icon').appendTo(additionalLinks);
    var additionalLinkText = $('<span></span>',{
        'class': 'amznps_additional_links_text',
        'text': strings.get('ps-bk-link-to-direct')
    }).appendTo(additionalLinks);

    var linkToSearchContainer = $('<span></span>',{}).appendTo(additionalLinks);
    var linkToSearch = $("<a/>",{
        id: 'amznps_additional_links_search',
        text: strings.get('ps-bk-link-search'),
        click: function(e) {
            if (!$(this).hasClass('amznps_additional_link_disabled')) {
                self.createLinkToNonAsinPage(curResult, editData, window.amznPs.landingPageTypeConfigData.searchPage);
            }
            return;
        }
    }).appendTo(linkToSearchContainer);

    var linkToGatewayContainer = $('<span></span>',{}).appendTo(additionalLinks);
    var linkToGateway = $("<a/>",{
        id: 'amznps_additional_links_gateway',
        text: strings.get('ps-bk-link-gateway'),
        click: function(e) {
            self.createLinkToNonAsinPage(curResult, editData, window.amznPs.landingPageTypeConfigData.gatewayPage);
            return;
        }
    }).appendTo(linkToGatewayContainer);

    /*var linkToCategoryContainer = $('<span></span>',{
        id: 'amznps_additional_links_category_container'
    }).appendTo(additionalLinks);
    var linkToCategory = $("<a/>",{
        id: 'amznps_additional_links_category',
        text: strings.get('ps-bk-link-category'),
        click: function(e) {
            window.amznPs.categoryBox.showCategoryLinking(curResult, editData);
            return;
        }
    }).appendTo(linkToCategoryContainer);
    window.amznPs.categoryBox.isInit = false;

    var linkToProductContainer = $('<span></span>',{
        id: 'amznps_additional_links_product_container'
    }).css({
        display: 'none'
    }).appendTo(additionalLinks);
    var linkToProduct = $("<a/>",{
        id: 'amznps_additional_links_product',
        text: strings.get('ps-bk-link-product'),
        click: function(e) {
            window.amznPs.categoryBox.toggleBetweenProductAndCategory(false);
            return;
        }
    }).appendTo(linkToProductContainer);*/
};

amzn_ps_bm_search.prototype.disableAdditionalLink = function(linkId) {
    var $link = $('#' + linkId);
    $link.addClass('amznps_additional_link_disabled');
};
amzn_ps_bm_search.prototype.enableAdditionalLink = function(linkId) {
    var $link = $('#' + linkId);
    $link.removeClass('amznps_additional_link_disabled');
};

amzn_ps_bm_search.prototype.createLinkToNonAsinPage = function(curResult, editData, type) {
    curResult.ASIN = type;
    if(curResult && curResult.editHotSpot && curResult.editHotSpot.type == 'image') {
        window.amznPs.link.wrapImageInLink(curResult, editData, type);
    }
    else {
        window.amznPs.link.wrapTextInLink(curResult, editData, type);
    }
    searchbox.closeSearchBox();
};

amzn_ps_bm_search.prototype.searchCompletionCallback = function(data, marketplaceName, editData,defaultLinkType) {
    var self = this;

    if ( !data || (data.length < 2) )
        return;

    var term = data[0];
    var suggestions = data[1];
    var nodes = data[2];

    if(term == self.latestSearchCompletionTerm) {

        if(!self.searchCompletionCache[marketplaceName][self.latestSearchAlias]) {
            self.searchCompletionCache[marketplaceName][self.latestSearchAlias] = {};
        }

        logger.log("Suggestions for " + marketplaceName);
        logger.log(data[1]);
        logger.log(data[2]);

        self.searchCompletionCache[marketplaceName][self.latestSearchAlias][term] = data;
        self.showSearchSuggestions(term, editData,defaultLinkType);
    }  else {
        logger.log("old search completion result for term: " + term + ", latest completion term: "+ self.latestSearchCompletionTerm);
    }
};

amzn_ps_bm_search.prototype.resetSelectedCategory = function(newText) {
    var self = this;
    var selected = $("select#amznps-searchDropdownBox :selected");
    if(!newText ) {
        newText = selected.text();
    }
    newText = $.trim(newText);
    var newValue = selected.val();
    self.latestSearchAlias = newValue;

    $("span#amznps-nav-search-in-content").text(newText);
    var strSearchIn = strings.get(constants.searchInCategory).replace("{cat}", newText);
    $(this).attr("title",strSearchIn);

    var searchNavIn = $("#amznps-nav-search-in");

    //Based on selected category, adjust padding of input div
    var newSize = searchNavIn.width();
    logger.log('setting padding-left - ' + newSize);
    $("#amznps-nav-searchfield-width").css("padding-left", newSize + 27);
    var searchSuggWidth =  $("#amznps-nav-searchfield-width").width();
    $("#amznps-srch_sggst").css("width",searchSuggWidth + 4);

    var input = $("input#amznps-twotabsearchtextbox");
    if(input.length>0 && input.closest('body').length && !self.ie) {
        logger.log('input box already rendered, setting focus.');
        input.css("width",searchSuggWidth - 6);
        input.focus();
    }
    else {
        clearTimeout(self.searchInputBoxTimeout);
        self.searchInputBoxTimeout = setTimeout(function() {
            input.css("width",searchSuggWidth - 6);
            logger.log('input box rendered late, setting focus.');
            input.focus();
        }, 1000);
    }
};

amzn_ps_bm_search.prototype.fetchSuggestions = function(term, editData,defaultLinkType) {
    try {
        var self = this;
        if ( term != "" ) {
            self.removeSuggestions();
            self.latestSearchCompletionTerm = term;

            var foundAllInCache = true;
            // Get suggestions for the selected marketplaces.
            var completionHost = "";
            var url = "";
            var marketplaceName = "";
            var marketplaceId = "";
            var searchAlias = "";

            if (self.latestSearchAlias == "All") {
                // Request all completion request and populate the suggestions box.
                for (var key in config.marketplaceConfig) {
                    var marketplace = config.marketplaceConfig[key];
                    marketplaceName = marketplace.name;

                    // Check whether the result is already present in the cache.
                    if (self.searchCompletionCache[marketplaceName] &&
                        self.searchCompletionCache[marketplaceName][self.latestSearchAlias] &&
                        self.searchCompletionCache[marketplaceName][self.latestSearchAlias][term]) {
                        continue;
                    }
                    else {
                        foundAllInCache = false;
                        completionHost = marketplace.completionServiceHost;
                        marketplaceId = marketplace.id;
                        if (key == "amazon") {
                            if (self.latestSearchAlias == "All")
                                searchAlias = "aps";
                            else
                                searchAlias = self.latestSearchAlias;
                        }
                        else {
                            searchAlias = "marketplace";
                        }

                        url = constants.completionServiceUrlPattern
                            .replace("__MARKETPLACE_ID__", marketplaceId)
                            .replace("__TERM__", term)
                            .replace("__SEARCHALIAS__", searchAlias);

                        self.reqSearchSuggestions(url, term, marketplaceName, editData,defaultLinkType);
                    }
                }
                if (foundAllInCache) { // Show suggestions from cache. We have not made any completion request.
                    self.showSearchSuggestions(term, editData,defaultLinkType);
                }
            }
            else {
                // Request compltion url only from the selected marketplace.
                // Marketplace is identified from selected category prefix.
                marketplaceName = self.getMktplaceFromCategory(self.latestSearchAlias);
                searchAlias = self.getSearchAliasFromCategory(self.latestSearchAlias);

                // Check whether the result is already present in cache results.
                if (self.searchCompletionCache[marketplaceName] &&
                    self.searchCompletionCache[marketplaceName][self.latestSearchAlias] &&
                    self.searchCompletionCache[marketplaceName][self.latestSearchAlias][term]) {
                    self.showSearchSuggestions(term, editData,defaultLinkType);
                }
                else { // Request from completion service.
                    var marketplace = config.marketplaceConfig[marketplaceName];
                    marketplaceName = marketplace.name;
                    completionHost = marketplace.completionServiceHost;
                    marketplaceId = marketplace.id;

                    url = constants.completionServiceUrlPattern
                        .replace("__MARKETPLACE_ID__", marketplaceId)
                        .replace("__TERM__", term)
                        .replace("__SEARCHALIAS__", searchAlias);

                    self.reqSearchSuggestions(url, term, marketplaceName, editData,defaultLinkType);
                }
            }
        }
        else {
            self.removeSuggestions();
        }
    } catch (e) {
        logger.log("Error in fetchSuggestions - " + e.message);
    }
};

// Make an ajax call to the completion service of the given URL and cache the result
// based on the marketplace.
amzn_ps_bm_search.prototype.reqSearchSuggestions = function(url, term, marketplaceName, editData,defaultLinkType) {
    var self = this;

    $.ajax({
        url: url,
        method:'GET',
        dataType:'json',
        timeout: 5000,
        success: function(resp) {
            //completion is the response of the service call
            self.searchCompletionCallback(resp, marketplaceName, editData, defaultLinkType);
        },
        error: function(term, editData,defaultLinkType) {
            return (function(jqXHR, textStatus, errorThrown){
                try {
                    if(term == self.latestSearchCompletionTerm) {
                        logger.log("latest search completion request failed");
                        // Remove suggestinos only for the failed marketplace complition request.
                        if(!self.searchCompletionCache[marketplaceName][self.latestSearchAlias]) {
                            self.searchCompletionCache[marketplaceName][self.latestSearchAlias] = {};
                        }
                        self.searchCompletionCache[marketplaceName][self.latestSearchAlias][term] = {};
                        self.showSearchSuggestions(term, editData,defaultLinkType);
                    } else {
                        logger.log("Some old completion request failed which we don't care anymore, for term: " + term);
                    }
                } catch (e) {
                    logger.log("Error in fetchSuggestions - " + e.message);
                }
            })
        }(term, editData, defaultLinkType)
    });
};

amzn_ps_bm_search.prototype.showSearchSuggestions = function(term, editData,defaultLinkType) {
    var self = this;

    if(term != self.latestSearchCompletionTerm) {
        return;
    }

    var marketplaceName;
    var searchCategory = self.latestSearchAlias;
    if (searchCategory != "All") {
        var sepIndex = searchCategory.indexOf(":");
        marketplaceName = searchCategory.substring(0, sepIndex);
    }
    else {
        marketplaceName = "All";
    }

    // Show results from each marketplace based on the search query.
    var maxSuggestions = 10;
    var maxCategorySuggestions = 5;
    if (marketplaceName == "All") {
        maxSuggestions = maxSuggestions / self.marketplaceCount;
    }

    var numberOfSuggestions = 0;
    var showingFirstResult = true;

    // Fetch the suggestions for the given term from the cache and show it.
    for (var key in config.marketplaceConfig) {
        if (marketplaceName == "All" || marketplaceName == key) {
            if (self.searchCompletionCache[key] && self.searchCompletionCache[key][searchCategory])
                var data = self.searchCompletionCache[key][searchCategory][term];

            if (!data) {
                continue;
            }

            var suggestions = data[1];

            if(suggestions && suggestions.length > 0) {
                numberOfSuggestions = 0;
                //amznpsMetricsModule.searchSuggestionShownCount.value++;
                var searchSuggestionContainer = $("div#amznps-srch_sggst");
                if (showingFirstResult) {
                    searchSuggestionContainer.empty();
                    searchSuggestionContainer.css("display","block");

                    var firstSuggestion = suggestions[0];
                    //self.search(firstSuggestion);
                    var input = $("input#amznps-twotabsearchtextbox");
                    self.toggleLabel(input, firstSuggestion);

                    self.createCategorySuggestion(self.latestSearchAlias, firstSuggestion, 0, searchSuggestionContainer);
                    numberOfSuggestions = 1;

                    showingFirstResult = false;
                }

                if(data[2] && data[2][0] && data[2][0].nodes) {
                    var nodes = data[2][0].nodes;
                    for(var i=0; i<nodes.length && i < maxCategorySuggestions && i <= numberOfSuggestions; i++) {
                        var alias = nodes[i].alias;
                        if (alias != "All")
                            alias = self.getSearchAlias(key, alias);
                        if( alias != self.latestSearchAlias && self.searchCategoryMap[alias] && self.searchCategoryMap[alias].text) {
                            self.createCategorySuggestion(alias, firstSuggestion, numberOfSuggestions, searchSuggestionContainer);
                            numberOfSuggestions++;
                        } else {
                            //We didn't render category, so ignoring it and adding one more acceptable value
                            maxCategorySuggestions++;
                            logger.log("Category details are not present from WS response for alias: " + alias);
                        }
                    }
                }
                for(var i=1; i<suggestions.length && numberOfSuggestions <= maxSuggestions; i++) {
                    var currentSuggestion = suggestions[i];
                    self.createAndAppendSuggestion(currentSuggestion, numberOfSuggestions, searchSuggestionContainer, editData,defaultLinkType);
                    numberOfSuggestions++;
                }
            }
        }
    }
};

amzn_ps_bm_search.prototype.createCategorySuggestion = function(alias, suggestion, i, searchSuggestionContainer) {
    var self = this;
    if(suggestion && $.trim(suggestion) != "") {
        var result = $("<div/>", {
            id: "amznPubstudioSearchSuggestion_"+i,
            title:  strings.get(constants.searchSuggestiojnInCategory).replace("{sugg}", suggestion).replace("{cat}", self.searchCategoryMap[alias].text),
            click: function(alias) {
                return (function(e){
                    logger.log("Selected sugg category " + alias);
                    //amznpsMetricsModule.searchSuggestionUsedCount.value++;
                    var selectedText = self.getTextFromSuggDiv($(this));
                    $("input#amznps-twotabsearchtextbox").val(selectedText);

                    var sugg = $("select#amznps-searchDropdownBox");
                    sugg.val(alias);
                    sugg.change();
                })
            }(alias),
            mouseenter: function() {
                var alreadySelected = $(".amznps_search_suggestion_hover");
                if(alreadySelected) {
                    alreadySelected.removeClass("amznps_search_suggestion_hover");
                }
                $(this).addClass("amznps_search_suggestion_hover");
            }
        }).addClass("amznps_search_suggestion").appendTo(searchSuggestionContainer);

        var regex = new RegExp("^"+self.latestSearchCompletionTerm,"i");
        var remainingText = "";
        var isPrefix = false;

        if(suggestion.match(regex)) {
            var matchedResult = $("<div/>", {
                text: self.latestSearchCompletionTerm
            }).addClass("amznps_search_suggestion_match").appendTo(result);
            remainingText = suggestion.replace(regex,"");
            isPrefix = true;
        } else {
            remainingText = suggestion;
        }

        var remaining = $("<div/>", {
            text: remainingText
        }).addClass("amznps_search_suggestion_remaining").appendTo(result);
        if(isPrefix) {
            remaining.css("padding-left","0px");
        }

        var remaining = $("<div/>", {
            text: "in " + self.searchCategoryMap[alias].text
        }).addClass("amznps_search_category").appendTo(result);
    }
};

amzn_ps_bm_search.prototype.removeSuggestions = function() {
    var searchSuggestionContainer = $("div#amznps-srch_sggst");
    searchSuggestionContainer.css("display","none");

    var alreadySelected = $(".amznps_search_suggestion_hover");
    if(alreadySelected) {
        alreadySelected.removeClass("amznps_search_suggestion_hover");
    }

    self.latestSearchCompletionTerm = new Date().getTime();

};

amzn_ps_bm_search.prototype.createAndAppendSuggestion = function(currentSuggestion, i, searchSuggestionContainer, editData,defaultLinkType) {
    var self = this;

    if(currentSuggestion && $.trim(currentSuggestion) != "") {
        var result = $("<div/>", {
            id: "amznPubstudioSearchSuggestion_"+i,
            title:  strings.get(constants.searchSuggestion).replace("{sugg}", currentSuggestion),
            click: (function(editData,defaultLinkType) {
                return (function() {
                    var selectedText = self.getTextFromSuggDiv($(this));
                    $("input#amznps-twotabsearchtextbox").val(selectedText);
                    //amznpsMetricsModule.searchSuggestionUsedCount.value++;
                    self.editHotSpot.start = 0;
                    self.search(selectedText, editData,defaultLinkType);
                })
            })(editData,defaultLinkType),
            mouseenter: function() {
                var alreadySelected = $(".amznps_search_suggestion_hover");
                if(alreadySelected) {
                    alreadySelected.removeClass("amznps_search_suggestion_hover");
                }
                $(this).addClass("amznps_search_suggestion_hover");
            }
        }).addClass("amznps_search_suggestion").appendTo(searchSuggestionContainer);

        var regex = new RegExp("^"+self.latestSearchCompletionTerm,"i");
        var remainingText = "";
        var isPrefix = false;

        if(currentSuggestion.match(regex)) {
            var matchedResult = $("<div/>", {
                text: self.latestSearchCompletionTerm
            }).addClass("amznps_search_suggestion_match").appendTo(result);
            remainingText = currentSuggestion.replace(regex,"");
            isPrefix = true;
        } else {
            remainingText = currentSuggestion;
        }

        var remaining = $("<div/>", {
            text: remainingText
        }).addClass("amznps_search_suggestion_remaining").appendTo(result);
        if(isPrefix) {
            remaining.css("padding-left","0px");
        }
    }
};

/*
 It will combine result of two child divs
 */
amzn_ps_bm_search.prototype.getTextFromSuggDiv = function(suggDiv) {
    var matchedSugg = $("div.amznps_search_suggestion_match", suggDiv).text();
    var remaingSugg = $("div.amznps_search_suggestion_remaining", suggDiv).text();

    return matchedSugg+remaingSugg;
};

amzn_ps_bm_search.prototype.searchCallback = function(data, editData,defaultLinkType) {

    //TODO clean up the overwritten function and move logic here
    var self = this;
    var instanceId = data.InstanceId;
    var asins = data.results;

    //window.amznPs.categoryBox.toggleBetweenProductAndCategory(false);

    if(self.latestSearchInstanceId == instanceId) {

        logger.log("latest search result data: ", data);
        // Since this is the latest request and handling in process, updating the global variable
        // Another reason to update this is to ignore error callback, since error callback is getting called sometime even if request succeeds
        self.latestSearchInstanceId = new Date().getTime();

        var term = self.editHotSpot.searchTerm;
        var pageNum = self.editHotSpot.start;

        if(!self.searchCache[term]) {
            self.searchCache[term] = {};
        }

        if(!self.searchCache[term][self.latestSearchAlias]) {
            self.searchCache[term][self.latestSearchAlias] = {};
        }
        var searchResult = {
                "asins": asins,
                "hasNextPage": true,
                "NumRecords": data.NumRecords
            };
        self.searchCache[term][self.latestSearchAlias][pageNum] = searchResult;
        self.showSearchResults(searchResult, editData,defaultLinkType);
    } else {
        logger.log("We got response from widget server for an older request: ", data, " instanceId: ", instanceId, " latestInstanceId: ", self.latestSearchInstanceId);
    }
};

amzn_ps_bm_search.prototype.searchErrorCallback = function(instanceId, pageStart, term, jqXHR, textStatus, errorThrown) {
    var self = this;
    logger.log("amzn_ps_bm_search.prototype.error");
    logger.log("jqXHR: ", jqXHR, ", textStatus: ", textStatus, ", error: ", errorThrown);
    logger.log("instanceId: " + instanceId + ", latestInstanceId: " + self.latestSearchInstanceId + ", pageStart: " + pageStart + ", term: " + term);

    //window.amznPs.categoryBox.toggleBetweenProductAndCategory(false);

    if(textStatus === "error"){
        logger.log("Network error occurred while performing search. Cleanup and show error.");
        notifications.showErrorNotification("searchNetworkError", strings.get(constants.networkError));

        // Removing gray div, search processing icon and disabling the next button if its there
        self.removeProcessingMask();

        return;
    }

    // Mostly it will happen where there is no result from WS, which is trying to fetch last page by pressing next button else it return 0 results
    if(instanceId == self.latestSearchInstanceId){
        logger.log("Latest search has been errored out");

        //amznpsMetricsModule.erroredOutSearchCount.value++;
        // Latest search has failed so just changing instanceId so that callback doesn't do anything
        self.latestSearchInstanceId = new Date().getTime();

        // Removing gray div, search processing icon and disabling the next button if its there
        self.removeProcessingMask();

        if(pageStart == 0) {
            // If fetch failed for first page then show no result error message
            var navigationPane = $("div#amznps_searchNavigationPane");
            if(navigationPane) {
                navigationPane.empty();
            }
            self.showSearchResultMessage(strings.get(constants.transientSearchErrorMessage));
        } else {
            // If fetch failed by pressing next, so old results will be shown by default and reduce the start which is already incremented
            self.editHotSpot.start = self.editHotSpot.start - self.numberOfSearchResult;
            self.pageCount = Math.max(self.pageCount - 1, 1);

            var nextButton = $("div#amznps_search_next");
            if(nextButton) {
                nextButton.remove();
            }
            self.searchCache[term][self.latestSearchAlias][self.editHotSpot.start].hasNextPage = false;
        }
        //TODO: How do we want to notify the user that we did't find any next page and still showing the old results(some notification?)
    } else {
        logger.log("Search which errored out is not the latest one, so we don't care anymore");
    }
};

amzn_ps_bm_search.prototype.search = function(term, editData,defaultLinkType) {
    var self = this;
    if(self.editHotSpot.searchTerm && ( self.editHotSpot.searchTerm !== term))
        self.pageCount = 1;
    // Since we are showing the search results, drop all the fetch suggestions called made till now and don't make pending call
    clearTimeout(self.amznPubstudioSearchSuggTimeout);
    self.latestSearchCompletionTerm = new Date().getTime();

    // Remove suggestion if exists
    self.removeSuggestions();

    var pageNum = self.editHotSpot.start;
    self.editHotSpot.searchTerm = term;

    term = $.trim(term);
    if ( term != "" ) {
        if(self.searchCache[term] && self.searchCache[term][self.latestSearchAlias] && self.searchCache[term][self.latestSearchAlias][pageNum]) {
            var searchResult = self.searchCache[term][self.latestSearchAlias][pageNum];
            //window.amznPs.categoryBox.toggleBetweenProductAndCategory(false);
            self.showSearchResults(searchResult, editData,defaultLinkType);
        } else {
            self.latestSearchInstanceId = new Date().getTime();

            self.createProcessingIcon();

            var searchIndex = self.searchCategoryMap[self.latestSearchAlias].searchIndex;
            logger.log("Searching for a Product : " + self.latestSearchAlias);
            logger.log("Searching for a Product : " + searchIndex);

            var url = constants.widgetServerUrlForSearch
                .replace("__keywords__",encodeURIComponent(term))
                .replace("__searchindex__",searchIndex)
                .replace("__multipagestart__",pageNum)
                .replace("__multipagecount__",self.numberOfSearchResult)
                .replace("__instance__id__",self.latestSearchInstanceId);

            // Searching in other marketplaces, if the selected category is not amazon.
            var marketplace = self.getMktplaceFromCategory(self.latestSearchAlias);
            if (marketplace != "amazon") {
                url = url + "&m=" + marketplace + "&BrowseNode=" +
                    self.getBrowseNodeFromCategory(self.latestSearchAlias);
            }

            $.ajax(url,{
                dataType:"json",
                timeout: 5000,
                cache: true,
                method:'GET',
                success: function(instanceId, pageStart, term) {
                    return function(data) {
                        try {
                            if(data) self.searchCallback(data, editData,defaultLinkType);
                            else {
                                self.searchErrorCallback(instanceId, pageStart, term);
                            }
                        } catch (e) {
                            logger.log("Error in search - " + e.message);
                        }
                    }
                }(self.latestSearchInstanceId, pageNum, term),
                error: function(instanceId, pageStart, term) {
                    return function(jqXHR, textStatus, errorThrown) {
                        try {
                            self.searchErrorCallback(instanceId, pageStart, term, jqXHR, textStatus, errorThrown);
                        } catch (e) {
                            logger.log("Error in search - " + e.message);
                        }
                    }
                }(self.latestSearchInstanceId, pageNum, term)
            });
        }
    }
};

amzn_ps_bm_search.prototype.removeProcessingMask = function() {
    var grayedArea = amznpubstudio_jQuery("div#amznps_search_resultareacover");
    if(grayedArea) {
        grayedArea.remove();
    }

    var navGrayedArea = amznpubstudio_jQuery("div#amznps_search_navareacover");
    if(navGrayedArea) {
        navGrayedArea.remove();
    }

    var catNavGrayedArea = amznpubstudio_jQuery("div#amznps_search_catnavareacover");
    if(catNavGrayedArea) {
        catNavGrayedArea.remove();
    }

    var catLink = amznpubstudio_jQuery('#amznps_additional_links_category_container');
    if (catLink.css('display') !== 'none') {
      var searchField = amznpubstudio_jQuery("#amznps-nav-iss-attach");
      $("div#amznps_search_boxareacover", searchField).remove();
      
      var categoryField = amznpubstudio_jQuery("#amznps-nav-search-in");
      $("div#amznps_search_catareacover", categoryField).remove();
    }
};

amzn_ps_bm_search.prototype.createProcessingIcon = function() {
    var self = this;

    var container = $("div#amznps_adminimgtools");
    $("div#amznps_search_resultareacover", container).remove();

    $("div.amzn_hovered").removeClass("amzn_hovered");

    var resultAreaCover = $("<div/>", {
        id: "amznps_search_resultareacover"
    }).appendTo(container);

    // Navigation section
    var navContainer = $("div#amznps_searchNavigationPane");
    if(navContainer) {
        $("div#amznps_search_navareacover", navContainer).remove();
        var navAreaCover = $("<div/>", {
            id: "amznps_search_navareacover"
        }).appendTo(navContainer);
    }
    var catNavContainer = $("div#amznps_categoryNavigationPane");
    if(catNavContainer) {
        $("div#amznps_search_catnavareacover", catNavContainer).remove();
        var catNavAreaCover = $("<div/>", {
            id: "amznps_search_catnavareacover"
        }).appendTo(catNavContainer);
    }

    var searchProcessingIcon = $("<div/>", {
        id: "amzn_searchProcessingIcon"
    }).appendTo(resultAreaCover);

    $("<img/>", {
        src: config.indicatorImage,
        id: "amzn-search-progress-indicator"
    }).appendTo(searchProcessingIcon);

    return resultAreaCover;
};


amzn_ps_bm_search.prototype.showSearchResults = function(searchResult, editData,defaultLinkType) {
    var self = this;
    var asins = searchResult.asins;

    var isPostPublish = typeof(editData) !== 'undefined' ? editData.isPostPublish : false;

    var container = $("div#amznps_adminimgtools");
    self.removeProcessingMask();


    // Removing existing results from the block
    var resultsArea = $("div#amznps_search_resultsarea", container)
      .css('display', 'block')
      .empty();

    if(!isPostPublish) {
        // Removing existing additional links block
        var additionalLinks = $("div#amznps_additional_links", container)
            .css('display', 'block');
    }
    else {
        resultsArea.css('max-height', '400px');
    }

    var navigationPane = $("div#amznps_searchNavigationPane", container)
      .css('display', 'block')
      .empty();

    if(asins.length == 0 && self.editHotSpot.start == 0) {
        logger.log("No search result found and it is the first page");
        self.showSearchResultMessage( strings.get(constants.noSearchResultMessage), resultsArea);
        self.disableAdditionalLink('amznps_additional_links_search');
        return;
    } else if(asins.length == 0) {
        // Removing existing results from the block
        logger.log("No search result found but it is not the first page");
        self.showSearchResultMessage( strings.get(constants.noSearchResultMessage), resultsArea);
    }

    self.enableAdditionalLink('amznps_additional_links_search');
    
    var _fallbackAsinImage = config.fallbackAsinImage;
    var isSuggestionBox = typeof(editData) !== 'undefined' ? editData.isSuggestionBox : false;
    for ( var i = 0; i < asins.length; i++ ) {
        var curResult = asins[i];

        // placeholder - 'amazon' is the only marketplace supported for now.
        curResult.Marketplace = 'amazon';

        //If no image is found, setting default image
        //TODO: Use different images for different URL, might have to use some media server link
        if(!curResult.ThumbImageUrl) {
            curResult.ThumbImageUrl = _fallbackAsinImage;
        }
        if(!curResult.LargeImageUrl) {
            curResult.LargeImageUrl = _fallbackAsinImage;
        }

        var result = $("<div/>", {
            id: "amznPubstudioSearchResult_"+i,
           'class':'amznps-search-result amznps_clearfix',
            click: (function(curResult, editData,defaultLinkType) {
                return (function(e) {
                    curResult.editHotSpot = self.editHotSpot;
                    //todo use local declaration
                    if( isSuggestionBox ) {
                        window.amznPs.shortCode.addShortCodeLink(window.selectedTa,curResult,window._targetNode);
                    }
                    else if(isPostPublish) {
                        editData.asinDetails = curResult;
                        editData.pageNum = (self.editHotSpot.start/self.numberOfSearchResult) + 1;
                        editData.searchTerm = self.editHotSpot.searchTerm;
                        admin.chooseAction(editData);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            })(curResult, editData,defaultLinkType)
        }).addClass("amznps-search-result").appendTo(resultsArea);

        result.hover(function(){
            $('.amznps-search-result').removeClass('amzn_hovered');
            $(this).addClass('amzn_hovered');
        }, function(){
            $(this).removeClass('amzn_hovered');
        });

        //TODO can reuse this piece of code from buildClickPreview
        var imageCover = $("<div/>")
            .addClass("amznps_search_result_image_holder").appendTo(result);

        $("<img/>", {
            src: curResult.ThumbImageUrl,
            load: function(e) {
                $(e.target).stop().animate({
                    opacity: 1
                });
            }
        }).addClass("amznps_search_result_image")
            .addClass("amzn-admin-item")
            .appendTo(imageCover);

        var details = $("<div/>").addClass("amznps_search_result_details").appendTo(result);

        var tempTitle = curResult.Title;
        var title = $("<div/>", {
            title: curResult.Title,
            text: curResult.Title
        }).addClass("amznps_search_result_title  amznps_ellipsis").appendTo(details);
        var priceReviewWrapper = $("<div/>").addClass('amznps_clearfix amznps_price_review_wrapper').appendTo(details);
        var price = $("<div/>").addClass("amznps_search_result_price").appendTo(priceReviewWrapper).text(curResult.Price || '---');
        if(!curResult.Price) price.attr('title', 'Check price on Amazon.com');

        var customerReviews = $("<div/>").addClass("amznps_search_result_reviews_holder amznps_clearfix").appendTo(priceReviewWrapper);

        var rating = $("<span/>", {
            css: {
                "background": 'url("' + config.sprite1 + '") 0 -270px repeat-x'
            }
        }).addClass("amznps_search_result_rating").appendTo(customerReviews).text(curResult.Rating);

        self.renderRating(rating);
        var totalReviews = curResult.TotalReviews?curResult.TotalReviews:0;
        $("<span/>").addClass("amznps_search_result_reviews_count").insertAfter(rating).text("("+totalReviews+")");

        var linkedUrl = escape(curResult.DetailPageURL + '?tag=assoc_tag&linkCode=amznbookmark');
        //todo use local declaration
        if(!isSuggestionBox && !isPostPublish) {
            window.amznPs.bookmarkletFeatures.addSearchFeatures(curResult, result, i, editData,defaultLinkType);
        }

        if(container.length>0) {
            //reposition the searchBox if it goes out of the page
            if(!self.fullElementInViewport(container,isSuggestionBox)) {
                var contTop=parseFloat(container.css('top'));
                var winD=viewUtils.getWindowDimensions();
                if(contTop>=100 && contTop + container.height() > winD.height) {
                    container.css('top',contTop-result.height());
                }
            }
        }
    }

    var nextButton = $("<div/>", {
        id: "amznps_search_next",
        css: {
            "background": 'url("' + config.sprite1 + '") -59px -79px repeat-x'
        }
    }).appendTo(navigationPane).addClass("amznpsSearchNavButton");

    if(asins.length == self.numberOfSearchResult && searchResult.hasNextPage && self.editHotSpot.start < 40) {
        nextButton.click(function(e) {
            self.pageCount++;
            $('input#amznps_asininput').focus();
            self.editHotSpot.start = self.editHotSpot.start + self.numberOfSearchResult;
            //no need to reset the page here to 0
            self.search(self.editHotSpot.searchTerm, editData,defaultLinkType);

            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }else{
        nextButton.css({
            'opacity': '0.3',
            'cursor': 'default'
        });
    }

    var previousButton = $("<div/>", {
        id: "amznps_search_prev",
        css: {
            "background": 'url("' + config.sprite1 + '") -38px -79px repeat-x'
        }
    }).addClass("amznpsSearchNavButton");

    if(self.editHotSpot.start > 0 ) {
        previousButton.click(function(e) {
            self.pageCount = Math.max(self.pageCount - 1, 1);
            $('input#amznps_asininput').focus();
            self.editHotSpot.start = self.editHotSpot.start - self.numberOfSearchResult;
            //no need to reset the page here to 0
            self.search(self.editHotSpot.searchTerm, editData,defaultLinkType);

            e.preventDefault();
            e.stopPropagation();

            return false;
        });
    }else{
        previousButton.css({
            'opacity': '0.3',
            'cursor': 'default'
        });
    }

        if(nextButton != undefined) {
            previousButton.insertBefore(nextButton);
        } else {
            previousButton.appendTo(navigationPane);
        }

    //move the searchBox above by diff pixels if very near to the bottom
    if(container.length>0 && !isSuggestionBox) {
        var contTop=parseFloat(container.css('top'));
        var res=viewUtils.getWindowDimensions();
        var winHt=res.height;
        var winScroll=viewUtils.getWindowScroll();
        var winScrollY=winScroll.yOffset;
        var diff=contTop+container.height() - (winHt + winScrollY - 20);
        if(contTop > 150 + winScrollY && diff>0) {
            container.css('top',contTop-diff);
        }
    }

    var paginationText = $('<span></span>',{
        'class': 'amznps_pagination_text',
        'text': 'Page ' + self.pageCount + ' (from ' + (self.editHotSpot.start+1) + ' to ' + (self.editHotSpot.start + asins.length) + ')'
    }).prependTo(navigationPane);

    var logo = $('<a></a>', {
        'class': 'amznps_footer_logo',
        'onclick': 'window.open("http://amazon.com", "_blank")',
        'css': {
            "background": 'url("' + config.sprite1 + '") -46px -144px repeat-x'
        }
    }).prependTo(navigationPane);
};

amzn_ps_bm_search.prototype.appendCurrentSearchDiv = function(resultArea) {
    var self = this;

    var labelCover = $("<div/>",{
        id: "amznps_current_search_label",
        title: strings.get(constants.searchInAllCategories).replace("{key}", self.editHotSpot.searchTerm).replace("{cat}", self.searchCategoryMap[self.latestSearchAlias].text),
        css: {
            "visibility": "hidden"
        }
    }).appendTo(resultArea);

    var category =  $("<span/>",{
        id: "amznps_current_search_category",
        text: self.searchCategoryMap[self.latestSearchAlias].text
    }).appendTo(labelCover);

    var separator = $("<span/>",{
        id: "amznps_current_search_separator",
        text: ">"
    }).appendTo(labelCover);

    var searchTerm = $("<span/>",{
        id: "amznps_current_search_term",
        text: '"' + self.editHotSpot.searchTerm + '"'
    }).appendTo(labelCover);

    if(category.outerWidth() + separator.outerWidth() + searchTerm.outerWidth() > 327) {
        labelCover.css("max-width", "328px");
        category.css("max-width", "100px");
        searchTerm.css("max-width", 327 - category.outerWidth() - separator.outerWidth() - 5);
    }

    labelCover.css("visibility","visible");
};

amzn_ps_bm_search.prototype.showSearchResultMessage = function(message, resultsArea) {
    var self = this;

    if(resultsArea == undefined) {
        resultsArea = $("div#amznps_search_resultsarea");
    }

    resultsArea.empty();
    $("<div/>", {
        id: "amznps_search_result_error"
    }).appendTo(resultsArea).text(message);
};

//Separate the searchalias and return the indexed token.
amzn_ps_bm_search.prototype.getToken = function(searchAlias, index) {
    var delimiter = ":";
    return searchAlias.split(delimiter)[index];
};

//Fetch the marketplace from category. Each category is identified by marketplace and search alias separated by ":"
amzn_ps_bm_search.prototype.getMktplaceFromCategory = function(searchAlias) {
    var self=this;
    return self.getToken(searchAlias, 0);
};

//Fetch the marketplace from category. Each category is identified by marketplace and search alias separated by ":"
amzn_ps_bm_search.prototype.getBrowseNodeFromCategory = function(searchAlias) {
    var self=this;
    return self.getToken(searchAlias, 1);
};

//Fetch the marketplace from category. Each category is identified by marketplace and search alias separated by ":"
amzn_ps_bm_search.prototype.getSearchAliasFromCategory = function(searchAlias) {
    var self=this;
    return self.getToken(searchAlias, 2);
};

//Identify the browse node and return the search alias formed from mktplace and alias.
amzn_ps_bm_search.prototype.getSearchAlias = function(mktplace, alias) {
    var self = this;
    for(var searchAlias in self.searchCategoryMap) {
        if (self.getMktplaceFromCategory(searchAlias) == mktplace &&
            self.getSearchAliasFromCategory(searchAlias) == alias) {
            return searchAlias;
        }
    }
    return (mktplace + ":" + mktplace + ":" + alias);
};

amzn_ps_bm_search.prototype.toggleLabel = function(input, customText) {
    try {
        var self = this;
        var span = input.prev('span');

        var currentInputValue = input.val();
        if (!currentInputValue ) {
            span.text(strings.get(constants.defaultSearchPlaceholder));
            span.css('visibility', '');
        } else if ( !customText ){
            span.text("");
        } else {
            var regex = new RegExp("^"+currentInputValue,"i");

            if(customText.match(regex)) {
                // Show gray autocomplete in input box only if current value is prefix of customText(first value)
                var dummySpan = $("<span/>",{
                    text: customText,
                    css: {
                        "visibility": "hidden"
                    }
                }).insertBefore(input);

                // If size is less than input size - 5 (padding)
                if(dummySpan.width() < input.width() - 5)  {
                    span.text(customText);
                }
                dummySpan.remove();
            }

        }
    } catch (e) {
        logger.log("Error in toggleLabel - " + e.message);
    }
};

amzn_ps_bm_search.prototype.scrollToView = function(element) {
    

    if(element.length==0){
        return;
    }
    var winHt=window.innerHeight, winWt=window.innerWidth,
        xOff=window.pageXOffset, yOff=window.pageYOffset,
        elTop=element.offset().top, elLeft=element.offset().left,
        elHt=element.get(0).clientHeight, elWt=element.get(0).clientWidth,
    //scrollable div
        resultsArea = $("div#amznps_search_resultsarea");

    var id = element.get(0).id, scTop=resultsArea.scrollTop(), num = parseInt(id.split("_")[1]), ht=0;
    for(var i=0;i<num;i++) {
        ht=ht+$("#amznPubstudioSearchResult_"+i).get(0).clientHeight;
    }

    //check if scroll is required because of clientPage
    if(!(elTop>yOff && elTop+elHt<yOff+winHt && elLeft>xOff && elLeft+elWt<xOff+winWt)) {
        resultsArea.scrollTop(ht);
        return;
    }

    //check is scroll is required because of resultsArea
    if(!(scTop<=ht && scTop+resultsArea.height()>ht+elHt)) {
        resultsArea.scrollTop(ht);
    }
};

amzn_ps_bm_search.prototype.autoScrollToView = function(element) {
    if(element.length==0) {
        return;
    }

    var elTop=element.offset().top, elLeft=element.offset().left,
        elHt=element.get(0).clientHeight, elWt=element.get(0).clientWidth,
        scrollablePar = element.parent(), scTop=scrollablePar.scrollTop(),
        parHt= scrollablePar.height(), parTop=scrollablePar.offset().top;

    var scrollReq=elTop-parTop+scTop-15;

    if(elTop<parTop || elTop+elHt>parTop+parHt) {
        scrollablePar.scrollTop(scrollReq);
    }
};

amzn_ps_bm_search.prototype.renderRating = function(obj) {
    var self=this;

    var val = parseFloat(obj.html());
    val = val.toString()=="NaN"?0:val;
    var size = Math.max(0, (Math.min(5, val))) * 11;
    var colStars = $("<span/>", {
        css: {
            "width": size,
            "backgroundImage": 'url("' + config.sprite1 + '")'
        }
    }).addClass('amzn-popover-item amzn-searchbox-rating-inner');
    obj.html(colStars);
};

//checks if the complete element is in viewport
amzn_ps_bm_search.prototype.fullElementInViewport = function(obj,isSuggestionBox) {
    var self=this;
    if(isSuggestionBox) return true; // incase of suggestion Box, render it beneath
    var top = obj.offset().top;
    var left = obj.offset().left;
    var width = obj.width();
    var height = obj.height();
    var res=viewUtils.getWindowDimensions();
    var winHt=res.height, winWt=res.width;
    var winScroll=viewUtils.getWindowScroll();
    var winScrollY=winScroll.yOffset, winScrollX=winScroll.xOffset;

    return (
        (top+height) < (winScrollY + winHt) &&
            (left + width) < (winScrollX + winWt) &&
            top > winScrollY &&
            left > winScrollX
        );
  };

amzn_ps_bm_search.prototype.showSuggestionsBox =function(ta,defaultText,_targetNode) {
    defaultText = defaultText.trim();
    if(defaultText === "") return;
    var self = this;
    var _present = true;
    
    window.selectedTa = ta;
    window._targetNode = _targetNode;
    var taParentSelectors = ['.mentionsTypeahead'];
    for(var i in taParentSelectors) {
        var taParent = ta.closest(taParentSelectors[i]);
        if(taParent.length === 1){
            ta = taParent;
            break;
        }
    }
    var _build = function() {
        var taOffset = ta.offset();
        var taTop =  ta.offset().top + ta.outerHeight(true);
        var taLeft = ta.offset().left;

        toolContainer = $("<div/>", {
            id: "amznps_adminimgtools",
            'class': 'amznps_adminimgtools amznps_suggestions_box',
            css: {
                "left": taLeft,
                "top": taTop,
                "width":ta.outerWidth(),
                "position": 'absolute !important'
            },
            click: function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            },
            //to prevent propagating mouseup event to textadmin function mouseup on body
            mouseup: function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }).appendTo($(DOCUMENT.body));

        var resultsArea = $("<div/>",{
            id: "amznps_search_resultsarea",
            css: {
                "display": "none"
            }
        }).appendTo(toolContainer);

        var navigationPane = $("<div/>",{
            id: "amznps_searchNavigationPane",
            css: {
                "display": "none"
            }
        }).appendTo(toolContainer);

    };
    var toolContainer =$("#amznps_adminimgtools");
    if(toolContainer.length === 0) {
        _present = false;
        _build();
    }
    self.editHotSpot.start = 0;
    var suggestionCont = $("div#amznps-srch_sggst");
    var _command = {
        self : self,
        keyCode: _targetNode.code,
        suggestionCont : null,
        currentValue : defaultText,
        defaultText : defaultText,
        editData : {isSuggestionBox : true},
        defaultLinkType : 'textLink',
        execute : 'navigate'
    };
    if( self.amznPubstudioPreviousText !== defaultText || !_present) _command.execute = 'search';
    self.amznPubstudioPreviousText = defaultText;
    amznPsResultKeyUpBehaviour(_command);

};

amzn_ps_bm_search.prototype.init = function() {
    var self = this;

    // Initialize the search completion cache for all marketplace.
    for (var key in config.marketplaceConfig) {
        self.searchCompletionCache[key] = {};
        self.marketplaceCount++;
    }

    self.attachEventsToCloseSearchBox($(DOCUMENT));
};

//var searchbox = new amzn_ps_bm_search();

        var searchbox = new amzn_ps_bm_search();
        searchbox.init();

//global function - WS seems to have trouble accepting a namespaced callback function!
function amznPsGetSearchCategoriesResponse(data) {
    if(data && data.categories && data.categories.length > 0) {
        searchCategories.fetched(true);
        for (var index=0; index < data.categories.length; index++) {
            for (var marketplace in data.categories[index]) {
                var categories = data.categories[index][marketplace];
                for(var i = 0; i < categories.length; i++) {
                    var browseNode = categories[i].browseNode;
                    if (browseNode == undefined || browseNode == "") {
                        browseNode = marketplace;
                    }
                    var marketCategoryAlias = marketplace + ":" + browseNode + ":" + categories[i].searchAlias;
                    var searchIndex = categories[i].searchIndex;
                    if (searchIndex == undefined || searchIndex == "") {
                        if (marketplace == "amazon" && categories[i].searchAlias == "aps") {
                            searchIndex = "All";
                        }
                        else {
                            searchIndex = "Marketplace";
                        }
                    }
                    searchbox.searchCategoryMap[marketCategoryAlias] = {"text": categories[i].text, "searchIndex": searchIndex, "browseNode": browseNode};
                }
            }
        }

        if(typeof admin != 'undefined') admin.initAdminMode();
    }
    else {
        searchCategories.useDefault();
    }
}

var searchCategories = function () {
        var getUrl = constants.widgetServerUrlForCategories;
        var fetched = false;

        var useDefault = function () {
            var data = {categories: [{"amazon":[{"text":"All Products","searchAlias":"aps"},{"text":"Apparel & Accessories","searchAlias":"apparel","browseNode":"51569011","searchIndex":"Apparel"},{"text":"Appliances","searchAlias":"appliances","browseNode":"2619525011","searchIndex":"Appliances"},{"text":"Arts, Crafts & Sewing","searchAlias":"arts-crafts","browseNode":"2617941011","searchIndex":"ArtsAndCrafts"},{"text":"Automotive","searchAlias":"automotive","browseNode":"15684181","searchIndex":"Automotive"},{"text":"Baby","searchAlias":"baby-products","browseNode":"165796011","searchIndex":"Baby"},{"text":"Beauty","searchAlias":"beauty","browseNode":"3760911","searchIndex":"Beauty"},{"text":"Books","searchAlias":"stripbooks","browseNode":"1000","searchIndex":"Books"},{"text":"Camera & Photo","searchAlias":"photo","browseNode":"13900861","searchIndex":"Photo"},{"text":"Cell Phones & Accessories","searchAlias":"mobile","browseNode":"2335752011","searchIndex":"Wireless"},{"text":"Classical Music","searchAlias":"classical","browseNode":"36632","searchIndex":"Classical"},{"text":"Computers","searchAlias":"pc-hardware","browseNode":"13900871","searchIndex":"PCHardware"},{"text":"DVD","searchAlias":"dvd","browseNode":"130","searchIndex":"DVD"},{"text":"Electronics","searchAlias":"electronics","browseNode":"172282","searchIndex":"Electronics"},{"text":"Game Downloads","searchAlias":"videogames","browseNode":"979455011","searchIndex":"VideoGames"},{"text":"Gift Cards","searchAlias":"gift-cards","browseNode":"2238192011","searchIndex":"GiftCards"},{"text":"Grocery & Gourmet Food","searchAlias":"grocery","browseNode":"16310101","searchIndex":"Grocery"},{"text":"Home & Garden","searchAlias":"garden","browseNode":"1055398","searchIndex":"HomeGarden"},{"text":"Health & Personal Care","searchAlias":"hpc","browseNode":"3760901","searchIndex":"HealthPersonalCare"},{"text":"Industrial & Scientific","searchAlias":"industrial","browseNode":"16310091","searchIndex":"Industrial"},{"text":"Jewelry","searchAlias":"jewelry","browseNode":"3367581","searchIndex":"Jewelry"},{"text":"Kindle Store","searchAlias":"digital-text","browseNode":"133140011","searchIndex":"KindleStore"},{"text":"Kitchen & Housewares","searchAlias":"kitchen","browseNode":"284507","searchIndex":"Kitchen"},{"text":"Magazine Subscriptions","searchAlias":"magazines","browseNode":"599858","searchIndex":"Magazines"},{"text":"Miscellaneous","searchAlias":"misc","browseNode":"10272111","searchIndex":"Miscellaneous"},{"text":"MP3 Downloads","searchAlias":"digital-music","browseNode":"195209011","searchIndex":"MP3Downloads"},{"text":"Music","searchAlias":"popular","browseNode":"301668","searchIndex":"Music"},{"text":"Musical Instruments","searchAlias":"mi","browseNode":"51575011","searchIndex":"MusicalInstruments"},{"text":"Office Products","searchAlias":"office-products","browseNode":"1064954","searchIndex":"OfficeProducts"},{"text":"Patio, Lawn & Garden","searchAlias":"lawngarden","browseNode":"2972638011","searchIndex":"LawnAndGarden"},{"text":"Pet Supplies","searchAlias":"pets","browseNode":"2619533011","searchIndex":"PetSupplies"},{"text":"Shoes","searchAlias":"shoes","browseNode":"672123011","searchIndex":"Shoes"},{"text":"Software","searchAlias":"software","browseNode":"229534","searchIndex":"Software"},{"text":"Sports & Outdoors","searchAlias":"sporting","browseNode":"3375251","searchIndex":"SportingGoods"},{"text":"Tools & Hardware","searchAlias":"tools","browseNode":"228013","searchIndex":"Tools"},{"text":"Toys & Games","searchAlias":"toys-and-games","browseNode":"165793011","searchIndex":"Toys"},{"text":"VHS","searchAlias":"vhs","browseNode":"404272","searchIndex":"VHS"},{"text":"Amazon Instant Video","searchAlias":"instant-video","browseNode":"16261631","searchIndex":"UnboxVideo"},{"text":"Video Games","searchAlias":"videogames","browseNode":"468642","searchIndex":"VideoGames"},{"text":"Watches","searchAlias":"watches","browseNode":"377110011","searchIndex":"Watches"}]}] , MarketPlace: "US" , InstanceId: "amznps"};
            amznPsGetSearchCategoriesResponse(data);
        };

        var init = function() {
            useDefault();

            //uncomment when category service is needed
            /*xhr.makeXHR({url:getUrl, methodType:'GET', data:'', successCB: amznPsGetSearchCategoriesResponse,
                failureCB:useDefault, successCBArgs:[], failureCBArgs:[], dataType:'text'});*/
        };

    return {
        'init': init,
        'fetched': function(val){if(val){fetched=val;} return fetched;},
        'useDefault': useDefault
    };
}();

        searchCategories.init();

/*
 amzn_il_btn_parent - parent of image with create-link button
 amzn_il_btn_pixel - pixel for create-link button
 amzn_il_btn_created - image with create-link button
 amznILBtnPixelId - key for storing id of create-link button in image's attribute
*/

var admin = function() {
    var imgBatchSize = 150,
        rerunILBtnTime = 1000,
        addILBtnTimer = null,
        addLinkUrl = null,
        deleteLinkUrl = null,
        enabled = false;

    var initPageMonitors = function() {
        $(window).unbind('resize', rerunAddILBtns);
        $(window).unbind('scroll', rerunAddILBtns);
        $(DOCUMENT).unbind('click', rerunAddILBtns);
        $(window).bind('resize', rerunAddILBtns);
        $(window).bind('scroll', rerunAddILBtns);
        $(DOCUMENT).bind('click', rerunAddILBtns);
    };

    var disableTLCreation = function() {
        $('body').unbind('click', allowTLCreation);
    };

    var initTLCreation = function() {
        disableILCreation();
        $('body').bind('click', allowTLCreation);
    };

    var disableILCreation = function() {
        $('.amzn_il_btn_parent').unbind('DOMNodeRemoved', removeOrphanILBtns).removeClass('amzn_il_btn_parent');
        $(window).unbind('resize', rerunAddILBtns);
        $(window).unbind('scroll', rerunAddILBtns);
        $(DOCUMENT).unbind('click', rerunAddILBtns);
        $("div.amzn_il_btn_pixel").remove();
        $(".amzn_il_btn_created").removeClass("amzn_il_btn_created").removeAttr('amznILBtnPixelId');
    };

    var filterSize = function(obj) {
        var size = settings.pubSettings();
        return (obj.width()>=size.minWidth && obj.height()>=size.minHeight &&
            obj.width()<=size.maxWidth && obj.height()<=size.maxHeight);
    };

    var addILBtns = function(reposition) {
        logger.log('adding create-IL buttons');

        var batchSize = markElements(),
            t1 = new Date(),
            elems = $(".amzn_taggable:not(.amzn_il_btn_created)");

        var t2 = new Date();
        logger.log("addILBtns - selector time: " + (t2-t1) + " Found " + elems.length + " elements to process");
        t1 = new Date();

        for(var i=0; i<elems .length; i++) {
            var elem = $(elems [i]);
            var src=viewUtils.getSrc(elem);
            var truncatedUrl = src;
            if(bootstrap.usePathNameForImages()) {
                truncatedUrl = viewUtils.usePathNameForImages(src);
            }
            //if neither black-listed nor directly hidden
            if(elem.is(':visible') && settings.blImgUrls[truncatedUrl]==undefined &&
                filterSize(elem)/* && !elem.hasClass('amzn-tagged-image')*/) {
                addILBtn(elem);
            }
        }
        t2 = new Date();
        logger.log("addClones time: " + (t2-t1));

        clearTimeout(addILBtnTimer);
        if(batchSize > 0) {
            logger.log("Scheduling next iteration of addILBtns");
            addILBtnTimer = setTimeout(function() {
                addILBtns();
            }, 100);
        }

    };

    var addILBtnOld = function(img) {
        var id = new Date().getTime() +'' + Math.ceil(Math.random()*10000000);
        img.attr('amznILBtnPixelId', id);
        var pixelEl = $('<div>').attr('id', id)
            .attr('style', 'margin:0px !important; display:inline-block !important')
            .css({
                "left": 0,
                "top": 0
            }).addClass('amzn_il_btn_pixel')
            .addClass('amzn-zero-opacity-important') //remove this class after positioning
            .appendTo(img.parent());

        viewUtils.position(pixelEl, img);
        pixelEl.removeClass('amzn-zero-opacity-important');

        var pos = viewUtils.findAdPosition(img);
        var btn = linkingUtils.createImgLinkBtn(pixelEl);
        btn.css({
            'position':'absolute',
            'top':pos.top,
            'left':pos.left
        });

        btn.click(function(e) {
            var pinLocation = {"imgSrc": viewUtils.getSrc(img), 'x':0, 'y':0};
            var editData = {'isPostPublish':true, 'img':img, 'btn':$(this), 'type':'image', 'pinLocation':pinLocation};
            var searchBoxNode = {'left':btn.offset().left,'top':btn.offset().top,'cookie':false,'linkType':'imageLink'};
            searchbox.buildSearchBox({'node':searchBoxNode,'searchTerm':null,
                'editData':editData});

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        img.addClass('amzn_il_btn_created');

        var imgPar = img.parent();
        if(bootstrap.domNodeRemovedSupport() && !imgPar.hasClass('amzn_il_btn_parent')) {
            imgPar.addClass('amzn_il_btn_parent');
            imgPar.bind('DOMNodeRemoved', removeOrphanILBtns);
        }
    };

    var addILBtn = function(img) {
        var id = new Date().getTime() +'' + Math.ceil(Math.random()*10000000);
        img.attr('amznILBtnPixelId', id);

        var paddingTop=parseFloat(img.css('padding-top').replace(/[^0-9-]/g, ''));
        var paddingLeft=parseFloat(img.css('padding-left').replace(/[^0-9-]/g, ''));
        var offsets = {'top': paddingTop+2, 'left': paddingLeft+2};

        var pixelEl = $('<div>').attr('id', id)
            .attr('style', 'margin:0px !important; display:inline-block !important')
            .css({
                "left": 0,
                "top": 0
            }).addClass('amzn_il_btn_pixel')
            .addClass('amzn-zero-opacity-important') //remove this class after positioning
            .appendTo(img.parent());

        viewUtils.position(pixelEl, img, offsets);
        pixelEl.removeClass('amzn-zero-opacity-important');

        var clone = $('<div/>')
            .attr('style', 'margin:0px !important; display:inline-block !important')
            .css({
                "width": img.width()-4,
                "height": img.height()-4,
                "cursor": 'url('+config.cloneCursorImage+'), auto'
            })
            .addClass('amzn_il_clone').appendTo(pixelEl);

        clone.mouseenter(function(e){
            var clone = $(this);
            if(img.hasClass('amzn-auto-link')) {
                clone.addClass('amzn_auto_clone')
                    .attr('title', strings.get(constants.autoLinkCloneClickMsg));
            }
            else clone.removeClass('amzn_auto_clone').removeAttr('title');
            e.stopPropagation();e.preventDefault();return false;
        });
        clone.mouseleave(function(e){
            e.stopPropagation();e.preventDefault();return false;
        });

        clone.click(function(e) {
            if(img.hasClass('amzn-auto-link'))notifications.showWarningNotification(strings.get(constants.autoLinkCloneClickMsg));
            else if(img.hasClass('amzn-tagged-image')){
                var adId=img.attr('amzn-ps-adId'), asin=img.attr('amzn-ps-asin');
                if(adId && asin && adId.length>0 && asin.length>0){
                    var obj=view.getAdObj(asin, adId, 'image'), ad=$('.'+adId+'.amzn-shop-now-parent-icon');
                    var searchBoxPos =  {'left': e.pageX,'top': e.pageY,'cookie':false,linkType:'imageLink'};
                    var editData = {'isPostPublish':true, 'img':img, 'oldObj':obj, 'oldAd':ad, 'type':'image', 'edit':true};
                    var searchObj = {node:searchBoxPos, searchTerm:obj.search_term,
                        editData:editData};
                    searchbox.buildSearchBox(searchObj);
                }
            }
            else{
                var pinLocation = {"imgSrc": viewUtils.getSrc(img), 'x':0, 'y':0};
                var editData = {'isPostPublish':true, 'img':img, 'btn':$(this), 'type':'image', 'pinLocation':pinLocation};
                var left= e.pageX, top= e.pageY;
                var searchBoxNode = {'left':left,'top':top,'cookie':false,'linkType':'imageLink'};
                searchbox.buildSearchBox({'node':searchBoxNode,'searchTerm':null,
                    'editData':editData});
            }
            e.stopPropagation();e.preventDefault();return false;
        });

        img.addClass('amzn_il_btn_created');

        var imgPar = img.parent();
        if(bootstrap.domNodeRemovedSupport() && !imgPar.hasClass('amzn_il_btn_parent')) {
            imgPar.addClass('amzn_il_btn_parent');
            imgPar.bind('DOMNodeRemoved', removeOrphanILBtns);
        }
    };

    var allowTLCreation = function(event) {
        //close old admin related stuff
        var cb = function() {
            var curSelection = window.getSelection();
            var textSelMap = linkingUtils.findValidTextNode(curSelection, false);
            if(textSelMap) {
                var textNode = textSelMap.textNode;
                if(textNode && textNode.length>0) {
                    var parentNode = textNode.parent();
                    if(linkingUtils.checkIfAnchorParent(parentNode)) {
                        curSelection.removeAllRanges();
                        var errorMsg = strings.get(constants.alreadyALinkError);
                        logger.log(errorMsg);
                        notifications.showWarningNotification(errorMsg);
                        return;
                    }
                    var xpath = utils.findXPath(parentNode.get(0));
                    var newNode = viewUtils.replaceTextWithSpan(textSelMap.text, textSelMap.textNode, textSelMap.localStart);
                    var textLinkLocation = {"xpath": xpath, "text": textSelMap.text, "startIndex": textSelMap.startIndex, "context": textSelMap.context};
                    var selObj = {left:event ? (event.clientX-5) || $(DOCUMENT).width()-170 :$(DOCUMENT).width()-170 ,
                        top:event ? (event.clientY  + 10) || 1 : 1,"width":0,"height":0,linkType : 'textLink',
                        'searchTerm':textSelMap.text};
                    var postPublishData = {'node':newNode, 'linkLocation':textLinkLocation, 'isPostPublish':true, 'type':'text'};
                    linkingUtils.openCreateLinkBox(selObj, $Ctx.tag, postPublishData);
                }
            }
        };
        viewUtils.removeLinkFromText($('.amznpsTempTextSpan.amzntextpin'));
        linkingUtils.selectionWatcher(window.getSelection, window.getSelection()+'', cb);
    };

    var markElements = function() {
        var selector = "img:not(.amzn_checked):not(.amzn-popover-item):not(.amzn-admin-item)," +
            "div:not(.amzn_checked):not(.amzn-popover-item):not(.amzn-admin-item)," +
            "span:not(.amzn_checked):not(.amzn-popover-item):not(.amzn-admin-item)," +
            "a:not(.amzn_checked):not(.amzn-popover-item):not(.amzn-admin-item)," +
            "li:not(.amzn_checked):not(.amzn-popover-item):not(.amzn-admin-item)," +
            "article:not(.amzn_checked):not(.amzn-popover-item):not(.amzn-admin-item)";

        var t1 = new Date();
        var imgList = $(selector);
        var t2 = new Date();
        logger.log("markElements - selector time: " + (t2-t1) + " Found " + imgList.length + " elements to process");

        var markedElementsList = [], len = imgList.length;

        t1 = new Date();
        var batchSize = (len < imgBatchSize) ? len : imgBatchSize;

        for(var idx = 0; idx < batchSize; idx++) {
            var obj = $(imgList[idx]);
            if(filterSize(obj) && viewUtils.isValidSource(obj)) {
                obj.addClass('amzn-valid-image-source');
                if(!viewUtils.isComplex(obj, 0, 3, 2)) {
                    obj.addClass("amzn_taggable");
                    markedElementsList.push(obj);
                }
            }
            obj.addClass("amzn_checked");
        }
        t2 = new Date();
        logger.log("markElements - imgCount: " + batchSize + " time: " + (t2-t1));

        return batchSize;
    };

    //code for dynamic elements, also used by view to remove il-btn
    var removeOrphanILBtns = function(e) {
        var img = $(e.target);
        if(img.hasClass('amzn_il_btn_created') &&
            !img.hasClass('amzn_il_btn_pixel') && !img.hasClass('amzn-image-ad-pixel') &&
            !img.hasClass('amzn-admin-item') && !img.hasClass('amzn-popover-item')) {
            var iLBtnId=img.attr('amznILBtnPixelId');
            img.removeClass("amzn_il_btn_created").removeAttr('amznILBtnPixelId');
            if(iLBtnId!=undefined) {
                logger.log('removing IL-btn with the id ' + iLBtnId + 'for the image ' + img);
                img.siblings('div#'+iLBtnId).remove();
            }
        }
    };

    var rerunAddILBtns = function() {
        clearTimeout(addILBtnTimer);
        addILBtnTimer = setTimeout(function() {
            addILBtns();
        }, rerunILBtnTime);
    };

    var createTempAd = function(img, msg) {
        var pixel = $('<div>', {
            css: {
                "left": 0,
                "top": 0
            }
        }).addClass('amznTempSearchPin amzn-zero-opacity-important')
            .appendTo(img.parent());

        viewUtils.position(pixel, img);
        pixel.removeClass('amzn-zero-opacity-important');
        var pos = viewUtils.findAdPosition(img);

        //shopNow-icon
        $("<div/>")
            .css({
                'margin': '0px 0px 0px -80px',
                'display':'inline-block',
                'top':pos.top,
                'left':pos.left,
                "backgroundImage":'url("' + config.adServingSprite + '")'
            })
            .mouseenter(function(e) {renderTooltip(e, msg);})
            .mouseleave(function() {removeTooltip();})
            .addClass('amzn-item amzn-shop-now-icon amzn-temp-shop-now-icon amzn-admin-item')
            .appendTo(pixel);

        return pixel;
    };

    var renderTooltip = function(e, msg) {
        var el = $(e.target);
        var map = {'left': e.clientX-5, 'top':e.clientY+10,
            'width':el.width(), 'height':el.height(),
            'boxWidth': 110, 'boxHeight': 18};
        var pos = linkingUtils.getBoxPosition(map);

        $("<div/>",{
            css: {
                top: pos.top,
                left:pos.left,
                lineHeight:'normal',
                fontSize: 12,
                fontFamily:'arial'
            },
            id: "amzn-progress-tooltip"
        }).addClass('amzn-progress-tooltip').text(msg).appendTo(DOCUMENT.body);
    };
    var removeTooltip = function() {
        var tooltip = $("#amzn-progress-tooltip");
        if(tooltip.length > 0) {
            tooltip.remove();
        }
    };

    var replaceSpanWithLink = function(span, obj, asinDetails) {
        var linkId = obj.linkId;
        var linkIdParam = "&linkId=" + linkId;

        var landingPageUrl = asinDetails.DetailPageURL+"?tag="+$Ctx.tag+
            "&linkCode=" + linkCodes.textLink + linkIdParam;

        var link = $('<a />', {
            'href': landingPageUrl,
            'target': '_blank',
            'rel': 'nofollow'
        }).addClass("amzntextpin " + obj.id).text(span.text()).insertBefore(span);
        span.remove();

        view.completeLink(link, obj);
    };

    var reloadUrls = function() {
        var pageId = $Ctx.pageId, storeId = $Ctx.storeId,
            reqId = bootstrap.reqId(), domainId = $Ctx.domainId;

        addLinkUrl = constants.addLinkUrl.replace('__store__id__', storeId)
            .replace('__domain__id__', domainId)
            .replace('__page__id__', pageId)
            .replace('__req__id__', reqId)
            .replace('__url__', bootstrap.pageUrl());

        deleteLinkUrl = constants.deleteLinkUrl.replace('__store__id__', storeId)
            .replace('__domain__id__', domainId)
            .replace('__page__id__', pageId)
            .replace('__req__id__', reqId);
    };

    var createLinkId = function(linkCode, adUnitType, asin, isUpdate, prevLinkId) {
        var linkIdData = {
            tag: $Ctx.tag,
            marketplaceId: config.marketplaceConfig['amazon']['id'],
            linkCode: linkCode,
            toolCreation: 'PubStudio',
            adUnitType: adUnitType,
            destinationType: 'ASIN',
            asin: asin,
            isUpdate: isUpdate,
            prevLinkId: prevLinkId
        };
        return AmznLinkID.get(linkIdData, config.stage);
    };

    var addTl = function(node, obj, asinDetails) {
        obj.linkId = createLinkId(linkCodes.textLink, 'TEXT', asinDetails.ASIN);
        var url = addLinkUrl.replace('__json__', encodeURIComponent(bootstrap.JSON().stringify(obj)));
        node.removeClass('amzntextpin')
            .mouseenter(function(e) {renderTooltip(e, strings.get(constants.saveInProgressMessage));})
            .mouseleave(function() {removeTooltip();});

        $.ajax({
            url: url,
            success: (function(tempNode) {
                return (function(data) {
                    if(data.error=='401') {
                        bootstrap.postLogout();
                        viewUtils.removeLinkFromText(tempNode);
                        return;
                    }
                    view.storeAd(data);
                    view.storeAsinData(asinDetails);
                    replaceSpanWithLink(tempNode, data, asinDetails);
                    removeTooltip();
                    notifications.showSuccessNotification(strings.get(constants.addTextlinkSuccessMessage));
                    metrics.send({ASIN:data.asin,mode:'na',action:'create',
                        data:data.linkLocation.text ,type: linkCodes.textLink,linkId:data.linkId,
                        isUpdated:'0',previousLinkId:'na'});
                });
            }(node)),
            error: (function(tempNode) {
                return (function() {
                    var msg = strings.get(constants.addTextlinkFailureMessage);
                    notifications.showErrorNotification(msg, msg);
                    viewUtils.removeLinkFromText(tempNode);
                    removeTooltip();
                });
            }(node))
        });
    };

    var deleteTl = function(args) {
        var obj = args.adObj;
        var url = deleteLinkUrl.replace('__hotspot__id__', obj.id);
        var node = viewUtils.replaceLinkWithSpan(args.link);
        node.removeClass('amzntextpin')
            .mouseenter(function(e) {renderTooltip(e, strings.get(constants.deleteInProgressMessage));})
            .mouseleave(function() {removeTooltip();});

        $.ajax({
            url: url,
            success: (function(tempNode) {
                return (function(data) {
                    var obj = args.adObj;
                    if(data.error=='401') {
                        bootstrap.postLogout();
                        tempNode.remove();
                        args.link.removeClass('amzn-hide-important');
                    }
                    else {
                        args.link.remove();
                        viewUtils.removeLinkFromText(tempNode);
                        view.deleteAd(obj, false);
                        notifications.showSuccessNotification(strings.get(constants.deleteTextlinkSuccessMessage));
                        metrics.send({ASIN:data.asin,mode:'na',action:'delete',
                            data:data.linkLocation.text ,type: linkCodes.textLink,linkId:data.linkId,
                            isUpdated:'0',previousLinkId:'na'});
                    }
                    removeTooltip();
                });
            }(node)),
            error: (function(tempNode) {
                return (function() {
                    tempNode.remove();
                    args.link.removeClass('amzn-hide-important');
                    removeTooltip();
                    var msg = strings.get(constants.deleteTextlinkFailureMessage);
                    notifications.showErrorNotification(msg, msg);
                });
            }(node))
        });
    };

    var editTl = function(link, oldObj, newObj, asinDetails) {
        newObj.linkId = createLinkId(linkCodes.textLink, 'TEXT', asinDetails.ASIN, 1, oldObj.linkId);
        var url = addLinkUrl.replace('__json__', encodeURIComponent(bootstrap.JSON().stringify(newObj)));
        var node = viewUtils.replaceLinkWithSpan(link);
        node.removeClass('amzntextpin')
            .mouseenter(function(e) {renderTooltip(e, strings.get(constants.updateInProgressMessage));})
            .mouseleave(function() {removeTooltip();});

        $.ajax({
            url: url,
            success: (function(tempNode, oldObj, newObj) {
                return (function(data) {
                    if(data.error=='401') {
                        bootstrap.postLogout();
                        tempNode.remove();
                        link.removeClass('amzn-hide-important');
                    }
                    else {
                        link.remove();
                        view.deleteAd(oldObj, true);
                        view.storeAd(data);
                        view.storeAsinData(asinDetails);
                        replaceSpanWithLink(tempNode, data, asinDetails);
                        notifications.showSuccessNotification(strings.get(constants.editTextlinkSuccessMessage));
                        metrics.send({ASIN:newObj.asin,mode:'na',action:'edit',
                            data:newObj.linkLocation.text ,type: linkCodes.textLink,linkId:newObj.linkId,
                            isUpdated:'1',previousLinkId:oldObj.linkId});
                    }
                    removeTooltip();
                });
            }(node, oldObj, newObj)),
            error: (function(tempNode) {
                return (function() {
                    var msg = strings.get(constants.editTextlinkFailureMessage);
                    notifications.showErrorNotification(msg, msg);
                    tempNode.remove();
                    link.removeClass('amzn-hide-important');
                    removeTooltip();
                });
            }(node))
        });
    };

    var addIl = function(img, obj, btn, asinDetails) {
        obj.linkId = createLinkId(linkCodes.textLink, 'IMAGE', asinDetails.ASIN);
        var url = addLinkUrl.replace('__json__', encodeURIComponent(bootstrap.JSON().stringify(obj)));
        //btn.hide();
        var tempAd = createTempAd(img, strings.get(constants.saveInProgressMessage));

        $.ajax({
            url: url,
            success: (function(tempAd) {
                return (function(data) {
                    if(data.error=='401') {
                        bootstrap.postLogout();
                        tempAd.remove();
                        //btn.show();
                    }
                    else {
                        tempAd.remove();
                        //btn.remove();
                        view.storeAd(data);
                        view.storeAsinData(asinDetails);
                        view.renderAd(data, img);
                        notifications.showSuccessNotification(strings.get(constants.addHotspotSuccessMessage));
                        metrics.send({ASIN:data.asin,mode:'na',action:'create',
                            data:data.pinLocation.imgSrc ,type: linkCodes.shopNow,linkId:data.linkId,
                            isUpdated:'0',previousLinkId:'na'});
                    }
                    removeTooltip();
                });
            }(tempAd)),
            error: (function(tempAd) {
                return (function() {
                    var msg = strings.get(constants.addHotspotFailureMessage);
                    notifications.showErrorNotification(msg, msg);
                    //btn.show();
                    tempAd.remove();
                    removeTooltip();
                });
            }(tempAd))
        });
    };

    var deleteIl = function(img, obj, oldAd) {
        var url = deleteLinkUrl.replace('__hotspot__id__', obj.id);
        oldAd.hide();
        var tempAd = createTempAd(img, strings.get(constants.deleteInProgressMessage));

        $.ajax({
            url: url,
            success: (function(tempAd) {
                return (function(data) {
                    if(data.error=='401') {
                        bootstrap.postLogout();
                        tempAd.remove();
                        oldAd.show();
                    }
                    else {
                        tempAd.remove();
                        oldAd.remove();
                        view.deleteAd(obj, false);
                        notifications.showSuccessNotification(strings.get(constants.deleteHotspotSuccessMessage));
                        //add create-link icon on image
                        //addILBtn(img);
                        metrics.send({ASIN:data.asin,mode:'na',action:'delete',
                            data:data.pinLocation.imgSrc ,type: linkCodes.shopNow,linkId:data.linkId,
                            isUpdated:'0',previousLinkId:'na'});
                    }
                    removeTooltip();
                });
            }(tempAd)),
            error: (function(tempAd) {
                return (function() {
                    tempAd.remove();
                    oldAd.show();
                    var msg = strings.get(constants.deleteHotspotFailureMessage);
                    notifications.showErrorNotification(msg, msg);
                    removeTooltip();
                });
            }(tempAd))
        });
    };

    var editIl = function(img, oldObj, newObj, oldAd, asinDetails) {
        newObj.linkId = createLinkId(linkCodes.textLink, 'IMAGE', asinDetails.ASIN, 1, oldObj.linkId);
        var url = addLinkUrl.replace('__json__', encodeURIComponent(bootstrap.JSON().stringify(newObj)));
        oldAd.hide();
        var tempAd = createTempAd(img, strings.get(constants.updateInProgressMessage));

        $.ajax({
            url: url,
            success: (function(tempAd, newObj, oldObj) {
                return (function(data) {
                    if(data.error=='401') {
                        bootstrap.postLogout();
                        tempAd.remove();
                        oldAd.show();
                        return;
                    }
                    else {
                        tempAd.remove();
                        oldAd.remove();
                        view.deleteAd(oldObj, true); view.storeAd(data);
                        view.storeAsinData(asinDetails);
                        view.renderAd(data, img);
                        notifications.showSuccessNotification(strings.get(constants.editHotspotSuccessMessage));
                        metrics.send({ASIN:newObj.asin,mode:'na',action:'edit',
                            data:newObj.linkLocation.text ,type: linkCodes.shopNow,linkId:newObj.linkId,
                            isUpdated:'1',previousLinkId:oldObj.linkId});
                    }
                    removeTooltip();
                });
            }(tempAd, newObj, oldObj)),
            error: (function(tempAd) {
                return (function() {
                    tempAd.remove();
                    oldAd.show();
                    var msg = strings.get(constants.editHotspotFailureMessage);
                    notifications.showErrorNotification(msg, msg);
                    removeTooltip();
                });
            }(tempAd))
        });
    };

    //decide what operation to perform on which link/node/image
    var chooseAction = function (data) {
        var asinDetails = data.asinDetails, type = data.type;
        var newObj = {
            'asin': asinDetails.ASIN,
            'search_term': data.searchTerm,
            'page_num' : data.pageNum,
            'mktplace' : asinDetails.Marketplace,
            'type' : type.toUpperCase()
        };

        if(type=='image') {
            if(data.edit) {
                var oldObj = data.oldObj;
                newObj.id = oldObj.id;
                newObj.pinLocation = oldObj.pinLocation;
                editIl(data.img, oldObj, newObj, data.oldAd, asinDetails);
            }
            else {
                newObj.pinLocation = data.pinLocation;
                addIl(data.img, newObj, data.btn, asinDetails);
            }
        }
        else if(type=='text') {
            if(data.edit) {
                var oldObj = data.oldObj;
                newObj.id = oldObj.id;
                newObj.linkLocation = oldObj.linkLocation;
                editTl(data.link, oldObj, newObj, asinDetails);
            }
            else {
                newObj.linkLocation = data.linkLocation;
                addTl(data.node, newObj, asinDetails);
            }
        }

        searchbox.closeSearchBox();
    };

    //called from settings module
    var initIlCreation = function() {
        addILBtns();
    };

    var openAdminPaletteForTl = function(link, ad, pos) {
        viewUtils.removeLinkFromText($('.amznpsTempTextSpan.amzntextpin'));
        linkingUtils.closeAdminTools();
        if(!enabled) return;
        var postPublishData = {'isPostPublish':true, 'link':link, 'oldObj':ad, 'type':'text', 'edit':true};
        var editDeleteBox = linkingUtils.openEditDeleteBox({'type':'text', 'link': link, 'body':DOCUMENT.body,
                'searchTerm':ad.search_term, 'top': pos.y, 'left':pos.x}, $Ctx.tag, deleteTl,
            {'link':link, 'adObj':ad}, postPublishData);
    };

    var openAdminPaletteForIl = function(unit, img, obj, ad) {
        linkingUtils.closeAdminTools();
        if(!enabled) return;
        var coverEditRemove = $("<div/>", {
            id : "amzn-edit-remove-cover"
        }).appendTo(unit);

        var editButton = $("<div/>", {
            id: "amzn-edit-hotspot-button",
            title: strings.get(constants.editButtonTooltip),
            click: function(e) {
                e.preventDefault();
                e.stopPropagation();
                var searchBoxPos =  {'left': e.pageX,'top': e.pageY,'cookie':false,linkType:'imageLink'};
                var editData = {'isPostPublish':true, 'img':img, 'oldObj':obj, 'oldAd':ad, 'type':'image', 'edit':true};
                var searchObj = {node:searchBoxPos, searchTerm:obj.search_term,
                    editData:editData};
                searchbox.buildSearchBox(searchObj);
                view.closeAdUnit(unit, true);
            }
        }).appendTo(coverEditRemove);

        $("<div/>", {
            css: {background: 'url("' + config.oldSprite1+ '") no-repeat scroll -47px -49px transparent'}
        }).addClass("amzn-admin-sleeve-img").appendTo(editButton);

        var removeButton = $("<div/>", {
            id: "amzn-delete-hotspot-button",
            title: strings.get(constants.deleteButtonTooltip),
            click: function(e) {
                e.preventDefault();
                e.stopPropagation();
                deleteIl(img, obj, ad);
                view.closeAdUnit(unit, true);
            }
        }).appendTo(coverEditRemove);

        $("<div/>", {
            css: {background: 'url("' + config.oldSprite1+ '") no-repeat scroll -69px -49px transparent'}
        }).addClass("amzn-admin-sleeve-img").appendTo(removeButton);
    };

    var disableAdminMode = function() {
        enabled = false;
        linkingUtils.closeAdminTools();
        disableILCreation();
        disableTLCreation();
    };

    var initAdminMode = function() {
        if(typeof bootstrap != 'undefined' && bootstrap.authorized() && bootstrap.psViewDisabled() &&
            typeof searchCategories != 'undefined' && searchCategories.fetched() &&
            typeof strings != 'undefined' && strings.fetched()) {
            enabled = true;
            initTLCreation();
            if(settings.fetched()) {
                addILBtns();
                initPageMonitors();
            }
        }
    };

    return {
        'reloadUrls': reloadUrls,
        'chooseAction': chooseAction,
        'deleteTl': deleteTl,
        'deleteIl': deleteIl,
        'initIlCreation': initIlCreation,
        'disableAdminMode': disableAdminMode,
        'initAdminMode': initAdminMode,
        'removeOrphanILBtns': removeOrphanILBtns,
        'openAdminPaletteForTl': openAdminPaletteForTl,
        'openAdminPaletteForIl': openAdminPaletteForIl
    };
}();

var bootstrap = function() {

    var linkingEnabled = true,
        reqId = undefined,
        authorized = false,
        pageUrl = window.location.host + window.location.pathname,
        usePathNameForImages = false,
        domNodeRemovedSupport = undefined,
        psViewDisabled = false,
        getPrefsUrl = '',
        wsGetDetailsUrl = '',
        JSON = window.JSON; //default initializing

    var namespaceOriginalJson = function() {
        if(typeof JSON === 'undefined'){
            var tempFrame = $('<iframe>').css({
                'display': 'none',
                'height': 0,
                'width': 0
            }).appendTo($(DOCUMENT.body));
            JSON = tempFrame.get(0).contentWindow.JSON;
            if(typeof JSON.stringify === 'undefined'){
                console.log('cannot initialize JSON object, keep using window.JSON');
                JSON=window.JSON;
            }
            //removing the iframe window throws the error 'cant execute code from a freed script error' in IE
            //refer http://stackoverflow.com/questions/83132/what-causes-the-error-cant-execute-code-from-a-freed-script
        }
    };

    var checkDomNodeSupport = function() {
        var par = $('<div/>').appendTo($(DOCUMENT.body)).bind('DOMNodeRemoved', function(e) {
            domNodeRemovedSupport = true;
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        var child = $('<div/>').appendTo(par);
        domNodeRemovedSupport = false;

        setTimeout((function(par, child) {
            return (function() {
                child.remove();
                setTimeout(function() {
                    par.remove();
                }, 500);
            });
        })(par, child), 500);
    };

    var setCookie = function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        DOCUMENT.cookie = name+"="+value+expires+"; path=/";
    };

    var getCookie = function(name) {
        var nameEQ = name + "=";
        var ca = DOCUMENT.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    var reloadUrls = function() {
        if(typeof admin!= 'undefined') {admin.reloadUrls();}
        if(typeof settings!= 'undefined') {settings.reloadUrls();}
    };

    var postAuthorize = function(status) {
        authorized = true;
        reqId = status.reqId;
        $Ctx = status.$Ctx;

        if(window.amznUseRelativeUrlsForImages ||
            $Ctx.domainId == 'e60db35e-87uy-gthy-954b-e47092027241') {
            usePathNameForImages = true;
        }

        reloadUrls();
        settings.init();
        admin.initAdminMode();
        initView();
        notifications.showNewFeatureNotification();
    };

    var postLogout = function(blockMsgToBg) {
        admin.disableAdminMode();
        $('.jGrowl-notification').trigger('jGrowl.close');
        if(!blockMsgToBg) browser.sendMessage({'method':'postLogout'});
        //pending - check if re-rendering of ads is needed after fetching prefs from cloud-front
    };

    var getData = function(name) {
        return getCookie(name);
    };

    var setData = function (name, value, days) {
        window.amznPs.logger.log("Setting " + name + ":" + value + " in cookie");
        setCookie(name, value, days);
    };

    var setLinkCreation = function(status) {
        linkingEnabled = status;
        if(status) admin.initAdminMode();
        else admin.disableAdminMode();
    };

    var isLinkingEnabled = function() {
        return (typeof $Ctx != 'undefined') && (typeof $Ctx.tag != 'undefined') && linkingEnabled;
    };

    var initView = function() {
        //this function will get called again if the pub logs out and logs in again. Reinitialization of view is not
        // needed becase all the url parameters will still remain same as before
        if(typeof view == 'undefined') {
            if(authorized && psViewDisabled && strings.fetched() && settings.fetched()) {
                getPrefsUrl = constants.getPrefsFromDbUrl.replace('__store__id__', $Ctx.storeId)
                    .replace('__domain__id__', $Ctx.domainId).replace('__page__hash__', $Ctx.pageId)
                    .replace('__req__id__', reqId);
                wsGetDetailsUrl = constants.widgetServerUrlForItem;
                view = View(linkCodes, popover, settings.pubSettings(), autoBot,
                    getPrefsUrl, getPrefsCb, wsGetDetailsUrl, getDetailsCb,
                    usePathNameForImages, domNodeRemovedSupport, false, logger, config.impressionHost, config.adServingSprite,
                    config.fallbackAsinImage);
                view.init();
            }
        }
    };

    var getPrefsCb = function(data) {view.storeAndBuildAds(data);};
    var getDetailsCb = function(data) {view.getDetailsCb(data);};

    var init = function() {
        browser.init(utils);
        namespaceOriginalJson();

        //dispatch event to ps-view on the web-page to disable itself
        var disableViewListener = function(){
            psViewDisabled = true;
            admin.initAdminMode();
            initView();
            DOCUMENT.removeEventListener('AmznPsViewDisabled');
        };
        DOCUMENT.addEventListener('AmznPsViewDisabled', disableViewListener);
        DOCUMENT.dispatchEvent(new CustomEvent('AmznPsDisableView'));

        checkDomNodeSupport();
    };

    return {
        'init':init,
        'isLinkingEnabled': isLinkingEnabled,
        'setLinkCreation': setLinkCreation,
        'postAuthorize': postAuthorize,
        'postLogout': postLogout,
        'getData': getData,
        'setData': setData,
        'initView': initView,
        'JSON': function(){return JSON;},
        'domNodeRemovedSupport': function(val){if(val){domNodeRemovedSupport=val;} return domNodeRemovedSupport;},
        'usePathNameForImages': function(val){if(val){usePathNameForImages=val;} return usePathNameForImages;},
        'reqId': function(){return reqId;},
        'authorized':function(){return authorized;},
        'pageUrl': function(val){if(val){pageUrl=val;} return pageUrl;},
        'psViewDisabled': function(){return psViewDisabled;},
    };
}();
        bootstrap.init();

    }());
}
