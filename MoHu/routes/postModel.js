var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PostSchema = new Schema({
	title: String,
	writer: String,
	content: String,
	comments: [{writer: String, comment: String, date: {type: Date, default: Date.now()}}],
	date: {type: Date, default: Date.now()}
});

exports.Post = mongoose.model('Post', PostSchema);