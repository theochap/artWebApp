"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_bootstrap_1 = require("react-bootstrap");
var PostCard = function (props) {
    var title = props.title, body = props.body, authorId = props.authorId, id = props.id;
    return (<react_bootstrap_1.Card style={{ marginTop: '30px' }}>
	<react_bootstrap_1.Card.Header as="h5"> Post by {authorId} </react_bootstrap_1.Card.Header>
	<react_bootstrap_1.Card.Body>
		<react_bootstrap_1.Card.Title> {title} </react_bootstrap_1.Card.Title>

		<react_bootstrap_1.Card.Text> {body} </react_bootstrap_1.Card.Text>
		
		<react_bootstrap_1.Button variant="primary" onClick={function () { props.handleDelete(authorId, id); }}>Supprimer</react_bootstrap_1.Button>


	</react_bootstrap_1.Card.Body>
	</react_bootstrap_1.Card>);
};
exports.default = PostCard;
