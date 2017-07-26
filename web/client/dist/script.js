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

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(2);
var app_1 = __webpack_require__(3);
ReactDOM.render(React.createElement(app_1.default, null), document.getElementById('app'));


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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var login_1 = __webpack_require__(4);
var bump_1 = __webpack_require__(5);
var LocationState;
(function (LocationState) {
    LocationState[LocationState["Detecting"] = 0] = "Detecting";
    LocationState[LocationState["Found"] = 1] = "Found";
    LocationState[LocationState["NotFound"] = 2] = "NotFound";
})(LocationState || (LocationState = {}));
var App = (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            logged: !!(window['logged']),
            locationState: LocationState.Detecting
        };
        return _this;
    }
    App.prototype.componentWillMount = function () {
        var _this = this;
        if (this.state.locationState === LocationState.Detecting) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (l) {
                    _this.setState({ locationState: LocationState.Found });
                }, function () {
                    _this.setState({ locationState: LocationState.NotFound });
                });
            }
            else {
                this.setState({ locationState: LocationState.NotFound });
            }
        }
        if (!this.state.logged)
            return;
        var r = new XMLHttpRequest();
        r.addEventListener("load", function () {
            if (r.readyState === r.DONE && r.status === 200) {
                try {
                    var user = JSON.parse(r.responseText);
                    var name_1 = '';
                    if (user.formattedName)
                        _this.setState({ name: user.formattedName });
                    if (user.headline)
                        _this.setState({ headline: user.headline });
                    if (user.publicProfileUrl)
                        _this.setState({ url: user.publicProfileUrl });
                    if (user.pictureUrl)
                        _this.setState({ photo: user.pictureUrl });
                }
                catch (e) { }
            }
        });
        r.open("GET", "/?api=user");
        r.send();
    };
    App.prototype.render = function () {
        if (this.state.locationState === LocationState.Detecting)
            return React.createElement("span", null);
        var content = this.state.locationState === LocationState.Found ? (React.createElement("div", null,
            !this.state.logged && React.createElement(login_1.default, null),
            this.state.logged && this.state.name && React.createElement(bump_1.default, { url: this.state.url, name: this.state.name, headline: this.state.headline, photo: this.state.photo }))) : (React.createElement("h2", null, "Unable to find location"));
        return (React.createElement("main", null,
            React.createElement("header", null,
                React.createElement("h1", null, "LinkedIn")),
            content));
    };
    return App;
}(React.Component));
exports.default = App;


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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Login = (function (_super) {
    __extends(Login, _super);
    function Login() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.doLogin = function (e) {
            e.preventDefault();
            var params = {
                response_type: 'code',
                client_id: '86bnycal7ck9ip',
                redirect_uri: 'https://linkedinbump.online',
                state: (new Date()).getTime() + ''
            };
            var req = Object.keys(params).map(function (a) { return a + '=' + encodeURIComponent(params[a]); }).join('&');
            window.location.replace('https://www.linkedin.com/oauth/v2/authorization?' + req);
        };
        return _this;
    }
    Login.prototype.render = function () {
        return (React.createElement("div", { className: "login" },
            React.createElement("button", { onClick: this.doLogin },
                React.createElement("img", { src: "linkedin.png" }),
                React.createElement("span", null, "Sign In"))));
    };
    return Login;
}(React.Component));
exports.default = Login;


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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var user_1 = __webpack_require__(6);
var Bump = (function (_super) {
    __extends(Bump, _super);
    function Bump(props) {
        var _this = _super.call(this, props) || this;
        _this.doBump = function () {
            if (_this.state.bump || !_this.props.url || document.hidden || _this.state.connected || _this.state.latitude == null)
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
            r.open("GET", "/?api=bump&id=" + _this.id + "&data=" + encodeURIComponent(JSON.stringify(payload)) + '&lat=' + _this.state.latitude + '&lon=' + _this.state.longitude);
            r.send();
        };
        _this.state = {
            bump: false
        };
        return _this;
    }
    Bump.prototype.componentWillMount = function () {
        var _this = this;
        this.id = (new Date()).getTime() + "";
        if (window.DeviceOrientationEvent) {
            this.orientListener = function (e) {
                if (e.alpha != null && e.beta != null && e.gamma != null)
                    tilt(e.alpha, e.beta, e.gamma);
            };
            window.addEventListener('deviceorientation', this.orientListener, true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function () {
                    _this.posWatch = navigator.geolocation.watchPosition(function (p) {
                        if (document.hidden)
                            return;
                        _this.setState({ latitude: p.coords.latitude, longitude: p.coords.longitude });
                    }, function () { }, { enableHighAccuracy: true });
                });
            }
        }
        var la, lb, lc, lt, loc, sample = 0;
        var tilt = function (a, b, c) {
            if (document.hidden) {
                sample = 0;
                return;
            }
            if (lt != null) {
                var dt = ((new Date()).getTime() - lt) / 1000, da = Math.abs(a - la) / dt, db = Math.abs(b - lb) / dt, dc = Math.abs(c - lc) / dt, v = Math.max(da, db, dc);
                if (v > 400 && sample > 100)
                    _this.doBump();
                else
                    sample++;
            }
            la = a;
            lb = b;
            lc = c;
            lt = (new Date()).getTime();
        };
    };
    Bump.prototype.componentWillUnmount = function () {
        if (this.orientListener)
            window.removeEventListener('deviceorientation', this.orientListener, true);
        if (this.posWatch)
            navigator.geolocation.clearWatch(this.posWatch);
    };
    Bump.prototype.render = function () {
        var _this = this;
        if (!this.props.url)
            return React.createElement("div", { className: "bump" },
                React.createElement("h2", null, "Please make your profile visible"));
        if (this.state.connected)
            return React.createElement(user_1.default, __assign({}, this.state.connected, { cancel: function () { return _this.setState({ connected: null }); } }));
        return (React.createElement("div", { className: "bump" },
            this.state.bump || this.state.latitude == null ? React.createElement("div", { className: "loader" }) : React.createElement(user_1.default, { name: this.props.name, url: this.props.url, photo: this.props.photo, headline: this.props.headline }),
            React.createElement("h2", null, this.state.bump ? '' : this.state.latitude == null ? 'Loading Location' : 'Bump to connect')));
    };
    return Bump;
}(React.Component));
exports.default = Bump;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = User;


/***/ })
/******/ ]);
//# sourceMappingURL=script.js.map