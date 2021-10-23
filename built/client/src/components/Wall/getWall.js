"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWall = void 0;
var react_1 = __importDefault(require("react"));
var cardWall_js_1 = __importDefault(require("./cardWall.js"));
var GetWall = function (props) {
    var posts = props.posts;
    var postList;
    if (!posts) {
        postList = "No posts !";
    }
    else {
        postList = posts.map(function (data) { return <cardWall_js_1.default title={data.title} body={data.body} authorId={data.authorId} id={data._id} handleDelete={props.handleDelete}/>; });
    }
    ;
    return (<div className="ShowPosts">

			<div className="postList">
				{postList}

			</div>

		</div>);
};
exports.GetWall = GetWall;
