var stock=stock||{};

stock.header=(function(){
	return {
		init:function(){
			this.loginOut();
			this.headerLogin();
		},
		loginOut:function(){
			$("#loginOut").on("click",function(){
				$.getJSON('/loginOut', function(data){
					if(data.ok){
						if($("#loginOut").attr("loginOut")){
							window.location.href='/login';
							return;
						}
						$("#islogin").hide();
						$("#isloginOut").show();
						$("#headShowName").attr("login","out");
						$("#butIswatch").show();
						$("#butNowatch").hide();
					}
				});
			});
		},
		headerLogin:function(){
			$("#headerLogin").on("click",function(){
				$.post('/loginAjax',{
					name:$("#headName").val(),
					password:$("#headPassword").val()
				},function(data){
					if(data.ok){
						$("#islogin").show();
						$("#isloginOut").hide();
						$("#headShowName").text(data.info.name).attr("top",data.info.top).attr("login","in");
						//自定义事件
						if($("#iswatch").length>0){
							$("#iswatch").trigger('loginWatch', [data.info.stock]);
						}
					}else{
						alert(data.message);
					}
				});
			});
		}
	};
})();

stock.header.init();