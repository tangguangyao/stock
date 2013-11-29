var mongodb = require('../models/db');
var User = require('../models/user');
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
			user:req.session.user
		});
	}else{
		res.redirect('/login');
	}
}

setting.post=function(req,res){
	var Spec=req.body.Spec;
	var interest=req.body.interest;
	var tmp_path,target_path_big,target_path_small;
	if(req.files.thumbnail.size>0){
		tmp_path = req.files.thumbnail.path;
		// 指定文件上传后的目录 - 示例为"images"目录。
		// 重命名图片名字
		var picType=req.files.thumbnail.name.split(".");
		picType=picType[1];
		target_path_big = './public/images/user/big/pic_' + req.session.user.name+"."+picType;
		target_path_small = './public/images/user/small/pic_' + req.session.user.name+"."+picType;		
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
			  }
			});
			imageMagick(target_path_small)
			.resize(80, 80, '!') //加('!')强行把图片缩放成对应尺寸150*150！
			.autoOrient()
			.write(target_path_small, function(err){
			  if (err) {
			    console.log(err);
			  }
			});
		});
	}
}

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