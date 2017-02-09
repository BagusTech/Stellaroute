/* global jQuery, duck */

void function initLogin($, duck) {
	'use strict';

	function setValidation($input) {
		return (length) => {
			if (length === "0") {
				$input.trigger('passedValidation')
			} else {
				$input.trigger('failedValidation')
			}
		}
	}

	function validateField($input) {
		const value = $input.val();

		if ($input.attr('type') === 'email' && !$.isValidEmail(value)) {
			$input.trigger('failedValidation')
			return;
		}

		duck('Users').exists({field: $input.attr('name'), value, fineOne: true}, setValidation($input));
	}	

	$(() => {
		$('#SignupEmail, #Username').prop('debounceValidate', 1000).prop('validateFunc', () => validateField);

		$('#SignupPassphrase').prop('validateFunc', () => ($input) => {
			const val = $input.val();

			if (val.length > 7) {
				$input.trigger('passedValidation');
			} else {
				$input.trigger('failedValidation');
			}

			$('#SignupPassphraseRepeat').trigger('validate');
		});

		$('#SignupPassphraseRepeat').prop('validateFunc', () => ($input) => {
			const $siblingInput = $('#SignupPassphrase');
			const val1 = $input.val();
			const val2 = $siblingInput.val();

			if(val1 && val2) {
				if(val1 === val2) {
					$input.trigger('passedValidation');
				} else {
					$input.trigger('failedValidation');
				}
			}

			$siblingInput.trigger('validate');
		});
	});
}(jQuery.noConflict(), duck);