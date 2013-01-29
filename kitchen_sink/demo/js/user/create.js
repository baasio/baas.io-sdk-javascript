$(document).ready(function () {

  var newUser = {
    type: 'users',
    username: null,
    password: null,
    email: null
  };

  function confirmPassword(pass, cfmpass) {
    return pass == cfmpass;
  }

  function signup() {
    var equal = confirmPassword($('#pass1').val(), $('#pass2').val());

    if(!equal) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    newUser.password = $('#pass1').val();
    newUser.username = $('#name').val();
    newUser.email = $('#email').val();

    client.createEntity(newUser, function(err, user) {
      if(err) {
        //유저 생성 실패
      } else {
        //유저 생성 성공
        alert(user.get('username')); // User Name

        window.location = 'index.html';
      }
    });
  }

  $('#btn-save-signup').bind('click', signup);

});