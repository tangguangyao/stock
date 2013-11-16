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
						$("#islogin").hide();
						$("#isloginOut").show();
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
						$("#headShowName").text(data.info.name);
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
	}
})();

stock.header.init();