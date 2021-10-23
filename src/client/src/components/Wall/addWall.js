import React, {useState, useContext} from "react";
import {UserContext} from "../PrivateRoute.js"; 
import {Button, FormGroup, FormControl, FormLabel} from "react-bootstrap";
import WallAPI from "../../utils/WallAPI";
import API from "../../utils/API";


export const AddWall = (props) => {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');

	const onChange = (fun, e) => {
		fun(e.target.value);
	};

	const onSubmit = e => {
		e.preventDefault();

		if (!title || title.length === 0) return;
		if (!body || body.length === 0) return;

		try{
			const data = WallAPI.add({title : title, body : body});
			setTitle("");
			setBody("");

		} catch (error){
			console.error(error);
		}
		};

		return (
			<div className = "AddPost">

			<FormGroup controlId="title" >
			  <FormLabel> Titre </FormLabel>
			
			  <FormControl
				autoFocus
				type="text"
				value = {title}
				onChange = {(e) => {onChange(setTitle, e)}}
			/>
			</FormGroup>
			

			<FormGroup controlId="body" >
			  <FormLabel> Body </FormLabel>
			
			  <FormControl
				autoFocus
				as="textarea"
				rows={3}
				value = {body}
				onChange = {(e) => {onChange(setBody, e)}}
			/>
			</FormGroup>

			<Button onClick={onSubmit} block type="submit">
			Ajouter un post
			</Button>

			</div>
		);
	};




