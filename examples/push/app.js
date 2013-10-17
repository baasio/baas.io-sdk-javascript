$(document).ready(function(){

	var setting = $('.__setting');

	setting
	.find('label').css('cursor','pointer').end()
	.find('.__target_id').attr('disabled',true).end()
	.find(':radio[name="target"]').bind('click',function(e){

		var target_value = $(this).val();

		var target_id = setting.find('.__target_id');

		target_id.attr({'disabled':(target_value === 'all')});

		switch(target_value){
			case 'all':
				target_id.attr({'placeholder':'disabled'}).val('');
			break;
			case 'user' :
				target_id.attr({'placeholder':'uuid'}).val('');
			break;
			case 'device' :
				target_id.attr({'placeholder':'device id'}).val('');
			break;
			case 'tag' :
				target_id.attr({'placeholder':'tag name'}).val('');
			break;
		}
	}).end()
	.find('.__send').bind('click',function(e){

		e.preventDefault();

		var options = {};

		//insert target
		options.target = setting.find(':radio[name="target"]:checked').val() || 'all';

		//insert 'uuid' or 'device id' or 'tag name'
		if(options.target !== 'all') {
			options.to = setting.find('.__target_id').val();
		}

		//setting payload
		var payload = options.payload = {};
		
		//payload message
		payload.alert = setting.find('.__message').val() || 'test';

		//payload badge(type = 'number')
		if(setting.find('.__badge').val()) payload.badge = setting.find('.__badge').val()*1;

		//payload sound
		if(setting.find('.__sound').val()) payload.sound = setting.find('.__sound').val();

		//payload reserve (ex:YYYYMMDDhhmm)
		if(setting.find('.__reserve').val()) options.reserve = setting.find('.__reserve').val();

		//select platform
		options.platform = setting.find(':radio[name="platform"]:checked').val() || 'I';

		//option memo
		if(setting.find('.__memo').val()) options.memo = setting.find('.__memo').val();

		var org_id 	= $('.__push_org_id').val();
    		var app_id 	= $('.__push_app_id').val();

    		var io    	= new Baas.IO({'orgName' : org_id, 'appName' : app_id});
		var push 	= new Baas.Push({'client':io});

		push.send(options, function(err, data, entity){
			if(err){
				$('.result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
			} else {
				$('.result_console').html('<pre>' + JSON.stringify(entity, null, 2) + '</pre>')
			}
		});	
	});
});