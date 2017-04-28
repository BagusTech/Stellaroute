/* global jQuery, duck */

void function initResetPassword($, duck) {
	'use strict';

	const $form = $('#ResetPasswordForm');
	const $email = $('#ResetPasswordEmail');
	const $submit = $('#ResetPasswordSubmit');
	const $loading = $submit.find('.fa-spinner');
	const $flash = $('#RequestFlash');

	function resetSuccess() {
		$flash.slideToggle(270);
		$email.val('');
		$submit.prop('disabled', false);
		$loading.addClass('hidden');

		setTimeout(() => {$flash.slideToggle(270);}, 5000);
	}

	function submitResetEmail(e) {
		e.stopPropagation();
		e.preventDefault();
		
		const email = $email.val();
		$submit.prop('disabled', true);

		if(!email) {
			$form.addClass('has-error');
			return;
		}

		$loading.removeClass('hidden');

		$form.removeClass('has-error');

		duck.sendResetEmail(email, resetSuccess)();
	}

	$submit.click(submitResetEmail);
}(jQuery.noConflict(), duck)