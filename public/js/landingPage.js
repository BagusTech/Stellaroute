jQuery(function initLandingPageJavascript($){
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
});
