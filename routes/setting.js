/*
用户设置页面功能
*/
var mongodb = require('../models/db');
var User = require('../models/user');
var crypto = require('crypto');
// 移动文件需要使用fs模块
var fs = require('fs');
//复制文件
var util = require("util");

//国外插件
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });

var setting={};
module.exports = setting;

setting.show=function(req,res){
	if(req.session.user){
		res.render('setting', {
			user:req.session.user,
			error: req.flash('error').toString()
		});
	}else{
		res.redirect('/login');
	}
};

setting.post=function(req,res){
	var name=req.session.user.name;
	var Spec=req.body.Spec;
	var interest=req.body.interest;
	var email=req.body.email;
	var tmp_path,target_path_big,target_path_small;
	if(req.files.thumbnail.size>0){
		tmp_path = req.files.thumbnail.path;
		// 指定文件上传后的目录 - 示例为"images"目录。
		// 重命名图片名字
		var picType=req.files.thumbnail.name.split(".");
		picType=picType[1];
		target_path_big = './public/images/user/big/pic_' + req.session.user.name+"."+picType;
		var bigUrl="user/big/pic_"+ req.session.user.name+"."+picType;
		target_path_small = './public/images/user/small/pic_' + req.session.user.name+"."+picType;
		var smallUrl="user/small/pic_"+ req.session.user.name+"."+picType;
		// 移动文件
		fs.rename(tmp_path, target_path_big, function(err) {
			if (err) throw err;
			//复制一份
			copyFile(target_path_big, target_path_small);
			//程序执行到这里，user文件下面就会有一个你上传的图片
			imageMagick(target_path_big)
				.resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
				.autoOrient()
				.write(target_path_big, function(err){
					if (err) {
						console.log(err);
						req.flash('error', err); 
						return res.redirect('/setting'); 
					}
				});
			imageMagick(target_path_small)
				.resize(80, 80, '!') //加('!')强行把图片缩放成对应尺寸150*150！
				.autoOrient()
				.write(target_path_small, function(err){
					if (err) {
						console.log(err);
						req.flash('error', err); 
						return res.redirect('/setting'); 
					}
				});
			var info={
				Spec:Spec,
				interest:interest,
				email:email,
				pic:{
					big:bigUrl,
					small:smallUrl
				}
			};
			//地址存入数据库
			User.setInfo(name,info,function(err,items){
				if(err){
					req.flash('error', err); 
					return res.redirect('/setting'); 
				}
				if(items>0){
					req.flash('error', "修改信息成功"); 
					req.session.user.info=info;
					res.redirect('/setting');
				}else{
					req.flash('error', err); 
					return res.redirect('/setting'); 
				}
			});
		});
	}else{
		fs.unlink(req.files.thumbnail.path, function(){
			var info={
				Spec:Spec,
				interest:interest,
				email:email,
				pic:req.session.user.info.pic
			};
			//地址存入数据库
			User.setInfo(name,info,function(err,items){
				if(err){
					req.flash('error', err); 
					return res.redirect('/setting'); 
				}
				if(items>0){
					req.flash('error', "修改信息成功"); 
					req.session.user.info=info;
					res.redirect('/setting');
				}else{
					req.flash('error', err); 
					return res.redirect('/setting');
				}
			});		
		});	
	}
};

setting.setPassword=function(req,res){
	var md5 = crypto.createHash('md5');
	var oldPassword = md5.update(req.body.oldPassword).digest('hex'),
			newPassword=req.body.newPassword,
			reNewPassword=req.body.reNewPassword,
			name=req.session.user.name;
	if(newPassword!==reNewPassword){
		req.flash('error', "两次密码不一致"); 
		return res.redirect('/setting'); 
	}
	var md52 = crypto.createHash('md5');
	newPassword=md52.update(newPassword).digest('hex');
	User.password(name,oldPassword,newPassword,function(err,message){
		if(err){
			req.flash('error', err); 
		}else{
			req.flash('error', message);
		}
		return res.redirect('/setting'); 
	});
};

/*
公共函数
*/
//复制文件
function copyFile(src, dst){
	var is = fs.createReadStream(src);
	var os = fs.createWriteStream(dst);
	//readable.pipe(destination, [options])
	//http://nodeapi.ucdok.com/#/api/stream.html
	is.pipe(os);
}


/*
*重构新加接口
*/
setting.showAjax=function(req,res){
	if(req.session.user){
		res.send({user:req.session.user,isOk:true});
	}else{
		res.send({isOk:false});
	}
};

setting.setPasswordAjax=function(req,res){
	var md5 = crypto.createHash('md5');
	var oldPassword = md5.update(req.body.oldPassword).digest('hex'),
			newPassword=req.body.newPassword,
			reNewPassword=req.body.reNewPassword,
			name=req.session.user.name;
	if(newPassword!==reNewPassword){
		return res.send({isOk:false,error:"两次密码不一致"}); 
	}
	var md52 = crypto.createHash('md5');
	newPassword=md52.update(newPassword).digest('hex');
	User.password(name,oldPassword,newPassword,function(err,message){
		if(err){
			res.send({isOk:false,error:"修改出错"});
		}else{
			res.send({isOk:true,error:"修改成功"}); 
		} 
	});
};


setting.postAjax=function(req,res){
	var name=req.session.user.name;
	var Spec=req.body.Spec;
	var interest=req.body.interest;
	var email=req.body.email;
	var tmp_path,target_path_big,target_path_small;
	if(req.files.thumbnail.size>0){
		tmp_path = req.files.thumbnail.path;
		// 指定文件上传后的目录 - 示例为"images"目录。
		// 重命名图片名字
		var picType=req.files.thumbnail.name.split(".");
		picType=picType[1];
		target_path_big = './public/images/user/big/pic_' + req.session.user.name+"."+picType;
		var bigUrl="user/big/pic_"+ req.session.user.name+"."+picType;
		target_path_small = './public/images/user/small/pic_' + req.session.user.name+"."+picType;
		var smallUrl="user/small/pic_"+ req.session.user.name+"."+picType;
		// 移动文件
		fs.rename(tmp_path, target_path_big, function(err) {
			if (err) throw err;
			//复制一份
			copyFile(target_path_big, target_path_small);
			//程序执行到这里，user文件下面就会有一个你上传的图片
			imageMagick(target_path_big)
				.resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
				.autoOrient()
				.write(target_path_big, function(err){
					if (err) {
						console.log(err);
						req.flash('error', err); 
						//return res.redirect('/setting'); 

						return res.redirect(req.headers.origin+"/"+req.query.r+"?status=2");
					}
				});
			imageMagick(target_path_small)
				.resize(80, 80, '!') //加('!')强行把图片缩放成对应尺寸150*150！
				.autoOrient()
				.write(target_path_small, function(err){
					if (err) {
						console.log(err);
						req.flash('error', err); 
						// return res.redirect('/setting');

    				return res.redirect(req.headers.origin+"/"+req.query.r+"?status=2");
					}
				});
			var info={
				Spec:Spec,
				interest:interest,
				email:email,
				pic:{
					big:bigUrl,
					small:smallUrl
				}
			};
			//地址存入数据库
			User.setInfo(name,info,function(err,items){
				if(err){
					req.flash('error', err); 
					//return res.redirect('/setting'); 
					return res.redirect(req.headers.origin+"/"+req.query.r+"?status=2");
				}
				if(items>0){
					req.flash('error', "修改信息成功"); 
					req.session.user.info=info;
					//res.redirect('/setting');
					return res.redirect(req.headers.origin+"/"+req.query.r+"?status=1");
				}else{
					req.flash('error', err); 
					//return res.redirect('/setting'); 
					return res.redirect(req.headers.origin+"/"+req.query.r+"?status=2");
				}
			});
		});
	}else{
		fs.unlink(req.files.thumbnail.path, function(){
			var info={
				Spec:Spec,
				interest:interest,
				email:email,
				pic:req.session.user.info.pic
			};
			//地址存入数据库
			User.setInfo(name,info,function(err,items){
				if(err){
					req.flash('error', err); 
					//return res.redirect('/setting'); 
					return res.redirect(req.headers.origin+"/"+req.query.r+"?status=2");
				}
				if(items>0){
					req.flash('error', "修改信息成功"); 
					req.session.user.info=info;
					//res.redirect('/setting');
					return res.redirect(req.headers.origin+"/"+req.query.r+"?status=1");
				}else{
					req.flash('error', err); 
					//return res.redirect('/setting');
					return res.redirect(req.headers.origin+"/"+req.query.r+"?status=2");
				}
			});		
		});	
	}
};