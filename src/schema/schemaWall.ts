import mongoose = require("mongoose");


const wallSchema = new mongoose.Schema(

	{
		authorPseudo:{
			type : String,
			required : true
		},

		title:{
			type : String,
			required : true
		},

		body:{
			type: String,
			required : true
		}
	},

	{timestamps: true}
	
);

export const Wall = mongoose.model("Wall", wallSchema);
