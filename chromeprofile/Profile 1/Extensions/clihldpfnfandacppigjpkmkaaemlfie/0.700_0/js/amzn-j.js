;

function AmznJ(ele, parent) {
  //debugger;

  var _this = this;

  _this.hasOwn = ({}).hasOwnProperty;

  _this.extend = function(tempObj, obj1, obj2) {
    if (!tempObj) tempObj = {};
    for (var i in obj1) {
      tempObj[i] = obj1[i];
    }
    if (obj2) {
      for (var i in obj2) {
        tempObj[i] = obj2[i];
      }
    }
    return tempObj;
  }

  _this.isNodeList = function(nodeList) {
    return (typeof nodeList.length === 'number');
  }

  _this.trim = function(str) {
    return str.split(/\s+/).join(' ');
  }

  _this.isPlainObject = function(obj) {

    if (!obj || (typeof obj !== "object") || (obj.nodeType) || (obj == obj.window)) {
      return false;
    }

    try {
      if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      return false;
    }

    for (var key in obj) {}

    return key === undefined || hasOwn.call(obj, key);
  }

  _this.eleToNode = function(tNode) {
    if (!tNode) return document;
    var doc;
    if (tNode.AmznJVer || tNode.length) {
      doc = tNode[0];
    } else if (tNode.nodeType) {
      doc = tNode;
    } else if (typeof tNode === 'string') {
      doc = document.querySelector(tNode);
    } else {
      doc = document;
    }
    return doc;
  }

  _this.styleToObj = function(styleStr) {
    var result = {};
    if (!styleStr) return result;
    var styles = styleStr.split(';');
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i].split(':');
      if (style[0] && style[1]) {
        result[_this.trim(style[0])] = _this.trim(style[1]);
      }
    }
    return result;
  }

  _this.objToStyle = function(styleObj) {
    if (!_this.isPlainObject(styleObj) && styleObj) return false;
    var result = '';
    var r = Math.random();
    for (var i in styleObj) {
      result += i + ':' + styleObj[i] + ';';
    }
    return result;
  }

  if (!parent) parent = document;

  if (typeof ele == 'string') {
    if ((/^</).test(ele)) {
      var tDiv = document.createElement('div');
      tDiv.innerHTML = ele;
      ele = tDiv.childNodes;
      if (!ele.length) {
        ele = [];
      } else {
        ele = ele[0];
        if (_this.isPlainObject(parent)) {
          var eleStyle = _this.styleToObj(ele.getAttribute('style'));
          var newStyle = _this.extend({}, eleStyle, (parent.css ? parent.css : {}));
          var finalStyle = _this.objToStyle(newStyle);
          if (finalStyle) ele.setAttribute('style', finalStyle);
          for (var i in parent) {
            switch (i) {
              case 'css':
                break;
              case 'text':
                if ('textContent' in ele) {
                  ele.textContent = parent[i];
                } else {
                  ele.innerText = parent[i];
                }
                break;
              case 'html':
                ele.innerHTML = parent[i];
                break;
              default:
                ele.setAttribute(i, parent[i]);
            }
          };
        }
        ele = [ele];
      }
    } else {
      if (_this.isNodeList(parent) || parent.AmznJVer) {
        if (!parent[0]) {
          ele = [];
        } else {
          ele = parent[0].querySelectorAll(ele);
        }
      } else if (parent.nodeName) {
        ele = parent.querySelectorAll(ele);
      } else {
        ele = [];
      }
    }
  } else if (_this.isNodeList(ele) || ele.AmznJVer) {
    ele = ele;
  } else if (ele.nodeName) {
    ele = [ele];
  } else {
    ele = [];
  }

  var tempEle = [];
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].nodeName && ele[i].nodeName != '#text') {
      tempEle.push(ele[i]);
    }
  }
  ele = tempEle;
  ele.AmznJVer = 0.1;

  Object.defineProperties(ele, {
    'addClass': {
      'value': function(className) {
        for (var i = 0; i < ele.length; i++) {
          var eleClasses = ele[i].getAttribute('class');
          ele[i].setAttribute("class", eleClasses + ' ' + className);
        }
        return ele;
      }
    },
    'removeClass': {
      'value': function(className) {
        var classNames = className.split(' ');
        for (var i = 0; i < ele.length; i++) {
          var eleClasses = ele[i].getAttribute('class') || '';
          for (var j = 0; j < classNames.length; j++) {
            if (!classNames[j]) continue;
            eleClasses = eleClasses.replace(new RegExp(classNames[j], 'g'), "");
          }
          eleClasses = _this.trim(eleClasses);
          ele[i].setAttribute("class", eleClasses);
        }
        return ele;
      }
    },
    'hasClass': {
      'value': function(className) {
        var classNames = className.split(' ');
        var result = true;
        for (var j = 0; j < classNames.length; j++) {
          var eleClasses = ele[0].getAttribute("class") || '';
          if (!eleClasses) continue;
          eleClasses = eleClasses.split(' ');
          if (eleClasses.indexOf(classNames[j]) === -1) {
            result = false;
          }
        }
        return result;
      }
    },
    'toggleClass': {
      'value': function(className) {
        var classNames = className.split(' ');
        for (var i = 0, li = ele.length; i < li; i++) {
          var _aEle = AmznJ(ele[i]);
          for (var j = 0, lj = classNames.length; j < lj; j++) {
            if (_aEle.hasClass(classNames[j])) {
              _aEle.removeClass(classNames[j]);
            } else {
              _aEle.addClass(classNames[j]);
            }
          }
        }
        return ele;
      }
    },
    'filter': {
      'value': function(query, parent) {
        var doc = _this.eleToNode(parent);
        var newEles = [];
        var targetEles = doc.querySelectorAll(query);
        for (var i = 0; i < ele.length; i++) {
          for (var j = 0; j < targetEles.length; j++) {
            if (targetEles[j] == ele[i]) {
              newEles.push(ele[i]);
              break;
            }
          }
        }
        return AmznJ(newEles);
      }
    },
    'click': {
      'value': function(callback) {
        if (typeof callback != 'function') callback = function() {};
        for (var i = 0; i < ele.length; i++) {
          if (ele[i].addEventListener) {
            ele[i].addEventListener('click', callback, false);
          } else {
            ele[i].attachEvent('click', callback);
          }
        }
        return ele;
      }
    },
    'submit': {
      'value': function(callback) {
        if (typeof callback != 'function') callback = function() {};
        for (var i = 0; i < ele.length; i++) {
          if (ele[i].addEventListener) {
            ele[i].addEventListener('submit', callback, false);
          } else {
            ele[i].attachEvent('submit', callback);
          }
        }
        return ele;
      }
    },
    'index': {
      'value': function() {
        var tEle = ele[0];
        if (!tEle) {
          return false;
        }
        var childs = AmznJ(tEle.parentNode.childNodes);
        for (var i = 0; i < childs.length; i++) {
          if (childs[i] == tEle) {
            return i;
          }
        }
        return 0;
      }
    },
    'not': {
      'value': function(query, parent) {
        var doc = _this.eleToNode(parent);
        var newEles = [];
        var targetEles = doc.querySelectorAll(query);
        for (var i = 0; i < ele.length; i++) {
          var found = false;
          for (var j = 0; j < targetEles.length; j++) {
            if (targetEles[j] == ele[i]) {
              found = true;
            }
          }
          if (!found) newEles.push(ele[i]);
        }
        return AmznJ(newEles);
      }
    },
    'append': {
      'value': function(tEle, parent) {
        if (!tEle) return ele;
        if (typeof tEle === 'string') {
          tEle = AmznJ(tEle, parent);
        } else if (!tEle.AmznJVer || !tEle.length) {
          return ele;
        }
        for (var i = 0; i < ele.length; i++) {
          for (var j = 0; j < tEle.length; j++) {
            ele[i].appendChild(tEle[j]);
          }
        }
        return ele;
      }
    },
    'html': {
      'value': function(html) {
        if (!html) {
          return ele[0].innerHTML;
        }
        for (var i = 0; i < ele.length; i++) {
          ele[i].innerHTML = html;
        }
        return ele;
      }
    },
    'text': {
      'value': function(text) {
        if (!text) {
          if (ele[0].textContent) {
            return ele[0].textContent;
          }
          return ele[0].innerText;
        }
        for (var i = 0; i < ele.length; i++) {
          if (ele[0].textContent) {
            ele[i].textContent = text;
          } else {
            ele[i].innerText = text;
          }
        }
        return ele;
      }
    },
    'height': {
      'value': function(ht) {
        if (!ht) {
          return ele[0].clientHeight;
        }
        for (var i = 0; i < ele.length; i++) {
          ele[i].style.height = ht;
        };
        return ele;
      }
    },
    'css': {
      'value': function(css) {
        if (!css || !_this.isPlainObject(css)) {
          return _this.styleToObj(ele[0].getAttribute('style'));
        }
        for (var i = 0; i < ele.length; i++) {
          var eleStyle = _this.styleToObj(ele[i].getAttribute('style'));
          var newStyle = _this.extend({}, eleStyle, css);
          for (var j in newStyle) {
            if (css[i] === false) delete newStyle[i];
          }
          var finalStyle = _this.objToStyle(newStyle);
          if (finalStyle) ele[i].setAttribute('style', finalStyle);
        };
        return ele;
      }
    }
  });

  return ele;
};
