/*
 取窗口可视范围的高度 
*/
export
const getClientHeight = function () {
  var clientHeight = 0;
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  } else {
    var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
  }
  return parseFloat(clientHeight);
};
/*
 取窗口可视范围的高度 
*/
export
const getClientWidth = function () {
  var clientWidth = 0;
  if (document.body.clientWidth && document.documentElement.clientWidth) {
    var clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
  } else {
    var clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth : document.documentElement.clientWidth;
  }
  return parseFloat(clientWidth);
};
/*
    取窗口滚动条高度 
*/
export
const getScrollTop = function () {
  var scrollTop = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
  }
  return parseFloat(scrollTop);
};
export
const setScrollTop = function (height) {
  if (document.documentElement && document.documentElement.scrollTop) {
    document.documentElement.scrollTop = height;
  } else if (document.body) {
    document.body.scrollTop = height;
  }
};
/*
    取文档高度 
*/
export
const getDocumentHeight = function () {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
/**
 * @module 
 * @description 获取url参数
 */
export
const getUrlArgs = function () {
  var argStr = window.location.search ? window.location.search.substring(1) : "";
  var argObj = {},
    item = null,
    value = null,
    key = null,
    argArr = argStr.length > 0 ? argStr.split("&") : [];
  for (var i = 0, len = argArr.length; i < len; i++) {
    item = argArr[i].split("=");
    key = decodeURIComponent(item[0]);
    value = decodeURIComponent(item[1]);
    argObj[key] = value;
  }
  return argObj
}
export
const pageScroll = (function () {
  const fn = function (e) {
    e.preventDefault();
    e.stopPropagation();
  };
  let islock = false;

  return {
    lock(el) {
      if (islock) return;
      islock = true;
      (el || document).addEventListener('touchmove', fn);
    },
    unlock(el) {
      islock = false;
      (el || document).removeEventListener('touchmove', fn);
    }
  };
})();

export
const isIOS = !!(window.navigator && window.navigator.userAgent || '').match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export
const getScrollview = function (el) {
  let currentNode = el;
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
    let overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
};
const hasClass = function (elem, cls) {
  cls = cls || '';
  if (cls.replace(/\s/g, '').length === 0 || !elem) return false;
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
};
export
const addClass = function (ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className = ele.className === '' ? cls : ele.className + ' ' + cls;
  }
};

export
const removeClass = function (ele, cls) {
  if (hasClass(ele, cls)) {
    let newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ');
    }
    ele.className = newClass.replace(/^\s+|\s+$/g, '');
  }
};
export
const scrollTop = function (el, from = 0, to, duration = 500, callback) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) {
      typeof callback === 'function' && callback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, step);
};

/**
 * @module  cookie 
 * @description cookie相关操作
 * 例子：
 *cookie.get("name");
 *cookie.set("name","minghuang",0.5, "/", "58.com")
 *cookie.unset("name","minghuang")
 */
export
const cookie = {
  get: function (name) {
    var cookieName = encodeURIComponent(name) + "=",
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null;
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
    }
    return cookieValue;
  },
  set: function (name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    var date = new Date();
    // if (expires instanceof Date) {
    //     cookieText += "; expires=" + expires.toGMTString();
    // }
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
    cookieText += "; expires=" + date.toGMTString();
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure=" + secure;
    }
    document.cookie = cookieText;
  },
  unset: function (name, path) {
    this.set(name, "", new Date(0), path);
  }
};
