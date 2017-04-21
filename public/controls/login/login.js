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
		const $SignupPassphrase = $('.js-signup-pass');
		const $SignupPassphraseRepeat = $('.js-signup-pass-repeat');

		$('.js-signup-email, .js-signup-username').prop('debounceValidate', 1000).prop('validateFunc', () => validateField);

		$SignupPassphrase.each((i, item) => {
			const $item = $(item);
			$item.prop('validateFunc', () => () => {
				const val = $item.val();

				if (val.length > 7) {
					$item.trigger('passedValidation');
				} else {
					$item.trigger('failedValidation');
				}

				$SignupPassphraseRepeat.trigger('validate');
			});
		});

		$SignupPassphraseRepeat.each((i, item) => {
			const $item = $(item);

			$item.prop('validateFunc', () => () => {
				const val1 = $item.val();
				const val2 = $item.closest('form').find('.js-signup-pass').val();

				if(val1 && val2) {
					if(val1 === val2) {
						$item.trigger('passedValidation');
					} else {
						$item.trigger('failedValidation');
					}
				}

				$SignupPassphrase.trigger('validate');
			});
		});
	});
}(jQuery.noConflict(), duck);