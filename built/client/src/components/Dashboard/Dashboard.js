"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
var react_1 = __importDefault(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
var Wall_js_1 = require("../Wall/Wall.js");
var API_1 = __importDefault(require("../../utils/API"));
var Dashboard = /** @class */ (function (_super) {
    __extends(Dashboard, _super);
    function Dashboard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.disconnect = function () {
            API_1.default.logout();
            window.location = "/";
        };
        return _this;
    }
    Dashboard.prototype.render = function () {
        return (<div className="Dashboard">
        <h1>Dashboard</h1>
	<Wall_js_1.Wall />
	
        <react_bootstrap_1.Button onClick={this.disconnect} block bsSize="large" type="submit" style={{ marginTop: '30px' }}>
          Se déconnecter
        </react_bootstrap_1.Button>

      </div>);
    };
    return Dashboard;
}(react_1.default.Component));
exports.Dashboard = Dashboard;
