/* global jQuery, duck */

void function initResetPassword($, duck) {
	'use strict';

	const $form = $('#ResetPasswordForm');
	const $email = $('#ResetPasswordEmail');
	const $submit = $('#ResetPasswordSubmit');
	const $flash = $('#RequestFlash');

	function resetSuccess() {
		$flash.slideToggle(270);

		setTimeout(() => {$flash.slideToggle(270);}, 5000);
	}

	function submitResetEmail() {
		const email = $email.val();

		if(!email) {
			$form.addClass('has-error')
			return;
		}

		duck.sendResetEmail(email, resetSuccess)();
	}

	$submit.click(submitResetEmail);
}(jQuery.noConflict(), duck)