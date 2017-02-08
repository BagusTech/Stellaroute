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

	function passedValidation($input) {
		$input.closest('.form-group').removeClass('has-error').addClass('has-success');
	}

	function setValidation($input, $form, $submit) {
		return (length) => {
			if (length !== "0") {
				failedValidation($input, $submit)
			} else {
				passedValidation($input);
			}

			if ($form.find('.has-success').length === 2) {
				$submit.prop('disabled', false);
			} else {
				$submit.prop('disabled', true);
			}

		}
	}

	function validate(field, $input, $form) {
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
				validate(field, $input, $form);
			}, 1000);
		}
	}

	$(() => {
		$('#SignupEmail').on('input', checkField('local.email'));
		$('#Username').on('input', checkField('username'));
		$('#SignupPassphrase, #SignupPassphraseRepeat').on('input', (() => {
					let checkIfTaken;
		
					alert('make password thing work')
		
					return (e) => {
						e.stopPropagation();
		
						const $input = $(e.currentTarget);
						const $form = $input.closest('form');
		
						clearTimeout(checkIfTaken);
		
						checkIfTaken = setTimeout(() => {
							//validate(field, $input, $form);
						}, 1000);
					}
				})());
	});
}(jQuery.noConflict(), duck);