"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var Dashboard_js_1 = require("./components/Dashboard/Dashboard.js");
var Login_js_1 = require("./components/Login/Login.js");
var Signup_js_1 = require("./components/Signup/Signup.js");
var PrivateRoute_js_1 = require("./components/PrivateRoute.js");
require("./App.css");
var App = function (props) {
    return (<div className="App">
        <div className="App-content">
          <react_router_dom_1.Switch>
            <react_router_dom_1.Route exact path="/" component={Login_js_1.Login}/>
            <react_router_dom_1.Route exact path="/signup" component={Signup_js_1.Signup}/>
            <PrivateRoute_js_1.PrivateRoute path="/dashboard" component={Dashboard_js_1.Dashboard}/>
          </react_router_dom_1.Switch>
        </div>
      </div>);
};
exports.App = App;
exports.default = exports.App;
