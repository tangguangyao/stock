var assert = require("assert");
var should = require('should');

// var talk= require('../../routes/talk');
var User = require('../../models/user');

var mongodb = require('../../models/db');
var connect=require('../../models/connect');

describe('models user', function(){
	var key = new Date().getTime() + '_' + Math.random();
	var name="test"+key;
	var user=new User({name:name,password:1,admin:100});
	var name2="test"
	var user2=new User({name:name2,password:1,admin:100});
	//先创建测试用户
	before(function () {
    //留下50毫秒等待连接上数据库，存在一个全局变量global.db
    setTimeout(function () {
  		user.save(function (err, _user) {});
  		user2.save(function (err, _user) {});
    },100);
	});
	//删除测试用户
	after(function () {
    global.db.collection('user',function(err,collection){
    	collection.remove({admin:100},function(err){});
    });
  });

	//读取用户信息
	describe('User.get', function(){
  	it('get name', function (done) {
      //留下50毫秒+10毫秒等待连接上数据库和创建完成用户，存在一个全局变量global.db
      setTimeout(function () {
        User.get(name, function (err,user) {
          should.not.exist(err);
          user.name.should.equal(name);
          user.admin.should.equal(100);
          done();
        });
      },110);
    });

    it('get name empty', function (done) {
    	var emptyName=name+ Math.random();
      User.get(emptyName, function (err,user) {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });
    
  })

	//点击股票关注，更新表
	describe('User.stockUp', function(){
  	it('stockUp add ok', function (done) {
      User.stockUp({name:name},'sh600171',true, function (err,items) {
        should.not.exist(err);
        items.should.equal(1);
        done();
      });
    });

    it('stockUp notadd ok', function (done) {
    	User.stockUp({name:name},'sh600171',false, function (err,items) {
        should.not.exist(err);
        items.should.equal(1);
        done();
      });
    });
  })
	//关注用户
	describe('User.watch', function(){
  	it('watch add and no watch ok', function (done) {
      User.watch(true,name,[],name2,function (err,items) {
        should.not.exist(err);
        items.ok.should.equal(true);
        done();
      });
    });

    it('watch add and watch ok', function (done) {
    	User.watch(true,name,[name2],name2,function (err,items) {
        should.not.exist(err);
        items.ok.should.equal(false);
        items.message.should.equal("您已经关注该用户");
        done();
      });
    });

    it('watch add and watch people not exist', function (done) {
    	User.watch(true,name,[name2],'tang12121212',function (err,items) {
        should.not.exist(err);
        items.ok.should.equal(false);
        items.message.should.equal("该用户不存在");
        done();
      });
    });

    it('watch notadd and no watch ok', function (done) {
      User.watch(false,name,[],name2,function (err,items) {
        should.not.exist(err);
        items.should.equal(1);
        done();
      });
    });

    it('watch notadd and watch people not exist', function (done) {
    	User.watch(false,name,[name2],'tang12121212',function (err,items) {
        should.not.exist(err);
        items.ok.should.equal(false);
        items.message.should.equal("该用户不存在");
        done();
      });
    });
  })
	
	//是否是关注用户
	describe('User.isWatch', function(){
		it('isWatch no', function (done) {
			User.isWatch(name,name2,function (items) {
				items.should.equal(false);
				done();
			});
		});

		it('isWatch yes', function (done) {
			User.watch(true,name,[],name2,function (err,items) {
				User.isWatch(name,name2,function (items) {
					items.should.equal(true);
					done();
				});
			});
		});
	})
	
	//name关注的用户
	describe('User.watchPage', function(){
		it('watchPage yes', function (done) {
			User.watchPage(name,function (err, user) {
				should.not.exist(err);
				user.admin.should.equal(100);
				done();
			});
		});

		it('watchPage error', function (done) {
			User.watchPage(name+"122",function (err, user) {
				should.not.exist(err);
				should.not.exist(user);
				done();
			});
		});
	})

  //热门用户
  describe('User.hotPeople : get hot people', function(){
    it('hotPeople yes', function (done) {
      User.hotPeople(function (items) {
        if(items){
          items.length.should.be.above(0);
          done();
        }else{
          done();
        }
      });
    });
  });

  //更新用户信息
  describe('User.setInfo : set info of user', function(){
    it('setInfo yes', function (done) {
      var info={
        Spec: "test",
        email: "test",
        interest: "test",
        pic: {
          big: "/user/big/test.jpg",
          small: "user/small/test.jpg"
        }
      }
      User.setInfo(name,info,function (err,items) {
        should.not.exist(err);
        items.should.equal(1);
        done();
      });
    });
  });

  //修改密码
  describe('User.password : change password', function(){
    it('old password is ok', function (done){
      User.password(name,1,2,function (err,items) {
        should.not.exist(err);
        items.should.equal("修改成功");
        done();
      });
    });

    it('old password is err', function (done){
      User.password(name,1,2,function (err,items) {
        should.not.exist(err);
        items.should.equal("原始密码不正确");
        done();
      });
    });
  });
})

