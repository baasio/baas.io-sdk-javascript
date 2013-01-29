var client = new Baas.IO({
  orgName: window.YOUR_BAAS_IO_ID, //baas.io ID
  appName: window.YOUR_BAAS_APP_ID, //Application ID
  logging: true,
  buildCurl: true
});

$(document).ready(function () {

	var appUser;
	var myCollection;

	function isLoggedIn() {
    if (!client.isLoggedIn()) {
      window.location = "#page-login";
      return false;
    }
    return true
  }

	function login() {
    var username = $("#username").val();
    var password = $("#password").val();

    client.login(username, password,
      function (err) {
        if (err) {
          // 로그인 실패
        } else {
          // 로그인 성공
          client.getLoggedInUser(function(err, data, user) {
            if(err) {
              //error - could not get logged in user
            } else {
              if (client.isLoggedIn()){
                appUser = user;
              }
            }
          });

          //clear out the login form so it is empty if the user chooses to log out
          $("#username").val('');
          $("#password").val('');
        }
      });
  }

  $('#btn-login').bind('click', login);

});