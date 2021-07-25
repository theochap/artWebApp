import React, {useContext} from "react";
import {Card, Button} from "react-bootstrap";

const PostCard = (props) => {

	const {title, body, authorId, id} = props;

	return(

	<Card style={{marginTop: '30px'}} >
	<Card.Header as="h5"> Post by {authorId} </Card.Header>
	<Card.Body>
		<Card.Title> {title} </Card.Title>

		<Card.Text> {body} </Card.Text>
		
		<Button variant="primary" onClick={() => {props.handleDelete(authorId, id)}}>Supprimer</Button>


	</Card.Body>
	</Card>
	);
};

export default PostCard
