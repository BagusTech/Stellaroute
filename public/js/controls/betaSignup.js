jQuery(function initLandingPageJavascript($){
	var $emailInput = $('#EmailCaptureInput');
	var $emailSubmit = $('#EmailCaptureButton');
	var $guideInput = $('#RequestGuideInput');
	var $guideSubmit = $('#RequestGuideButton');

	var isValid = function(email){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return re.test(email);
	};

	var failed = function() {
		$('.email-capture-error').addClass('active');

		setTimeout(function(){
			$('.email-capture-error').removeClass('active');					
		}, 2000);
	};

	$emailSubmit.click(function(e) {
		e.preventDefault();

		var email = $emailInput.val();

		if(isValid(email)){
			$('.email-capture-error').text('Sorry, we experienced an error. Please refresh the page and try again.');
			var user = {
				"local.email": email,
				recieveNewsletter: true
			};

			$.ajax({
				type: 'POST',
				data: JSON.stringify(user),
				url: '/newsletter-signup',
				contentType: 'application/json'
			}).done(function(response) {
				if(response.msg === "success"){
					$('.email-capture').removeClass('active');
					$('.email-capture-success').addClass('active').slideDown(180);
				} else {
					failed();
				}

			}).fail(function(response) {
				failed();
			});
		} else {
			failed();
		}
	});

	$guideSubmit.click(function(e) {
		e.preventDefault();

		var $header = $('.submit-guide-header');
		var $text = $('.submit-guide-text');
		var request = {
			fromEmail: $emailInput.val(),
			request: $guideInput.val()
		};

		$.ajax({
			type: 'POST',
			data: JSON.stringify(request),
			url: '/request-location',
			contentType: 'application/json'
		}).done(function(response) {
			if(response.msg === "success"){
				$header.text('Success! You\'ve Requested a Guide.');
				$text.text('We\'ll get back to you as quickly as we can. Feel free to request another.');
				$guideInput.val('');
			} else {
				failed();
			}

		}).fail(function(response) {
			failed();
		});
	});
});
