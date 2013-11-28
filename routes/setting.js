var mongodb = require('../models/db');
var User = require('../models/user');
// 移动文件需要使用fs模块
var fs = require('fs');

//国外插件
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });


var setting={};
module.exports = setting;

setting.show=function(req,res){
	if(req.session.user){
		res.render('setting', {
			user:req.session.user
		});
	}else{
		res.redirect('/login');
	}
}

setting.post=function(req,res){
	var Spec=req.body.Spec;
	var interest=req.body.interest;
	var tmp_path,target_path;
	if(req.files.thumbnail.size>0){
		tmp_path = req.files.thumbnail.path;
		// 指定文件上传后的目录 - 示例为"images"目录。
		// 重命名图片名字
		var picType=req.files.thumbnail.name.split(".");
		picType=picType[1];
		target_path = './public/images/user/pic_' + req.session.user.name+"."+picType;
		// 移动文件
		fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		//程序执行到这里，user文件下面就会有一个你上传的图片
		imageMagick(target_path)
		.resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
		.autoOrient()
		.write(target_path, function(err){
		  if (err) {
		    console.log(err);
		  }
		});
		});
	}
}