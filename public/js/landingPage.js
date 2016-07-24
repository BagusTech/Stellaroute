void function initLandingPageJavascript($){
	$(document).ready(function(){
		void function initRotator(rotateTime){
			rotateTime = rotateTime*1000;

			var $wrapper = $('.screenshot-rotator');
			var rotate = function (){
				var $active = $wrapper.find('.active');
				var $after = $wrapper.find('.after');
				var $before = $wrapper.find('.before');
				
				$active.addClass('after').removeClass('active');
				$after.addClass('before').removeClass('after');
				$before.addClass('active').removeClass('before');
			};

			var startRotate = setInterval(rotate, rotateTime);

			$wrapper.on('mouseenter', function(){
				clearInterval(startRotate);
			});

			$wrapper.on('mouseleave', function(){
				startRotate = setInterval(rotate, rotateTime);
			});
		}(4);

		void function initEmailCapture(){
			var $emailInput = $('#EmailCaptureInput');
			var $emailSubmit = $('#EmailCaptureButton');
			var $guideInput = $('#RequestGuideInput');
			var $guideSubmit = $('#RequestGuideButton');

			var isValid = function(email){
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	    		return re.test(email);
			};

			$emailSubmit.click(function(e) {
				e.preventDefault();

				var email = $emailInput.val();

				var failed = function() {
					$('.email-capture-error').addClass('active');

					setTimeout(function(){
						$('.email-capture-error').removeClass('active');					
					}, 2000);
				};

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

				$header.text('Success! You\'ve Requested a Guide.');
				$text.text('We\'ll get back to you as quickly as we can. Feel free to request another.');
			});
		}();
	});
}(jQuery);
