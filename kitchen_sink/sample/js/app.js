$(document).ready(function () {

	var appUser;
	var myCollection;

	var client = new Baas.IO({
		//baas.io ID
		orgName: '6666a80e-31ed-11e2-a2c1-02003a570010',
		//Application ID
		appName: 'e9fcb221-384f-11e2-a2c1-02003a570010',
		logging: true,
		buildCurl: true
	});

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
               // showFullFeed();
              }
            }
          });

          //clear out the login form so it is empty if the user chooses to log out
          $("#username").val('');
          $("#password").val('');

          //default to the full feed view (all messages in the system)
          showMyCollection();
        }
      });
  }

  function drawItems(collection) {
  	var html = '';

  	while(collection.hasNextEntity()) {
      var entity = collection.getNextEntity(),
		      created = entity.get('created'),
		      name = entity.get('name'),
		      price = entity.get('price');

		  html += '<li><a href="acura.html">'+ name +'</a></li>';
  	}

    if (html == "") { html = "No Entitiy"; }
    $("#entities").html(html).listview('refresh');

    //next show the next / previous buttons
    if (collection.hasPreviousPage()) {
      $("#previous-btn-container").show();
    } else {
      $("#previous-btn-container").hide();
    }
    if (collection.hasNextPage()) {
      $("#next-btn-container").show();
    } else {
      $("#next-btn-container").hide();
    }
  }

  function prettyDate(createdDateValue) {
    var diff = (((new Date()).getTime() - createdDateValue) / 1000)
    var day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
      return 'just now';

    return fred = day_diff == 0 && (
      diff < 60 && "just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
      day_diff == 1 && "Yesterday" ||
      day_diff < 7 && day_diff + " days ago" ||
      day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
  }

  function showMyCollection() {
    if (!isLoggedIn()) return;

    //make sure we are on the messages page
    window.location = "#page-collection";

    // fullFeedView = false;
    // $('#btn-show-full-feed').removeClass('ui-btn-up-c');
    // $('#btn-show-my-feed').addClass('ui-btn-up-c');

    if (myCollection) {
      myCollection.resetPaging();
      myCollection.fetch(function (err) {
        if (err) {
          alert('Could not get user feed. Please try again.');
        } else {
        	console.log(JSON.stringify(myCollection, null, 2));
          drawItems(myCollection);
        }
      });
    } else {
      // 컬렉션이 없는 경우
      var options = {
        // type:'user/me/feed',
        type:'mycollections',
        qs:{"ql":"order by created desc"}
      }
      client.createCollection(options, function(err, collectionObj){
        if (err) {
         alert('Could not get user feed. Please try again.');
        } else {
          myCollection = collectionObj;
        	console.log(JSON.stringify(myCollection, null, 2));
          drawItems(myCollection);
        }
      });
    }
  }

	$('#btn-login').bind('click', login);

});