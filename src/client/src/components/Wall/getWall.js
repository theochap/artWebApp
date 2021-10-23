import React from "react";
import axios from "axios";

import {Container} from "react-bootstrap";

import PostCard from "./cardWall.js";


export const GetWall = (props) => {
	
	const posts = props.posts;

	let postList;
	if (!posts){
		postList = "No posts !";
	}
	else{
		
		postList = posts.map(data => <PostCard title={data.title} body={data.body} authorId = {data.authorId} id = {data._id} handleDelete = {props.handleDelete} />);
	};


	return(
		<div className = "ShowPosts">

			<div className = "postList">
				{postList}

			</div>

		</div>

	)

}
