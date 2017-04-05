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

	$(() => {
		const $newGuideForm = $('[duck-table="Guides"]');
		const $submit = $newGuideForm.find('[duck-button="submit"]');

		$submit.on('click', () => {
			$submit.append('<i class="fa fa-spin fa-spinner"></i>');
		});

		$newGuideForm.duckForm({successCallback: () => {
			window.location = `${window.location.pathname}/${$('[duck-field="url"] [duck-value]').val()}`;
		}});
	});

}(jQuery.noConflict())