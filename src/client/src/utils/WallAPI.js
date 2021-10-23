import axios from "axios";

const headers = {
	"Content-Type": "application/json"
};

const burl = "http://localhost:8080";

export default {
	add: function(data){
		const {title, body, authorId} = data;
		console.log(title);
		console.log(body);
		console.log(authorId);
		return axios.post(
			`${burl}/wall/add`,
			{
				title,
				body,
				authorId
			},
			{
				headers:headers
			}
		);
	},

	get: function(){
		return axios.get(`${burl}/wall/get`);

	},

	del: function(id)
	{
		return axios.post(`${burl}/wall/del`,
			{
				id
			},
			{
				headers:headers
			}
		);
	}
};

