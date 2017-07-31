/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(2);
var app_1 = __webpack_require__(3);
ReactDOM.render(React.createElement(app_1["default"], null), document.getElementById('app'));


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(0);
var login_1 = __webpack_require__(4);
var bump_1 = __webpack_require__(5);
var App = (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            logged: false,
            loaded: false
        };
        return _this;
    }
    App.prototype.componentWillMount = function () {
        var _this = this;
        var r = new XMLHttpRequest();
        r.addEventListener("load", function () {
            if (r.readyState === r.DONE && r.status === 200) {
                try {
                    var user = JSON.parse(r.responseText);
                    if (user != null) {
                        _this.setState(user);
                        _this.setState({ logged: true });
                    }
                    else {
                        _this.setState({ logged: false });
                    }
                }
                catch (e) { }
                finally {
                    _this.setState({ loaded: true });
                }
            }
        });
        r.open("POST", "/");
        r.send('api=user');
    };
    App.prototype.componentDidUpdate = function () {
        if (this.state.loaded && !this.state.name)
            this.setState({ logged: false, loaded: false });
    };
    App.prototype.render = function () {
        return (React.createElement("main", null,
            React.createElement("header", null,
                React.createElement("h1", null, "LinkedIn")),
            React.createElement("div", null,
                !this.state.logged && React.createElement(login_1["default"], null),
                this.state.logged && this.state.name && this.state.url && React.createElement(bump_1["default"], { url: this.state.url, name: this.state.name, headline: this.state.headline, photo: this.state.photo }))));
    };
    return App;
}(React.Component));
exports["default"] = App;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(0);
var Login = (function (_super) {
    __extends(Login, _super);
    function Login() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Login.prototype.render = function () {
        return (React.createElement("form", { className: "login", method: "POST", action: "/" },
            React.createElement("button", { name: "api", value: "login" },
                React.createElement("img", { src: "linkedin.png" }),
                React.createElement("span", null, "Sign In"))));
    };
    return Login;
}(React.Component));
exports["default"] = Login;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = __webpack_require__(0);
var user_1 = __webpack_require__(6);
var bump_anim_1 = __webpack_require__(7);
var Bump = (function (_super) {
    __extends(Bump, _super);
    function Bump(props) {
        var _this = _super.call(this, props) || this;
        _this.doBump = function () {
            if (_this.state.bump || _this.state.error || document.hidden || _this.state.connected || _this.state.latitude == null)
                return;
            _this.setState({ bump: true });
            var r = new XMLHttpRequest();
            r.addEventListener("load", function () {
                if (r.readyState === r.DONE && r.status === 200) {
                    _this.setState({ bump: false });
                    try {
                        var u = JSON.parse(r.responseText);
                        if (!u)
                            return;
                        if (u.error) {
                            window.location.reload();
                            return;
                        }
                        _this.setState({ connected: u });
                    }
                    catch (e) { }
                }
            });
            var payload = {
                name: _this.props.name,
                headline: _this.props.headline,
                photo: _this.props.photo,
                url: _this.props.url
            };
            r.open("POST", '/');
            r.send('api=bump&acc=' + _this.state.accuracy + '&lat=' + _this.state.latitude + '&lon=' + _this.state.longitude);
        };
        _this.state = {
            bump: false,
            error: ''
        };
        return _this;
    }
    Bump.prototype.componentWillMount = function () {
        var _this = this;
        this.id = (new Date()).getTime() + "";
        if ('ondevicemotion' in window && navigator.geolocation) {
            this.moveListener = function (e) {
                if (e.accelerationIncludingGravity)
                    tilt(e.accelerationIncludingGravity.x || 0, e.accelerationIncludingGravity.y || 0, e.accelerationIncludingGravity.z || 0);
            };
            window.addEventListener('devicemotion', this.moveListener, true);
            this.setupLocation();
        }
        else {
            this.setState({ error: 'This device is not supported' });
        }
        var cal = 0, sample = 0;
        var tilt = function (a, b, c) {
            var d = a * a + b * b + c * c;
            if (document.hidden || _this.state.bump) {
                sample = 0;
                return;
            }
            if (sample > 100) {
                if ((cal / sample) * 6 < d) {
                    _this.doBump();
                    sample = 0;
                    cal = 0;
                }
            }
            if (sample < 100000) {
                cal += d;
                sample++;
            }
        };
    };
    Bump.prototype.componentWillUnmount = function () {
        if (this.moveListener)
            window.removeEventListener('deviceorientation', this.moveListener, true);
        if (this.posWatch)
            navigator.geolocation.clearWatch(this.posWatch);
    };
    Bump.prototype.setupLocation = function () {
        var _this = this;
        if (this.posWatch)
            navigator.geolocation.clearWatch(this.posWatch);
        var listener = function (p) {
            if (document.hidden)
                return;
            _this.setState({ error: '', latitude: p.coords.latitude, longitude: p.coords.longitude, accuracy: p.coords.accuracy });
        }, eListener = function (e) {
            if (e.code === e.PERMISSION_DENIED || e.code === e.POSITION_UNAVAILABLE)
                _this.setState({ error: 'Please enable location data' });
            else
                _this.setState({ error: 'Unable to find location' });
        };
        navigator.geolocation.getCurrentPosition(function (p) {
            _this.posWatch = navigator.geolocation.watchPosition(listener, eListener, { enableHighAccuracy: true });
            listener(p);
        }, eListener, { enableHighAccuracy: true });
    };
    Bump.prototype.render = function () {
        var _this = this;
        if (this.state.error)
            return React.createElement("div", { className: "bump" },
                React.createElement("h2", null, this.state.error));
        if (this.state.connected)
            return (React.createElement("div", null,
                React.createElement("h1", { className: "bumped" }, "Bumped With"),
                React.createElement(user_1["default"], __assign({}, this.state.connected, { cancel: function () { return _this.setState({ connected: null }); } }))));
        return (React.createElement("div", { className: "bump" },
            this.state.bump || this.state.latitude == null ? React.createElement("div", { className: "loader" }) : React.createElement(user_1["default"], { name: this.props.name, url: this.props.url, photo: this.props.photo, headline: this.props.headline }),
            this.state.bump ? false : this.state.latitude == null ? React.createElement("h2", null, "Loading Location") : React.createElement(bump_anim_1["default"], null)));
    };
    return Bump;
}(React.Component));
exports["default"] = Bump;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var React = __webpack_require__(0);
function User(_a) {
    var photo = _a.photo, name = _a.name, headline = _a.headline, url = _a.url, cancel = _a.cancel;
    return (React.createElement("div", { className: "user" },
        React.createElement("div", { className: "photo", style: photo ? { backgroundImage: "url(" + photo + ")" } : {} }),
        React.createElement("div", { className: "name" }, name),
        headline && React.createElement("div", { className: "headline" }, headline),
        cancel && React.createElement("a", { onClick: cancel, href: url, target: "_blank", className: "connect" }, "Connect"),
        React.createElement("br", null),
        cancel && React.createElement("button", { className: "cancel", onClick: cancel }, "Back")));
}
exports["default"] = User;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = __webpack_require__(0);
var BumpAnim = (function (_super) {
    __extends(BumpAnim, _super);
    function BumpAnim() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BumpAnim.prototype.render = function () {
        return (React.createElement("div", { className: "bump-anim" },
            React.createElement("div", { className: "line" }),
            React.createElement("div", { className: "phone" },
                React.createElement("div", { className: "top" }),
                React.createElement("div", { className: "body" },
                    React.createElement("span", null, "Bump"),
                    React.createElement("span", null, "to"),
                    React.createElement("span", null, "connect")))));
    };
    return BumpAnim;
}(React.Component));
exports["default"] = BumpAnim;


/***/ })
/******/ ]);
//# sourceMappingURL=script.js.map