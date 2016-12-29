/* global jQuery, duck */

void function initRequestLocation($, duck) {
	'use strict';

	const $requestLocation = $('#RequestLocation');
	const $flash = $('#RequestLocationMessage');

	function failed() {
		$flash.find('.alert-danger').show(0);
		$flash.show(0);

		setTimeout(() => {
			$flash.slideUp(270)
			$flash.find('.alert-danger').slideUp(270);
		}, 5000)
	}

	function success(response) {
		$requestLocation.modal('hide');

		if (response.msg === 'success') {
			$flash.find('.alert-success').show(0);
			$flash.show(0);

			setTimeout(() => {
				$flash.slideUp(270)
				$flash.find('.alert-success').slideUp(270);
			}, 5000)
		} else {
			failed();
		}
	}

	function error(){
		$requestLocation.modal('hide');

		failed();
	}

	$requestLocation.find('[type="submit"]').click((e) => {
		e.preventDefault();

		const html = `
			<h1>New Location Request</h1>
			<h2>${$requestLocation.find('[name="from"]').val()} requested ${$requestLocation.find('[name="location"]').val()}</h2>
		`;
		const request = {
			html,
			subject: 'New Location Request',
		};

		duck.sendEmail(request, success, error);
	});
}(jQuery.noConflict(), duck)