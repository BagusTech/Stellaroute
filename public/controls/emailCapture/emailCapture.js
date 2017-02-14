/* global jQuery */

void function initEmailCapture($) {
	'use strict'

	const $wrapper = $('.email-capture');
	const $form = $wrapper.find('form');
	const $submit = $form.find('button');
	const $emailInput = $form.find('input[name="email"]');
	const $errorMessage = $wrapper.find('.js-error-message');

	function addUser(user) {
		$.ajax({
			type: 'POST',
			data: JSON.stringify(user),
			url: '/email-capture',
			contentType: 'application/json',
			success: () => {
				$wrapper.trigger('email-capture-complete', true);
			},
			error: () => {
				$wrapper.trigger('email-capture-complete', false);
			},
		});
	}

	$submit.click((e) => {
		e.stopPropagation();
		e.preventDefault();

		$submit.prop('disabled', true);

		const email = $emailInput.val();
		const user = {
			local: {
				email,
			},
			recieveNewsletter: true,
			created: new Date(),
			roles: [`beta-${$wrapper.attr('data-category')}`],
		};
		
		addUser(user);
	});

	$wrapper.on('email-capture-complete', (e, success) => {
		e.stopPropagation();

		if(success) {
			$form.hide();
			$wrapper.find('.email-capture--sub-header').hide();
			$wrapper.find('.email-capture--header').text('Thanks for signing up. You\'ll be the first to know when we open you beta. Happy travels!');
		} else {
			$submit.prop('disabled', false);
			$emailInput.val('');
			$errorMessage.slideDown(500);
		}
	});
}(jQuery.noConflict());