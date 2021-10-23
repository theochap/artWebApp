"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateRoute = void 0;
var react_1 = __importDefault(require("react"));
var API_js_1 = __importDefault(require("../utils/API.js"));
var react_router_dom_1 = require("react-router-dom");
var PrivateRoute = function (_a) {
    var Component = _a.component, rest = __rest(_a, ["component"]);
    return (<react_router_dom_1.Route {...rest} render={function (props) {
            if (API_js_1.default.isAuth() === false) {
                return <react_router_dom_1.Redirect to="/"/>;
            }
            else {
                return (<div>
	      <Component {...props}/>
	</div>);
            }
        }}/>);
};
exports.PrivateRoute = PrivateRoute;
