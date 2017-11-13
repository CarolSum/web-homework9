var express = require('express');
var router = express.Router();
var debug = require('debug')('signin:index');

var students={};

module.exports = function(db){

	var userManager = require('../models/user')(db);

	/* GET users listing. */
	router.get('/', function(req, res, next) {
	  res.render('signup',{user:{username:'', password:''}});
	});

	router.post('/', function(req, res,next){
	  console.log(req.body);
	  var user = req.body;
	  userManager.findUser(req.body.username, req.body.password)
	    .then(function(user){
	    	req.session.regenerate(function(err){
	    		if(err) console.log('req session regenerate failed');
	    		req.session.user = user;
	    		res.redirect('/detail');
	    	});
	    })
	    .catch(function(error){
	    	res.render('signup', {user:user, error:'用户名不存在或密码错误'});
	    })
	  /*
	  for(var key in students){
	  	if(students[key].username == user.username && students[key].password == user.password){
	  		console.log('login success!');
	  		console.log(user);
	  		req.session.user = {
	  			'username': students[key].username,
	  			'id': students[key].id,
	  			'email':students[key].email,
	  			'phone':students[key].phone,
	  			'password':students[key].password
	  		}
	  		res.redirect('/detail');
	  		
	  		return;
	  	}
	  }
	  res.render('signup', {user:user, error:'用户名不存在或密码错误'});
	  return;
	  */

	});

	router.get('/signout', function(req, res, next) {
		/*
	  console.log('begin delete session.user');
	  console.log(req.session.user);
	  delete req.session.user;
	  console.log('after delete session.user');
	  console.log(req.session.user);
	  res.redirect('/');
		*/
	  req.session.destroy(function(err){
	  	if(err){
	  		return;
	  	}
	  	res.clearCookie('skey');
	  	res.redirect('/');
	  });

	});


	router.get('/regist', function(req, res, next) {
	  showSignUp(res,{});
	  //res.render('../views/signin.jade', {user: {username:null},error:null});
	});

	router.post('/regist', function(req, res, next) {
	  var user = req.body;
	  userManager.checkUser(user)
	    .then(userManager.createUser(user))
	    .then(function(){
	    	console.log(user);
	    	req.session.user = user;
	    	res.redirect('/detail');
	    })
	    .catch(function(error){
	    	res.render('../views/signin.jade',{user:user,error:error})
	    })
	  /*
	  try{
		checkFileds(user);
		req.session.user = students[user.username] = user;
		console.log(req.session.user);
		//redirect
		res.redirect('/detail');
		//showDetail(res, user);
		return;
	  }catch(error){
		console.log(error);
		showSignUp(res, user, error.message);
	  }
	  //res.render('../views/signin.jade', {user: {username:null},error:null});
	  */
	});

	router.all('*', function(req, res, next){
	  req.session.user ? next():res.redirect('/');
	});

	router.get('/detail', function(req, res, next) {
	  //showDetail(res, req.session.user);
	  //res.render('../views/signin.jade', {user: {username:null},error:null});
	  console.log('begin: get user detail');
	  console.log(req.session.user);
	  res.render('../views/detail.jade', req.session.user);
	  console.log('after: get user detail');
	});

	return router;
};


function showSignUp(response, user, error){
	getPage(response, '../views/signin.jade', {user:user,error:error});
}


function showDetail(response, user){
	getPage(response, '../views/detail.jade', user);
}



function getPage(response, url, data){
	console.log('sss');
	response.render(url, data);
	return;
}

function checkFileds(user){
	var errs = [];
	if(!user.username || !/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(user.username)){
		errs.push('用户名：6-18位数字、字母或下划线，必须以字母开头');
	}
	if(!user.id || !/^[1-9][0-9]{7}$/.test(user.id)){
		errs.push('学号：8位数字，不能以0开头');
	}
	if(!user.phone || !/^[1-9][0-9]{10}$/.test(user.phone)){
		errs.push('电话：11位数字，不能以0开头');
	}
	if(!user.email || !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)$/.test(user.email)){
		errs.push('邮箱：格式非法');
	}
	if(!user.password || !/^[a-zA-Z0-9_\-]{6,12}$/.test(user.password)){
		errs.push('密码：6-12位数字、字母、中划线或下划线');
	}
	if(!user.re_password || user.re_password!=user.password){
		errs.push('两次密码输入不一致');
	}
	for(var key in students){
		if(user.username == students[key].username){
			errs.push('用户名重复');
		}
		if(user.id == students[key].id){
			errs.push('学号重复');
		}
		if(user.phone == students[key].phone){
			errs.push('手机号重复');
		}
		if(user.email == students[key].email){
			errs.push('邮箱重复');
		}
	}
	if(errs.length > 0) throw Error(errs.join(','));
}

