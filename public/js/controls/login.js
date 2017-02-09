/* global jQuery, duck */

void function initLogin($, duck) {
	'use strict';

	function validateEmail(email) {
		const re = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/

		return re.test(email);
	}

	function isAlreadyTaken(field , value, callback) {
		duck('Users').exists({field, value, fineOne: true}, callback);
	}

	function failedValidation($input, $submit) {
		$input.closest('.form-group').removeClass('has-success').addClass('has-error');
		$submit.prop('disabled', true);
	}

	function passedValidation($input, $form, $submit) {
		$input.closest('.form-group').removeClass('has-error has-warning').addClass('has-success');

		if ($form.find('.has-error').length === 0 && $form.find('.has-success input[required]').length === $form.find('input[required]').length) {
			$submit.prop('disabled', false);
		} else {
			$submit.prop('disabled', true);
		}
	}

	function setValidation($input, $form, $submit) {
		return (length) => {
			if (length !== "0") {
				failedValidation($input, $submit)
			} else {
				passedValidation($input, $form, $submit);
			}
		}
	}

	function validateField(field, $input, $form) {
		const $submit = $form.find('[type="submit"]')
		const val = $input.val();

		if ($input.attr('type') === 'email' && !validateEmail(val)) {
			failedValidation($input, $submit)
			return
		}

		isAlreadyTaken(field, val, setValidation($input, $form, $submit));
	}

	function checkField(field) {
		let checkIfTaken;

		return (e) => {
			e.stopPropagation();

			const $input = $(e.currentTarget);
			const $form = $input.closest('form');

			clearTimeout(checkIfTaken);

			checkIfTaken = setTimeout(() => {
				validateField(field, $input, $form);
			}, 1000);
		}
	}

	function hadData($input) {
		if($input.val()) {
			return true;
		}

		return false;
	}

	const $wrapper = $('#SignupModal form');

	$wrapper.find('[required], [required="required"], [required="true"]')
		.closest('.form-group')
		.addClass('has-warning');

	function checkIsValid(e) {
		e.stopPropagation();

		const $form = e.data.form;
		const $submit = $form.find('[type="submit"]')

		if ($form.find('.has-error').length === 0 && $form.find('.has-success input[required]').length === $form.find('input[required]').length) {
			$submit.prop('disabled', false);
		} else {
			$submit.prop('disabled', true);
		}
	}

	function validate(e, func) {
		e.stopPropagation();

		const $form = e.data.form;
		const $input = $(e.target);
		const validateFunc = func || $input.prop('validateFunc') || hadData;

		if(validateFunc($input)) {
			passedValidation($input);
		} else {
			failedValidation($input);
		}

		$form.trigger('checkIsValid');
	}

	$wrapper.on('checkIsValid', {form: $wrapper}, checkIsValid);
	$wrapper.on('validate', {form: $wrapper}, validate);

	$(() => {
		$('#SignupEmail').on('input', checkField('local.email'));
		$('#Username').on('input', checkField('username'));
		$('#SignupPassphrase, #SignupPassphraseRepeat').on('input', (() => {
					let checkIfTaken;
		
					return (e) => {
						e.stopPropagation();
		
						const $input = $(e.currentTarget);
						const $siblingInput = $input.closest('form').find('[type="password"]').not($input);
						const $form = $input.closest('form');
						const $submit = $form.find('[type="submit"]')
		
						clearTimeout(checkIfTaken);
		
						checkIfTaken = setTimeout(() => {
							const val1 = $input.val();
							const val2 = $siblingInput.val();

							if(val1 && val2) {
								if(val1 === val2) {
									passedValidation($input, $form, $submit);
									passedValidation($siblingInput, $form, $submit);
								} else {
									failedValidation($input, $submit);
									failedValidation($siblingInput, $submit);
								}
							}
						}, 1000);
					}
				})());
	});
}(jQuery.noConflict(), duck);