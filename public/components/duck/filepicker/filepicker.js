/* global jQuery */

void function initDuckFilepicker($) {
	'use strict';

	// run after dom has loaded
	$(() => {
		const $imagePicker = $('#ImagePickerModal');
		
		$('[duck-type="image"]').on('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
			$imagePicker.modal('show');
		});
	});
}(jQuery.noConflict());