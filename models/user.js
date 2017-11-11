var bcrypt = require('bcrypt-as-promised');

module.exports = function(db){
	var users = db.collection('users');

	return {
		findUser: function(username, password){
			return users.findOne({username:username}).then(function(user){
				return user ? bcrypt.compare(password, user.password).then(function(){
					return user;
				}) : Promise.reject("user doesn't exist");
			})
		},
		createUser: function(user){
			return bcrypt.hash(user.password, 10).then(function(hash){
				user.password = hash;
				user.re_password = hash;
				return users.insert(user);
			})
		},
		checkUser: function(user){
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
			var formatErrors = errs.join(',');
			return new Promise(function(resolve, reject){
				formatErrors ? reject(formatErrors):resolve(user);
			}).then(function(user){
				console.log('check user repeat.');
				return users.findOne({$or:[{username:user.username},
					{id:user.id},{phone:user.phone},{email:user.email}]}).then(function(curUser){
					return curUser ? Promise.reject("User isn't unique"):Promise.resolve(user);
				})	
			})
		},
	}
}

