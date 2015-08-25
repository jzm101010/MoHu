var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var usermodel = require('./userModel');
var postmodel = require('./postmodel');
var Post = postmodel.Post;
var User = usermodel.User;

mongoose.connect('mongodb://localhost/MoHu');



router.post('/', function (req, res, next) {
	User.findOne({username:req.body.username}, function (err, user) {
		if(err){
			return res.json({err:err});
		}
		if(!user) {
			return res.json({err: '用户名不存在'});
		}
		if(!user.authenticate(req.body.password)){
			return res.json({err:'密码错误'});
		}
		res.json(user);
	});
});


router.post('/register', function (req, res, next) {
	var password_re = req.body.password_re;
	if(password_re != req.body.password){
		return res.json({err: '密码不一致！'})
	}
	var newUser = new User(req.body);
	User.findOne({username: req.body.username}, function (err, user) {
		if (err) {
			return res.json({err:err});
		}
		if (user) {
			return res.json({err: '用户名已存在'});
		}
		newUser.save(function (err, user) {
			if(err) {
				return res.json({err:err});
			}
			res.json({status: 'done'});
		}) ;
	});
});

router.get('/posts', function (req, res, next) {
	Post.find({}).sort({date: -1}).exec(function (err, docs) {
		res.json(docs);
	});
});

router.post('/post/add', function (req, res,next) {
	var newPost = new Post(req.body);

	newPost.save(function (err, docs) {
		res.json({status: 'done'});
	});
});

router.get('/post/:_id', function (req, res, next) {
	var _id = req.params._id;

	Post.findOne({_id: _id}).exec(function (err, docs) {
		res.json(docs);
	});
});

router.post('/post/:_id/comment', function (req, res, next) {
	var _id = req.params._id;
	var comment = req.body;

	Post.update({_id: _id}, {$push: {comments: comment}}).exec(function (err, docs) {
		res.json({status: 'done'});
	});
});

router.get('*', function (req, res, next) {
	res.sendfile('app/index.html');
});

module.exports = router