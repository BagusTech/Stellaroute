/*global jQuery */

void function initializeValidateForm($){
	'use strict';

	function isValidEmail(email) {
		// eslint-disable-next-line
		const re = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/

		return re.test(email);
	}

	$.isValidEmail = isValidEmail;

	function failedValidation(e, func) {
		const $input = $(e.target);

		if(!func) {
			$input.parent()
					.removeClass('has-success has-warning')
					.addClass('has-error')
					.trigger('checkIsValid', [true]);

			return;
		}

		func($input);
	}

	function passedValidation(e, func) {
		const $input = $(e.target);

		if(!func) {
			$input.parent()
					.removeClass('has-error has-warning')
					.addClass('has-success')
					.trigger('checkIsValid');

			return;
		}

		func($input);
	}

	function hasData($input) {
		const value = $input.val();

		if (!value || ($input.attr('type') === 'email' && !$.isValidEmail(value))) {
			$input.trigger('failedValidation')
			return;
		}

		$input.trigger('passedValidation');
	}

	function checkIsValid(e, failed) {
		e.stopPropagation();

		const $form = $(e.currentTarget);
		const $submit = $form.find('[type="submit"]')

		if (!failed && $form.find('.has-error').length === 0 && $form.find('.has-success input[required]').length === $form.find('input[required]').length) {
			$submit.prop('disabled', false);
		} else {
			$submit.prop('disabled', true);
		}
	}

	function validate(e, input, func) {	
		e.stopPropagation();

		const $input = input ? $(input) : $(e.target);

		if(func || $input.prop('validateFunc') || $input.prop('required')) {
			const validateFunc = func || $input.prop('validateFunc') || hasData;

			validateFunc($input);
		}
	}

	function debounceValidate() {
		let checkIfTaken;

		return (e) => {
			e.stopPropagation();

			const $input = $(e.target);

			clearTimeout(checkIfTaken);
			checkIfTaken = setTimeout(() => {
				$input.trigger('validate');
			}, $input.prop('debounceValidate') || 10);
		}
	}

	function initValidateForm($wrapper) {
		$wrapper.on('checkIsValid', checkIsValid);
		$wrapper.on('validate', validate);
		$wrapper.on('passedValidation', passedValidation);
		$wrapper.on('failedValidation', failedValidation);
		$wrapper.on('input', debounceValidate());

		if($wrapper.find('input').filter((i, item) => $(item).prop('required')).length) {
			$wrapper.find('[type="submit"]').prop('disabled', true);
		}
	}

	$.fn.validateForm = function() {
		return this.each((i, wrapper) => initValidateForm($(wrapper)))
	};

	$(() => $('[data-function*="form"], [duck-table], form').validateForm());
}(jQuery.noConflict());
