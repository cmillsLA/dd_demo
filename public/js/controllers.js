'use strict';

angular.module('dd.controllers', [])
	.controller('activate', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {

    $('.home').hide();
    $('.logout').hide();
    $('.login').show();

  }])
  .controller('password', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {
    
    $scope.setupPassword = function() {
      console.log('setup password');
      $('.msg').remove();
      $('.home').hide();
      $('.logout').hide();
      $('.login').show();

      // Login validation.
      $('#passwordForm').validate({
        rules: {
          passwordEmail: {
            required: true,
            minlength: 2,
            email: true
          }
        },
        messages: {
          passwordEmail: {
            required: "Please enter an email address.",
            minlength: "Please enter a valid email address.",
            email: "Please enter a valid email address."
          }
        }
      });

    };

    // Submit Login Form
    $scope.password = function() {
      if($('#passwordForm').valid()) {
        $.ajax({
          crossOrigin: true,
          type: 'GET',
          url:'demourl/api/password?email=' + $('#passwordEmail').val(),
          success: function(d) {
            displayErr('password', 'success');
            $('#password-wrap').html('<p>Please follow the link in your email address to reset your password.</p>')
          },
          error: function(d) {
            displayErr('password', 'error');
          }
        });
        return false;
      }
    };

    $scope.setupPassword();

  }])
  .controller('advertise', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {

    $scope.setupAdvertise = function() {
      $('.home').show();
      $('.logout').show();
      $('.login').hide();
      $('#advertise-form').validate({
        rules: {
          advertiseName: {
            required: true,
            minlength: 2
          },
          advertiseEmail: {
            required: true,
            minlength:2,
            email: true
          },
          advertiseMsg: {
            required: true,
            minlength:2
          }
        },
        messages: {
          advertiseName: {
            required: "Please enter your name.",
            minlength: "Please enter a valid name."
          },
          advertiseEmail: {
            required: "Please enter an email address.",
            minlengh: "Please enter a valid email address."
          },
          advertiseMsg: {
            required: "Please enter a message.",
            minlengh: "Please enter a message."
          }
        }
      });
    };

    $scope.advertise = function() {
      if($('#advertise-form').valid()) {
        var advObj = {
          name: $('#advertiseName').val(),
          email: $('#advertiseEmail').val(),
          company: $('#advertiseCompany').val(),
          message: $('#advertiseMsg').val()
        };
        $.ajax({
          type: "POST",
          //contentType: "application/json; charset=UTF-8",
          //dataType: "json",
          url: 'demourl/api/advertise',
          data: JSON.stringify(advObj),
          crossOrigin: true,
          success: function(d) {
            displayErr('advertise', 'success');
            $('#advertise-wrap').html('<p>Thank you, your message has been sent.  We will respond within two business days.</p>');
          },
          error: function(d) {
            displayErr('advertise', 'error');
          }
        });
      }
    };

    $scope.setupAdvertise();

  }])
  .controller('category', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {

    $scope.setupCategory = function() {
      $('.home').show();
      $('.logout').show();
      $('.login').hide();
    };

    $scope.setupCategory();

  }])
  .controller('help', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {

    $scope.setupHelp = function(showBtns) {
      if(showBtns) {
        $('.home').show();
        $('.logout').show();
        $('.login').hide();
      } else {
        $('.home').hide();
        $('.logout').hide();
        $('.login').show();
      }
    };

    $scope.setupHelp();

  }])
  .controller('points', [ '$rootScope', '$scope', '$http', '$location', '$timeout', function( $rootScope, $scope, $http, $location, $timeout) {

    $scope.setupPoints = function() {
      $('.home').show();
      $('.logout').show();
      $('.login').hide();
    };

    $scope.setupPoints();

  }])
  .controller('revenue', [ '$rootScope', '$scope', '$http', '$location', '$timeout', '$compile', function( $rootScope, $scope, $http, $location, $timeout, $compile) {

    $scope.setupRevenue = function() {
      $('.home').show();
      $('.logout').show();
      $('.login').hide();
    };

    $scope.setupRevenue();

  }])
	.controller('global', [ '$rootScope', '$scope', '$http', '$location', '$compile', function( $rootScope, $scope, $http, $location, $compile) {

    $scope.logOut = function() {
      $.removeCookie('dd.sess', { path: '/' });
      $('.logout').hide();
      $('.home').hide();
      $('.login').hide();
      $location.path('/login').replace();
      $http.get('/logout');
		};

    $scope.login = function() {
      $location.path('/login').replace();
    };

    $scope.showOverlay = function() {

      var html = '<div id="overlay">';
      html += '<div class="overlay-content">';
      html += '<h4></h4>';
      html += '<div class="overlay-container"></div>';
      html += '<div class="btn btn-cancel" data-role="button" id="overlay-cancel" ng-click="hideOverlay()"><span>Cancel</span></div>';
      html += '</div>';
      html += '</div>';

      $compile(html)($scope).appendTo($('#page'));

    };

    $scope.hideOverlay = function() {
      $('#page #overlay').fadeOut(500, function() {
        $(this).remove();
      });
    };

	}])
	.controller('dashboard', [ '$rootScope', '$scope', '$http', '$location', '$window', '$compile', 'twitter', function ($rootScope, $scope, $http, $location, $window, $compile, Twitter) {

    $scope.setupDashboard = function() {
      $('.home').fadeIn();
      $('.logout').fadeIn();
      $('.login').hide();
    };

    $scope.twitterDisplay = function() {
      $scope.showOverlay();
      var html = '<form>';
      html += '<label>Additional message (optional):</label>';
      html += '<textarea maxlength="40" id="twitter-msg"></textarea>';
      html += '<p>* You may post up to one ad per day.</p>';
      html += '<div class="btn lt-green-gradient" data-role="button" id="overlay-submit" ng-click="twitterPost()"><span>Post to Twitter</span></div>';
      html += '</form>';
      $compile(html)($scope).appendTo($('#overlay .overlay-container'));
      $('#overlay h4').html('Post an Ad to Twitter*');
    };

    $scope.twitterPost = function() {

      var msg = $('#twitter-msg').val();
      if(!msg) { msg = null; }
      var _scope = $scope;

      $('#loader').addClass('ajax');

      $http.get('/api/twitter/post/' + msg).
        success(function(d,s,h,c) {
          // User has not authorized Twitter.
          if(d.success === true) {
            _scope.twitterSuccess();
          } else {
            // Error.
            $('#loader').removeClass('ajax');
            if(d.message && d.message.data) {
              var errMsg = JSON.parse(d.message.data);
              errMsg.errors[0] && errMsg.errors[0].message ? errMsg =  '  Error: ' + errMsg.errors[0].message : '';
              displayErr('twitter', 'error', errMsg);
            } else {
              displayErr('twitter', 'error');
            }
            _scope.hideOverlay();
          }
          $('#loader').removeClass('ajax');
        }).
        error(function(d,s,h,c) {
          displayErr('twitter', 'error', d.message);
          _scope.hideOverlay();
          $('#loader').removeClass('ajax');
        });

    };

    $scope.twitterSuccess = function() {
      // TODO Disable twitter button.
      $('.overlay-container').html('<p>The ad has been successfully posted to your Twitter Account.</p>');
      $('#overlay-cancel span').html('Close');
      displayErr('twitter', 'success');
      setTimeout($scope.hideOverlay, 4000);
    };

    $scope.twitter = function(e) {
      $('.msg').remove();
      e.preventDefault();
      var _scope = $scope;
      var promise = Twitter.verifyUser();
      promise.then(function(d) {
        console.log(d);
        _scope.twitterDisplay();
      }, function(d) {
        console.log(d);
        $window.location.href = '/auth/twitter';
      });
    };

    $scope.setupDashboard();

  }])
  .controller('login', [ '$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {

  $scope.setupLogin = function() {
    $('.msg').remove();
    $('.home').hide();
    $('.logout').hide();
    $('.login').hide();

    $('#loginAccordion').accordion();

    // Validate password strength
    /*jQuery.validator.addMethod("pwStrength", function(value, element) {
     var _pwAll = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/;
     return _pwAll.test(value);
     }, "Please check your password strength.");*/

    // Login validation.
    $('#loginForm').validate({
      rules: {
        loginUser: {
          required: true,
          minlength: 2,
          email: true
        },
        loginPW: {
          required: true,
          minlength:2
        }
      },
      messages: {
        loginUser: {
          required: "Please enter your username.",
          minlength: "Please enter a valid username.",
          email: "Username must be a valid email address."
        },
        loginPW: {
          required: "Please enter a password.",
          minlengh: "Please enter a valid password."
        }
      }
    });
    // Signup Validation.
    jQuery.validator.addMethod("matchers", function(value, element) {
      return $('#signupPW').val() == $('#signupPWVerify').val();
    }, "Passwords do not match.");

    $('#signupForm').validate({
      rules: {
        signupUser: {
          required: true,
          minlength: 2,
          email: true
        },
        signupPW: {
          required: true,
          minlength:2,
          matchers: true
        },
        signupPVerifyW: {
          required: true,
          minlength:2,
          matchers: true
        }
      },
      messages: {
        signupUser: {
          required: "Please enter your username.",
          minlength: "Please enter a valid username.",
          email: "Username must be a valid email address."
        },
        signupPW: {
          required: "Please enter a password.",
          minlengh: "Please enter a valid password."
        },
        signupPWVerify: {
          required: "Please enter a password.",
          minlengh: "Please enter a valid password."
        }
      }
    });

  };

  // Submit Login Form
  $scope.login = function() {
    if($('#loginForm').valid()) {
      var _scope = $scope;
      var usrObj = {
        username: $('#loginUser').val(),
        password: $('#loginPW').val()
      };
      $('#loader').addClass('ajax');
      $.ajax({
        crossOrigin: true,
        type: "POST",
        //contentType: "application/json; charset=UTF-8",
        //dataType: "json",
        url: 'someurl/api/login',
        data: JSON.stringify(usrObj),
        success: function(d) {
          $('#loader').removeClass('ajax');
          if(d.success == true) {
          //if(d.success == true && d.session) {
            document.cookie = "dd.sess=true; expires=" + 604800000 + "; path=/; value=" + d.session;
            $location.path('/dashboard').replace();
            $scope.$apply();
          } else {
            displayErr('login', 'error', d.errors);
          }
        },
        error: function(d) {
          $('#loader').removeClass('ajax');
          displayErr('login', 'error');
        }
      });
      return false;
    }
  };

  // Submit Registration
  $scope.register = function() {
    var _scope = $scope;
    if($('#signupForm').valid()) {
      var usrObj = {
        username: $('#signupUser').val(),
        password: $('#signupPW').val(),
        email: $('#signupUser').val()
      };
      $('#loader').addClass('ajax');
      $.ajax({
        type: "POST",
        url: 'someurl/api/adduser',
        data: JSON.stringify(usrObj),
        crossOrigin: true,
        success: function(d) {
          $('#loader').removeClass('ajax');
          if(d.success) {
            displayErr('registration', 'success');
          } else {
            displayErr('registration', 'error');
          }
        },
        error: function(d) {
          $('#loader').removeClass('ajax');
          displayErr('registration', 'error');
        }
      });
    }
    return false;
  };

  // Forgot Password Submit
  $scope.forgotPasswordSubmit = function() {
    var _scope = $scope;
    if($('#forgotPasswordForm').valid()) {
      $.ajax({
        crossOrigin: true,
        type: 'GET',
        url:'http://edafeks.dyndns.biz:9090/api/v1/users/forgot/?email=' + $('#forgotPasswordEmail').val(),
        success: function(d) {
          _scope.closeLightbox();
          displayMessage($('div.form-signin'),'passwordReset', true);
        },
        error: function(e) {
          _scope.closeLightbox();
          if(d.responseJSON) {
            displayMessage($('div.form-signin'),'errorCustom', true, d.responseJSON.messages[0].message);
          } else {
            displayMessage($('div.form-signin'), 'error', true);
          }
        }
      });
    }
    return false;
  };

  $scope.checkPwStrength = function(e) {
    var _pw = $(e.currentTarget).val();
    if(_pw.length < 8) {
      $('.pwStrength').hide();
      $('#pwShort').show();
    } else {
      var _pwStrength = 0;
      var _pwLower = /^(?=.*[a-z])/;
      var _pwUpper = /^(?=.*[A-Z])/;
      var _pwSpecial = /^(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/;
      if(_pwUpper.test(_pw)) { // uppercase
        _pwStrength++;
      }
      if(_pwLower.test(_pw)) { // lowercase
        _pwStrength++;
      }
      if(_pwSpecial.test(_pw)) { // special character
        _pwStrength++;
      }
      $('.pwStrength').hide();
      if(_pwStrength == 0 || _pwStrength == 1) {
        $('#pwWeak').show();
      } else if(_pwStrength == 2) {
        $('#pwGood').show();
      } else {
        if(_pwStrength == 3) {
          $('#pwStrong').show();
        }
      }
    }
    $('#pwStrength').show();
  };

  $scope.help = function(e) {
    $location.path('/help').replace();
    //$scope.$apply();
  };

  $scope.setupLogin();

}]);