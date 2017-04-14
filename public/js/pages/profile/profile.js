/* global jQuery, duck */

void function initRequest($){
	'use strict';

	$(() => {
		const $error = $('<div class="alert alert-danger p-A z-1 l-0 r-0 t-0">Something went wrong, please try again.</div>');

	// USER FORM
		const $userForm = $('#MySettings [duck-table="Users"]');
		const $userSubmit = $userForm.find('[duck-button="submit"]');
		const $username = $userForm.find('[duck-field="username"] [duck-value]');
		const startingUsername = $username.val();

		$username.prop('validateFunc', () => () => {
			const newUsername = $username.val();
			
			duck('Users').exists({field: 'username', value: newUsername, fineOne: true}, (length) => {
				if (length === "0" || startingUsername === newUsername) {
					$username.trigger('passedValidation');
				} else {
					$username.trigger('failedValidation');
				}
			});
		});

		$userSubmit.on('click', () => {
			$userSubmit.find('i').removeClass('hidden');
		});

		$userForm.duckForm({successCallback: () => {
			$userSubmit.prop('disabled', false).find('i').addClass('hidden');
		}, errorCallBack: () => {
			const _$error = $error.clone();

			$userSubmit.prop('disabled', false).find('i').addClass('hidden');
			$userForm.append(_$error);

			setTimeout(() => {
				_$error.slideUp(270);				
			}, 3000);

			setTimeout(() => {
				_$error.remove();				
			}, 3270);
		}});

	// CHANGE PASSWORD FORM
		const $changePasswordModal = $('#ChangePassword'); 
		const $changePasswordForm = $changePasswordModal.find('[duck-table="Users"]');
		const $passwordFields = $changePasswordForm.find('input[type="password"]');
		const $passwordSubmit = $changePasswordForm.find('[duck-button="submit"]');

		$passwordFields.on('input', (e) => {
			e.stopPropagation();
			e.preventDefault();

			if(($passwordFields.eq(0).val() !== $passwordFields.eq(1).val()) || $passwordFields.eq(0).val().length < 6 || $passwordFields.eq(1).val().length < 6) {
				$passwordSubmit.prop('disabled', true);
				$passwordFields.closest('.form-group').addClass('has-error');
			} else {
				$passwordFields.closest('.form-group').removeClass('has-error');
				$passwordSubmit.prop('disabled', false);
			}
		});

		$passwordSubmit.on('click', () => {
			$passwordSubmit.find('i').removeClass('hidden');
		});

		$changePasswordForm.duckForm({successCallback: () => {
			$passwordSubmit.prop('disabled', false).find('i').addClass('hidden');
			$changePasswordModal.modal('hide');
		}});

	// NEW GUIDE FORM
		const $newGuideForm = $('[duck-table="Guides"]');
		const $newGuideSubmit = $newGuideForm.find('[duck-button="submit"]');

		$newGuideSubmit.on('click', () => {
			$newGuideSubmit.append('<i class="fa fa-spin fa-spinner"></i>');
		});

		$newGuideForm.duckForm({successCallback: () => {
			window.location = `${window.location.pathname}/${$('[duck-field="url"] [duck-value]').val()}`;
		}});
	});

}(jQuery.noConflict())