import mongoose = require("mongoose");


const wallSchema = new mongoose.Schema(

	{
		authors: [{
			type: String,
			required: true
		}],

		title: {
			type: String,
			required: true
		},

		body: {
			type: String,
			required: true
		},

		timestamp: {
			type: Date,
			required: true,
			default: Date.now
		},

		visible: {
			type: Boolean,
			required: true,
			default: false
		}
	}
);

export const Wall = mongoose.model("Wall", wallSchema);
