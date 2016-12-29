/* global jQuery, duck */

void function initRequest($, duck){
	'use strict';

	const $selectRequestForm = $('#SelectRequestForm');
	const $requestForms = $('.js-request-form');
	const $flash = $('#MakeRequestMessage');

	$selectRequestForm.on('change', () => {
		$requestForms.addClass('hidden');

		$(`.request-${$selectRequestForm.val()}`).removeClass('hidden');
	});

	function failed() {
		$flash.find('.alert-danger').show(0);
		$flash.show(0);

		setTimeout(() => {
			$flash.slideUp(270)
			$flash.find('.alert-danger').slideUp(270);
		}, 5000)
	}

	function success(response) {
		if (response.msg === 'success') {
			$flash.find('.alert-success').show(0);
			$flash.show(0);

			setTimeout(() => {
				$flash.slideUp(270)
				$flash.find('.alert-success').slideUp(270);
			}, 5000);

			setTimeout(() => {
				$requestForms.find('[type="submit"]').prop('disabled', false);
			}, 500);
		} else {
			failed();
		}
	}

	function error() { failed(); }

	$requestForms.each((i, form) => {
		const $form = $(form);

		$form.find('[type="submit"]').click((e) => {
			$form.find('[type="submit"]').prop('disabled', true);			
			e.preventDefault();

			const $type = $form.find('[name="type"]');
			const type = $form.find('[name="type"]').val();
			const $location = $form.find('[name="location"]');
			const location = $form.find('[name="location"]').val();
			const $description = $form.find('[name="description"]');
			const description = $form.find('[name="description"]').val();
			const $attraction = $form.find('[name="attraction"]');
			const attraction = $form.find('[name="attraction"]').val();

			const html = `
				<h1>New Request</h1>
				<h2>${$form.find('[name="from"]').val()} requested a new ${type}</h2>

				<p>
					<strong>Name of ${$form.find('[name="type"]').val()}</strong>: ${attraction ? attraction : location}
					${attraction ? '<br />' : ''}
					${attraction ? `<strong>Location: </strong>${location}` : ''}
				</p>

				<p>${description}</p>

			`;
			const request = {
				html,
				subject: `New ${type} Request`,
			};

			duck.sendEmail(request, success, error);
			$type.val('')
			$location.val('')
			$description.val('')
			$attraction.val('')
		});
	});
}(jQuery.noConflict(), duck)