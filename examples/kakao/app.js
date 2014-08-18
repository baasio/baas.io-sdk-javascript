$(document).ready(function(){
	
	$('.__kakao_login_btn').bind('click',function(e){
		e.preventDefault();

		if( $('.__kakao_key').val() === ''){
			alert('Kakao App Key를 입력해 주세요.');
			return;
		}

		var kakao_app_key = $('.__kakao_key').val();

		Kakao.init(kakao_app_key);

		Kakao.Auth.login({
			success: function(authObj) {
				$('.__kakao_token').val(authObj.access_token);
			},
			fail:function(errorObj){
				alert('Kakao Token을 가지고 오는 실패했습니다.');
			},
			always:function(obj){
			}
		});
	});

	var signup = $('#signup');

	signup
	.find('.__sign_up_btn').bind('click',onSign)

	var signin = $('#signin');

	signin
	.find('.__sign_in_btn').bind('click',onSign)

	function onSign(e){

		e.preventDefault();

		if($('.__auth').val() === ''){
			alert('Baas.io Token 을 입력해 주세요.');
			return;
		}

		if($('.__org_id').val() === ''){
			alert('baas.io ID or Name 을 입력해 주세요.');
			return;
		}

		if($('.__app_id').val() === ''){
			alert('Application ID or Name 을 입력해 주세요.');
			return;
		}

		if($('.__kakao_token').val() === ''){
			alert('Kakao Token 을 입력해 주세요.');
			return;
		}

		var baas_token = $('.__auth').val()
		,org_id 	= $('.__org_id').val()
		,app_id 	= $('.__app_id').val()
		,kakao_data = {
    			'kkt_access_token' : $('.__kakao_token').val()
    		}

    		var io 	= new Baas.IO({
    			'orgName' : org_id, 
    			'appName' : app_id, 
    			'token':baas_token
    		});

    		if($(e.currentTarget).hasClass('__sign_up_btn')){
    			io.kakao_signup(kakao_data,function(err, data){
	    			
	    			signup.find('#signup_json .result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');

	    			var node = JsonHuman.format(data);
	    			$(node).addClass('table table-bordered')
	    			$('#signup_table .result_table').html(node);

			})
    		} else {
    			io.kakao_signin(kakao_data,function(err,data){
	    			signin.find('#signin_json .result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>');

	    			var node = JsonHuman.format(data);
	    			$(node).addClass('table table-bordered')
	    			$('#signin_table .result_table').html(node);
			})
    		}
	}

});