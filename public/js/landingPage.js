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
