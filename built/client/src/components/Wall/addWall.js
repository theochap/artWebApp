"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddWall = void 0;
var react_1 = __importStar(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
var WallAPI_1 = __importDefault(require("../../utils/WallAPI"));
var AddWall = function (props) {
    var _a = (0, react_1.useState)(''), title = _a[0], setTitle = _a[1];
    var _b = (0, react_1.useState)(''), body = _b[0], setBody = _b[1];
    var onChange = function (fun, e) {
        fun(e.target.value);
    };
    var onSubmit = function (e) {
        e.preventDefault();
        if (!title || title.length === 0)
            return;
        if (!body || body.length === 0)
            return;
        try {
            var data = WallAPI_1.default.add({ title: title, body: body });
            setTitle("");
            setBody("");
        }
        catch (error) {
            console.error(error);
        }
    };
    return (<div className="AddPost">

			<react_bootstrap_1.FormGroup controlId="title">
			  <react_bootstrap_1.FormLabel> Titre </react_bootstrap_1.FormLabel>
			
			  <react_bootstrap_1.FormControl autoFocus type="text" value={title} onChange={function (e) { onChange(setTitle, e); }}/>
			</react_bootstrap_1.FormGroup>
			

			<react_bootstrap_1.FormGroup controlId="body">
			  <react_bootstrap_1.FormLabel> Body </react_bootstrap_1.FormLabel>
			
			  <react_bootstrap_1.FormControl autoFocus as="textarea" rows={3} value={body} onChange={function (e) { onChange(setBody, e); }}/>
			</react_bootstrap_1.FormGroup>

			<react_bootstrap_1.Button onClick={onSubmit} block type="submit">
			Ajouter un post
			</react_bootstrap_1.Button>

			</div>);
};
exports.AddWall = AddWall;
