/*
登录,注册功能
*/

var mongodb = require('../models/db');
var crypto = require('crypto');
var User = require('../models/user');

var login={};
module.exports = login;

login.sign = function(req,res){
	//post信息中发送过来的name,password和repassword,用req.body获取
	var name = req.body.name, 
	password = req.body.password, 
	password_re = req.body['repassword']; 
	//后端判断两次注册的密码是否相等
	if(password_re != password){
		//如果密码不相等，将信息记录到页面通知flash,然后跳转到http://localhost:3000/
		req.flash('error','两次输入的密码不一致!');  
		return res.redirect('/login');
	}
	//对密码进行加密操作 
	var md5 = crypto.createHash('md5'); 
	password = md5.update(req.body.password).digest('hex'); 
	var newUser = new User({
		name: req.body.name, 
		password: password 
	}); 
	//使用user.js中的user.get() 函数来读取用户信息
	User.get(newUser.name, function(err, user){ 
		//如果有返回值，表示存在用户
		if(user){ 
			err = '用户已存在!'; 
		} 
		if(err){
			//如果报错，记录错误信息和页面跳转
			req.flash('error', err); 
			return res.redirect('/login'); 
		} 
		//使用user.js的user.save() 保存信息函数
		newUser.save(function(err,user){ 
			if(err){ 
				req.flash('error',err); 
				return res.redirect('/login'); 
			} 
			//成功后，将用户信息记录在页面间的会话req.session中，并且跳转到一个新页面，就是内容集中展示页面
			req.session.user = user; 
			req.flash('success','注册成功!'); 
			res.redirect('/'); 
		});
	});
};

login.log=function(req,res,callback){
	var md5 = crypto.createHash('md5'), 
      password = md5.update(req.body.password).digest('hex'); 
	var newUser = new User({ 
		name: req.body.name, 
		password: password 
	}); 
	//查找用户
	User.get(newUser.name, function(err, user){ 
		callback(user,password);
	}); 
};

login.login=function(req,res){
	login.log(req,res,changeUrl);
	function changeUrl(user,password){
		if(user){ 
			//如果存在，就返回用户的所有信息，取出password来和post过来的password比较
			if(user.password != password){ 
				req.flash('error','密码不正确');
				res.redirect('/login'); 
			}else{ 
				req.session.user = user; 
				res.redirect('/'); 
			} 
		}else{ 
			req.flash('error','用户不存在'); 
			res.redirect('/login'); 
		} 
	}
};

login.loginAjax=function(req,res){
	login.log(req,res,changeAjax);
	function changeAjax(user,password){
		if(user){
			//如果存在，就返回用户的所有信息，取出password来和post过来的password比较
			if(user.password != password){ 
				res.send({ok:false,message:"用户名或密码错误"}); 
			}else{ 
				req.session.user = user; 
				res.send({ok:true,info:{
					name:user.name,
					stock:user.stock,
					top:user.top
				}});
			} 
		}else{ 
			res.send({ok:false,message:"用户名或密码错误"});
		} 
	}
};

login.islogin=function(req,res){
	if(!req.session.user){
    res.render('login', { 
      error: req.flash('error').toString()
    });
  }else{
    res.redirect('/');
  }
};

login.loginOut=function(req,res){
	req.session.user = null;
	var data={};
	data.ok=true;
	res.send(data);
};

/*
*重构新增接口
*/
login.isOnline=function(req,res){
	if(req.session.user){
		res.send({ok:true,info:{
			name:req.session.user.name,
			stock:req.session.user.stock,
			top:req.session.user.top
		}});
	}else{
		res.send({ok:false});
	}
}