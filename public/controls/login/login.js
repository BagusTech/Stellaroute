/* global jQuery, duck */

void function initLogin($, duck) {
	'use strict';

	function setValidation($input, type) {
		const sendMagicLink = $(`
			<div class='alert alert-danger p-A l-0 t-100 mt-Sm w-100 z-1'>
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 class='mt-0'>Email Already In Use</h4>
				<p class='fw-N'>If you forgot your password or haven't set one yet, <a class='js-magic-link-email' href='#'>Click Here</a></p>
			</div>
		`);

		return (length) => {
			if (length === "0") {
				$input.trigger('passedValidation')

				if(type === 'email') {
					$input.parent().find('.alert').remove();
				}
			} else {
				if(type === 'email') {
					$input.trigger('failedValidation', () => {
						const $parent = $input.parent();
						
						$parent.removeClass('has-success has-warning')
							.addClass('has-error')
							.trigger('checkIsValid', [true])

						if($parent.find('.js-magic-link-email').length === 0) {
							const $sendMagicLink = $(sendMagicLink);

							$sendMagicLink.find('.js-magic-link-email').attr('href', `/send-magic-link/${$input.val()}`);
							$parent.append($sendMagicLink);
						}
					});
				} else {
					$input.trigger('failedValidation');
				}
			}
		}
	}

	function validateField($input) {
		const value = $input.val();
		const type = $input.attr('type');

		if (type === 'email' && !$.isValidEmail(value)) {
			$input.trigger('failedValidation')
			return;
		}

		duck('Users').exists({field: $input.attr('name'), value, fineOne: true}, setValidation($input, type));
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