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
					}else{
						alert(data.message);
					}
				});
			});
		}
	}
})();

stock.header.init();