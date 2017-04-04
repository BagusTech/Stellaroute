/* global jQuery */

void function initRequest($){
	'use strict';

	$(() => {
		const $userForm = $('[duck-table="Users"]');
		const $passwordFields = $userForm.find('input[type="password"]');
		const $submit = $userForm.find('[duck-button="submit"]');

		$passwordFields.on('input', (e) => {
			e.stopPropagation();
			e.preventDefault();

			if(($passwordFields.eq(0).val() !== $passwordFields.eq(1).val()) || $passwordFields.eq(0).val().length < 6 || $passwordFields.eq(1).val().length < 6) {
				$submit.prop('disabled', true);
				$passwordFields.closest('.form-group').addClass('has-error');
			} else {
				$passwordFields.closest('.form-group').removeClass('has-error');
				$submit.prop('disabled', false);
			}
		});

		$userForm.duckForm({successCallback: () => {
			window.location.reload(true);
		}});
	});

}(jQuery.noConflict())