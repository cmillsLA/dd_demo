/*------ Global ------*/
// Matching passwords keyup false
$.validator.setDefaults({ onkeyup: false });

// Global Error Messaging.
function displayErr(page, type, customMsg) {
  $('.msg').remove();
  var msg = '';
  var msgClass = "msg msg-error";
  var genericErr = "There was a problem with your request, please try again later.";
  switch(page) {
    case "registration":
      if(type === "success") {
        msg = "Please check your email to activate your account.";
        msgClass = "msg msg-success";
      } else {
        msg = genericErr;
      }
      break;
    case "login":
      if(type != "success" && !customMsg) {
        msg = genericErr;
      } else {
        msg = customMsg;
      }
      break;
    case "advertise":
      if(type === "success") {
        msg = "Your message has been sent successfully.";
        msgClass = "msg msg-success";
      } else {
        msg = genericErr;
      }
      break;
    case "password":
      if(type === "success") {
        msg = "Your message has been sent successfully.";
        msgClass = "msg msg-success";
      } else {
        msg = genericErr;
      }
      break;
    case "twitter":
      if(type === "success") {
        msg = "The ad has been posted to your Twitter Account successfully.";
        msgClass = "msg msg-success";
      } else {
        if(!customMsg) {
          msg = "There was a problem posting an ad to your Twitter Account.";
        } else {
          msg = "There was a problem posting an ad to your Twitter Account." + customMsg;
        }
      }
      break;
  }
  $('.header').after('<div class="' + msgClass + '">' + msg + '</div>');
}

$(window).load(function() {
	if($('#container').hasClass('dNone')) {
    $('#loader').fadeOut(500);
    $('#header').fadeIn(500);
    $('#container').fadeIn(1000);
	}
});