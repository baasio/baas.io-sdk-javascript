$(document).ready(function(){

  $('.myTab li').each(function(i,element){
    $(element).bind('click',function(e){
      $(this).tab('show')
    })
  })
  
  $('.upload_start').click(function(e){

    e.preventDefault();

    var org_id      = $('.upload_org_id').val();
    var app_id      = $('.upload_app_id').val();
    var file_upload = $('.file_upload');

    var io    = new Baas.IO({'orgName' : org_id, 'appName' : app_id});
    var file  = new Baas.File({'client':io});

    file.upload({'file':file_upload},function(err, data, entity){
      $('#upload > .result_console').html('<pre>' + JSON.stringify(data, null, 2) + '</pre>')
    })
  })

  $('.download_start').click(function(e){

    e.preventDefault();

    var org_id      = $('.download_org_id').val();
    var app_id      = $('.download_app_id').val();
    var file_uuid   = $('.file_uuid').val();

    var io    = new Baas.IO({'orgName' : org_id, 'appName' : app_id});
    var file  = new Baas.File({'client':io, 'data':{'uuid':file_uuid} });

    file.download(function(err, entity){
      $('#download > .result_console').html('<pre>' + JSON.stringify(entity, null, 2) + '</pre>')
    })
  })
})