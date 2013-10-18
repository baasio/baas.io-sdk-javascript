$(document).ready(function(){

	var baas_get = $('#get');

	baas_get
	.find('.__run_query').bind('click',function(e){

		e.preventDefault();

		var org_id 	= $('.__org_id').val();
    		var app_id 	= $('.__app_id').val();

    		var io    	= new Baas.IO({'orgName' : org_id, 'appName' : app_id});

    		var endpoint = baas_get.find('.__path').val();

    		var options = {
	     	method:'GET',
	     	endpoint:endpoint
		};

		io.request(options, function (err, data) {
	      	baas_get.find('.result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
	    });
	})

	var baas_post = $('#post');

	baas_post
	.find('.__run_query').bind('click',function(e){

		e.preventDefault();

		var org_id 	= $('.__org_id').val();
    		var app_id 	= $('.__app_id').val();

    		var io    	= new Baas.IO({'orgName' : org_id, 'appName' : app_id});

    		var endpoint = baas_post.find('.__path').val();

    		var data = baas_post.find('.__body').val();
    		data = JSON.parse(data);

    		var options = {
	     	method:'POST',
	     	endpoint:endpoint,
	     	body:data
		};

		io.request(options, function (err, data) {
	      	baas_post.find('.result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
	    });
	})

	var baas_put = $('#put');

	baas_put
	.find('.__run_query').bind('click',function(e){

		e.preventDefault();

		var org_id 	= $('.__org_id').val();
    		var app_id 	= $('.__app_id').val();

    		var io    	= new Baas.IO({'orgName' : org_id, 'appName' : app_id});

    		var endpoint = baas_put.find('.__path').val();

    		var data = baas_put.find('.__body').val();
    		data = JSON.parse(data);

    		var options = {
	     	method:'PUT',
	     	endpoint:endpoint,
	     	body:data
		};

		io.request(options, function (err, data) {
	      	baas_put.find('.result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
	    });
	})

	var baas_delete = $('#delete');

	baas_delete
	.find('.__run_query').bind('click',function(e){

		e.preventDefault();

		var org_id 	= $('.__org_id').val();
    		var app_id 	= $('.__app_id').val();

    		var io    	= new Baas.IO({'orgName' : org_id, 'appName' : app_id});

    		var endpoint = baas_delete.find('.__path').val();

    		var options = {
	     	method:'DELETE',
	     	endpoint:endpoint,
		};

		io.request(options, function (err, data) {
	      	baas_delete.find('.result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
	    });
	})

	var baas_login = $('#login');

	baas_login
	.find('.__run_query').bind('click',function(e){

		e.preventDefault();

		var org_id 	= $('.__org_id').val();
    		var app_id 	= $('.__app_id').val();

    		var io    	= new Baas.IO({'orgName' : org_id, 'appName' : app_id});

    		var username = baas_login.find('.__username').val();
    		var password = baas_login.find('.__password').val();

		io.login(username, password, function (err, data) {
			io.token = null;
	      	baas_login.find('.result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
	    });
	})
});