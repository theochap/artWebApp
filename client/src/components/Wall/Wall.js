import React, {useState, useEffect, useContext} from "react";
import WallAPI from "../../utils/WallAPI";
import {Button, FormGroup, FormControl, FormLabel} from "react-bootstrap";
import {AddWall} from './addWall';
import {GetWall} from './getWall';
import {Container} from "react-bootstrap";
import axios from "axios";

export const Wall = () => {

	const [posts, setPosts] = useState([]);
	
	const handleDelete = (async (authorId, id) =>
		{
				try{	
					await WallAPI.del(id).then(getPosts()).catch(e => console.error(e));
				}
				catch(e){
					console.log(e);
				}
		});
	
	
	const getPosts = async () => {
		let data = await WallAPI.get().then(res =>  res.data);
		setPosts(data);
	};

	useEffect( () =>
		{
			getPosts();
		}	
	, [posts]);

	return(
		<div >

			<AddWall/>

			<GetWall posts = {posts} handleDelete={handleDelete} />

		</div>
	)
}


