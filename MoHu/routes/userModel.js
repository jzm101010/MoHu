var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: String,
	password: String
});

/*UserSchema.virtual('password').set(function (password) {
	this.hash_password = encryptPassword(password);
});

function encryptPassword(password) {
	return crypto.createHash('md5').update(password).digest('base64');
} */

UserSchema.method('authenticate', function (loginText) {
	return loginText === this.password;
});


exports.User = mongoose.model('User', UserSchema);