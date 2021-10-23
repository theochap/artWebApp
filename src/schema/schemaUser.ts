import mongoose = require("mongoose");
import passwordHash = require("password-hash");
import jwt = require("jwt-simple");
import {Config} from "../config/config";

const userSchema = new mongoose.Schema(

	{
		pseudo:{
			type : String,
			required: true,
			unique: true
		},

		email:{
			type : String,
			lowercase: true,
			trim: true,
			unique: true,
			required: true
		},

		password: {
			type: String,
			required: true
		}
	},
	
	{ timestamps: {createdAt: "created_at"} }
	
);

userSchema.methods = {
	authenticate : function(password){
		return passwordHash.verify(password, this.password);

	},
	getToken: function() {
		const data = { id: this._id }; 
		return jwt.encode(data, Config.secret);
	},


};

export const User = mongoose.model("User", userSchema);
