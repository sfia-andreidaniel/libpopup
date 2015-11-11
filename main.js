/**
 * Core eventing class, which stands at the base of most classes in this framework.
 */
var UI_Event = (function () {
    function UI_Event() {
        this.$EVENTS_ENABLED = true;
    }
    /**
     * Adds an event listener to eventName
     *
     * @param eventName - the name of the event where the callback should run.
     * @param callback - a function which is executed each time an event with name eventName is fired. You can use
     * this inside the callback.
     */
    UI_Event.prototype.on = function (eventName, callback) {
        this.$EVENTS_QUEUE = this.$EVENTS_QUEUE || {};
        if (!this.$EVENTS_QUEUE[eventName])
            this.$EVENTS_QUEUE[eventName] = [];
        this.$EVENTS_QUEUE[eventName].push(callback);
    };
    /**
     * Removes the event listener callback from event eventName.
     *
     * @param eventName - if null, all events are removed from the event.
     * @param callback - the callback which should be removed. If null, all events binded to eventName are removed.
     */
    UI_Event.prototype.off = function (eventName, callback) {
        if (eventName) {
            if (callback) {
                if (this.$EVENTS_QUEUE && this.$EVENTS_QUEUE[eventName]) {
                    for (var i = this.$EVENTS_QUEUE[eventName].length - 1; i >= 0; i--) {
                        if (this.$EVENTS_QUEUE[eventName][i] == callback) {
                            this.$EVENTS_QUEUE[eventName].splice(i, 1);
                            return;
                        }
                    }
                }
            }
            else {
                if (typeof this.$EVENTS_QUEUE[eventName] != 'undefined') {
                    delete this.$EVENTS_QUEUE[eventName];
                }
            }
        }
        else {
            // drops the $EVENTS_QUEUE AT ALL
            this.$EVENTS_QUEUE = undefined;
        }
    };
    /**
     * Fires all callbacks associated with event eventName. You can use "this" in the context
     * of the callbacks.
     *
     * @param eventName - the name of the event which should be fired.
     * @param ...args - arguments that are applied with the "this" context to each binded callback.
     */
    UI_Event.prototype.fire = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var hasNull = false, i, len, queue;
        if (this.$EVENTS_ENABLED) {
            if (this.$EVENTS_QUEUE && this.$EVENTS_QUEUE[eventName]) {
                queue = this.$EVENTS_QUEUE[eventName].slice(0);
                for (i = 0, len = queue.length; i < len; i++) {
                    queue[i].apply(this, args);
                }
            }
        }
    };
    /**
     * Destructor. Unbinds all events and all dom event listeners.
     */
    UI_Event.prototype.free = function () {
        this.off(null, null);
    };
    /**
     * A method to enable or disable all events on this object.
     */
    UI_Event.prototype.setEventingState = function (enabled) {
        this.$EVENTS_ENABLED = !!enabled;
    };
    return UI_Event;
})();
/**
 * The Global class is used to access the global javascript environment in a cross-platform
 * way ( window in browser, global under node, etc ).
 */
var Global = (function () {
    function Global() {
    }
    Global.isBrowser = typeof window != 'undefined' ? true : false;
    return Global;
})();
Global.env = typeof window != 'undefined' ? window : global;
/**
 * The Utils_Dom class defines helpers for manipulating the browser DOM (Document Object Model).
 *
 */
var Utils_Dom = (function () {
    function Utils_Dom() {
    }
    Utils_Dom._selector_ = function (element) {
        return typeof element == 'string'
            ? document.querySelector(element)
            : element ? element : null;
    };
    Utils_Dom.hasClass = function (element, className) {
        element = Utils_Dom._selector_(element);
        if (!className || !element) {
            return false;
        }
        var classes = element.className.split(' '), i = 0, len = classes.length;
        for (i = 0; i < len; i++) {
            if (classes[i] == className) {
                return true;
            }
        }
        return false;
    };
    Utils_Dom.addClass = function (element, className) {
        element = Utils_Dom._selector_(element);
        if (!element || !className) {
            return;
        }
        var classes = String(element.className || '').split(' '), outclasses = [], i = 0, len = classes.length;
        for (i = 0; i < len; i++) {
            if (classes[i] == className) {
                return;
            }
            else if (classes[i]) {
                outclasses.push(classes[i]);
            }
        }
        outclasses.push(className);
        element.className = outclasses.join(' ');
    };
    Utils_Dom.removeClass = function (element, className) {
        element = Utils_Dom._selector_(element);
        if (!element || !className || !element.className) {
            return;
        }
        var classes = String(element.className).split(' '), i = 0, len = classes.length, f = false;
        for (i = 0; i < len; i++) {
            if (classes[i] == className) {
                classes.splice(i, 1);
                f = true;
                break;
            }
        }
        if (f) {
            element.className = classes.length
                ? classes.join(' ')
                : null;
        }
    };
    /* Removes a list of classes from a DOM element */
    Utils_Dom.removeClasses = function (element, classes) {
        element = Utils_Dom._selector_(element);
        if (!element || !element.className || !classes.length) {
            return;
        }
        var elClasses = String(element.className).split(' '), i = 0, len = classes.length, pos = 0, f = false;
        for (i = 0; i < len; i++) {
            if ((pos = elClasses.indexOf(classes[i])) >= 0) {
                elClasses.splice(pos, 1);
                f = true;
            }
        }
        if (f) {
            element.className = elClasses.length
                ? elClasses.join(' ')
                : null;
        }
    };
    /* Creates a DOM element, and optionally set it's class attribute */
    Utils_Dom.create = function (tagName, className) {
        if (className === void 0) { className = null; }
        var result = document.createElement(tagName);
        if (className)
            result.className = className;
        return result;
    };
    Utils_Dom.selectText = function (input, start, length, reverse) {
        if (length === void 0) { length = null; }
        if (reverse === void 0) { reverse = false; }
        if (input) {
            if (length === null) {
                length = input.value.length - start;
            }
            if (input.createTextRange) {
                var selRange = input.createTextRange();
                selRange.collapse(true);
                if (!reverse) {
                    selRange.moveStart('character', start);
                    selRange.moveEnd('character', start + length);
                }
                else {
                    selRange.moveStart('character', start + length);
                    selRange.moveEnd('character', -length);
                }
                selRange.select();
            }
            else if (input.setSelectionRange) {
                if (!reverse) {
                    input.setSelectionRange(start, start + length);
                }
                else {
                    input.setSelectionRange(start, start + length, 'backward');
                }
            }
            else if (typeof input.selectionStart != 'undefined') {
                if (!reverse) {
                    input.selectionStart = start;
                    input.selectionEnd = start + length;
                }
                else {
                    input.selectionStart = start + length;
                    input.selectionEnd = start;
                }
            }
        }
    };
    Utils_Dom.getCaretPosition = function (input) {
        // Initialize
        var iCaretPos = 0;
        if (document['selection']) {
            var oSel = document['selection'].createRange();
            oSel.moveStart('character', -input.value.length);
            iCaretPos = oSel.text.length;
        }
        else if (input.selectionStart || input.selectionStart == '0')
            iCaretPos = input.selectionStart;
        return (iCaretPos);
    };
    Utils_Dom.scrollbarSize = 30;
    return Utils_Dom;
})();
if (Global.isBrowser) {
    Global.env.addEventListener('load', function () {
        // measure the scrollbar width
        var d = Utils_Dom.create('div');
        d.style.cssText = 'overflow:scroll;width:100px;height:40px;';
        document.body.appendChild(d);
        Utils_Dom.scrollbarSize = 100 - d.clientWidth;
        d.parentNode.removeChild(d);
    }, true);
}
var Hash_Crc32 = (function () {
    function Hash_Crc32() {
    }
    Hash_Crc32._createTable_ = function () {
        if (!Hash_Crc32._table) {
            Hash_Crc32._table = [];
            var c, n, k;
            for (n = 0; n < 256; n++) {
                c = n;
                for (k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                Hash_Crc32._table[n] = c;
            }
        }
    };
    Hash_Crc32.compute = function (s) {
        var crc = 0 ^ (-1), i, len, st = String(s || '');
        Hash_Crc32._createTable_();
        for (i = 0, len = st.length; i < len; i++) {
            crc = (crc >>> 8) ^ Hash_Crc32._table[(crc ^ st.charCodeAt(i)) & 0xFF];
        }
        return crc;
    };
    return Hash_Crc32;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Frontend = (function (_super) {
    __extends(Frontend, _super);
    /**
     * Creates a new frontend. This class should be used via it's "create" method,
     * not via it's constructor, in order to be a singleton.
     */
    function Frontend() {
        _super.call(this);
    }
    /**
     * Obtains the frontend singleton
     */
    Frontend.create = function () {
        return Frontend._singleton || (Frontend._singleton = new Frontend());
    };
    Object.defineProperty(Frontend, "loaded", {
        /**
         * Returns true if the frontend has been loaded
         */
        get: function () {
            return Frontend._loaded;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a event to the frontend.
     * Valid events are:
     * - "load"
     */
    Frontend.on = function (eventName, eventCallback) {
        if (eventName == 'load' && Frontend.loaded) {
            Frontend.create().fire(eventName);
        }
        else {
            Frontend.create().on(eventName, eventCallback);
        }
    };
    Object.defineProperty(Frontend, "storage", {
        /**
         * Returns a Frontend Storage instance
         */
        get: function () {
            return Frontend._storage || (Frontend._storage = new Frontend_Storage());
        },
        enumerable: true,
        configurable: true
    });
    Frontend._singleton = null;
    Frontend._loaded = false;
    return Frontend;
})(UI_Event);
(function () {
    if (Global.isBrowser) {
        window.addEventListener('load', function (e) {
            Frontend['_loaded'] = true;
            Frontend.create().fire('load');
        });
    }
})();
var Frontend_Storage = (function () {
    function Frontend_Storage() {
    }
    Frontend_Storage.prototype.get = function (propertyName) {
        return '';
    };
    Frontend_Storage.prototype.set = function (propertyName, propertyValue) {
        // needs to be implemented
        return false;
    };
    Frontend_Storage.prototype.has = function (propertyName) {
        return false;
    };
    Frontend_Storage.prototype.remove = function (propertyName) {
        return false;
    };
    Object.defineProperty(Frontend_Storage.prototype, "cookie", {
        get: function () {
            return Frontend_Storage._cookie || (Frontend_Storage._cookie = new Frontend_Storage_Cookie());
        },
        enumerable: true,
        configurable: true
    });
    return Frontend_Storage;
})();
var Frontend_Storage_Cookie = (function (_super) {
    __extends(Frontend_Storage_Cookie, _super);
    function Frontend_Storage_Cookie() {
        _super.call(this);
    }
    Frontend_Storage_Cookie.prototype.set = function (cookieName, cookieValue, expireDate, path, domain, secure) {
        if (expireDate === void 0) { expireDate = null; }
        if (path === void 0) { path = null; }
        if (domain === void 0) { domain = null; }
        if (secure === void 0) { secure = false; }
        cookieName = String(cookieName || '');
        if (!cookieName || /^(?:expires|max\-age|path|domain|secure)$/i.test(cookieName))
            return false;
        var sExpires = "";
        if (expireDate) {
            sExpires = "; expires=" + expireDate.toUTCString();
        }
        document.cookie = encodeURIComponent(cookieName)
            + "="
            + encodeURIComponent(String(cookieValue || ''))
            + sExpires
            + (domain
                ? "; domain=" + String(domain || '')
                : "")
            + (path
                ? "; path=" + String(path)
                : "")
            + (secure
                ? "; secure"
                : "");
        return true;
    };
    Frontend_Storage_Cookie.prototype.has = function (cookieName) {
        if (!cookieName)
            return false;
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(cookieName).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };
    Frontend_Storage_Cookie.prototype.get = function (cookieName) {
        cookieName = String(cookieName || '');
        if (!cookieName) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"
            + encodeURIComponent(cookieName).replace(/[\-\.\+\*]/g, "\\$&")
            + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    };
    Frontend_Storage_Cookie.prototype.remove = function (cookieName, path, domain) {
        if (path === void 0) { path = null; }
        if (domain === void 0) { domain = null; }
        if (!this.has(cookieName))
            return false;
        document.cookie = encodeURIComponent(String(cookieName)) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");
        return true;
    };
    return Frontend_Storage_Cookie;
})(Frontend_Storage);
var Frontend_Popup = (function (_super) {
    __extends(Frontend_Popup, _super);
    /**
     * @imageSrc: the source which will be used for the image
     * @url:      the url which will be opened when the user clicks on the popup
     * @cssClass: adds additional CSS classes to the popup, in order to allow skinning on target website
     * @target:   the "tab" which will be used to open the popup. _self: same tab, "_blank": new tab, etc.
     * @once:     whether the popup, after it's closed, won't be displayed again (TRUE), or if the popup will be displayed each time (FALSE)
     * @timer:    takes effect only if @once is true. the number in seconds after which the popup will be automatically visible again.
     * @width:    override the width in pixels of the popup
     * @height:   override the height in pixels of the popup
     */
    function Frontend_Popup(imageSrc, url, cssClass, target, once, timer, width, height) {
        if (cssClass === void 0) { cssClass = ''; }
        if (target === void 0) { target = '_self'; }
        if (once === void 0) { once = true; }
        if (timer === void 0) { timer = null; }
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        _super.call(this);
        this._hash = null;
        this._closed = false;
        this._targetURL = '';
        this._target = '';
        this._width = 0;
        this._height = 0;
        this._renderWidth = null;
        this._renderHeight = null;
        this._placement = null;
        this._scale = 1;
        this._physicalWidth = 0;
        this._physicalHeight = 0;
        this._timer = null;
        this._dom = {
            img: null,
            body: null,
            close: null
        };
        this._hash = Hash_Crc32.compute(imageSrc + ';' + url + ';' + (once ? '1' : '0') + ';' + target).toString(32);
        this._targetURL = String(url || '');
        this._target = String(target || '');
        this._placement = 'bottom-left';
        if (once)
            this._timer = timer || null;
        this._closed = (Frontend.storage.cookie.get('frpop') || '').split(',').indexOf(this._hash) > -1;
        if (this._closed && this.isExpired()) {
            this.resetTimer();
            this._closed = false;
        }
        if (this._closed) {
            return;
        }
        this._dom.img = Utils_Dom.create('img');
        this._renderWidth = Math.abs(width || 0) || null;
        this._renderHeight = Math.abs(height || 0) || null;
        (function (me) {
            me._dom.img.onload = function () {
                me._width = me._dom.img.width;
                me._height = me._dom.img.height;
                if (Frontend_Popup.isCoolDown) {
                    return;
                }
                me.show();
            };
            me._dom.img.onclick = function () {
                me.open();
            };
        })(this);
        if (!Frontend_Popup.isCoolDown)
            this._dom.img.src = imageSrc;
    }
    Frontend_Popup.prototype.show = function () {
        if (!this._dom.img) {
            return;
        }
        if (Frontend_Popup.instances.indexOf(this) == -1) {
            Frontend_Popup.instances.push(this);
        }
        this._root = this._root || (function () {
            var result = Utils_Dom.create('div', 'frontend popup bottom-left');
            return result;
        })();
        this._dom.close = this._dom.close || (function (me) {
            var result = Utils_Dom.create('div', 'close');
            result.onclick = function () {
                me.close();
            };
            return result;
        })(this);
        this._dom.body = this._dom.body || Utils_Dom.create('div', 'body');
        this._root.appendChild(this._dom.body);
        this._dom.body.appendChild(this._dom.img);
        this._dom.body.appendChild(this._dom.close);
        if (!Frontend_Popup._cssAppended) {
            (function () {
                var st = Utils_Dom.create('style');
                st.id = 'frontend-popup-css-default-style';
                st.textContent = Frontend_Popup._css;
                document.getElementsByTagName('head')[0].appendChild(st);
            })();
            Frontend_Popup._cssAppended = true;
        }
        this.scaleToFitViewport();
        document.body.appendChild(this._root);
    };
    Frontend_Popup.prototype.scale = function () {
        var aspectRatio = this._width / this._height;
        if (this._renderHeight === null && this._renderWidth === null) {
            this._root.style.width = (this._physicalWidth = ~~(this._width * this._scale)) + "px";
            this._root.style.height = (this._physicalHeight = ~~(this._height * this._scale)) + "px";
            return;
        }
        else if (this._renderWidth !== null && this._renderHeight === null) {
            this._root.style.width = (this._physicalWidth = ~~(this._renderWidth * this._scale)) + "px";
            this._root.style.height = (this._physicalHeight = ~~(this._renderWidth / aspectRatio * this._scale)) + "px";
        }
        else if (this._renderWidth === null && this._renderHeight !== null) {
            this._root.style.height = (this._physicalHeight = ~~(this._renderHeight * this._scale)) + "px";
            this._root.style.width = (this._physicalWidth = ~~(this._renderHeight * aspectRatio * this._scale)) + "px";
        }
        else {
            this._root.style.width = (this._physicalWidth = this._renderWidth) + "px";
            this._root.style.height = (this._physicalHeight = this._renderHeight) + "px";
        }
    };
    Frontend_Popup.prototype.open = function () {
        if (this._targetURL) {
            window.open(this._targetURL, this._target || '_self');
        }
    };
    Frontend_Popup.prototype.close = function () {
        if (Frontend_Popup.instances.indexOf(this) > -1) {
            Frontend_Popup.instances.splice(Frontend_Popup.instances.indexOf(this), 1);
        }
        if (this._root && this._root.parentNode) {
            this._root.parentNode.removeChild(this._root);
            // set cookie
            var cookie = Frontend.storage.cookie.get('frpop') || '', i, cookies = cookie.split(','), len, found;
            if (cookie) {
                cookies.push(this._hash);
            }
            else {
                cookies[0] = this._hash;
            }
            Frontend.storage.cookie.set('frpop', cookies.join(','));
            if (this._timer !== null) {
                // setup timer to reset cookie.
                cookie = Frontend.storage.cookie.get('frpopt') || '';
                cookies = cookie.split(',');
                if (cookie) {
                    found = false;
                    for (i = 0, len = cookies.length; i < len; i++) {
                        if (cookies[i].substr(0, this._hash.length + 1) == (this._hash + ':')) {
                            cookies[i] = this._hash + ':' + (parseInt((Date.now() / 1000).toFixed(0)) + this._timer);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        cookies.push(this._hash + ':' + (parseInt((Date.now() / 1000).toFixed(0)) + this._timer));
                    }
                }
                else {
                    cookies[0] = this._hash + ':' + (parseInt((Date.now() / 1000).toFixed(0)) + this._timer);
                }
                Frontend.storage.cookie.set('frpopt', cookies.join(','));
            }
            // setup cooldown
            if (Frontend_Popup.coolDown > 0) {
                Frontend.storage.cookie.set('frpopc', String((parseInt((Date.now() / 1000).toFixed(0)) + Frontend_Popup.coolDown)));
            }
            this._closed = true;
        }
    };
    /**
     * Resets the timer from the cookie
     */
    Frontend_Popup.prototype.resetTimer = function () {
        var cookie = Frontend.storage.cookie.get('frpopt') || '', i, cookies = cookie.split(','), len, found = false;
        if (cookie) {
            for (i = 0, len = cookies.length; i < len; i++) {
                if (cookies[i].substr(0, this._hash.length + 1) == this._hash + ':') {
                    found = true;
                    cookies.splice(i, 1);
                    break;
                }
            }
        }
        if (found) {
            if (cookies.length) {
                Frontend.storage.cookie.set('frpopt', cookies.join(','));
            }
            else {
                Frontend.storage.cookie.remove('frpopt');
            }
            this.reset();
        }
    };
    Frontend_Popup.prototype.isExpired = function () {
        var cookie = Frontend.storage.cookie.get('frpopt') || '', i, cookies = cookie.split(','), len, found = false, now = parseInt((Date.now() / 1000).toFixed(0)), expireDate;
        if (cookie) {
            for (i = 0, len = cookies.length; i < len; i++) {
                if (cookies[i].substr(0, this._hash.length + 1) == this._hash + ':') {
                    expireDate = parseInt(cookies[i].substr(this._hash.length + 1));
                    //console.log(now, expireDate, parseInt( cookies[i].substr(this._hash.length + 1) ) );
                    if (now > expireDate) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Frontend_Popup.prototype.reset = function () {
        var cookie = Frontend.storage.cookie.get('frpop') || '', cookies = cookie.split(',');
        if (cookies.indexOf(this._hash) > -1) {
            cookies.splice(cookies.indexOf(this._hash), 1);
            Frontend.storage.cookie.set('frpop', cookies.join(','));
        }
    };
    Object.defineProperty(Frontend_Popup.prototype, "width", {
        get: function () {
            return this._renderWidth || null;
        },
        set: function (w) {
            w = ~~w;
            if (w < 1)
                w = null;
            if (w === this._renderWidth) {
                return;
            }
            this._renderWidth = w;
            this.scale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frontend_Popup.prototype, "height", {
        get: function () {
            return this._renderHeight || null;
        },
        set: function (h) {
            h = ~~h;
            if (h < 1)
                h = null;
            if (h === this._renderHeight) {
                return;
            }
            this._renderHeight = h;
            this.scale();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frontend_Popup.prototype, "designedWidth", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frontend_Popup.prototype, "designedHeight", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frontend_Popup.prototype, "placement", {
        get: function () {
            switch (this._placement) {
                case 'top-right':
                case 'bottom-left':
                case 'bottom-right':
                    return this._placement;
                    break;
                default:
                    return 'top-left';
                    break;
            }
        },
        set: function (placement) {
            switch (placement) {
                case 'top-left':
                case 'top-right':
                case 'bottom-left':
                case 'bottom-right':
                    this._placement = placement;
                    Utils_Dom.removeClasses(this._root, ['top-left', 'top-right', 'bottom-left', 'bottom-right']);
                    Utils_Dom.addClass(this._root, this._placement);
                    break;
            }
        },
        enumerable: true,
        configurable: true
    });
    Frontend_Popup.prototype.fit = function (width, height) {
        return this._physicalWidth <= width - 10 &&
            this._physicalHeight <= height - 10;
    };
    Frontend_Popup.prototype.zoom = function (scale) {
        this._scale = scale;
        this.scale();
    };
    Frontend_Popup.prototype.scaleToFitViewport = function () {
        var viewportWidth = ~~document.body.clientWidth, viewportHeight = ~~document.body.clientHeight, scale = 1, step = 0.001;
        if (viewportWidth == 0 || viewportHeight == 0) {
            return;
        }
        this.zoom(scale);
        while (!this.fit(viewportWidth, viewportHeight) && scale > step) {
            scale -= step;
            this.zoom(scale);
        }
    };
    Object.defineProperty(Frontend_Popup, "isCoolDown", {
        get: function () {
            var coolDownCookie = Frontend.storage.cookie.get('frpopc'), now = parseInt((Date.now() / 1000).toFixed(0));
            if (coolDownCookie) {
                // has cookie set, but no cooldown
                if (!Frontend_Popup.coolDown) {
                    // remove cookie
                    Frontend.storage.cookie.remove('fropc');
                    return false;
                }
                // has cookie set, cooldown passed
                if (now - parseInt(coolDownCookie) > 0) {
                    Frontend.storage.cookie.remove('fropc');
                    return false;
                }
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Frontend_Popup.instances = [];
    Frontend_Popup.coolDown = 60;
    Frontend_Popup._css = [
        'html, body                              { min-width: 100%; min-height: 100%; padding: 0; margin: 0; width: 100%; height: 100%; }',
        '.frontend.popup                      { position: fixed; padding: 0; margin: 0; z-index: 100000; }',
        '.frontend.popup > div                { position: relative; width: 100%; height: 100%; }',
        '.frontend.popup > div > img          { display: block; position: absolute; margin: 0; padding: 0; border-width: 0px; cursor: pointer; left: 0px; top: 0px; right: 0px; bottom: 0px; width: 100%; height: 100%; }',
        '.frontend.popup > div > .close       { position: absolute; z-index: 10; width: 50px; height: 30px; right: 0px; top: 0px; display: block; background-color: rgba(0,0,0,.3); background-repeat: no-repeat; background-position: 50% 50%; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsLDBcx0irPggAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAASUlEQVQY042QQQ6AQAwCh/3/n8eTSV0xLqeGEgIEEEANBUkEWDvRRABrOs3HvNVE/XSckdZONNFD+IfzMi14K5h7x5bz5XhS5gLl5DENSHlXpAAAAABJRU5ErkJggg=="); }',
        '.frontend.popup:hover > div > .close { background-color: rgba(0,0,0,1); background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsLDBgVabE3nAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAUUlEQVQY05WQQQqAMAwEJwXR/3/WqofxYFFqK9Q5bjbsJqHKRdBHgARwbPkW3qYyAxXVPa8Wuhofg2Yxnop11DQvVe/EKKPRv47pmRpzjD78BKDZy1c/Rj2yAAAAAElFTkSuQmCC"); }',
        '.frontend.popup.top-left             { left: 10px; top: 10px; }',
        '.frontend.popup.top-right            { right: 10px; top: 10px; }',
        '.frontend.popup.bottom-left          { left: 10px; bottom: 10px; }',
        '.frontend.popup.bottom-right         { right: 10px; bottom: 10px; }'
    ].join('\n');
    Frontend_Popup._cssAppended = false;
    return Frontend_Popup;
})(UI_Event);
(function () {
    Frontend.on('load', function () {
        window.addEventListener('resize', function (e) {
            var i, len = Frontend_Popup.instances.length;
            for (i = 0; i < len; i++) {
                Frontend_Popup.instances[i].scaleToFitViewport();
            }
        });
    });
})();
/// <reference path="UI/Event" />
/// <reference path="node.d.ts" />
/// <reference path="Global" />
/// <reference path="Utils/Dom" />
/// <reference path="Hash/Crc32" />
/// <reference path="Frontend" />
/// <reference path="Frontend/Storage" />
/// <reference path="Frontend/Storage/Cookie" />
/// <reference path="Frontend/Popup" /> 
