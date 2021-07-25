const mongoose = require("mongoose");


const wallSchema = mongoose.Schema(

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

module.exports = mongoose.model("Wall", wallSchema);
