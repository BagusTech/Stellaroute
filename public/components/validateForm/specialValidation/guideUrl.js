/* global jQuery, duck */

void function validateGuideUrl($) {
	'use strict';

	const $input = $('[duck-table="Guides"] [duck-field="url"] [duck-value]');

	$input.prop('validateFunc', () => () => {
		duck('Guides').exists({field: 'url', value: $input.val(), fineOne: true}, (length) => {
			if (length === "0") {
				$input.trigger('passedValidation');
			} else {
				$input.trigger('failedValidation');
			}
		});
	});
}(jQuery.noConflict(), duck)